# LLM Tool Calling Architecture: Complete Learning Summary

## 1. FUNDAMENTAL REQUEST/RESPONSE CYCLE

### Core Concept
When an LLM needs to use tools, it doesn't execute them directly. Instead:
- **LLM decides** to call a tool and returns metadata about it
- **Agent executes** the tool locally
- **Agent sends back** the result to the LLM for processing

### Critical Understanding
Each interaction with the LLM is **a separate API request**. They are NOT chained automatically—the agent orchestrates them.

---

## 2. CONTEXT PROMPT TRANSMISSION (VERY IMPORTANT)

### Key Finding
The system prompt, tools definitions, and conversation history are **sent with EVERY request**.

```
Request 1: System Prompt + Tool Defs + User Message → LLM Returns tool_use
Request 2: System Prompt + Tool Defs + History + tool_use + tool_result → LLM Returns answer
Request 3: System Prompt + Tool Defs + History + tool_use + tool_result + ... → Continue
```

### Implication
- The system prompt is **NOT cached or reused** between requests
- Each request is stateless; history is rebuilt via the messages array
- This impacts **token cost** — your system prompt gets tokenized multiple times
- **Optimization matters**: Concise system prompts reduce costs in agentic systems

---

## 3. THE STEP-BY-STEP FLOW (EXACT SEQUENCE)

### Step 1: Agent → LLM (First Request)
```json
{
  "model": "claude-opus-4-5",
  "system": "Your system prompt here",
  "tools": [
    {
      "name": "tool_name",
      "description": "what it does",
      "input_schema": {...}
    }
  ],
  "messages": [
    {
      "role": "user",
      "content": "User's actual request"
    }
  ]
}
```

### Step 2: LLM Response (Returns tool_use blocks)
```json
{
  "content": [
    {
      "type": "text",
      "text": "I'll help by calling this tool..."
    },
    {
      "type": "tool_use",
      "id": "tool_call_abc123",
      "name": "fetch_mr_diff",
      "input": {
        "mr_id": "42",
        "project_id": "red-hat-platform"
      }
    }
  ]
}
```

### Step 3: Agent Executes Locally
- Agent parses the tool_use block
- Executes the tool (API call, database query, file read, etc.) **on the agent side**
- Captures the result/output

### Step 4: Agent → LLM (Second Request - SENDS EVERYTHING BACK)
```json
{
  "model": "claude-opus-4-5",
  "system": "Your system prompt here",  // SENT AGAIN
  "tools": [...],                        // SENT AGAIN
  "messages": [
    {
      "role": "user",
      "content": "User's actual request"
    },
    {
      "role": "assistant",
      "content": [
        {
          "type": "text",
          "text": "I'll help by calling this tool..."
        },
        {
          "type": "tool_use",
          "id": "tool_call_abc123",
          "name": "fetch_mr_diff",
          "input": {...}
        }
      ]
    },
    {
      "role": "user",
      "content": [
        {
          "type": "tool_result",
          "tool_use_id": "tool_call_abc123",
          "content": "ACTUAL RESULT FROM TOOL EXECUTION HERE"
        }
      ]
    }
  ]
}
```

### Step 5: LLM Processes Result
- Sees the tool_result
- Can decide to:
  - Call another tool (go back to Step 1 of loop)
  - Return final answer (end interaction)

---

## 4. THE tool_use AND tool_result BLOCKS

### tool_use Block (What LLM Sends)
```json
{
  "type": "tool_use",
  "id": "unique_identifier_001",           // UNIQUE ID for tracking
  "name": "function_to_call",              // Which tool to execute
  "input": {                               // Parameters for the tool
    "param1": "value1",
    "param2": "value2"
  }
}
```

**This is part of the assistant's response content.**

### tool_result Block (What Agent Sends Back)
```json
{
  "type": "tool_result",
  "tool_use_id": "unique_identifier_001",  // MUST MATCH tool_use id
  "content": "The actual result from executing the tool"
}
```

**This is part of the user's message content (even though the agent sent it).**

### The ID Matching System
- `tool_use.id` = unique identifier given by LLM
- `tool_result.tool_use_id` = must match the corresponding tool_use.id
- **This is how the LLM knows which result came from which tool call**

---

## 5. PARALLEL TOOL CALLING (Multiple Tools in One Go)

### Capability
The LLM can request **multiple different tools in a single response**:

```json
{
  "content": [
    {
      "type": "text",
      "text": "Let me gather all the information needed..."
    },
    {
      "type": "tool_use",
      "id": "tool_call_001",
      "name": "fetch_mr_diff",
      "input": {"mr_id": "42"}
    },
    {
      "type": "tool_use",
      "id": "tool_call_002",
      "name": "fetch_commit_history",
      "input": {"mr_id": "42"}
    },
    {
      "type": "tool_use",
      "id": "tool_call_003",
      "name": "check_ci_status",
      "input": {"mr_id": "42"}
    }
  ]
}
```

### How Agent Handles It
```
Request 1: LLM returns 3 tool_use blocks (IDs: 001, 002, 003)
    ↓
Agent: Execute all 3 in parallel (or sequentially, doesn't matter)
    ↓
Request 2: Send back 3 tool_result blocks with matching IDs
    ↓
LLM: Sees all 3 results at once, can reason over all data
```

### Efficiency Gain
- **Sequential approach**: Request → Result 1 → Request → Result 2 → Request → Result 3 (5 requests)
- **Parallel approach**: Request 1→3 tools → Results 1→3 (2 requests)
- **Token savings**: System prompt sent 2 times instead of 5 times

### When to Use Parallel
- Tools are **independent** (don't depend on each other's output)
- Example: Fetching diff, commits, and CI status all at once
- Not suitable when: Tool B needs output from Tool A

---

## 6. SEQUENTIAL TOOL CALLING (When Order Matters)

### Scenario: Dependent Tools
Some workflows **require tools to run in sequence**:

```
Tool A: fetch_user_id (input: username) → output: user_id
    ↓ (needs user_id from A)
Tool B: fetch_user_profile (input: user_id) → output: profile
    ↓ (needs profile data from B)
Tool C: check_permissions (input: profile) → output: permissions
```

### How LLM Naturally Sequences Them

#### Request 1
LLM sees it needs user_id first, so calls only Tool A:
```json
{
  "type": "tool_use",
  "id": "call_001",
  "name": "fetch_user_id",
  "input": {"username": "john_doe"}
}
```

#### Request 2 (After Tool A Result)
LLM now has user_id=12345, calls Tool B:
```json
{
  "type": "tool_use",
  "id": "call_002",
  "name": "fetch_user_profile",
  "input": {"user_id": "12345"}
}
```

#### Request 3 (After Tool B Result)
LLM now has profile data, calls Tool C:
```json
{
  "type": "tool_use",
  "id": "call_003",
  "name": "check_permissions",
  "input": {"user_id": "12345", "role": "admin"}
}
```

### Why This Happens Automatically
The LLM is intelligent enough to recognize when:
- It has missing information needed to make a decision
- A tool's input requires output from a previous tool
- Therefore, it naturally sequences them

---

## 7. CONTROLLING PARALLEL vs SEQUENTIAL BEHAVIOR

### Method 1: Parallel (Explicit System Prompt)
```
system: """
You have access to: fetch_mr_diff, fetch_commits, check_ci_status

IMPORTANT: When analyzing an MR, you can call multiple tools in parallel.
If tools are independent (don't depend on each other's output), 
call all of them at once in a single response.
Maximize parallelism for efficiency.
"""
```

This tells the LLM: "Go ahead and call all independent tools together."

### Method 2: Sequential (Explicit System Prompt)
```
system: """
You have access to: fetch_user_id, fetch_user_profile, check_permissions

Follow this workflow strictly:
1. First, call fetch_user_id
2. Only after getting the user_id, call fetch_user_profile
3. Only after getting the profile, call check_permissions

Do NOT call multiple tools at once. One tool per response.
"""
```

This tells the LLM: "Even if you could parallelize, don't. Do one at a time."

### Method 3: Let LLM Decide (No Guidance)
If you don't specify, the LLM will intelligently choose based on dependencies:
- Independent tools → LLM calls them together
- Dependent tools → LLM sequences them naturally

---

## 8. PART OF CONVERSATION CONTEXT

### tool_use Location
```json
{
  "role": "assistant",           // ← tool_use is part of ASSISTANT
  "content": [
    {"type": "text", ...},
    {"type": "tool_use", ...}    // ← HERE
  ]
}
```

### tool_result Location
```json
{
  "role": "user",                // ← tool_result is part of USER
  "content": [
    {"type": "tool_result", ...} // ← HERE
]
}
```

This is important because:
- tool_use is what the LLM decided to do
- tool_result is what the agent reports back (from user's perspective)

---

## 9. REQUEST ANATOMY (Complete Example)

### Request 1: Initial
```
├─ System Prompt
├─ Tool Definitions (all available tools)
├─ Messages array
│  └─ User: "Review MR #42"
└─ Model: claude-opus-4-5
```

### Response 1: LLM
```
└─ Content
   ├─ Text: "I'll analyze this..."
   └─ tool_use block (id: 001)
```

### Request 2: Full Context
```
├─ System Prompt (SAME, SENT AGAIN)
├─ Tool Definitions (SAME, SENT AGAIN)
├─ Messages array
│  ├─ User: "Review MR #42"
│  ├─ Assistant: [text + tool_use 001]
│  └─ User: [tool_result for 001]
└─ Model: claude-opus-4-5
```

### Response 2: LLM
```
└─ Content
   ├─ Text: "Found issues..."
   └─ Final answer OR more tool_use blocks
```

---

## 10. KEY INSIGHTS & TAKEAWAYS

### Token Efficiency
- System prompt sent with EVERY request
- Example: 3-tool agentic loop = system prompt tokenized 3+ times
- **Action**: Keep system prompts concise for long-running agentic workflows

### No Magic Caching
- Each request is independent
- Full conversation history must be rebuilt each time
- LLM has no "memory" between requests—only what's in the messages array

### ID Matching is Critical
- Every tool_use needs a unique ID
- Every tool_result must reference the corresponding ID
- Without this, LLM won't know which result matched which tool call

### Parallelism is Possible but Optional
- Independent tools can run together (1 request → multiple results)
- Dependent tools naturally sequence (1 request → 1 result → next request)
- Use system prompts to guide LLM's choice

### Agent Orchestration
- Agent decides what to do with tool_use blocks
- Agent executes tools
- Agent packages results back in tool_result format
- LLM never "knows" tool execution details—only what agent tells it

### System Prompt Influences Behavior
- Parallel vs Sequential decisions
- Tool selection priority
- Reasoning depth
- Error handling approach

---

## 11. PRACTICAL WORKFLOW DIAGRAM

```
User Request
    ↓
[Request 1]
├─ System Prompt + Tools + User Message
└─ → LLM

[LLM Response 1]
├─ text + tool_use (001, 002, 003)
└─ → Agent

[Agent Execution]
├─ Execute all tools (parallel/sequential)
├─ Get results
└─ Package into tool_result blocks

[Request 2]
├─ System Prompt + Tools + Full History
├─ + Previous tool_use blocks
├─ + New tool_result blocks
└─ → LLM

[LLM Response 2]
├─ Option A: Final answer → Done
├─ Option B: More tool_use → Loop back to Agent
└─ → User or Agent

(Loop continues until final answer)
```

---

## 12. COMMON MISTAKES TO AVOID

1. **Forgetting the system prompt in Request 2+**
   - ❌ Send only new results
   - ✓ Send system prompt + tools + full history + results

2. **Mismatching tool_use IDs with tool_result IDs**
   - ❌ tool_use id="001" but tool_result tool_use_id="002"
   - ✓ Must match exactly

3. **Assuming LLM executes tools**
   - ❌ "LLM called the API directly"
   - ✓ LLM returned metadata; agent executed it

4. **Not providing tool descriptions**
   - ❌ Tool with no description
   - ✓ LLM needs to understand what each tool does

5. **Forcing parallelism on dependent tools**
   - ❌ Asking LLM to call fetch_user_profile before fetch_user_id
   - ✓ Let LLM naturally sequence or explicitly guide in system prompt

6. **Sending tool results in assistant content**
   - ❌ tool_result in "role": "assistant"
   - ✓ tool_result in "role": "user"

---

## 13. FOR YOUR AGENTIC SYSTEMS (GitLab MR Reviewer Example)

### Your Architecture
```
Request 1: "Review MR #42"
    ↓
LLM: "Call 3 tools" (fetch_diff, fetch_comments, check_ci)
    ↓
Agent: Execute all 3 in parallel
    ↓
Request 2: Send all 3 results with matching IDs
    ↓
LLM: Synthesize review using all data
    ↓
Output: Complete security review
```

### Optimization Opportunity
- Use parallel tool calls (independent fetches at once)
- Reduce requests from 7 to 2
- System prompt sent 2 times instead of 7 (71% token savings)
- Add explicit guidance: "Fetch all independent data in first call"

---

## 14. SUMMARY IN ONE SENTENCE

**The LLM decides which tools to call and sends metadata (tool_use); the agent executes them locally and returns results (tool_result); then the entire context (including results) goes back to the LLM for further processing—with system prompt and tools re-sent each time.**

---

## 15. NEXT STEPS FOR IMPLEMENTATION

1. **Verify your current flow** matches the 5-step cycle
2. **Audit system prompt size** — optimize for token efficiency
3. **Design parallel vs sequential** — decide upfront for your use case
4. **Test tool ID matching** — ensure tool_use_id ↔ tool_result IDs align
5. **Monitor request count** — parallel execution should reduce requests
6. **Document tool dependencies** — helps LLM and future developers understand flow

