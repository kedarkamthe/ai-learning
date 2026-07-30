# Visual Reference Guide: Context Prompt Structure Tags

## Quick Reference Table

| Tag | Purpose | Persists? | What It Stores | Analogy |
|-----|---------|-----------|---|---|
| `<system>` | Rules & constraints | ✅ Always | Foundational rules, role definition, safety constraints | Doctor's medical license & ethics code |
| `<tools>` | Available functions | ✅ Every request | Tool names, descriptions, parameters, return schemas | Medical clinic equipment (ECG, blood test, X-ray) |
| `<memory>` | Historical data | ✅ Across sessions | Facts, results, decisions, state from previous interactions | Medical file (test results, diagnoses, treatments) |
| `<user_message>` | Current request | ❌ This request only | User's question or task | Patient's current symptoms |
| `<assistant>` | Reasoning process | ❌ Discarded | Agent's thinking, analysis, intermediate steps, decisions | Doctor's internal reasoning |

---

## Flow Diagram: Multi-Request Conversation

```
REQUEST 1: "What's the config?"
├─ <system> READ: ✅ "You are a financial agent"
├─ <tools> READ: ✅ "Here are 12 APIs available"
├─ <memory> READ: ❌ Empty (first request)
├─ <user_message> READ: ✅ "What's the maintenance model?"
├─ <assistant> THINKS: "Fetching config..." → DISCARDED ❌
└─ <memory> WRITE: ✅ "Model: Model 3"

REQUEST 2: "Process ₹50,000 split"
├─ <system> READ: ✅ "You are a financial agent"
├─ <tools> READ: ✅ "Here are 12 APIs available"
├─ <memory> READ: ✅ "Model: Model 3" (carried forward)
├─ <user_message> READ: ✅ "Process ₹50,000 split"
├─ <assistant> THINKS: "I know Model 3. Fetching units..." → DISCARDED ❌
└─ <memory> WRITE: ✅ "Model: Model 3 + Units + Splits calculated"

REQUEST 3: "Execute settlement"
├─ <system> READ: ✅ "You are a financial agent"
├─ <tools> READ: ✅ "Here are 12 APIs available"
├─ <memory> READ: ✅ "Model + Units + Splits" (all accumulated)
├─ <user_message> READ: ✅ "Execute settlement"
├─ <assistant> THINKS: "I have everything. Executing..." → DISCARDED ❌
└─ <memory> WRITE: ✅ "Model + Units + Splits + Settlement ID + Receipts"
```

---

## Doctor Visit Mapping (Complete)

### VISIT 1: Initial Diagnosis

```
PATIENT SAYS:
"I have chest pain and shortness of breath"
↓
= <user_message>

DOCTOR'S LICENSE & CONSTRAINTS:
"I must follow medical ethics, use only certified equipment"
↓
= <system>

AVAILABLE EQUIPMENT:
ECG machine, blood test lab, X-ray, stethoscope
↓
= <tools>

DOCTOR'S THINKING (THIS VISIT):
"Cardiac symptoms... likely heart failure... order ECG, troponin, X-ray"
[Makes decisions, analyzes results]
↓
= <assistant> (FORGOTTEN after explanation)

RESULTS STORED IN MEDICAL FILE:
✅ Chief Complaint: Chest pain, SOB
✅ ECG: Abnormal ST segment
✅ Troponin: 2.5 ng/mL
✅ X-ray: Fluid in lungs
✅ Diagnosis: Heart failure
✅ Medication: Beta-blockers + Diuretics
↓
= <memory> (KEPT FOREVER)
```

### VISIT 2: Follow-up (1 Month Later)

```
PATIENT SAYS:
"Still having shortness of breath"
↓
= <user_message>

DOCTOR READS MEDICAL FILE:
"Last visit: Heart failure. Troponin was 2.5. On beta-blockers."
↓
= <memory> READ

DOCTOR'S NEW THINKING (THIS VISIT):
"Patient still SOB. Is medication working? Run new tests."
[Fresh analysis, new strategy]
↓
= <assistant> (FORGOTTEN after explanation)

UPDATED MEDICAL FILE:
✅ Previous visits data
✅ Follow-up visit date
✅ New ECG: No improvement
✅ New troponin: Still elevated
✅ Echo: EF 35%
✅ Plan: Adjust medication
↓
= <memory> GROWS
```

### VISIT 3: Continued Care (2 Months Later)

```
PATTERN REPEATS:
Read file → Fresh thinking → Update file → Forget thinking
```

---

## Real-World Example: SocietyPay Maintenance Payment

### Three-Step Settlement Process

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: Validate Maintenance Model                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ <system>: "You are financial settlement agent"            │
│ <tools>: [get_maintenance_config, get_all_units, etc.]   │
│ <memory>: {} (empty)                                       │
│ <user_message>: "What's the maintenance model?"           │
│                                                             │
│ <assistant>:                                               │
│   "Need to fetch maintenance config.                       │
│    Calling get_maintenance_config()..."                    │
│   ↓ [DISCARDED after response]                            │
│                                                             │
│ <memory>:                                                  │
│   ✅ Maintenance Model: Model 3                           │
│   ✅ Calculation: share % × total amount                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ STEP 2: Calculate Unit Splits                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ <system>: "You are financial settlement agent"            │
│ <tools>: [get_maintenance_config, get_all_units, etc.]   │
│ <memory>: {Model: Model 3}  ← READ from previous request  │
│ <user_message>: "Process ₹50,000 split"                  │
│                                                             │
│ <assistant>:                                               │
│   "I know Model 3 from earlier.                           │
│    Now fetching all units...                              │
│    Calculating splits:                                     │
│    A1: 10.5% × ₹50,000 = ₹5,250                          │
│    A2: 15.0% × ₹50,000 = ₹7,500                          │
│    A3: 12.5% × ₹50,000 = ₹6,250"                         │
│   ↓ [DISCARDED after response]                            │
│                                                             │
│ <memory>:                                                  │
│   ✅ Maintenance Model: Model 3                           │
│   ✅ Units: A1 (10.5%), A2 (15%), A3 (12.5%)            │
│   ✅ Total Amount: ₹50,000                                │
│   ✅ Calculated Splits:                                   │
│      - A1: ₹5,250                                         │
│      - A2: ₹7,500                                         │
│      - A3: ₹6,250                                         │
│   ✅ Status: Awaiting confirmation                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ STEP 3: Execute Settlement                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ <system>: "You are financial settlement agent"            │
│ <tools>: [execute_settlement, generate_receipt, etc.]     │
│ <memory>:  ← READ: Model 3, Units, Splits, Status         │
│            {All accumulated data available}                │
│ <user_message>: "Yes, execute the settlement"             │
│                                                             │
│ <assistant>:                                               │
│   "I have all required data from previous steps.          │
│    Model: Model 3 ✓                                       │
│    Units: A1, A2, A3 ✓                                    │
│    Splits validated: Sum = ₹50,000 ✓                      │
│    Executing via Razorpay..."                             │
│   ↓ [DISCARDED after response]                            │
│                                                             │
│ <memory>:                                                  │
│   ✅ Maintenance Model: Model 3                           │
│   ✅ Units: A1 (10.5%), A2 (15%), A3 (12.5%)            │
│   ✅ Total Split: ₹50,000                                │
│   ✅ Settlement ID: SET-2024-001                          │
│   ✅ Status: Completed                                    │
│   ✅ Receipts:                                            │
│      - A1: CODE/FY/0001                                   │
│      - A2: CODE/FY/0002                                   │
│      - A3: CODE/FY/0003                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Common Mistakes & Why Agents Break

### ❌ Mistake 1: Confusing Memory with Thinking

```
WRONG: Storing reasoning in memory
"Called get_units API, got 3 results, calculated splits manually..."
↓
Problem: Memory bloats, agent loses focus, next request confused

RIGHT: Storing only facts in memory
"Units: A1 (10.5%), A2 (15%), A3 (12.5%)"
↓
Solution: Clean memory, agent can reason fresh each time
```

### ❌ Mistake 2: Expecting Agent to Remember Reasoning

```
Request 1: Agent thinks "Model 3 means share % × amount"
Request 2: User asks "Wait, why did you calculate it that way?"
Agent response: "I don't remember my reasoning from last time"
↓
Problem: Assistant thinking is discarded!

SOLUTION: Store the RULE in memory
Memory: "Model 3 Calculation: share % × total amount"
Request 2: Agent reads rule, explains it
```

### ❌ Mistake 3: Not Updating Memory with Results

```
Tool call returns: {"unit_id": "A1", "share": 10.5}
But NOT stored in memory

Next request needs this data → Agent calls same tool again
Next request after that → Calls tool again
↓
Problem: Wasted tokens, inconsistent data, slow responses

SOLUTION: Always write tool results to memory
Then agent can read from memory instead of calling API repeatedly
```

### ❌ Mistake 4: Storing Sensitive Data in Memory

```
WRONG: Memory stores API keys, passwords, credit card numbers
↓
Security breach, audit failure, compliance violation

RIGHT: Memory only stores derived facts
"Payment processed via Razorpay" not "API Key: xyz123"
```

---

## What Each Tag Should/Shouldn't Store

### `<system>` - DO's and DON'Ts

✅ **DO STORE:**
- Role definition: "You are a financial settlement agent"
- Hard constraints: "Never settle more than 100%"
- Tool availability rules: "Only use certified gateways"
- Output format rules: "Always show calculations"

❌ **DON'T STORE:**
- Specific user data
- Current transaction details
- Temporary state
- Previous interaction history

### `<tools>` - DO's and DON'Ts

✅ **DO:**
- List all available functions
- Describe each tool's purpose
- Define required parameters
- Document return format

❌ **DON'T:**
- Store results of calling tools
- Embed logic in tool definitions
- Hide available tools
- Change tools mid-conversation

### `<memory>` - DO's and DON'Ts

✅ **DO STORE:**
- Test results and findings
- Calculated values
- Decisions made and their outcomes
- User preferences
- Configuration discovered
- Transaction history

❌ **DON'T STORE:**
- Internal reasoning steps
- Intermediate calculations
- Rejected approaches (unless lesson is reusable)
- Passwords, API keys, sensitive info
- Temporary variable states

### `<user_message>` - Simple

✅ Each user request  
❌ Nothing else

### `<assistant>` - Important Limits

✅ Show thinking (for this request only)  
❌ Don't expect it to persist  
✅ Use for transparency  
❌ Never rely on it in future requests

---

## Memory Lifecycle: 3 Tiers

### Tier 1: Session Context (During current request)
```
Loaded in context window only
Examples: Current conversation turn, active calculation
Lifetime: This request only
```

### Tier 2: Session Memory (Across requests in one conversation)
```
Persists until conversation ends
Examples: Units fetched, splits calculated, settlement ID
Lifetime: Entire conversation
```

### Tier 3: Long-term Memory (Across multiple conversations)
```
Stored in database/file system
Examples: Society configuration, historical transactions
Lifetime: Indefinite
```

---

## The 3-Step Memory Management Pattern

```
┌────────────────────────────────────────┐
│ 1. WRITE (After agent action)          │
│                                        │
│ Tool call result → Analyze → Store in  │
│ memory what matters                    │
│                                        │
│ "Troponin: 2.5 ng/mL" ✅              │
│ Not: "Called blood test, got result,  │
│ processed it" ❌                       │
└────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────┐
│ 2. MANAGE (Index what matters)         │
│                                        │
│ Keep memory organized by:              │
│ - Recency (when was it added?)         │
│ - Relevance (does it apply now?)       │
│ - Reliability (is it still accurate?)  │
└────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────┐
│ 3. READ (In next request)              │
│                                        │
│ Agent reads memory to avoid:           │
│ - Repeating previous steps             │
│ - Losing context                       │
│ - Making conflicting decisions         │
└────────────────────────────────────────┘
```

---

## Quick Checklist: Is Your Agent Memory Healthy?

- [ ] Memory grows with each interaction (facts accumulate)
- [ ] Memory doesn't store reasoning (only results)
- [ ] Agent can read memory in next request
- [ ] Old data is marked with dates (freshness matters)
- [ ] Sensitive info is NOT in memory
- [ ] Tool results are stored, not APIs called repeatedly
- [ ] Agent's thinking is shown but discarded
- [ ] Constraints from `<system>` are enforced
- [ ] Tools are available in every request
- [ ] User message is understood with memory context

If all ✅, your agent works in production.  
If any ❌, your agent will break under real users.

---

## Real-World Test: Does Your Agent Pass?

**Test 1: Can it continue work?**
```
Request 1: "Fetch the units"
Request 2: "Now show me the splits"
Request 3: "Execute payment"

Agent should NOT refetch units in Request 3.
If it does: Memory not working.
```

**Test 2: Does it remember results?**
```
Request 1: "Get config" → Returns Model 3
Request 2: "Should we use Model 3?" 
Agent should remember: "Yes, Model 3 is configured"

If it says "What's Model 3?": Memory not working.
```

**Test 3: Does it avoid repeating work?**
```
Call Tool A in Request 1 → Results stored in memory
Call Tool A again in Request 2?
Agent should read from memory, NOT call API again.

If API is called again: Memory not being used.
```

**Test 4: Can it explain its reasoning?**
```
Request 1: Agent shows thinking in <assistant> tag
Request 2: Can agent still work even though thinking is gone?

If agent breaks without the thinking: Design flaw.
```

---

## Key Takeaway

Remember this pattern:
- **System**: Set once, applies to all
- **Tools**: Available every time
- **Memory**: Grows, persists, stores facts only
- **User message**: Fresh each time
- **Assistant**: Shows work, then forgotten

Doctor visits his patient the same way every time.  
AI agents should too.
