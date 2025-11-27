# Changelog

All notable changes to DevPrompt Studio.

## [Unreleased]

### Added
- Comprehensive JSDoc comments for all public functions
- Architecture documentation (ARCHITECTURE.md)
- Component documentation (COMPONENTS.md)
- Accessibility testing guide (ACCESSIBILITY.md)
- Property-based tests for all requirements
- Unit tests for hooks and services
- Accessibility tests with axe-core
- Auto-save with 2s debounce and retry logic
- Draft recovery modal on app load
- Error boundary with state preservation
- Atomic component library (Button, Modal, Input, etc.)
- Custom hooks (useAutoSave, useLocalStorage, etc.)
- API service with interceptors and retry logic
- Hardware-accelerated animations
- Reduced motion support
- Skeleton loading states
- Focus management in modals
- Keyboard navigation support

### Changed
- Refactored PromptInput into sub-components
- Enhanced Tailwind CSS with custom utilities
- Improved error handling with structured types
- Updated README with architecture overview
- Downgraded Vitest from 4.0.14 to 3.0.0 (bug fix)

### Fixed
- Test runner issues with Vitest 4.x
- ARIA violations in tablist structure
- Focus trap in modal components
- Color contrast for WCAG AA compliance

### Removed
- Unused test files (simple.test.ts, minimal.test.ts)
- Inline styles replaced with Tailwind classes

## [0.0.0] - Initial Release

### Added
- Initial React + TypeScript setup
- Google Gemini AI integration
- Basic prompt enhancement
- IndexedDB storage with Dexie
- Zustand state management
- Tailwind CSS styling
- Vite build configuration
