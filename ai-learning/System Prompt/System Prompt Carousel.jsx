import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, X, Info } from 'lucide-react';

export default function SystemPromptCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 0,
      type: 'intro',
      title: 'System Prompt Guidelines',
      subtitle: 'Building Effective AI Instructions',
      sections: [
        {
          heading: 'What are System Prompts?',
          content: 'A system prompt is a set of instructions that shapes how an AI model behaves. It\'s like defining an interface contract: specifying who is evaluating, what to focus on, in what order to think, how to present output, and when to admit uncertainty.'
        },
        {
          heading: 'Why They Matter?',
          content: 'Without a system prompt: Outputs are inconsistent, generic, and unpredictable. With a system prompt: Outputs are organized, specific, and trustworthy.'
        },
        {
          heading: 'The Five Components',
          content: 'Every effective system prompt has 5 interconnected components: ROLE (who), CONSTRAINT (what), REASONING (order), FORMAT (how), and CALIBRATION (when).'
        },
        {
          heading: 'How to Use This Carousel',
          content: 'Navigate through each component using the buttons below. Each slide shows: What it is, How to use it, Best Practice, and Bad Practice. Use this as a guide when writing your own prompts.'
        }
      ]
    },
    {
      id: 1,
      type: 'component',
      title: 'ROLE',
      subtitle: 'Who is evaluating?',
      what: 'Selecting the identity and communication pattern. You\'re choosing WHO is thinking, not just giving instructions.',
      how: [
        'Choose specific identity (not just "engineer")',
        'Include experience level and domain',
        'Match real communication patterns',
        'This selects thinking style from training data'
      ],
      bestPractice: 'You are a Senior Backend Engineer with 10 years experience optimizing Go microservices at scale, specializing in distributed systems and performance tuning.',
      badPractice: 'You are a software engineer. Be a good reviewer.'
    },
    {
      id: 2,
      type: 'component',
      title: 'CONSTRAINT',
      subtitle: 'What to focus on?',
      what: 'Narrowing focus by filtering out possibilities. You eliminate branches to make the output space smaller.',
      how: [
        'Specify what TO focus on',
        'Specify what TO ignore',
        'Use specific context (language, scale)',
        'Keep constraints orthogonal (independent)',
        'Each constraint cuts a different slice'
      ],
      bestPractice: 'Focus: Security (SQL injection, auth, data exposure). Ignore: Code style, comments. Context: Java payment system, 50K QPS.',
      badPractice: 'Be comprehensive AND concise AND thorough AND specific AND maintain quality.'
    },
    {
      id: 3,
      type: 'component',
      title: 'REASONING',
      subtitle: 'In what order to think?',
      what: 'Specifying evaluation order. Thinking order shapes the frame. Frame determines emphasis.',
      how: [
        'Identify what to evaluate FIRST',
        'Define what comes SECOND, THIRD',
        'BE SPECIFIC about each priority',
        'Match how real people think',
        'First thinking shapes everything else'
      ],
      bestPractice: '1. Security (SQL injection, broken auth)\n2. Performance (N+1 queries, timeouts)\n3. Reliability (error handling)\n4. Code clarity (readability)',
      badPractice: 'Think about security and performance. Also consider maintainability. Be thorough.'
    },
    {
      id: 4,
      type: 'component',
      title: 'FORMAT',
      subtitle: 'How to present the output?',
      what: 'Pre-shaping output structure so it\'s predictable and parseable. Format determines if output is usable.',
      how: [
        'Specify exact structure and sections',
        'SHOW example of good output',
        'Make it parseable (extractable)',
        'Structure creates predictability',
        'Example beats description always'
      ],
      bestPractice: '**[Issue Title]**\nDiagnosis: [What\'s wrong]\nImpact: [Why it matters]\nFix: [Solution]\nSeverity: [Critical/High/Med/Low]',
      badPractice: 'Provide output in a good format. Give recommendations and explanations.'
    },
    {
      id: 5,
      type: 'component',
      title: 'CALIBRATION',
      subtitle: 'When to admit uncertainty?',
      what: 'Honest assessment of what model UNDERSTANDS vs. DOESN\'T UNDERSTAND. Confidence reflects actual knowledge gaps.',
      how: [
        'Define confidence threshold (e.g., 70%)',
        'Show what you UNDERSTAND (general)',
        'Show what you DON\'T (specific gaps)',
        'Confidence reflects the gap',
        'Provide conditional recommendations'
      ],
      bestPractice: 'Below 70% confident:\n1. State confidence level\n2. Explain what you understand\n3. Explain what you don\'t\n4. Say what info would help',
      badPractice: 'When uncertain, say so. Be humble about limits.'
    }
  ];

  const currentContent = slides[currentSlide];

  const goNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-6 flex flex-col">
      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            System Prompt Components
          </h1>
          <p className="text-sm md:text-base text-slate-300">
            Interactive guide to building effective system prompts
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex gap-1.5 justify-center mb-6 flex-wrap">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2.5 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-blue-500 w-8'
                  : 'bg-slate-600 w-2.5 hover:bg-slate-500'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              title={index === 0 ? 'Introduction' : `Component ${index}`}
            />
          ))}
        </div>

        {/* Main Content - Intro Slide */}
        {currentContent.type === 'intro' && (
          <div className="flex-1 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 bg-white bg-opacity-20 text-white px-3 py-1.5 rounded-lg mb-4">
                <Info className="w-4 h-4" />
                <span className="text-xs md:text-sm font-semibold">INTRODUCTION</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                {currentContent.title}
              </h2>

              <div className="space-y-5">
                {currentContent.sections.map((section, idx) => (
                  <div key={idx} className="bg-white bg-opacity-10 backdrop-blur rounded-lg p-4">
                    <h3 className="font-semibold text-white text-sm md:text-base mb-2">
                      {section.heading}
                    </h3>
                    <p className="text-white text-opacity-90 text-xs md:text-sm leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white border-opacity-20">
              <p className="text-white text-opacity-80 text-xs">
                ➜ Click "Next" to start exploring the 5 components
              </p>
            </div>
          </div>
        )}

        {/* Main Content - Component Slides */}
        {currentContent.type === 'component' && (
          <div className="flex-1 bg-white rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="mb-4 pb-3 border-b border-slate-200">
              <div className="inline-block bg-slate-900 text-white px-3 py-1 rounded-lg mb-2">
                <span className="text-xs font-semibold tracking-wide">
                  Component {currentSlide} of 5
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                {currentContent.title}
              </h2>
              <p className="text-sm md:text-base text-slate-600 mt-1">
                {currentContent.subtitle}
              </p>
            </div>

            {/* Main Content Grid */}
            <div className="flex-1 overflow-auto flex flex-col gap-4">
              {/* What Section */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-3 md:p-4 rounded">
                <h3 className="text-sm font-semibold text-blue-900 mb-1.5">
                  What is it?
                </h3>
                <p className="text-xs md:text-sm text-blue-800 leading-snug">
                  {currentContent.what}
                </p>
              </div>

              {/* How Section */}
              <div className="bg-amber-50 border-l-4 border-amber-400 p-3 md:p-4 rounded">
                <h3 className="text-sm font-semibold text-amber-900 mb-2">
                  How to use it?
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {currentContent.how.map((item, idx) => (
                    <div key={idx} className="flex gap-2">
                      <span className="text-amber-700 font-bold text-xs flex-shrink-0">
                        {idx + 1}.
                      </span>
                      <span className="text-amber-800 text-xs leading-tight">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Best vs Bad Practice - Side by Side */}
              <div className="grid md:grid-cols-2 gap-3 flex-1">
                {/* Best Practice */}
                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-3 md:p-4 flex flex-col">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <h4 className="text-sm font-semibold text-emerald-900">
                      ✓ Best
                    </h4>
                  </div>
                  <pre className="bg-white border border-emerald-200 rounded p-2 text-xs font-mono text-slate-900 whitespace-pre-wrap break-words overflow-hidden flex-1">
                    {currentContent.bestPractice}
                  </pre>
                </div>

                {/* Bad Practice */}
                <div className="bg-rose-50 border-2 border-rose-200 rounded-lg p-3 md:p-4 flex flex-col">
                  <div className="flex items-center gap-1.5 mb-2">
                    <X className="w-4 h-4 text-rose-600" />
                    <h4 className="text-sm font-semibold text-rose-900">
                      ✗ Bad
                    </h4>
                  </div>
                  <pre className="bg-white border border-rose-200 rounded p-2 text-xs font-mono text-slate-900 whitespace-pre-wrap break-words overflow-hidden flex-1">
                    {currentContent.badPractice}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={goPrev}
            disabled={currentSlide === 0}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:opacity-50 text-white rounded-lg transition-colors font-semibold text-sm md:text-base"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <span className="text-slate-300 font-medium text-sm">
            {currentSlide + 1} / {slides.length}
          </span>

          <button
            onClick={goNext}
            disabled={currentSlide === slides.length - 1}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:opacity-50 text-white rounded-lg transition-colors font-semibold text-sm md:text-base"
            aria-label="Next slide"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Footer Hint */}
        <div className="text-center mt-4 text-xs text-slate-400">
          💡 Click progress dots to jump to any slide
        </div>
      </div>
    </div>
  );
}
