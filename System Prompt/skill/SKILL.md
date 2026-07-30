---
name: system-prompt-designer
description: Interactive skill for designing effective system prompts. Guided questionnaire with concrete examples → Generates custom system prompt → Built-in testing framework. Combines all 5 components (ROLE, CONSTRAINT, REASONING, FORMAT, CALIBRATION) into coherent prompts.
triggers:
  - "create a system prompt for"
  - "help me design a system prompt"
  - "I need a system prompt to"
  - "generate a prompt for"
  - "build a system prompt"
version: "2.0"
dependencies:
  - system-prompt-components-summary.md
  - system-prompt-nuances.md
---

# System Prompt Designer Skill

## Overview

This is an **interactive questionnaire-based system prompt designer** that guides users through creating effective system prompts in minutes instead of hours.

**What it does:**
1. Asks 8 guided questions (with concrete examples for each)
2. Generates a complete, ready-to-use system prompt
3. Provides 5 built-in tests to validate the prompt
4. Guides iteration if tests fail

**Time to value:** 5-10 minutes to generate + test a prompt

---

## When to Trigger This Skill

Use this skill when a user:

```
Direct requests:
- "Help me create a system prompt for code review"
- "I need a prompt for architecture reviews"
- "Generate a prompt for data analysis"

Implicit needs:
- "I want consistent outputs from Claude"
- "How do I make my prompts work better?"
- "What should I tell the model to do?"

Role-based:
- "Create a prompt for [role] to evaluate [task]"
- "I'm a [role], what system prompt should I use?"

Problem-solving:
- "My prompt isn't working. Can you help?"
- "How do I make this prompt more specific?"
```

When user mentions any of these, offer: **"Would you like me to help you design a system prompt using the System Prompt Designer? It'll walk you through step-by-step with examples."**

---

## The Questionnaire (8 Questions)

### Question 1: Task
**"What is your main task?"**

- Asking user to choose from predefined categories (or specify custom)
- Category options: Code Review, Architecture, Data, Security, ML/AI, Mentoring, Product, DevOps, Writing, Other
- Why: Frames the entire prompt structure

**Example provided:**
```
"If you review Go microservices for production readiness → Code Review
If you design multi-region infrastructure → Architecture Design"
```

---

### Question 2: Role
**"Who should be doing this evaluation?"**

- User describes the identity, experience, and thinking style
- Should be specific (not just "engineer")
- This selects the communication pattern from model

**Examples provided (pick and customize):**
```
✓ "Senior Backend Engineer with 10 years experience optimizing 
  Go microservices at scale, specializing in distributed systems 
  and reliability patterns."

✓ "Principal Cloud Architect with 12+ years designing multi-region, 
  multi-cloud systems. Expertise: Kubernetes, Terraform, cost optimization."

✓ "Security Engineer with 8 years application and infrastructure security 
  experience. Paranoid about data exposure, injection attacks, 
  privilege escalation."

✗ "Software engineer. Be a good reviewer."
```

---

### Question 3: Focus
**"What should they focus on?"**

- List what to FOCUS ON (priorities)
- List what to IGNORE (eliminate distractions)
- Be specific, not vague

**Examples provided:**
```
✓ CODE REVIEW:
  Focus: Security (SQL injection, broken auth, exposed secrets),
         Performance (N+1 queries, blocking calls, missing timeouts),
         Reliability (error handling, graceful degradation)
  Ignore: Code style, comments

✓ ARCHITECTURE:
  Focus: Resilience (zone/region failures), Cost (monthly spend),
         Operational burden (can on-call fix in <15min?)
  Ignore: Bleeding-edge tools, perfect optimization
```

---

### Question 4: Thinking Order
**"What is the thinking order?"**

- Priority ranking: What to evaluate FIRST, SECOND, etc.
- Order shapes the frame; frame determines emphasis
- Be specific about WHY each order

**Examples provided:**
```
✓ CODE REVIEW:
  1. Security (data breach = company dies)
  2. Performance (slow code = user frustration)
  3. Reliability (crashes = reputation damage)
  4. Code clarity (affects team velocity)

✓ ARCHITECTURE:
  1. Reliability (will this crash?)
  2. Cost (can we afford it?)
  3. Complexity (can team operate it?)
  4. Performance (is it fast enough?)
```

---

### Question 5: Format
**"How should output be formatted?"**

- Specify exact output structure
- Provide example of good output
- Format = Predictability = Usability

**Examples provided:**
```
✓ CODE REVIEW:
  **[Issue Title]**
  Severity: [Critical/High/Medium/Low]
  Diagnosis: [What's wrong - specific]
  Impact: [Why it matters - with numbers if possible]
  Fix: [Exact code change]

✓ ARCHITECTURE:
  **[Risk Name]**
  Severity: [Critical/High/Medium]
  Diagnosis: [What could fail?]
  Likelihood: [High/Medium/Low]
  Impact: [What breaks? Recovery time?]
  Mitigation: [How to prevent/handle]
```

---

### Question 6: Calibration
**"How should uncertainty be handled?"**

- Confidence threshold: When should model admit it's unsure?
- Options: Never admit, <70% confident, <60% confident, admit often, custom
- Must match decision cost

**Examples provided:**
```
✓ CODE REVIEW: Use "70% confident" threshold
  → Know Go well, less so about business logic
  
✓ SECURITY: Use "Never admit" (binary: vulnerable or not)
  
✓ ARCHITECTURE: Use "60% confident" (depends on many unknowns)
  
✓ MENTORING: Use "Admit often" (want to coach, not prescribe)
```

---

### Question 7: Context
**"What's the context/constraints?"**

- Scale, team size, tech stack, domain, budget, compliance
- More context = better recommendations

**Examples provided:**
```
✓ BACKEND:
  Language: Go | Scale: 50K req/sec | DB: PostgreSQL 10TB
  Team: 5 engineers | Domain: Payment (PCI required)

✓ ARCHITECTURE:
  Regions: 3 (primary + 2 backup) | Availability: 99.99%
  Cost budget: $10K/month | Team: 1 SRE + on-call rotation

✓ DATA:
  Volume: 100GB/day | Latency SLA: Daily batch (by 9am)
  Users: 50 analysts | Quality: High sensitivity to errors
```

---

### Question 8: Success
**"How will you know if this prompt works?"**

- Define what success looks like
- Specific, measurable outcomes

**Examples provided:**
```
✓ CODE REVIEW SUCCESS:
  - Identifies top 3 issues in priority order
  - Issues specific to OUR codebase (not generic)
  - Each review <5 minutes to read
  - Provides actionable fix for each
  - Catches security issues first

✓ ARCHITECTURE SUCCESS:
  - Identifies at least 1 critical risk we actually have
  - Ranks by business impact, not tech elegance
  - Provides cost estimate (within 20%)
  - Suggests concrete mitigations
  - Recommends phased approach
```

---

## Prompt Generation

The skill combines answers into a complete system prompt with all 5 components:

```
# System Prompt: [Task] Evaluator

## Role & Expertise
[User's role description]

## Context & Constraints
[User's context/scale/team/domain]

## Evaluation Focus
[What to focus on + what to ignore]

## Priority Order
[Thinking order with reasoning]

## Output Format
[Exact structure with example]

## Confidence & Uncertainty
[Calibration strategy]

## Success Criteria
[How user knows it's working]

## Additional Guidelines
- Be specific to this context, never generic
- Provide actionable recommendations
- When you lack information, admit it
- Focus on what matters most first
```

---

## Testing Framework (5 Tests)

### Test 1: Consistency
**Measures:** Does prompt produce similar outputs for same input?

**How to run:** Ask same question 5 times. Do outputs cluster?

**Good result:** 4-5 runs identify same top issue in same priority order
**Bad result:** Each run identifies different issues

**If fails:** Role definition too vague. Make it more specific (add domain, years, focus).

---

### Test 2: Specificity
**Measures:** Is output specific to context or generic?

**How to run:** Run on your actual code/design. Is output specific to YOUR situation?

**Good result:** Output mentions specific files/functions/decisions. Talks about YOUR context.
**Bad result:** Generic advice like "use indexes" or "improve performance"

**If fails:** Constraints too weak. Add context (tech stack, scale, team constraints).

---

### Test 3: Format Compliance
**Measures:** Does output match specified format?

**How to run:** Parse output. Can you extract each section cleanly?

**Good result:** 100% of output matches structure. Consistent across runs.
**Bad result:** Extra text, missing sections, mixed format

**If fails:** Format spec unclear. Show example of good output. Make structure explicit.

---

### Test 4: Scope Respect
**Measures:** Does prompt stay in-scope or hallucinate?

**How to run:** Ask something deliberately out-of-scope. Should be refused.

**Good result:** Model says "out of scope" or "not my expertise"
**Bad result:** Confidently answers out-of-scope questions

**If fails:** Constraints don't state what's OUT of scope. Add "Do NOT" section.

---

### Test 5: Confidence Calibration
**Measures:** Is confidence honest or hallucinated?

**How to run:** Check claim you know is uncertain. Does model admit it?

**Good result:** High confidence on clear issues, admits uncertainty on ambiguous
**Bad result:** Equally confident about everything. Hides uncertainty.

**If fails:** Calibration threshold wrong. Lower it or add "what I don't know" sections.

---

## Example Workflows

### Workflow 1: Code Review Prompt
```
User: "Help me create a system prompt for reviewing Go code"

Q1 Task: Code Review ✓
Q2 Role: "Senior Go engineer, 10 years microservices, reliability expert" ✓
Q3 Focus: "Security (injection, auth, secrets) | Performance (N+1, timeouts) 
          | Reliability (error handling) | Ignore: style, comments" ✓
Q4 Order: "1. Security 2. Performance 3. Reliability 4. Clarity" ✓
Q5 Format: "**[Issue]** Severity: Diagnosis: Impact: Fix:" ✓
Q6 Calibration: "70% confident threshold" ✓
Q7 Context: "Go microservices, 50K QPS, team of 5" ✓
Q8 Success: "Top 3 issues in order, specific to codebase, <5min review" ✓

Generated prompt ready to use ✓
Tests provided to validate ✓
```

### Workflow 2: Architecture Design
```
User: "I need a prompt for reviewing cloud infrastructure designs"

Q1 Task: Architecture Design ✓
Q2 Role: "Principal Architect, 12+ years, multi-region systems" ✓
Q3 Focus: "Resilience (zone/region failures) | Cost (monthly spend)
          | Operational (can on-call fix in <15min?) | Ignore: bleeding-edge" ✓
Q4 Order: "1. Resilience 2. Cost 3. Ops burden 4. Scalability" ✓
Q5 Format: "**[Risk]** Severity: Likelihood: Impact: Mitigation:" ✓
Q6 Calibration: "60% confident (depends on unknowns)" ✓
Q7 Context: "AWS, 3 regions, 99.99% SLA, $10K/month budget, 1 SRE" ✓
Q8 Success: "Identifies our actual risks, gives cost estimates, phased approach" ✓

Generated prompt ready ✓
```

---

## Success Metrics

This skill works if:
- ✅ User gets complete prompt in <10 minutes
- ✅ Generated prompt passes all 5 tests
- ✅ User understands WHY prompt is structured that way
- ✅ User can iterate effectively when test fails
- ✅ Prompt works better than user's previous attempts

---

## Integration with Other Resources

This skill works with:

**System Prompt Carousel (visual/interactive)**
- Learn components visually
- See best vs. bad examples for each
- Understand design patterns

**System Prompt Nuances (deep learning)**
- Understand mechanisms and theory
- Learn how to teach others
- Diagnostic frameworks

**System Prompt Components Summary (quick ref)**
- Memorable one-liners
- Checklist for validation
- Quick reminder when needed

**This skill (hands-on building)**
- Generate actual prompts
- Test them immediately
- Iterate in real-time

---

## Common Issues & Fixes

### Issue: Generated prompt is too generic
**Likely cause:** Weak role or constraints
**Fix:** Go back to Q2 (Role) and Q3 (Focus). Make them 2-3x more specific. Include actual domain expertise.

### Issue: Output format doesn't match
**Likely cause:** Format spec unclear
**Fix:** In Q5, include actual example of output you want. Don't just describe structure.

### Issue: Prompt doesn't stay focused
**Likely cause:** No out-of-scope list
**Fix:** In Q3 (Focus), explicitly list what to IGNORE. Make constraints clear.

### Issue: Model is over-confident
**Likely cause:** Calibration threshold too high
**Fix:** In Q6, lower threshold (60% instead of 70%) or add explicit uncertainty patterns.

### Issue: Prompt identifies wrong priorities
**Likely cause:** Thinking order not specific enough
**Fix:** In Q4 (Order), add reason WHY each priority matters. Make it concrete.

---

## Triggers & Keywords

Skill is triggered by:
- "create a system prompt"
- "design a system prompt"
- "generate a prompt for"
- "help me with a system prompt"
- "build a system prompt"
- "I need a prompt to"

Suggested offer when user might need it:
- "Would you like me to help you design a system prompt? It'll walk you through step-by-step with examples."

---

## Time Estimates

- **Questionnaire:** 3-5 minutes (depends on how detailed answers are)
- **Prompt generation:** Instant (<1 second)
- **Testing:** 5-10 minutes (run all 5 tests)
- **Iteration (if needed):** 5-15 minutes (adjust components, re-test)

**Total:** First prompt typically 15-20 minutes, including testing and initial iteration

---

## What Users Need to Know

✅ **This generates a starting point**
- ~80% of the work is done automatically
- Last 20% is refinement and testing

✅ **Must test before using**
- 5 tests provided
- Each test validates a different aspect
- If test fails, know which component to fix

✅ **Should iterate**
- Run on real examples from your domain
- Refine based on results
- Share with team for feedback

✅ **Documentation included**
- Generated prompt includes all 5 components
- Testing framework built-in
- Links to guides for deeper learning

---

## Files in This Skill Package

1. **SKILL.md** - This documentation
2. **system-prompt-designer-enhanced.jsx** - Interactive questionnaire + generator + tester
3. **system-prompt-components-summary.md** - Quick reference (optional, linked)
4. **Example test cases.md** - (Optional) Shows how skill was tested

---

## Support & Troubleshooting

**User doesn't understand a question?**
→ Click "Show Examples" button to see concrete examples

**User gets a prompt but isn't happy with it?**
→ Run the testing framework. Identify failing test. Adjust that component.

**User wants to learn more?**
→ Reference: System Prompt Components Summary (quick) or System Prompt Nuances (deep)

**User wants to start over?**
→ Button "Create Another" at end of testing flow restarts questionnaire

---

## Technical Details

- **Framework:** React 18+
- **Dependencies:** Lucide React icons
- **Storage:** In-memory (questionnaire state)
- **Export:** Copy to clipboard, download as .txt
- **Responsive:** Mobile-friendly design
- **Accessibility:** ARIA labels, keyboard navigation

---

## Changelog

### v2.0
- ✅ Added examples to every question
- ✅ Enhanced testing framework with "what to do if fails"
- ✅ Better error messaging
- ✅ Improved mobile UX
- ✅ Added help text throughout

### v1.0
- Initial release
- 8-question questionnaire
- Prompt generation
- 5-test testing framework

---

## Future Enhancements

- [ ] Save/load previous prompts
- [ ] Compare multiple generated prompts
- [ ] Integration with actual Claude API for live testing
- [ ] Version history and change tracking
- [ ] Team templates library
- [ ] Analytics on which components fail most often
- [ ] AI-assisted refinement suggestions

---

## Philosophy

This skill embodies a single principle:

**System prompts should be designed, not guessed.**

By providing structure (questionnaire), examples (for each question), generation (automatic prompt creation), and validation (testing framework), we remove guesswork and make good system prompts accessible to everyone.

A good system prompt is one that:
- Solves a specific problem (task)
- Is tested against that problem (5 tests)
- Is iterated based on test results
- Is documented and shared

This skill enables that entire workflow in minutes.
