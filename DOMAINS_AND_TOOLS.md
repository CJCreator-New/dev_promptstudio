# DevPrompt Studio - Domains & Target Tools Reference

## 📊 Domain Types (8 Categories)

### 1. **Frontend Development**
- **Value**: `'Frontend Development'`
- **Use Cases**: React, Vue, Angular, CSS, HTML, Tailwind, Web UI
- **Optimization**: Focus on component architecture, styling, accessibility
- **Example Prompts**: 
  - "Create a responsive React component for..."
  - "Design a Tailwind CSS utility system for..."
  - "Build an accessible form component with..."

### 2. **Backend Systems**
- **Value**: `'Backend Systems'`
- **Use Cases**: Node.js, Express, APIs, SQL, Databases, Authentication
- **Optimization**: Focus on architecture, scalability, security
- **Example Prompts**:
  - "Design a REST API for..."
  - "Create a database schema for..."
  - "Build an authentication system for..."

### 3. **UI/UX Design**
- **Value**: `'UI/UX Design'`
- **Use Cases**: Figma, Design Systems, Color Palettes, Typography, Wireframes
- **Optimization**: Focus on visual design, user experience, design patterns
- **Example Prompts**:
  - "Create a design system for..."
  - "Design a user flow for..."
  - "Build a color palette for..."

### 4. **DevOps & Infrastructure**
- **Value**: `'DevOps & Infrastructure'`
- **Use Cases**: Docker, Kubernetes, AWS, CI/CD, Terraform, Cloud Deployment
- **Optimization**: Focus on infrastructure, automation, deployment
- **Example Prompts**:
  - "Create a Docker setup for..."
  - "Design a CI/CD pipeline for..."
  - "Build a Kubernetes deployment for..."

### 5. **Mobile App Development**
- **Value**: `'Mobile App Development'`
- **Use Cases**: iOS, Android, React Native, Flutter, Swift, Kotlin
- **Optimization**: Focus on mobile-specific patterns, performance, native APIs
- **Example Prompts**:
  - "Create a React Native app for..."
  - "Build a Flutter UI for..."
  - "Design an iOS app flow for..."

### 6. **Full Stack**
- **Value**: `'Full Stack'`
- **Use Cases**: End-to-end applications, Frontend + Backend integration
- **Optimization**: Focus on architecture, integration, full system design
- **Example Prompts**:
  - "Build a full-stack application for..."
  - "Design an end-to-end system for..."
  - "Create a complete web app for..."

### 7. **AI Agent Builders**
- **Value**: `'AI Agent Builders'`
- **Use Cases**: Autonomous agents, LLM orchestration, multi-step workflows
- **Optimization**: Focus on agent reasoning, tool use, error handling
- **Example Prompts**:
  - "Create an autonomous agent that..."
  - "Build a multi-step workflow for..."
  - "Design an agent system for..."

### 8. **General**
- **Value**: `'General'`
- **Use Cases**: Default for any domain not listed above
- **Optimization**: Balanced approach, no specific domain optimization
- **Example Prompts**: Any prompt that doesn't fit other categories

---

## 🎯 Target Tools (3 Categories)

### Category 1: AI Builders (No-Code/Full-Stack)
**Purpose**: Generate entire apps, screens, or components from a single prompt

#### Tools List:
1. **Bolt.new** - React/Supabase full-stack builder
2. **Lovable.dev** - AI-powered web app builder
3. **Replit** - Cloud IDE with AI assistance
4. **Google AI Studio** - Google's prompt testing tool
5. **Base44** - No-code app builder
6. **V0** - Vercel's AI component generator
7. **Glide** - No-code app platform
8. **Softr** - No-code web app builder
9. **Adalo** - No-code mobile app builder
10. **Bravo Studio** - Design-to-app platform
11. **Thunkable** - No-code mobile development
12. **Bubble** - No-code web app platform
13. **FlutterFlow** - No-code Flutter app builder
14. **Appgyver** - No-code app development
15. **OutSystems** - Enterprise no-code platform
16. **AppMySite** - Website builder
17. **Builder.ai** - AI-powered app builder
18. **Clappia** - No-code business app builder
19. **GoodBarber** - Mobile app builder
20. **GoCodeo SaaSBuilder** - SaaS builder platform
21. **Natively** - Native app builder

**Optimization Strategy**:
- Be extremely prescriptive about Tech Stack
- Provide Database Schema upfront
- Define UI layout explicitly
- Ask for "Final Implementation" not "steps"
- Tool-specific primitives and patterns

**Example Prompt**:
```
For Bolt.new:
"Create a React + Supabase todo app with:
- Database: todos table (id, title, completed, created_at)
- UI: Header with logo, Grid layout for todo cards
- Features: Add, complete, delete todos
- Styling: Tailwind CSS with dark mode"
```

---

### Category 2: Agentic IDEs (Coding Agents)
**Purpose**: Autonomous agents that work directly in the file system

#### Tools List:
1. **Cursor** - AI-powered code editor (repo-wide context)
2. **Cline** - Autonomous coding agent
3. **Windsurf** - Agentic IDE with Cascade
4. **Trae** - AI coding assistant
5. **GitHub Copilot** - GitHub's AI assistant
6. **Aider** - Git-aware AI coding agent
7. **Continue.dev** - Open-source AI code assistant
8. **OpenHands** - Open-source autonomous agent
9. **Kiro** - AI IDE (this project!)
10. **Qoder** - AI code generation
11. **Google Antigravity** - Google's coding agent
12. **Zencoder** - Autonomous coding agent
13. **Claude Code** - Anthropic's code agent
14. **UiPath** - Enterprise automation platform

**Optimization Strategy**:
- Propose "File Structure" or "Implementation Plan" first
- Use phrases like "Review current file context"
- Focus on modularity and separation of concerns
- Git-commit-friendly, atomic changes
- Mention "Cascade" or "Composer" for Windsurf/Cursor

**Example Prompt**:
```
For Cline:
"Create a new feature:
1. File Structure:
   - src/features/auth/
     - login.ts
     - logout.ts
     - types.ts
   - src/tests/auth.test.ts

2. Implementation:
   - Create login function with validation
   - Add logout with session cleanup
   - Write unit tests

3. Git: Commit each file separately"
```

---

### Category 3: Designers (Prompt-to-Design)
**Purpose**: Generate visuals, Figma designs, or prompt workflows

#### Tools List:
1. **Uizard** - AI UI design generator
2. **Subframe** - Design-to-code platform
3. **Galileo AI** - AI design generator
4. **Visily** - AI wireframe generator
5. **Tempo** - Design automation
6. **Onlook** - Visual editor for web
7. **UX Pilot** - UX design assistant
8. **Polymet** - Design system generator
9. **Stitch** - Design collaboration
10. **Autodraw** - Google's drawing tool
11. **Figma AI** - Figma's AI features
12. **PromptLayer** - Prompt management
13. **Humanloop** - Prompt ops platform
14. **AI Parabellum** - Design AI
15. **Promptbuilder** - Prompt template builder
16. **Microsoft Design AI** - Microsoft's design AI
17. **Adobe Firefly** - Adobe's generative AI

**Optimization Strategy**:
- Focus on Visual Descriptions
- Include Color Palettes (Hex codes)
- Specify Typography and Layout
- Describe the "Vibe" (Minimalist, Brutalist, Corporate)
- List specific screens required
- For Prompt Ops tools: structure as meta-prompt template with {{variables}}

**Example Prompt**:
```
For Figma AI:
"Create a design system:
- Color Palette: Primary #5B5FFF, Secondary #10B981, Background #FFFFFF
- Typography: Heading: Inter Bold 28px, Body: Inter Regular 14px
- Layout: Sidebar (280px) + Main (flex)
- Screens: Dashboard, Settings, Profile
- Vibe: Modern, minimalist, professional"
```

---

### Default: General LLM
- **Value**: `'general'`
- **Use Cases**: Any LLM (ChatGPT, Claude, Gemini)
- **Optimization**: Balanced approach, no tool-specific optimization
- **Strategy**: Focus on clarity, context, step-by-step reasoning

---

## 📋 Platform Types (7 Categories)

1. **Web (Browser)** - Web applications
2. **Mobile (iOS/Android)** - Native mobile apps
3. **Cross-Platform (RN/Flutter)** - React Native, Flutter
4. **Desktop (Electron/Native)** - Desktop applications
5. **CLI / Terminal** - Command-line tools
6. **Server / Cloud** - Backend services
7. **Platform Agnostic** - Works on all platforms

---

## 🎚️ Complexity Levels (3 Options)

1. **Concise** - Brief, to-the-point responses
2. **Detailed** - Comprehensive with explanations
3. **Expert / Architectural** - Deep technical analysis

---

## 🔄 Generation Modes (3 Options)

1. **Basic Refinement** - Grammar and clarity improvements
2. **Prompt Enhancement** - Full structural optimization
3. **Structured Outline** - Document outline generation

---

## 🔧 Advanced Options (Boolean Flags)

- `includeTechStack` - Include specific technology recommendations
- `includeBestPractices` - Include industry best practices
- `includeEdgeCases` - Include edge case handling
- `includeCodeSnippet` - Include code examples
- `includeExampleUsage` - Include usage examples
- `includeTests` - Include test cases
- `useThinking` - Enable extended thinking mode (Gemini 2.0)

---

## 📊 Quick Reference Table

| Domain | Best For | Example Tools |
|--------|----------|----------------|
| Frontend | UI/Web Components | React, Vue, Angular |
| Backend | APIs & Databases | Node.js, Express, SQL |
| UI/UX | Design Systems | Figma, Sketch, Adobe |
| DevOps | Infrastructure | Docker, Kubernetes, AWS |
| Mobile | App Development | React Native, Flutter |
| Full Stack | Complete Apps | MERN, LAMP, JAMstack |
| AI Agents | Autonomous Systems | LangChain, CrewAI, n8n |
| General | Anything Else | Default option |

---

## 🎯 Tool Selection Guide

### Choose **Builders** if:
- You want to generate entire applications
- You need a no-code/low-code solution
- You want quick prototyping
- You're building full-stack apps

### Choose **Agents** if:
- You want autonomous code generation
- You need file system access
- You're building complex features
- You want git-friendly commits

### Choose **Designers** if:
- You need visual design output
- You're creating design systems
- You want Figma designs
- You're building UI mockups

### Choose **General** if:
- You're unsure which tool to use
- Your use case doesn't fit other categories
- You want balanced optimization

---

## 💡 Usage Examples

### Example 1: Frontend Component
```
Domain: Frontend Development
Platform: Web (Browser)
Target Tool: V0
Complexity: Detailed
Mode: Prompt Enhancement
Options: includeTechStack, includeBestPractices, includeCodeSnippet
```

### Example 2: Backend API
```
Domain: Backend Systems
Platform: Server / Cloud
Target Tool: General
Complexity: Expert / Architectural
Mode: Prompt Enhancement
Options: includeTechStack, includeBestPractices, includeEdgeCases, includeTests
```

### Example 3: Mobile App
```
Domain: Mobile App Development
Platform: Cross-Platform (RN/Flutter)
Target Tool: FlutterFlow
Complexity: Detailed
Mode: Structured Outline
Options: includeTechStack, includeBestPractices
```

### Example 4: AI Agent
```
Domain: AI Agent Builders
Platform: Server / Cloud
Target Tool: Cline
Complexity: Expert / Architectural
Mode: Prompt Enhancement
Options: includeTechStack, includeBestPractices, includeEdgeCases, includeTests
```

---

## 🔗 Integration with Enhancement Service

The `geminiService.ts` uses these values to:

1. **Select Tool Strategy**: Determines optimization approach
2. **Format System Instruction**: Customizes the AI's behavior
3. **Structure Response**: Tailors output format to tool requirements
4. **Provide Examples**: Includes tool-specific examples

```typescript
// Example from geminiService.ts
const tool = options.targetTool || 'general';

if (builders.includes(tool)) {
  // Use builder-specific strategy
} else if (agents.includes(tool)) {
  // Use agent-specific strategy
} else if (designers.includes(tool)) {
  // Use designer-specific strategy
} else {
  // Use general strategy
}
```

---

## 📝 Notes

- **Default Domain**: `General`
- **Default Platform**: `Platform Agnostic`
- **Default Tool**: `general`
- **Default Complexity**: `Detailed`
- **Default Mode**: `Prompt Enhancement`

All values are case-sensitive and must match exactly as defined in the enums.
