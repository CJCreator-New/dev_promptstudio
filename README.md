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
- **Multi-Provider Support**: Google Gemini, OpenAI, Anthropic, custom endpoints
- **Smart Enhancement**: Context-aware prompt optimization
- **Model Selection**: Choose specific models per provider
- **Real-time Streaming**: Live response generation
- **Custom Endpoints**: Configure your own AI services

### 📝 Advanced Editor
- **Syntax Highlighting**: Code-aware highlighting for multiple languages
- **Variable Placeholders**: Dynamic content with `{{variable}}` syntax
- **Auto-completion**: Context-aware suggestions
- **Multiple Modes**: Basic, Prompt Engineering, Outline modes
- **Draft Recovery**: Never lose your work

### 📊 Organization & Management
- **Folder System**: Hierarchical prompt organization
- **Tagging**: Categorize and filter prompts
- **Search**: Full-text search across all prompts
- **Favorites**: Quick access to frequently used prompts
- **Version History**: Track changes over time

### 🔄 Import/Export
- **Multiple Formats**: JSON, Markdown, PDF, Plain Text
- **Bulk Operations**: Export/import multiple prompts
- **ZIP Archives**: Compressed bulk exports
- **Schema Validation**: Ensure data integrity
- **Conflict Resolution**: Handle import conflicts gracefully

### 📈 Analytics & Monitoring
- **Usage Analytics**: Track prompt usage and performance
- **Error Monitoring**: Comprehensive error tracking
- **Performance Metrics**: Response times and success rates
- **Dashboard**: Visual insights into your workflow

### 🔧 Collaboration & Sharing
- **Workspace Isolation**: Separate environments
- **Real-time Sync**: Multi-device synchronization
- **Share Links**: Secure prompt sharing
- **Team Features**: Collaborative prompt development

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
- **Diff Viewer**: Compare prompt versions side-by-side
- **Template System**: Reusable prompt templates
- **Prompt Recipes**: Pre-built templates with 6 use cases
- **Recent Prompts Rail**: Quick access to last 10 prompts
- **Onboarding**: Interactive user guidance
- **Focus Management**: Distraction-free editing
- **Toast Notifications**: Non-intrusive feedback

### 🚧 Planned Features (Roadmap)

- **Enhanced Version History**: Git-style branching and merging
- **A/B Variant Testing**: Run multiple prompt variants against test inputs
- **Evaluation Panel**: Define success criteria and auto-evaluate outputs
- **Recipe Variables**: Dynamic templates with `{{variable}}` interpolation
- **Team Workspaces**: Multi-user collaboration with roles
- **Prompt Marketplace**: Community-contributed templates
- **CI/CD Integration**: GitHub Actions for prompt testing
- **Analytics Dashboard**: Advanced metrics and insights

[📋 View Full Roadmap](https://github.com/CJCreator-New/dev_promptstudio/projects) • [💡 Request Feature](https://github.com/CJCreator-New/dev_promptstudio/issues/new?template=feature_request.md)

## Architecture

### Tech Stack
- **Framework**: React 18 with TypeScript
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Database**: Dexie (IndexedDB wrapper)
- **API**: Google Gemini AI
- **Build Tool**: Vite
- **Testing**: Vitest + Testing Library

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

**geminiService.ts**: Centralized API layer
- Request/response/error interceptors
- Exponential backoff retry (1s → 2s → 4s)
- Structured error handling
- Streaming support

## Run Locally

**Prerequisites**: Node.js 18+

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` in [.env.local](.env.local):
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

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
- Performance: 92/100
- Accessibility: 100/100
- Best Practices: 95/100
- SEO: 100/100

**Key Metrics:**
- First Contentful Paint: < 0.8s
- Time to Interactive: < 1.5s
- Interaction responsiveness: < 100ms

**Optimizations:**
- Hardware-accelerated animations
- Lazy loading for optimal bundle size (450KB main bundle)
- IndexedDB for efficient data storage
- Code-splitting for heavy components

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
