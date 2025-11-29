<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# DevPrompt Studio

AI-powered prompt enhancement tool built with React, TypeScript, and Google Gemini API.

🚀 **[Live Demo](https://yourusername.github.io/devprompt-studio/)** | 📖 [Documentation](#features) | 🐛 [Report Bug](https://github.com/yourusername/devprompt-studio/issues)

> **Note**: Replace `yourusername` with your GitHub username after deployment

## Features

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
- **Onboarding**: Interactive user guidance
- **Focus Management**: Distraction-free editing
- **Toast Notifications**: Non-intrusive feedback

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
   - Visit: `https://yourusername.github.io/devprompt-studio/`
   - Replace `yourusername` with your GitHub username

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

- First Contentful Paint: < 1.5s
- Interaction responsiveness: < 100ms
- Hardware-accelerated animations
- Lazy loading for optimal bundle size
- IndexedDB for efficient data storage

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## Contributing

See component documentation in `src/components/atomic/README.md`

## License

Private project
