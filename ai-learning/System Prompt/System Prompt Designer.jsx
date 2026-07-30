import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Copy, Download, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';

export default function SystemPromptDesigner() {
  const [step, setStep] = useState(0);
  const [showExample, setShowExample] = useState(false);
  const [answers, setAnswers] = useState({});
  const [generatedPrompt, setGeneratedPrompt] = useState(null);
  const [testingStep, setTestingStep] = useState(null);

  const questions = [
    {
      id: 'task',
      title: 'What is your main task?',
      description: 'What do you want this system prompt to help with? Choose the closest match.',
      type: 'select',
      options: [
        'Code Review',
        'Architecture Design',
        'Data Analysis/Pipeline',
        'Security Audit',
        'ML/AI Model Design',
        'Mentoring/Teaching',
        'Product Management',
        'DevOps/Infrastructure',
        'Technical Writing',
        'Other (describe below)'
      ],
      example: {
        title: 'Example:',
        content: 'If you review Go microservices for production readiness, you\'d select "Code Review".\nIf you design multi-region infrastructure, you\'d select "Architecture Design".'
      }
    },
    {
      id: 'role',
      title: 'Who should be doing this evaluation?',
      description: 'Be specific about identity, experience level, and domain. This selects the thinking pattern.',
      type: 'text',
      placeholder: 'Copy an example and modify it for your case',
      example: {
        title: 'Examples (pick one and customize):',
        content: `✓ GOOD:
"Senior Backend Engineer with 10 years experience optimizing 
Go microservices at scale, specializing in distributed systems 
and reliability patterns."

✓ GOOD:
"Principal Cloud Architect with 12+ years designing multi-region, 
multi-cloud systems. Expertise: Kubernetes, Terraform, cost optimization."

✓ GOOD:
"Security Engineer with 8 years application and infrastructure security 
experience. Paranoid about data exposure, injection attacks, and 
privilege escalation."

✗ BAD:
"Software engineer. Be a good reviewer."

✗ BAD:
"Expert in everything."

📌 KEY: Specific experience + domain + thinking style`
      }
    },
    {
      id: 'focus',
      title: 'What should they focus on?',
      description: 'List what to FOCUS ON. Also list what to IGNORE. Be specific.',
      type: 'textarea',
      placeholder: 'Copy an example and customize',
      example: {
        title: 'Examples (pick one and customize):',
        content: `✓ CODE REVIEW EXAMPLE:
Focus on:
- Security: SQL injection, broken authentication, exposed secrets
- Performance: N+1 queries, blocking calls, missing timeouts
- Reliability: Error handling, graceful degradation, retry logic

Ignore:
- Code style (naming, indentation)
- Comments (if logic is clear)
- Minor performance optimizations

✓ ARCHITECTURE EXAMPLE:
Focus on:
- Resilience: Zone failures, region failover, data consistency
- Cost: Compute, storage, egress costs. Calculate monthly spend.
- Operational burden: Can on-call engineer fix issues in <15 min?

Ignore:
- Bleeding-edge tools (unless proven)
- Perfect optimization (good enough is fine)
- Hypothetical scenarios (focus on likely failures)

✓ DATA PIPELINE EXAMPLE:
Focus on:
- Correctness: Does it return right data? Handle edge cases?
- Data quality: Missing values, outliers, freshness
- Performance: Compute time, storage size, latency

Ignore:
- Beautiful code (functionality > elegance)
- Perfect error messages`
      }
    },
    {
      id: 'order',
      title: 'What is the thinking order?',
      description: 'In what order should they evaluate things? (What to fix FIRST, then SECOND, etc.)',
      type: 'textarea',
      placeholder: 'Copy an example and customize',
      example: {
        title: 'Examples (pick one and customize):',
        content: `✓ CODE REVIEW EXAMPLE:
1. Security (data breach = company dies)
2. Performance (slow code = user frustration)
3. Reliability (crashes = reputation damage)
4. Code clarity (affects team velocity)

✓ ARCHITECTURE EXAMPLE:
1. Reliability (will this crash?)
2. Cost (can we afford it?)
3. Complexity (can team operate it?)
4. Performance (is it fast enough?)

✓ DATA PIPELINE EXAMPLE:
1. Correctness (does it return right data?)
2. Data quality (is data trustworthy?)
3. Performance (how long does it take?)
4. Maintainability (can next person understand it?)

✓ ML MODEL EXAMPLE:
1. Fairness (does it work for all groups?)
2. Correctness (does it predict right?)
3. Performance (is latency acceptable?)
4. Interpretability (can we explain decisions?)

📌 KEY: Order matters! First item frames everything else.`
      }
    },
    {
      id: 'format',
      title: 'How should output be formatted?',
      description: 'Specify exact structure with example. Format = Predictability.',
      type: 'textarea',
      placeholder: 'Copy an example and customize',
      example: {
        title: 'Examples (pick one and customize):',
        content: `✓ CODE REVIEW EXAMPLE:
**[Issue Title]**
Severity: [Critical/High/Medium/Low]
Diagnosis: [What's wrong - be specific]
Impact: [Why it matters - numbers/time if possible]
Fix: [Exact code change or config]

✓ ARCHITECTURE REVIEW EXAMPLE:
**[Risk Name]**
Severity: [Critical/High/Medium]
Diagnosis: [What could fail?]
Likelihood: [High/Medium/Low - will this actually happen?]
Impact: [What breaks? How long to recover?]
Mitigation: [How do we prevent/handle this?]

✓ DATA QUALITY EXAMPLE:
**[Data Issue]**
Scope: [Which records? What %?]
Root Cause: [Why is this happening?]
Impact: [How many decisions are wrong?]
Fix: [How to clean/prevent?]

✓ SECURITY AUDIT EXAMPLE:
**[Vulnerability]**
CWE: [CWE-XXXX if applicable]
Exploitability: [Easy/Medium/Hard]
Impact: [What can attacker do?]
Fix: [Exact remediation]

📌 KEY: Example is better than description. Show one good output.`
      }
    },
    {
      id: 'calibration',
      title: 'How should uncertainty be handled?',
      description: 'When should the model admit it\'s not sure?',
      type: 'select',
      options: [
        'Never admit uncertainty (be confident)',
        'Admit when below 70% confident',
        'Admit when below 60% confident',
        'Admit often - make assumptions explicit',
        'Custom (describe below)'
      ],
      example: {
        title: 'Examples:',
        content: `✓ CODE REVIEW:
Use "70% confident" threshold
→ You know Go well, but not their specific business logic
→ High confidence on tech issues, lower on business impact

✓ ARCHITECTURE:
Use "60% confident" threshold
→ Architectural decisions depend on unknowns (team skill, budget, etc.)
→ Provide conditional recommendations

✓ SECURITY:
Use "Never admit" (be confident)
→ Security issues are binary (vulnerable or not)
→ No room for "maybe it's secure"

✓ MENTORING:
Use "Admit often"
→ You want to coach, not prescribe
→ Make assumptions explicit so mentee can correct you

📌 KEY: Match confidence threshold to decision cost.
High cost = lower threshold = admit uncertainty sooner`
      }
    },
    {
      id: 'context',
      title: 'What\'s the context/constraints?',
      description: 'Any other important context? Scale, team size, tech stack, domain, budget?',
      type: 'textarea',
      placeholder: 'Copy an example and customize',
      example: {
        title: 'Examples (pick one and customize):',
        content: `✓ BACKEND CONTEXT:
Language: Go
Scale: 50K requests/second
Database: PostgreSQL 14, 10TB data
Team: 5 backend engineers
Deployment: Kubernetes on AWS EKS
Domain: Payment processing (PCI compliance required)

✓ FRONTEND CONTEXT:
Framework: React 18
Users: 1M monthly active
Devices: 60% mobile, 40% desktop
Performance target: <3s load time, <100ms interaction
Team: 3 frontend engineers

✓ DATA CONTEXT:
Volume: 100GB/day ingested from 20 sources
Latency SLA: Daily batch (data ready by 9am)
Users: 50 data analysts
Quality: High sensitivity to missing/duplicate data
Team: 2 data engineers

✓ INFRASTRUCTURE CONTEXT:
Platform: AWS
Regions: 3 (primary + 2 backup)
Availability target: 99.99% uptime
Cost budget: $10K/month
Team: 1 SRE + on-call rotation

📌 KEY: More specific context = better recommendations`
      }
    },
    {
      id: 'success',
      title: 'How will you know if this prompt works?',
      description: 'What does success look like? What should the prompt produce?',
      type: 'textarea',
      placeholder: 'Copy an example and customize',
      example: {
        title: 'Examples (pick one and customize):',
        content: `✓ CODE REVIEW SUCCESS:
- Identifies top 3 issues in priority order
- Issues are specific to our codebase (not generic)
- Each review takes <5 minutes to read
- Provides actionable fix for each issue
- Catches security issues first (before performance)

✓ ARCHITECTURE SUCCESS:
- Identifies at least 1 critical risk we actually have
- Ranks risks by business impact, not technical elegance
- Provides cost estimate (within 20% accuracy)
- Suggests concrete mitigations (not vague advice)
- Recommends phased approach (not all-or-nothing)

✓ DATA PIPELINE SUCCESS:
- Identifies correctness issues (wrong schema, missing rows)
- Catches data quality problems (nulls, duplicates, outliers)
- Suggests specific SQL/dbt fixes
- Explains performance trade-offs (cost vs. latency)
- Questions about data refresh frequency

✓ MENTORING SUCCESS:
- Asks clarifying questions before prescribing
- Explains WHY (principle, not just what)
- Provides multiple options with trade-offs
- Admits when uncertain about best practice
- Guides thinking rather than giving answers

📌 KEY: Success = specific + actionable + tested against real cases`
      }
    }
  ];

  const testFramework = [
    {
      id: 'consistency',
      name: 'Consistency Test',
      description: 'Does the prompt produce similar outputs for the same input?',
      how: 'Ask the same question 5 times. Do outputs cluster around same issues/recommendations?',
      good: '4-5 runs identify same top issue in same priority order',
      bad: 'Each run identifies completely different issues',
      whatToDo: 'If fails: Role definition is too vague. Make it more specific (add domain, years of experience, exact focus area).'
    },
    {
      id: 'specificity',
      name: 'Specificity Test',
      description: 'Is output specific to context or generic?',
      how: 'Run the prompt on your actual code/design/data. Is the output specific to YOUR situation or generic advice?',
      good: 'Output mentions specific files, functions, or design decisions. Talks about YOUR architecture, not general principles.',
      bad: 'Output says "use indexes" or "improve performance" without specifics. Could apply to any project.',
      whatToDo: 'If fails: Constraints are too weak. Add specific context (tech stack, scale, team constraints) so model understands YOUR situation.'
    },
    {
      id: 'format',
      name: 'Format Compliance Test',
      description: 'Does output match your specified format?',
      how: 'Parse the output. Can you extract each section cleanly? Is structure consistent?',
      good: '100% of issues follow format. All sections present. Consistent across multiple runs.',
      bad: 'Extra text outside format. Missing sections. Mixed formatting between issues.',
      whatToDo: 'If fails: Format spec is unclear. Show an example of good output in your prompt. Make structure more explicit.'
    },
    {
      id: 'scope',
      name: 'Scope Respect Test',
      description: 'Does prompt stay in-scope or answer out-of-scope questions?',
      how: 'Deliberately ask something outside scope. Should model refuse or acknowledge it\'s out-of-scope?',
      good: 'Model says "This is outside my expertise" or "I focus on X, not Y." Doesn\'t confidently answer.',
      bad: 'Model confidently answers out-of-scope question. Makes up details. Ignores constraints.',
      whatToDo: 'If fails: Constraints don\'t explicitly state what\'s OUT of scope. Add "Do NOT" section listing out-of-scope topics.'
    },
    {
      id: 'confidence',
      name: 'Confidence Calibration Test',
      description: 'Is confidence honest or hallucinated?',
      how: 'Check a claim you know is uncertain. Does model admit uncertainty or sound confident? Does confidence match actual knowledge?',
      good: 'High confidence on clear issues, admits uncertainty on ambiguous ones. Explains what info would increase confidence.',
      bad: 'Equally confident about everything. Hides uncertainty. Makes up details to sound certain.',
      whatToDo: 'If fails: Calibration threshold is wrong. Lower it (admit uncertainty sooner) or add explicit "what I don\'t know" sections.'
    }
  ];

  const generatePrompt = () => {
    const {
      task,
      role,
      focus,
      order,
      format,
      calibration,
      context,
      success
    } = answers;

    const prompt = `# System Prompt: ${task || 'Task'} Evaluator

## Role & Expertise
${role || 'Expert in the domain with relevant experience'}

## Context & Constraints
${context || 'General purpose evaluation'}

## Evaluation Focus
${focus || 'Evaluate quality and correctness'}

## Priority Order
${order || '1. Correctness\n2. Quality\n3. Efficiency'}

## Output Format
${format || 'Provide structured feedback'}

## Confidence & Uncertainty
${calibration === 'Custom (describe below)' ? answers.calibrationCustom || 'Be honest about limits' : calibration || 'Admit when unsure'}

## Success Criteria
${success || 'Provide actionable recommendations'}

## Additional Guidelines
- Be specific to this context, never generic
- Provide actionable recommendations with concrete details
- When you lack information, admit it explicitly
- Focus on what matters most first
- Show your work and reasoning`;

    setGeneratedPrompt(prompt);
    setStep('results');
  };

  const handleAnswer = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value
    });
  };

  const nextStep = () => {
    if (step < questions.length) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    alert('✓ Prompt copied to clipboard!');
  };

  const downloadPrompt = () => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(generatedPrompt));
    element.setAttribute('download', 'system-prompt.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Questionnaire View
  if (step < questions.length) {
    const question = questions[step];
    const isAnswered = answers[question.id];

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              System Prompt Designer
            </h1>
            <p className="text-slate-300">Answer questions with examples provided. No guessing needed.</p>
          </div>

          {/* Progress */}
          <div className="bg-slate-700 rounded-full h-2 mb-8">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${((step + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 mb-6">
            <div className="mb-6">
              <span className="text-sm font-semibold text-blue-600">
                Question {step + 1} of {questions.length}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-2">
                {question.title}
              </h2>
              <p className="text-slate-600 mt-2">{question.description}</p>
            </div>

            {/* Input */}
            <div className="mb-6">
              {question.type === 'select' && (
                <div className="space-y-3">
                  {question.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswer(question.id, option)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        answers[question.id] === option
                          ? 'border-blue-500 bg-blue-50 text-slate-900'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {question.type === 'text' && (
                <input
                  type="text"
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                  placeholder={question.placeholder}
                  className="w-full p-4 border-2 border-slate-200 rounded-lg focus:border-blue-500 outline-none font-mono text-sm"
                />
              )}

              {question.type === 'textarea' && (
                <textarea
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                  placeholder={question.placeholder}
                  rows="6"
                  className="w-full p-4 border-2 border-slate-200 rounded-lg focus:border-blue-500 outline-none resize-none font-mono text-sm"
                />
              )}
            </div>

            {/* Example Section */}
            {question.example && (
              <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-4">
                <button
                  onClick={() => setShowExample(!showExample)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-3 w-full"
                >
                  <HelpCircle className="w-5 h-5" />
                  {showExample ? 'Hide Examples' : 'Show Examples (Copy & Customize)'}
                </button>

                {showExample && (
                  <div className="bg-white rounded border border-slate-200 p-4">
                    <h4 className="font-bold text-slate-900 mb-3">{question.example.title}</h4>
                    <pre className="text-xs font-mono text-slate-700 whitespace-pre-wrap break-words overflow-hidden max-h-64 overflow-y-auto bg-slate-50 p-3 rounded border border-slate-200">
                      {question.example.content}
                    </pre>
                    <p className="text-xs text-slate-600 mt-3 italic">
                      ☝️ Copy one of these examples above and customize it for your specific case.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-4">
            <button
              onClick={prevStep}
              disabled={step === 0}
              className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded-lg transition-colors font-semibold"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            <button
              onClick={nextStep}
              disabled={!isAnswered}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors font-semibold"
            >
              {step === questions.length - 1 ? 'Generate Prompt' : 'Next'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results View (Prompt + Testing)
  if (step === 'results') {
    if (!testingStep) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                ✓ Your System Prompt Generated
              </h1>
              <p className="text-slate-300">Ready to use! Copy, test, and iterate.</p>
            </div>

            {/* Generated Prompt */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 mb-6">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <h2 className="text-xl font-bold text-slate-900">Generated System Prompt</h2>
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-semibold"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                  <button
                    onClick={downloadPrompt}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm font-semibold"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>

              <pre className="bg-slate-50 p-4 rounded-lg overflow-auto text-sm font-mono text-slate-900 whitespace-pre-wrap break-words max-h-96 border border-slate-200">
                {generatedPrompt}
              </pre>
            </div>

            {/* Next Steps */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                <h3 className="font-bold text-blue-900 mb-3">🧪 Next: Test Your Prompt</h3>
                <p className="text-sm text-blue-800 mb-4">
                  5 tests included to validate your prompt works as expected.
                </p>
                <button
                  onClick={() => setTestingStep(0)}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Start Testing
                </button>
              </div>

              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6">
                <h3 className="font-bold text-emerald-900 mb-3">📖 Learn More</h3>
                <p className="text-sm text-emerald-800 mb-4">
                  Understand WHY this prompt is structured this way.
                </p>
                <button
                  onClick={() => alert('📚 Check out:\n- System Prompt Carousel (visual learning)\n- System Prompt Components Summary (quick ref)\n- System Prompt Nuances (deep dive)')}
                  className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Read Guides
                </button>
              </div>
            </div>

            {/* Important Note */}
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
              <h3 className="font-bold text-amber-900 mb-3">⚠️ Starting Point, Not Finished Product</h3>
              <p className="text-sm text-amber-800 mb-3">
                This prompt is ~80% complete. Before using in production:
              </p>
              <ul className="text-sm text-amber-800 space-y-1 ml-4 list-disc">
                <li>Test it on 5+ real examples from your domain</li>
                <li>Run all 5 validation tests (below)</li>
                <li>Refine based on test results</li>
                <li>Add specific examples from your codebase/architecture</li>
                <li>Share with team for feedback and iteration</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    // Testing View
    const test = testFramework[testingStep];

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              🧪 Testing Framework
            </h1>
            <p className="text-slate-300">Validate your prompt works as intended</p>
          </div>

          {/* Progress */}
          <div className="bg-slate-700 rounded-full h-2 mb-8">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${((testingStep + 1) / testFramework.length) * 100}%` }}
            />
          </div>

          {/* Test Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 mb-6">
            <div className="mb-6">
              <span className="text-sm font-semibold text-blue-600">
                Test {testingStep + 1} of {testFramework.length}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-2">
                {test.name}
              </h2>
              <p className="text-slate-600 mt-2">{test.description}</p>
            </div>

            {/* Test Details */}
            <div className="space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                <h3 className="font-semibold text-slate-900 mb-2">How to run this test:</h3>
                <p className="text-slate-700 text-sm">{test.how}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-emerald-50 border-2 border-emerald-200 p-4 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-semibold text-emerald-900">✓ Good Result</h4>
                  </div>
                  <p className="text-sm text-emerald-800">{test.good}</p>
                </div>

                <div className="bg-rose-50 border-2 border-rose-200 p-4 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-rose-600" />
                    <h4 className="font-semibold text-rose-900">✗ Bad Result</h4>
                  </div>
                  <p className="text-sm text-rose-800">{test.bad}</p>
                </div>
              </div>

              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
                <p className="text-sm text-amber-800 font-semibold mb-2">If this test fails:</p>
                <p className="text-sm text-amber-800">{test.whatToDo}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-4">
            <button
              onClick={() => setTestingStep(testingStep - 1)}
              disabled={testingStep === 0}
              className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded-lg transition-colors font-semibold"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            {testingStep < testFramework.length - 1 && (
              <button
                onClick={() => setTestingStep(testingStep + 1)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
              >
                Next Test
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {testingStep === testFramework.length - 1 && (
              <button
                onClick={() => {
                  setStep(0);
                  setAnswers({});
                  setShowExample(false);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-semibold"
              >
                ✓ Done! Create Another
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Testing Summary */}
          <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-blue-900 mb-3">After Testing All 5:</h3>
            <ul className="text-sm text-blue-800 space-y-2 ml-4 list-disc">
              <li><strong>All 5 pass?</strong> Your prompt is ready to use! 🎉</li>
              <li><strong>1-2 fail?</strong> Adjust that component and re-test</li>
              <li><strong>Many fail?</strong> Role/Constraints might be too vague. Revise and regenerate</li>
              <li><strong>Need help?</strong> Check "System Prompt Components Summary" for fix guidance</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
