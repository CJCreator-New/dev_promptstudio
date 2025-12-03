# DevPrompt Studio

**Git for prompts.** Version-controlled prompt engineering workspace for developers. Test, iterate, and ship production-ready AI prompts with built-in A/B testing and team collaboration.

🚀 **[Live Demo](https://cjcreator-new.github.io/dev_promptstudio/)** | 📖 [Documentation](#features) | 🐛 [Report Bug](https://github.com/CJCreator-New/dev_promptstudio/issues)

---

## 🎯 Why DevPrompt Studio?

**Problem:** AI prompts are scattered across docs, Slack messages, and local files. No version control, no testing, no collaboration.

**Solution:** Treat prompts like code. Version them, test them, share them.

### Use Cases

#### 🔧 Refactor Messy Agent Prompts
**Problem:** Your AI coding agent gives inconsistent results  
**Solution:** Use version history to A/B test prompt variations, track what works  
**Features:** Version History • A/B Testing • Diff Viewer

#### 👥 Standardize Team Prompts
**Problem:** Each team member uses different prompt styles  
**Solution:** Create shared templates, enforce best practices via recipes  
**Features:** Templates • Recipes • Import/Export

#### 🧪 Run A/B Tests on System Prompts
**Problem:** Unsure which prompt variant performs better  
**Solution:** Side-by-side comparison with evaluation criteria  
**Features:** A/B Testing • Evaluation Panel • Metrics Dashboard

---

## ✨ Features

### Available Now

### 🤖 AI & Enhancement
- **Multi-Provider Support**: Google Gemini, OpenAI, Anthropic, OpenRouter
- **Smart Enhancement**: Context-aware prompt optimization with thinking mode
- **Model Selection**: Choose specific models per provider
- **Real-time Streaming**: Live response generation
- **Secure API Keys**: Encrypted storage with automatic migration
- **Auto-Failover**: Automatic provider switching on rate limits

### 📝 Advanced Editor
- **Smart Suggestions**: Context-aware prompt suggestions
- **Variable Placeholders**: Dynamic content with `{{variable}}` syntax
- **Multiple Modes**: Basic Refinement, Prompt Enhancement, Structured Outline
- **Draft Recovery**: Auto-recovery of unsaved work
- **Character Counter**: Real-time token estimation
- **Quick Clear**: One-click input clearing

### 📊 Organization & Management
- **History Tracking**: Automatic prompt history with timestamps
- **Saved Projects**: Save and restore complete configurations
- **Custom Templates**: Create reusable prompt templates
- **Recent Prompts Rail**: Quick access to last 10 prompts
- **Domain Detection**: Auto-detect prompt domain from content

### 🔄 Sharing & Collaboration
- **Share Links**: Generate shareable prompt links
- **Read-Only Mode**: View shared prompts without editing
- **Cloud Sync**: Firebase-based cloud synchronization
- **User Authentication**: Secure login with Firebase Auth
- **Export Options**: Share prompts via URL parameters

### 📈 Analytics & Monitoring
- **Usage Tracking**: Firebase Analytics integration
- **Error Monitoring**: Comprehensive error logging with context
- **Performance Metrics**: Web Vitals monitoring
- **Feature Usage**: Track enhancement patterns by provider

### 🔧 Advanced Configuration
- **8 Domain Types**: Frontend, Backend, Mobile, DevOps, UI/UX, Full Stack, AI Agents, General
- **7 Platform Types**: Web, Mobile, Cross-Platform, Desktop, CLI, Server, Platform Agnostic
- **3 Complexity Levels**: Concise, Detailed, Expert/Architectural
- **Advanced Options**: Tech stack, best practices, edge cases, code snippets, tests
- **Thinking Mode**: Enhanced reasoning with extended thinking (Gemini 2.0 Pro)

### ♿ Accessibility & UX
- **WCAG AA Compliant**: Full accessibility support
- **Keyboard Navigation**: Complete keyboard control
- **Screen Reader**: Optimized for assistive technology
- **Responsive Design**: Mobile-first approach
- **Offline Support**: Work without internet
- **Auto-save**: Continuous backup with retry logic

### 🎨 Customization
- **Themes**: Light/dark mode with custom themes
- **Layout**: Configurable interface layout
- **Shortcuts**: Customizable keyboard shortcuts
- **Preferences**: Personalized settings

### 🔍 Advanced Features
- **Prompt Recipes**: 6 pre-built templates (Code Review, API Design, Bug Fix, Feature Spec, Refactoring, Testing)
- **Template Gallery**: Browse and apply community templates
- **Variable Editor**: Dynamic template interpolation
- **Version Timeline**: Track prompt evolution over time
- **Version Compare**: Side-by-side diff viewer
- **Onboarding Checklist**: Interactive user guidance
- **Toast Notifications**: Non-intrusive feedback system

### 🚧 Planned Features (Roadmap)

- **Enhanced A/B Testing**: Multi-variant testing with statistical analysis
- **Advanced Evaluation**: Custom success criteria and auto-scoring
- **Team Workspaces**: Multi-user collaboration with role-based access
- **Prompt Marketplace**: Community-contributed template sharing
- **CI/CD Integration**: GitHub Actions for automated prompt testing
- **Advanced Analytics**: Detailed metrics dashboard with insights
- **Git Integration**: Direct sync with GitHub repositories
- **API Access**: RESTful API for programmatic access

[📋 View Full Roadmap](https://github.com/CJCreator-New/dev_promptstudio/projects) • [💡 Request Feature](https://github.com/CJCreator-New/dev_promptstudio/issues/new?template=feature_request.md)

## Architecture

### Tech Stack
- **Framework**: React 18 with TypeScript
- **State Management**: Zustand with persistence middleware
- **Styling**: Tailwind CSS with custom design tokens
- **Database**: Dexie (IndexedDB wrapper)
- **Backend**: Firebase (Auth, Firestore, Analytics)
- **AI Providers**: Gemini, OpenAI, Anthropic, OpenRouter
- **Build Tool**: Vite
- **Testing**: Vitest + Testing Library
- **UI Components**: Radix UI primitives

### Project Structure
```
src/
├── components/          # React components
│   ├── atomic/         # Reusable UI components (Button, Modal, etc.)
│   ├── PromptInput/    # Prompt input sub-components
│   └── ...             # Feature components
├── hooks/              # Custom React hooks
├── services/           # API services (geminiService)
├── store/              # Zustand state management
├── utils/              # Utility functions
└── test/               # Test files
```

### Key Components

**PromptInput**: Main input component with mode selection (Basic, Prompt, Outline)
- Uses composition pattern with sub-components
- Integrates custom hooks for validation, suggestions, auto-save

**Atomic Components**: Reusable UI building blocks
- Button, Input, Select, Modal, Tooltip, Checkbox, Textarea, Dropdown, Skeleton
- Consistent styling and accessibility

**Error Boundary**: Catches React errors with state preservation
- User-friendly fallback UI
- Stack trace logging
- Reset functionality

### Custom Hooks

- `useAutoSave`: Debounced auto-save with retry logic (2s delay, 3 retries)
- `useLocalStorage`: Type-safe localStorage management
- `usePromptSuggestions`: Contextual prompt suggestions
- `useValidation`: Zod-based input validation
- `useClickOutside`: Click outside detection
- `useDraftRecovery`: Draft recovery on app load
- `useReducedMotion`: Respects user motion preferences

### API Service

**enhancementService.ts**: Multi-provider API layer
- Unified interface for all AI providers
- Exponential backoff retry (1s → 2s → 4s)
- Structured error handling with context
- Streaming support for all providers
- Automatic rate limit detection and failover

## Run Locally

**Prerequisites**: Node.js 18+

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Firebase and API keys:
   - Copy `.env.example` to `.env.local`
   - Add your Firebase config
   - Add API keys for desired providers (Gemini, OpenAI, Claude, OpenRouter)

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run with coverage
npm test:coverage

# Run specific test file
npm test -- accessibility-audit.test.tsx
```

### Test Coverage
- Property tests validate requirements
- Unit tests cover implementation details
- Accessibility tests with axe-core
- Integration tests for critical flows

## Build

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

## Deploy to GitHub Pages

1. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: GitHub Actions
   - Save

2. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

3. **Access your app**:
   - Visit: `https://cjcreator-new.github.io/dev_promptstudio/`

4. **Update base path** (if using different repo name):
   - Edit `vite.config.ts`: `base: '/your-repo-name/'`
   - Update `public/manifest.json` paths

## Accessibility

See [ACCESSIBILITY.md](ACCESSIBILITY.md) for:
- Automated testing with axe-core
- Manual testing checklists
- Screen reader testing (NVDA/JAWS/VoiceOver)
- Keyboard navigation guide
- WCAG AA compliance

## Performance

**Current Lighthouse Scores:**
- Performance: 95/100
- Accessibility: 100/100
- Best Practices: 96/100
- SEO: 100/100

**Key Metrics:**
- First Contentful Paint: < 0.8s
- Time to Interactive: < 1.5s
- Interaction responsiveness: < 100ms

**Optimizations:**
- Hardware-accelerated animations with reduced motion support
- Lazy loading for modals and heavy components
- IndexedDB for efficient local data storage
- Code-splitting with React.lazy and Suspense
- Debounced auto-save (2s delay, 3 retries)
- Request idle callback for non-critical initialization

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

---

## 🏷️ Topics

`prompt-engineering` `llm-ops` `ai-tools` `developer-tools` `react` `typescript` `prompt-testing` `ai-development` `version-control` `team-collaboration` `indexeddb` `zustand`

## 🤝 Team Usage

### For Team Leads
1. Create shared templates in DevPrompt Studio
2. Export as JSON: `File → Export → JSON`
3. Share with team via GitHub/Slack

### For Team Members
1. Receive JSON file from team lead
2. Import: `File → Import → From JSON`
3. Templates appear in your workspace

### Example: Shared Recipe Pack
```bash
# Clone team recipes
git clone https://github.com/your-org/prompt-recipes
cd prompt-recipes

# Import into DevPrompt Studio
# File → Import → recipes/dev-tools.json
```

---

## 📚 Documentation

- [State Management Guide](docs/STATE_MODEL.md)
- [Keyboard Shortcuts](docs/KEYBOARD_SHORTCUTS.md)
- [Accessibility Guide](ACCESSIBILITY.md)
- [Component Library](src/components/atomic/README.md)

## 🙏 Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md)

## 📄 License

MIT License - see [LICENSE](LICENSE)
