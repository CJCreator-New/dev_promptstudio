export const TOUR_STEPS = [
  {
    title: 'Welcome to DevPrompt Studio!',
    intro: 'This tool helps you turn rough ideas into professional-grade development prompts. Let\'s take a quick tour.',
  },
  {
    element: '#config-grid-area',
    title: '1. Configure Context',
    intro: 'Start here. Select your **Target Tool** (like Bolt or Cursor), your **Domain** (Frontend/Backend), and the desired **Complexity** level.',
    position: 'right'
  },
  {
    element: '#main-input',
    title: '2. Describe Your Idea',
    intro: 'Type your rough request here. Don\'t worry about format—just describe what you want to build in plain English.',
    position: 'top'
  },
  {
    element: '#examples-trigger',
    title: '3. Use Examples',
    intro: 'Stuck? Click here to load pre-built examples for various stacks and use cases.',
    position: 'bottom'
  },
  {
    element: '#suggestions-area',
    title: '4. Enhance with Tags',
    intro: 'As you type, smart suggestions will appear here. Click them to instantly add tech stacks and keywords to your prompt.',
    position: 'top'
  },
  {
    element: '#enhance-btn',
    title: '5. Generate Prompt',
    intro: 'Click here to let Gemini 2.5 transform your input into a structured, optimized specification ready for any LLM.',
    position: 'top'
  }
];