import { DomainType } from '../types';

export interface AgentBuilderRecipe {
  id: string;
  platform: string;
  category: string;
  description: string;
  prompts: string[];
  features: string[];
}

export const AI_AGENT_BUILDER_RECIPES: AgentBuilderRecipe[] = [
  {
    id: 'replit-ai',
    platform: 'Replit AI App Builder',
    category: 'Full-Stack Development',
    description: 'Natural language to full-stack web apps with instant deployment',
    features: ['Real-time collaboration', 'Instant deployment', 'Database integration', 'API generation'],
    prompts: [
      'Build a task management app with user authentication, drag-and-drop task boards, and real-time collaboration. Use React for frontend, Node.js/Express for backend, and PostgreSQL for data storage.',
      'Create a personal finance tracker that connects to bank APIs, categorizes transactions automatically, generates spending reports with charts, and sends budget alerts via email.',
      'Develop a multiplayer trivia game with WebSocket support for real-time gameplay, leaderboards, question categories, and admin panel for managing questions.'
    ]
  },
  {
    id: 'create-xyz',
    platform: 'Create.xyz',
    category: 'Rapid Prototyping',
    description: 'Text-to-website builder for landing pages and marketing sites',
    features: ['Visual editing', 'Responsive design', 'SEO optimization', 'Component library'],
    prompts: [
      'Design a modern SaaS landing page for an AI writing assistant. Include hero section with animated gradient background, feature cards with icons, pricing table with 3 tiers, testimonials carousel, and CTA buttons.',
      'Build a portfolio website for a UX designer showcasing 6 case studies with project thumbnails, filterable by category, about section with skills timeline, and contact form with validation.',
      'Create a restaurant website with online menu, reservation system, photo gallery in masonry layout, Google Maps integration, and mobile-first responsive design with dark mode toggle.'
    ]
  },
  {
    id: 'agentgpt',
    platform: 'AgentGPT',
    category: 'Autonomous Task Execution',
    description: 'Goal-driven autonomous agents that break down and execute complex tasks',
    features: ['Goal decomposition', 'Multi-step reasoning', 'Web browsing', 'Self-correction'],
    prompts: [
      'Research the top 10 AI coding tools launched in 2024, compare their features, pricing, and user reviews, then create a comprehensive comparison spreadsheet with recommendations for different use cases.',
      'Analyze my competitor\'s website (example.com), identify their key value propositions, pricing strategy, target audience, and SEO keywords, then generate a competitive analysis report with actionable insights.',
      'Plan a 7-day trip to Tokyo for 2 people with $3000 budget. Find flights, hotels, create daily itineraries with restaurant recommendations, calculate total costs, and provide booking links.'
    ]
  },
  {
    id: 'superagi',
    platform: 'SuperAGI',
    category: 'Enterprise Agent Framework',
    description: 'Open-source framework for building, managing, and deploying autonomous agents',
    features: ['Tool integration', 'Agent monitoring', 'Performance metrics', 'Multi-agent orchestration'],
    prompts: [
      'Create a customer support agent that monitors Zendesk tickets, categorizes them by urgency and topic, drafts responses using our knowledge base, escalates complex issues to human agents, and tracks resolution metrics.',
      'Build a code review agent that analyzes pull requests, checks for security vulnerabilities, enforces coding standards, runs automated tests, suggests improvements, and posts detailed review comments on GitHub.',
      'Develop a market research agent that scrapes competitor websites daily, tracks pricing changes, monitors social media sentiment, identifies trending features, and generates weekly competitive intelligence reports.'
    ]
  },
  {
    id: 'relevance-ai',
    platform: 'Relevance AI',
    category: 'Business Process Automation',
    description: 'No-code platform for building AI agents and workflows',
    features: ['Workflow builder', 'Data integration', 'API connectors', 'Team collaboration'],
    prompts: [
      'Design a lead qualification agent that receives form submissions, enriches contact data via Clearbit API, scores leads based on company size and industry, assigns to appropriate sales rep, and sends personalized follow-up emails.',
      'Create a content moderation workflow that analyzes user-generated content for inappropriate language, checks images for policy violations, flags suspicious patterns, notifies moderators of high-risk content, and maintains audit logs.',
      'Build an invoice processing agent that extracts data from PDF invoices using OCR, validates against purchase orders, detects anomalies or duplicates, routes for approval based on amount thresholds, and updates accounting system.'
    ]
  },
  {
    id: 'mindstudio',
    platform: 'MindStudio',
    category: 'AI App Builder',
    description: 'Visual builder for creating custom AI applications without coding',
    features: ['Drag-and-drop interface', 'Custom UI components', 'Model selection', 'Publishing platform'],
    prompts: [
      'Build a legal document analyzer that accepts contract uploads, identifies key clauses (termination, liability, payment terms), highlights potential risks, compares against standard templates, and generates summary reports.',
      'Create a personalized learning assistant that assesses student knowledge through quizzes, adapts difficulty based on performance, generates custom study materials, tracks progress over time, and provides spaced repetition reminders.',
      'Develop a recipe generator that takes dietary restrictions and available ingredients as input, suggests creative recipes with step-by-step instructions, calculates nutritional information, and generates shopping lists for missing items.'
    ]
  },
  {
    id: 'promptly',
    platform: 'Promptly',
    category: 'Prompt Chaining & Workflows',
    description: 'Platform for building complex AI workflows with prompt chaining',
    features: ['Visual workflow editor', 'Prompt versioning', 'A/B testing', 'Analytics dashboard'],
    prompts: [
      'Design a blog post creation workflow: 1) Generate 10 SEO-optimized titles from topic, 2) Create detailed outline with H2/H3 headings, 3) Write introduction and conclusion, 4) Expand each section with examples, 5) Add meta description and tags.',
      'Build a customer feedback analysis pipeline: 1) Categorize feedback by topic (product, support, pricing), 2) Extract sentiment scores, 3) Identify actionable insights, 4) Prioritize by impact and frequency, 5) Generate executive summary with recommendations.',
      'Create a job description optimizer: 1) Analyze existing JD for bias and clarity, 2) Suggest inclusive language alternatives, 3) Add skills matrix and requirements, 4) Generate compelling benefits section, 5) Optimize for ATS keywords and SEO.'
    ]
  },
  {
    id: 'postman-agent',
    platform: 'Postman AI Agent Builder',
    category: 'API Testing & Automation',
    description: 'Build agents for API testing, monitoring, and documentation',
    features: ['API testing', 'Mock servers', 'Documentation generation', 'CI/CD integration'],
    prompts: [
      'Create an API testing agent that generates comprehensive test cases for REST endpoints, validates response schemas, checks authentication flows, tests rate limiting, verifies error handling, and produces coverage reports.',
      'Build an API documentation agent that analyzes OpenAPI specs, generates interactive examples with sample requests/responses, creates SDK code snippets in 5 languages, identifies missing descriptions, and suggests improvements.',
      'Develop an API monitoring agent that runs health checks every 5 minutes, tracks response times and error rates, detects breaking changes in responses, alerts on SLA violations, and generates uptime reports.'
    ]
  },
  {
    id: 'lindy-ai',
    platform: 'Lindy.ai',
    category: 'Personal AI Assistant',
    description: 'Build personalized AI assistants for daily tasks and workflows',
    features: ['Email integration', 'Calendar management', 'Task automation', 'Natural language interface'],
    prompts: [
      'Create a meeting scheduler assistant that reads my calendar availability, coordinates with participants via email, finds optimal meeting times across time zones, sends calendar invites with agenda, and follows up with reminders.',
      'Build an email triage agent that categorizes incoming emails by priority, drafts responses to common inquiries, flags urgent messages, archives newsletters, unsubscribes from spam, and provides daily email summaries.',
      'Develop a research assistant that monitors RSS feeds and newsletters for topics I care about, summarizes key articles, saves relevant content to Notion with tags, identifies trending themes, and sends weekly digests.'
    ]
  },
  {
    id: 'multion',
    platform: 'MultiOn',
    category: 'Web Automation Agent',
    description: 'Agents that interact with websites and perform browser-based tasks',
    features: ['Browser automation', 'Form filling', 'Data extraction', 'Multi-step workflows'],
    prompts: [
      'Build a job application agent that searches LinkedIn/Indeed for roles matching my criteria, fills out application forms with my resume data, answers screening questions intelligently, tracks applications in a spreadsheet, and sends me daily summaries.',
      'Create a price monitoring agent that checks 5 e-commerce sites daily for specific products, compares prices and availability, detects price drops or restocks, sends alerts when price falls below threshold, and maintains price history charts.',
      'Develop a social media manager agent that schedules posts across Twitter, LinkedIn, and Facebook, repurposes content for each platform, responds to comments and mentions, tracks engagement metrics, and suggests optimal posting times.'
    ]
  },
  {
    id: 'cognosys',
    platform: 'Cognosys',
    category: 'Research & Analysis Agent',
    description: 'AI agents for deep research, data analysis, and report generation',
    features: ['Web research', 'Data synthesis', 'Report generation', 'Source citation'],
    prompts: [
      'Research the current state of quantum computing: identify leading companies and research institutions, summarize recent breakthroughs, analyze commercial applications, assess timeline to practical quantum advantage, and create a 10-page report with citations.',
      'Analyze the impact of remote work on commercial real estate: gather data on office vacancy rates in major cities, interview findings from industry reports, financial performance of REITs, emerging trends like office-to-residential conversions, and forecast next 5 years.',
      'Investigate best practices for implementing AI governance in enterprises: review frameworks from major consulting firms, case studies from Fortune 500 companies, regulatory requirements across regions, common pitfalls, and create implementation roadmap.'
    ]
  },
  {
    id: 'n8n-ai',
    platform: 'n8n AI Agent',
    category: 'Workflow Automation',
    description: 'Fair-code automation platform with AI agent capabilities',
    features: ['400+ integrations', 'Self-hosted option', 'Visual workflow builder', 'Custom code nodes'],
    prompts: [
      'Build a customer onboarding workflow: When new user signs up in Stripe, create account in app database, send welcome email series via SendGrid, add to CRM with tags, schedule onboarding call, and notify sales team in Slack.',
      'Create a content distribution agent: When new blog post published in WordPress, generate social media variants for each platform, create graphics using Canva API, schedule posts via Buffer, submit to Reddit/HackerNews, and track engagement in Google Sheets.',
      'Develop an incident response workflow: When error rate exceeds threshold in Datadog, create PagerDuty incident, notify on-call engineer, post in Slack channel, create Jira ticket with logs, and send status updates every 15 minutes until resolved.'
    ]
  },
  {
    id: 'zapier-ai',
    platform: 'Zapier AI Actions',
    category: 'App Integration Automation',
    description: 'Connect apps and build automated workflows with AI capabilities',
    features: ['5000+ app integrations', 'Multi-step zaps', 'AI-powered automation', 'Conditional logic'],
    prompts: [
      'Create a lead nurturing automation: When lead downloads whitepaper, add to Mailchimp segment, enrich data via Clearbit, create deal in HubSpot, assign lead score based on company size, and trigger personalized email sequence based on industry.',
      'Build an expense management workflow: When receipt photo uploaded to Dropbox, extract data using OCR, categorize expense type, check against policy limits, route for approval if needed, create entry in QuickBooks, and update budget tracker in Airtable.',
      'Develop a social listening agent: Monitor Twitter/Reddit for brand mentions, analyze sentiment, identify influencers and trending topics, save high-priority mentions to Notion, alert marketing team for negative sentiment, and generate weekly reports.'
    ]
  },
  {
    id: 'langchain-agent',
    platform: 'LangChain Agents',
    category: 'Developer Framework',
    description: 'Build custom agents with tools, memory, and reasoning capabilities',
    features: ['Tool integration', 'Memory systems', 'Chain composition', 'Custom agents'],
    prompts: [
      'Implement a SQL database agent with tools for: querying tables, explaining query results in natural language, suggesting optimizations, detecting schema issues, generating sample data, and creating visualization recommendations.',
      'Build a code documentation agent that: analyzes codebases, generates docstrings for functions, creates README files, identifies undocumented APIs, suggests examples, maintains consistency across docs, and updates on code changes.',
      'Create a data analysis agent with tools for: loading CSV/JSON files, performing statistical analysis, detecting outliers and patterns, generating visualizations, running hypothesis tests, and producing narrative insights with recommendations.'
    ]
  },
  {
    id: 'autogpt',
    platform: 'AutoGPT',
    category: 'Autonomous AI Agent',
    description: 'Self-directed agents that pursue goals with minimal human intervention',
    features: ['Goal-oriented', 'Self-prompting', 'Memory management', 'Tool usage'],
    prompts: [
      'Goal: Launch a profitable micro-SaaS product in 90 days. Steps: Research market gaps, validate ideas through surveys, design MVP features, find no-code tools or developers, build landing page, implement core features, acquire first 100 users, iterate based on feedback.',
      'Goal: Become a recognized expert in AI safety. Steps: Create learning curriculum from top resources, summarize key papers weekly, write blog posts explaining concepts, engage in online communities, contribute to open-source projects, speak at meetups, build portfolio.',
      'Goal: Optimize my personal finances to save $10,000 this year. Steps: Analyze spending patterns, identify unnecessary subscriptions, negotiate bills, find better insurance rates, create budget categories, automate savings, track progress monthly, adjust strategy.'
    ]
  },
  {
    id: 'crew-ai',
    platform: 'CrewAI',
    category: 'Multi-Agent Collaboration',
    description: 'Framework for orchestrating role-playing AI agents working together',
    features: ['Role-based agents', 'Task delegation', 'Collaborative workflows', 'Process automation'],
    prompts: [
      'Assemble a product launch crew: Product Manager (defines requirements and success metrics), Designer (creates mockups and user flows), Developer (implements features and APIs), QA Engineer (writes test cases), Marketing Manager (plans launch strategy). Goal: Ship new feature in 4 weeks.',
      'Create a content production crew: Content Strategist (plans topics and SEO keywords), Writer (drafts articles), Editor (reviews and improves), Designer (creates graphics), SEO Specialist (optimizes metadata). Goal: Publish 20 high-quality blog posts monthly.',
      'Build an investment research crew: Market Analyst (tracks trends and news), Financial Analyst (evaluates company fundamentals), Technical Analyst (charts and patterns), Risk Manager (assesses downside), Portfolio Manager (makes final decisions). Goal: Generate monthly investment recommendations.'
    ]
  }
];

// Additional recommended platforms based on feature alignment
export const RECOMMENDED_PLATFORMS: AgentBuilderRecipe[] = [
  {
    id: 'flowise',
    platform: 'Flowise',
    category: 'Visual LLM Orchestration',
    description: 'Open-source UI for building LLM flows with drag-and-drop',
    features: ['Visual builder', 'LangChain integration', 'Custom nodes', 'Self-hosted'],
    prompts: [
      'Design a customer support chatbot flow: User input → Intent classification → Knowledge base retrieval → Response generation → Sentiment analysis → Escalation logic if negative → Log conversation to database.',
      'Build a document Q&A system: PDF upload → Text extraction → Chunk and embed → Store in vector DB → User question → Semantic search → Context retrieval → Answer generation with citations.',
      'Create a content generation pipeline: Topic input → Research web sources → Extract key points → Generate outline → Write sections → Fact-check claims → Format output → Save to CMS.'
    ]
  },
  {
    id: 'stack-ai',
    platform: 'Stack AI',
    category: 'Enterprise AI Workflows',
    description: 'Build and deploy AI workflows for business processes',
    features: ['Enterprise security', 'API deployment', 'Team collaboration', 'Version control'],
    prompts: [
      'Build a contract review workflow: Upload contract → Extract key terms → Compare against playbook → Identify deviations → Risk scoring → Generate redline suggestions → Route for legal approval → Track in contract database.',
      'Create a sales intelligence agent: Prospect company name → Enrich with Clearbit/ZoomInfo → Analyze website and social media → Identify decision makers → Generate personalized outreach → Suggest talking points → Track engagement.',
      'Develop a compliance monitoring system: Ingest regulatory updates → Classify by jurisdiction and topic → Map to internal policies → Identify gaps → Generate remediation tasks → Assign to owners → Track completion.'
    ]
  },
  {
    id: 'dust-tt',
    platform: 'Dust',
    category: 'Team AI Assistant Platform',
    description: 'Build custom AI assistants connected to company knowledge',
    features: ['Knowledge integration', 'Team workspaces', 'Custom assistants', 'Data connectors'],
    prompts: [
      'Create an engineering assistant that: Answers questions using internal docs and Confluence, searches codebase for examples, explains architecture decisions, suggests relevant PRs, onboards new engineers, and maintains knowledge base.',
      'Build a sales enablement assistant that: Provides competitive intelligence, suggests responses to objections, finds relevant case studies, generates proposal content, tracks deal progress, and recommends next actions.',
      'Develop an HR assistant that: Answers policy questions, guides through benefits enrollment, provides onboarding checklists, suggests learning resources, handles PTO requests, and escalates sensitive issues.'
    ]
  },
  {
    id: 'voiceflow',
    platform: 'Voiceflow',
    category: 'Conversational AI Builder',
    description: 'Design, prototype, and build chat and voice assistants',
    features: ['Visual conversation designer', 'Multi-channel deployment', 'Analytics', 'Integrations'],
    prompts: [
      'Design a restaurant booking voice assistant: Greet caller → Collect party size and date → Check availability → Offer time slots → Confirm details → Send SMS confirmation → Handle modifications and cancellations.',
      'Build a technical support chatbot: Identify product and issue → Ask diagnostic questions → Search knowledge base → Provide step-by-step troubleshooting → Collect feedback → Create ticket if unresolved → Follow up.',
      'Create an e-commerce shopping assistant: Understand product needs → Ask qualifying questions → Recommend products → Compare options → Handle objections → Process order → Upsell related items → Confirm purchase.'
    ]
  }
];

export const getAllAgentBuilderRecipes = (): AgentBuilderRecipe[] => {
  return [...AI_AGENT_BUILDER_RECIPES, ...RECOMMENDED_PLATFORMS];
};

export const getRecipesByCategory = (category: string): AgentBuilderRecipe[] => {
  return getAllAgentBuilderRecipes().filter(recipe => recipe.category === category);
};

export const getRecipeByPlatform = (platform: string): AgentBuilderRecipe | undefined => {
  return getAllAgentBuilderRecipes().find(recipe => recipe.platform.toLowerCase() === platform.toLowerCase());
};
