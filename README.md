<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# DevPrompt Studio

AI-powered prompt enhancement tool built with React, TypeScript, and Google Gemini API.

View your app in AI Studio: https://ai.studio/apps/drive/1Go09lCl7VDGrCYaIfJD8Aw9Yk2V1ibjl

## Features

- 🤖 AI-powered prompt enhancement using Google Gemini
- 💾 Auto-save with draft recovery
- 📱 Responsive design with mobile support
- ♿ WCAG AA accessibility compliant
- 🎨 Modern UI with Tailwind CSS
- 🔄 Real-time streaming responses
- 📊 History tracking with IndexedDB
- 🎯 Template system for common prompts

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
