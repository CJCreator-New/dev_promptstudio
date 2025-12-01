import { DomainType } from '../types';
import { AI_AGENT_BUILDER_RECIPES, RECOMMENDED_PLATFORMS } from './agentBuilderRecipes';

export interface PromptRecipe {
  id: string;
  label: string;
  icon: string;
  description: string;
  template: string;
  domain: DomainType;
}

export const PROMPT_RECIPES: PromptRecipe[] = [
  {
    id: 'refactor',
    label: 'Refactor Messy Prompt',
    icon: '🔧',
    description: 'Clean up and structure an existing prompt',
    domain: DomainType.GENERAL,
    template: `Take this rough prompt and refactor it into a clear, structured format:

{{paste_your_messy_prompt_here}}

Requirements:
- Clear role definition
- Specific requirements list
- Expected output format
- Any constraints or limitations`
  },
  {
    id: 'system-prompt',
    label: 'System Prompt for Coding Agent',
    icon: '🤖',
    description: 'Create a system prompt for AI coding assistants',
    domain: DomainType.BACKEND,
    template: `Act as an expert {{language}} developer with deep knowledge of {{framework}}.

Your role:
- Write clean, maintainable code following best practices
- Provide detailed explanations for complex logic
- Suggest optimizations and improvements
- Follow {{coding_standard}} conventions

When responding:
1. Analyze the requirements carefully
2. Propose a solution with code examples
3. Explain key decisions and trade-offs
4. Highlight potential edge cases

Code style:
- Use TypeScript for type safety
- Write comprehensive JSDoc comments
- Include error handling
- Add unit tests when relevant`
  },
  {
    id: 'ux-copy',
    label: 'UX Copy Polish',
    icon: '✨',
    description: 'Refine UI text for clarity and engagement',
    domain: DomainType.UI_UX,
    template: `Polish this UI copy to be clear, concise, and user-friendly:

{{paste_your_ui_text_here}}

Guidelines:
- Use active voice
- Keep it conversational but professional
- Avoid jargon unless necessary
- Make CTAs action-oriented
- Consider accessibility and inclusivity

Target audience: {{describe_your_users}}
Tone: {{friendly/professional/technical}}`
  },
  {
    id: 'api-spec',
    label: 'API Contract Enforcer',
    icon: '📋',
    description: 'Generate strict API specifications',
    domain: DomainType.BACKEND,
    template: `Create a detailed API specification for:

Endpoint: {{endpoint_name}}
Method: {{GET/POST/PUT/DELETE}}
Purpose: {{what_it_does}}

Include:
- Request schema (headers, body, query params)
- Response schema (success and error cases)
- Status codes and their meanings
- Authentication requirements
- Rate limiting rules
- Example requests and responses
- Edge cases and validation rules`
  },
  {
    id: 'code-review',
    label: 'Code Reviewer',
    icon: '👀',
    description: 'Comprehensive code review checklist',
    domain: DomainType.GENERAL,
    template: `Review this code for:

\`\`\`{{language}}
{{paste_code_here}}
\`\`\`

Check for:
1. **Correctness**: Does it work as intended?
2. **Performance**: Any bottlenecks or inefficiencies?
3. **Security**: Vulnerabilities or unsafe practices?
4. **Maintainability**: Is it readable and well-structured?
5. **Best Practices**: Following language/framework conventions?
6. **Testing**: Are edge cases covered?

Provide:
- Specific issues with line numbers
- Suggested improvements
- Severity rating (critical/major/minor)
- Code snippets for fixes`
  },
  {
    id: 'test-gen',
    label: 'Test Case Generator',
    icon: '🧪',
    description: 'Generate comprehensive test cases',
    domain: DomainType.GENERAL,
    template: `Generate test cases for:

Function/Component: {{name}}
Purpose: {{what_it_does}}

Create tests for:
1. **Happy path**: Normal expected usage
2. **Edge cases**: Boundary conditions
3. **Error cases**: Invalid inputs, failures
4. **Integration**: How it works with other parts

For each test:
- Clear test name
- Setup/Given
- Action/When
- Expected result/Then
- Cleanup if needed

Framework: {{jest/vitest/mocha/etc}}`
  },
  // AI Agent Builder Recipes
  {
    id: 'agent-replit',
    label: 'Replit AI App Builder Prompt',
    icon: '🚀',
    description: 'Full-stack app prompts for Replit AI',
    domain: DomainType.AI_AGENTS,
    template: `Build a {{app_type}} with the following features:

Core Functionality:
- {{feature_1}}
- {{feature_2}}
- {{feature_3}}

Tech Stack:
- Frontend: React with TypeScript
- Backend: Node.js/Express
- Database: {{PostgreSQL/MongoDB/SQLite}}
- Authentication: {{JWT/OAuth/Magic Links}}

Requirements:
- Responsive design for mobile and desktop
- Real-time updates using WebSockets
- RESTful API with proper error handling
- Database migrations and seed data
- Environment variables for configuration

Deployment:
- Ready for Replit deployment
- Include README with setup instructions`
  },
  {
    id: 'agent-autonomous',
    label: 'Autonomous Agent Goal',
    icon: '🤖',
    description: 'Goal-driven prompts for AgentGPT/AutoGPT',
    domain: DomainType.AI_AGENTS,
    template: `Goal: {{describe_your_end_goal}}

Context:
- Current situation: {{where_you_are_now}}
- Constraints: {{time/budget/resources}}
- Success criteria: {{how_to_measure_success}}

Agent Instructions:
1. Break down the goal into actionable sub-tasks
2. Research and gather necessary information
3. Execute tasks in logical order
4. Validate results at each step
5. Adapt strategy based on outcomes
6. Report progress and blockers

Tools Available:
- Web browsing and research
- Code execution
- File operations
- API calls

Expected Output:
- Step-by-step execution plan
- Progress updates
- Final deliverable
- Lessons learned`
  },
  {
    id: 'agent-workflow',
    label: 'Multi-Step Agent Workflow',
    icon: '⚙️',
    description: 'Workflow prompts for Relevance AI/Promptly',
    domain: DomainType.AI_AGENTS,
    template: `Workflow: {{workflow_name}}

Trigger: {{what_starts_this_workflow}}

Steps:
1. **{{Step_1_Name}}**
   - Input: {{what_data_comes_in}}
   - Action: {{what_to_do}}
   - Output: {{what_to_produce}}

2. **{{Step_2_Name}}**
   - Input: {{output_from_step_1}}
   - Action: {{processing_logic}}
   - Output: {{transformed_data}}

3. **{{Step_3_Name}}**
   - Input: {{previous_outputs}}
   - Action: {{final_processing}}
   - Output: {{final_deliverable}}

Error Handling:
- Retry logic for failed steps
- Fallback actions
- Notification on critical failures

Integrations:
- {{Tool_1}}: {{purpose}}
- {{Tool_2}}: {{purpose}}

Success Metrics:
- {{metric_1}}
- {{metric_2}}`
  },
  {
    id: 'agent-web-automation',
    label: 'Web Automation Agent',
    icon: '🌐',
    description: 'Browser automation for MultiOn/Zapier',
    domain: DomainType.AI_AGENTS,
    template: `Task: {{describe_web_automation_task}}

Target Websites:
- {{website_1}}: {{what_to_do_there}}
- {{website_2}}: {{what_to_do_there}}

Automation Steps:
1. Navigate to {{URL}}
2. {{action}}: {{details}}
3. Extract data: {{what_data_to_collect}}
4. Process data: {{transformations}}
5. Store results: {{where_to_save}}

Data to Extract:
- {{field_1}}: {{selector_or_description}}
- {{field_2}}: {{selector_or_description}}

Schedule:
- Frequency: {{daily/hourly/on-demand}}
- Time: {{when_to_run}}

Notifications:
- Success: {{where_to_notify}}
- Errors: {{alert_method}}
- Summary: {{reporting_frequency}}

Edge Cases:
- Handle login/authentication
- Deal with CAPTCHAs
- Retry on network errors
- Validate data completeness`
  },
  {
    id: 'agent-research',
    label: 'Research & Analysis Agent',
    icon: '🔍',
    description: 'Deep research prompts for Cognosys',
    domain: DomainType.AI_AGENTS,
    template: `Research Topic: {{your_research_question}}

Objective: {{what_you_want_to_learn}}

Research Scope:
- Time period: {{date_range}}
- Geographic focus: {{regions}}
- Industries: {{relevant_sectors}}
- Key players: {{companies_or_people}}

Research Tasks:
1. **Literature Review**
   - Academic papers and journals
   - Industry reports
   - News articles and press releases

2. **Data Collection**
   - Quantitative metrics
   - Qualitative insights
   - Expert opinions

3. **Analysis**
   - Identify patterns and trends
   - Compare different perspectives
   - Assess credibility of sources

4. **Synthesis**
   - Key findings
   - Implications
   - Recommendations

Deliverables:
- Executive summary (1 page)
- Detailed report ({{page_count}} pages)
- Data visualizations
- Source citations (APA/MLA format)
- Appendix with raw data

Quality Criteria:
- Cite credible sources only
- Present balanced viewpoints
- Distinguish facts from opinions
- Highlight knowledge gaps`
  },
  {
    id: 'agent-multi-agent',
    label: 'Multi-Agent Collaboration',
    icon: '👥',
    description: 'Team-based agents for CrewAI',
    domain: DomainType.AI_AGENTS,
    template: `Project: {{project_name}}

Goal: {{what_the_team_should_accomplish}}

Agent Roles:

**Agent 1: {{Role_Name}}**
- Expertise: {{domain_knowledge}}
- Responsibilities: {{what_they_do}}
- Tools: {{available_tools}}
- Success criteria: {{how_to_measure}}

**Agent 2: {{Role_Name}}**
- Expertise: {{domain_knowledge}}
- Responsibilities: {{what_they_do}}
- Tools: {{available_tools}}
- Success criteria: {{how_to_measure}}

**Agent 3: {{Role_Name}}**
- Expertise: {{domain_knowledge}}
- Responsibilities: {{what_they_do}}
- Tools: {{available_tools}}
- Success criteria: {{how_to_measure}}

Collaboration Flow:
1. {{Agent_1}} starts by {{initial_task}}
2. {{Agent_2}} receives output and {{next_task}}
3. {{Agent_3}} finalizes by {{final_task}}
4. Team reviews and iterates if needed

Communication Protocol:
- Share outputs in {{format}}
- Flag blockers immediately
- Daily sync on progress
- Final review before delivery

Timeline:
- Phase 1: {{duration}} - {{deliverable}}
- Phase 2: {{duration}} - {{deliverable}}
- Phase 3: {{duration}} - {{deliverable}}`
  }
];

// Export agent builder recipes for use in other components
export { AI_AGENT_BUILDER_RECIPES, RECOMMENDED_PLATFORMS } from './agentBuilderRecipes';
