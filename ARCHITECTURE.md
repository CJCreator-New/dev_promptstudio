# DevPrompt Studio - Complete Architecture & Features Guide

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [Core Features](#core-features)
3. [Architecture Layers](#architecture-layers)
4. [Data Flow](#data-flow)
5. [Technology Stack](#technology-stack)
6. [Component Hierarchy](#component-hierarchy)
7. [State Management](#state-management)
8. [API Integration](#api-integration)
9. [Database Schema](#database-schema)
10. [Security & Performance](#security--performance)

---

## System Overview

**DevPrompt Studio** is a version-controlled prompt engineering workspace that treats AI prompts like code. It enables developers to:
- Write, test, and iterate on AI prompts
- Version control prompt history
- A/B test prompt variations
- Share prompts with teams
- Integrate with multiple AI providers

### Key Principles
- **Frontend-First**: All data stored locally (IndexedDB) with optional cloud sync
- **Privacy-Focused**: No server-side processing of prompts
- **Developer-Centric**: Git-like workflows for prompt management
- **Multi-Provider**: Support for Gemini, OpenAI, Claude, OpenRouter

---

## Core Features

### 1. **Prompt Enhancement** 🤖
**Purpose**: Transform raw prompts into production-ready specifications

**Flow**:
```
User Input → Enhancement Service → AI Provider → Streaming Response → History
```

**Supported Modes**:
- **Basic Refinement**: Grammar and clarity improvements
- **Prompt Enhancement**: Full structural optimization
- **Outline Generation**: Structured document creation

**Providers**:
- Google Gemini (with thinking mode)
- OpenAI GPT-4/3.5
- Anthropic Claude
- OpenRouter (multi-model)

**Key Features**:
- Real-time streaming responses
- Automatic provider failover on rate limits
- Exponential backoff retry (1s → 2s → 4s)
- Token counting and cost estimation
- Thinking mode for complex reasoning

---

### 2. **Version Control** 📜
**Purpose**: Track prompt evolution and enable rollback

**Components**:
- **Version History**: Automatic snapshots on each enhancement
- **Version Timeline**: Visual representation of changes
- **Diff Viewer**: Side-by-side comparison with highlighting
- **Version Limit**: Keep last 50 versions per prompt

**Data Structure**:
```typescript
interface PromptVersion {
  id: string;
  promptId: string;
  content: string;
  timestamp: number;
  description: string;
  author: string;
  changeStats: {
    additions: number;
    deletions: number;
    modifications: number;
  };
}
```

---

### 3. **A/B Testing** 🧪
**Purpose**: Compare prompt variations with evaluation criteria

**Features**:
- Multi-variant support (A/B/C/D)
- Custom evaluation criteria
- Side-by-side comparison
- Statistical significance calculation
- Winner auto-selection

**Workflow**:
```
Create Variants → Set Criteria → Run Tests → Compare Results → Select Winner
```

---

### 4. **Template System** 📋
**Purpose**: Reusable prompt templates with variable support

**Types**:
- **Custom Templates**: User-created templates
- **Built-in Recipes**: 6 pre-built templates
- **Community Templates**: Shared via marketplace

**Variable Support**:
```
Template: "Create a {{language}} {{type}} for {{domain}}"
Variables: { language: "TypeScript", type: "API", domain: "E-commerce" }
Result: "Create a TypeScript API for E-commerce"
```

**Built-in Recipes**:
1. Code Review
2. API Design
3. Bug Fix
4. Feature Specification
5. Refactoring
6. Testing Strategy

---

### 5. **Project Management** 📁
**Purpose**: Organize and save prompt configurations

**Features**:
- Save complete project state (input, options, history)
- Load and restore projects
- Project metadata (name, timestamp)
- Quick access via sidebar

**Project Structure**:
```typescript
interface SavedProject {
  id: string;
  name: string;
  input: string;
  options: EnhancementOptions;
  timestamp: number;
}
```

---

### 6. **Sharing & Collaboration** 🔗
**Purpose**: Share prompts with teams and stakeholders

**Features**:
- Generate shareable links with URL encoding
- Read-only mode for shared prompts
- Cloud sync via Firebase
- User authentication
- Activity tracking

**Share Flow**:
```
Enhanced Prompt → Generate Link → Share URL → Recipient Views (Read-Only)
```

---

### 7. **Analytics & Monitoring** 📊
**Purpose**: Track usage patterns and performance

**Metrics Tracked**:
- Enhancement count by provider
- Domain distribution
- Mode usage (Basic, Prompt, Outline)
- Error rates and types
- Performance metrics (Web Vitals)

**Firebase Integration**:
- User authentication
- Cloud Firestore for sync
- Analytics events
- Error logging

---

### 8. **Offline Support** 🔌
**Purpose**: Work without internet connectivity

**Features**:
- IndexedDB for local storage
- Offline indicator
- Auto-sync on reconnection
- Draft recovery
- Service worker support

---

## Architecture Layers

### Layer 1: Presentation (React Components)

```
┌─────────────────────────────────────────────────────────┐
│                    Header Component                      │
│  (Logo, User Info, API Keys, Theme Toggle, Feedback)   │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌──────▼──────┐  ┌────────▼────────┐
│  PromptInput   │  │ PromptOutput │  │ HistorySidebar  │
│  - Mode Select │  │ - Share Btn  │  │ - History List  │
│  - Domain Sel  │  │ - Chain Btn  │  │ - Projects      │
│  - Input Area  │  │ - A/B Test   │  │ - Templates     │
│  - Provider    │  │ - Evaluate   │  │ - Recent        │
└────────────────┘  └──────────────┘  └─────────────────┘
```

**Key Components**:
- **Header**: Navigation and user controls
- **PromptInput**: Main input interface with options
- **PromptOutput**: Display enhanced prompts with actions
- **HistorySidebar**: Access to history, projects, templates
- **Modals**: Share, A/B Test, Evaluation, Recovery
- **Atomic Components**: Reusable UI building blocks

---

### Layer 2: State Management (Zustand)

```
┌──────────────────────────────────────────────────────────┐
│                    Zustand Stores                        │
├──────────────────────────────────────────────────────────┤
│ • useAppStore        - Prompt state (input, output)     │
│ • useUIStore         - UI state (modals, sidebar)       │
│ • useDataStore       - Data (history, projects, temps)  │
│ • useApiKeyStore     - API keys (encrypted)             │
│ • useThemeStore      - Theme preferences                │
│ • useAnalyticsStore  - Analytics events                 │
└──────────────────────────────────────────────────────────┘
```

**Persistence**:
- Middleware auto-saves to localStorage
- Selective persistence (not all state)
- Encryption for sensitive data

---

### Layer 3: Services (Business Logic)

```
┌──────────────────────────────────────────────────────────┐
│                    Service Layer                         │
├──────────────────────────────────────────────────────────┤
│ • enhancementService    - AI provider integration       │
│ • geminiService         - Gemini API wrapper            │
│ • firebaseAuth          - User authentication           │
│ • firebaseAnalytics     - Event tracking                │
│ • cloudSync             - Cloud synchronization         │
│ • errorLogger           - Error tracking                │
│ • performanceMonitor    - Performance metrics           │
│ • searchService         - Full-text search              │
│ • tagService            - Tag management                │
│ • versionService        - Version control               │
└──────────────────────────────────────────────────────────┘
```

---

### Layer 4: Data Access (IndexedDB)

```
┌──────────────────────────────────────────────────────────┐
│                    Dexie Database                        │
├──────────────────────────────────────────────────────────┤
│ Tables:                                                  │
│ • drafts              - Auto-saved drafts               │
│ • history             - Enhancement history             │
│ • projects            - Saved projects                  │
│ • templates           - Custom templates                │
│ • versions            - Prompt versions                 │
│ • tags                - Tag metadata                    │
│ • folders             - Folder structure                │
│ • analytics           - Local analytics                 │
└──────────────────────────────────────────────────────────┘
```

---

## Data Flow

### Enhancement Flow

```
1. User Input
   ↓
2. Validation (Zod schema)
   ↓
3. API Key Selection
   ↓
4. Enhancement Service
   ├─ Format request
   ├─ Add system instruction
   └─ Select provider
   ↓
5. AI Provider API
   ├─ Gemini
   ├─ OpenAI
   ├─ Claude
   └─ OpenRouter
   ↓
6. Streaming Response
   ├─ Accumulate chunks
   ├─ Update UI in real-time
   └─ Handle errors
   ↓
7. Post-Processing
   ├─ Save to history
   ├─ Update analytics
   ├─ Cloud sync (if enabled)
   └─ Show success toast
   ↓
8. Display Output
   ├─ Show enhanced prompt
   ├─ Enable actions (Share, A/B, etc.)
   └─ Update sidebar
```

### Error Handling Flow

```
Error Occurs
   ↓
Categorize Error
   ├─ Rate Limit (429)
   ├─ Auth Error (401)
   ├─ Server Error (500)
   ├─ Network Error
   └─ Validation Error
   ↓
Apply Strategy
   ├─ Rate Limit → Try failover provider
   ├─ Auth → Show API key setup
   ├─ Server → Retry with backoff
   ├─ Network → Show offline indicator
   └─ Validation → Show user message
   ↓
Log & Track
   ├─ Error logger service
   ├─ Firebase analytics
   └─ Local error store
   ↓
User Notification
   ├─ Toast message
   ├─ Retry button (if applicable)
   └─ Suggestion for resolution
```

---

## Technology Stack

### Frontend Framework
- **React 18**: Component-based UI
- **TypeScript**: Type safety
- **Vite**: Fast build tool
- **Tailwind CSS**: Utility-first styling

### State Management
- **Zustand**: Lightweight state management
- **Middleware**: Auto-persistence to localStorage

### Database
- **Dexie.js**: IndexedDB wrapper
- **IndexedDB**: Browser-based storage (50MB+)

### Backend Services
- **Firebase Auth**: User authentication
- **Firebase Firestore**: Cloud data sync
- **Firebase Analytics**: Event tracking

### AI Providers
- **Google Gemini**: Multi-modal, thinking mode
- **OpenAI**: GPT-4, GPT-3.5-turbo
- **Anthropic**: Claude models
- **OpenRouter**: Multi-model aggregator

### UI Libraries
- **Radix UI**: Accessible components
- **Lucide React**: Icons
- **React Hot Toast**: Notifications
- **Framer Motion**: Animations

### Utilities
- **Zod**: Schema validation
- **crypto-js**: Client-side encryption
- **diff-match-patch**: Diff generation
- **lz-string**: Compression
- **jspdf**: PDF export
- **jszip**: ZIP creation

### Testing
- **Vitest**: Unit testing
- **Testing Library**: Component testing
- **axe-core**: Accessibility testing
- **fast-check**: Property-based testing

---

## Component Hierarchy

```
App
├── Header
│   ├── Logo
│   ├── User Info
│   ├── API Keys Button
│   ├── Theme Toggle
│   ├── Feedback Button
│   └── Logout Button
│
├── Main Content
│   ├── PromptInput
│   │   ├── Mode Selector
│   │   ├── Domain Selector
│   │   ├── Input Textarea
│   │   ├── Advanced Options
│   │   ├── Provider Selector
│   │   └── Enhance Button
│   │
│   ├── PromptOutput
│   │   ├── Output Display
│   │   ├── Share Button
│   │   ├── Chain Button
│   │   ├── A/B Test Button
│   │   ├── Evaluate Button
│   │   └── Copy Button
│   │
│   └── HistorySidebar (Desktop)
│       ├── History Tab
│       ├── Projects Tab
│       ├── Templates Tab
│       └── Recent Tab
│
├── Modals
│   ├── ShareModal
│   ├── ABTestWorkspace
│   ├── EvaluationPanel
│   ├── RecoveryModal
│   ├── FeedbackModal
│   ├── ApiKeySetupModal
│   └── TemplateGallery
│
├── Indicators
│   ├── OfflineIndicator
│   ├── UpdateNotification
│   ├── OnboardingChecklist
│   └── LiveRegion (A11y)
│
└── Mobile Sidebar (Mobile)
    └── HistorySidebar (Mobile)
```

---

## State Management

### useAppStore (Prompt State)
```typescript
{
  input: string;
  options: EnhancementOptions;
  enhancedPrompt: string;
  originalPrompt: string;
  isLoading: boolean;
  recoveryDraft: Draft | null;
  
  // Actions
  setInput(input: string);
  setOptions(options: EnhancementOptions);
  setEnhancedPrompt(prompt: string);
  setOriginalPrompt(prompt: string);
  setLoading(loading: boolean);
  setRecoveryDraft(draft: Draft | null);
  resetPrompts();
}
```

### useUIStore (UI State)
```typescript
{
  isMobileHistoryOpen: boolean;
  isTemplateModalOpen: boolean;
  templateModalMode: 'create' | 'edit';
  editingTemplateId: string | null;
  templateFormData: TemplateFormData;
  isFeedbackOpen: boolean;
  isReadOnly: boolean;
  isBooting: boolean;
  
  // Actions
  setMobileHistoryOpen(open: boolean);
  setTemplateModalOpen(open: boolean);
  setTemplateModalMode(mode: 'create' | 'edit');
  setEditingTemplateId(id: string | null);
  setTemplateFormData(data: TemplateFormData);
  setFeedbackOpen(open: boolean);
  setReadOnly(readOnly: boolean);
  setBooting(booting: boolean);
}
```

### useDataStore (Data State)
```typescript
{
  history: HistoryItem[];
  savedProjects: SavedProject[];
  customTemplates: CustomTemplate[];
  
  // Actions
  addHistoryItem(item: HistoryItem);
  clearHistory();
  addSavedProject(project: SavedProject);
  deleteSavedProject(id: string);
  addCustomTemplate(template: CustomTemplate);
  updateCustomTemplate(id: string, template: Partial<CustomTemplate>);
  deleteCustomTemplate(id: string);
}
```

---

## API Integration

### Enhancement Service Architecture

```
enhancementService.ts
├── enhancePromptWithKey(input, options, provider)
│   ├── Get API key from store
│   ├── Validate key
│   ├── Call provider-specific service
│   └── Return async generator (streaming)
│
├── Provider Services
│   ├── geminiService.ts
│   │   ├── System instruction
│   │   ├── Thinking mode support
│   │   ├── Streaming response
│   │   └── Error handling
│   │
│   ├── openaiService.ts
│   │   ├── Model selection
│   │   ├── Streaming response
│   │   └── Token counting
│   │
│   ├── claudeService.ts
│   │   ├── Model selection
│   │   ├── Streaming response
│   │   └── Vision support
│   │
│   └── openrouterService.ts
│       ├── Multi-model support
│       ├── Free model fallback
│       └── Streaming response
│
└── Error Handling
    ├── Retry logic (exponential backoff)
    ├── Rate limit detection
    ├── Provider failover
    └── User-friendly messages
```

### API Request Flow

```
1. User clicks "Enhance"
   ↓
2. Validate input (Zod)
   ↓
3. Get selected provider from store
   ↓
4. Retrieve encrypted API key
   ↓
5. Format request
   ├─ System instruction
   ├─ User input
   ├─ Enhancement options
   └─ Model-specific config
   ↓
6. Call provider API
   ├─ Streaming enabled
   ├─ Timeout: 60 seconds
   └─ Retry: 3 attempts
   ↓
7. Process response
   ├─ Accumulate chunks
   ├─ Update UI in real-time
   ├─ Handle errors
   └─ Track metrics
   ↓
8. Post-processing
   ├─ Save to history
   ├─ Update analytics
   ├─ Cloud sync
   └─ Show success
```

---

## Database Schema

### IndexedDB Tables

#### drafts
```typescript
{
  id: number (auto-increment);
  input: string;
  options: EnhancementOptions;
  timestamp: number;
  domain: DomainType;
  mode: GenerationMode;
}
```

#### history
```typescript
{
  id: string (UUID);
  original: string;
  enhanced: string;
  timestamp: number;
  domain: DomainType;
  mode: GenerationMode;
  provider?: string;
  tokens?: number;
  cost?: number;
}
```

#### projects
```typescript
{
  id: string (UUID);
  name: string;
  input: string;
  options: EnhancementOptions;
  timestamp: number;
  description?: string;
  tags?: string[];
}
```

#### templates
```typescript
{
  id: string (UUID);
  name: string;
  text: string;
  domain: DomainType;
  timestamp: number;
  category?: string;
  variables?: Variable[];
  usage_count?: number;
}
```

#### versions
```typescript
{
  id: string (UUID);
  promptId: string;
  content: string;
  timestamp: number;
  description: string;
  author: string;
  changeStats: {
    additions: number;
    deletions: number;
    modifications: number;
  };
}
```

---

## Security & Performance

### Security Measures

1. **API Key Encryption**
   - Client-side encryption with crypto-js
   - Never sent to backend
   - Stored in encrypted localStorage

2. **Authentication**
   - Firebase Auth (email/password, OAuth)
   - Session management
   - Automatic logout on inactivity

3. **Data Privacy**
   - No server-side processing of prompts
   - Optional cloud sync (user-controlled)
   - HTTPS only
   - CSP headers

4. **Input Validation**
   - Zod schema validation
   - XSS prevention
   - SQL injection prevention (N/A - no backend)

### Performance Optimizations

1. **Code Splitting**
   - Lazy load modals (FeedbackModal, RecoveryModal, HistorySidebar)
   - Lazy load heavy components
   - React.lazy + Suspense

2. **Rendering Optimization**
   - React.memo for expensive components
   - useCallback for stable function references
   - Virtualization for long lists (react-window)

3. **Data Optimization**
   - Debounced auto-save (2s delay)
   - Compression with lz-string
   - IndexedDB for efficient storage
   - Selective state persistence

4. **Network Optimization**
   - Streaming responses (no waiting for full response)
   - Request deduplication
   - Exponential backoff retry
   - Provider failover

5. **Browser APIs**
   - requestIdleCallback for non-critical tasks
   - Service Worker for offline support
   - Web Workers for heavy computation
   - IndexedDB for local storage

### Performance Metrics

**Target Metrics**:
- First Contentful Paint: < 0.8s
- Time to Interactive: < 1.5s
- Interaction responsiveness: < 100ms
- Lighthouse Score: 95+

**Current Scores**:
- Performance: 95/100
- Accessibility: 100/100
- Best Practices: 96/100
- SEO: 100/100

---

## Deployment

### Build Process
```bash
npm run build
# Output: dist/ directory
# Size: ~500KB (gzipped)
```

### Hosting Options
1. **GitHub Pages** (Current)
   - Free hosting
   - Automatic deployment via GitHub Actions
   - Base path: `/dev_promptstudio/`

2. **Vercel**
   - Automatic deployments
   - Edge functions support
   - Analytics included

3. **Netlify**
   - Continuous deployment
   - Serverless functions
   - Form handling

### Environment Variables
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

---

## Future Roadmap

### Phase 1: Enhanced Collaboration
- [ ] Real-time co-editing with WebRTC
- [ ] Comments and annotations
- [ ] Team workspaces
- [ ] Role-based access control

### Phase 2: Advanced Analytics
- [ ] Detailed metrics dashboard
- [ ] Prompt effectiveness scoring
- [ ] Usage patterns analysis
- [ ] Cost tracking by provider

### Phase 3: Integration Hub
- [ ] GitHub integration
- [ ] Slack bot
- [ ] VS Code extension
- [ ] REST API

### Phase 4: Community Features
- [ ] Prompt marketplace
- [ ] Community templates
- [ ] Rating and reviews
- [ ] Leaderboards

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](LICENSE)
