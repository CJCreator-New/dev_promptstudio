# Zero-Cost Backend Integration Plan

## Current Status
- ✅ Firebase Auth (anonymous + email)
- ✅ Firestore (optional sync)
- ✅ Analytics tracking
- ✅ Share links
- ✅ Favorites

**Current Capacity:** 42,857 users at $0/month

## Optimization Strategy

### 1. Cache-First Architecture
```typescript
// Only sync favorites, not all prompts
const syncStrategy = {
  local: 'All prompts in IndexedDB',
  cloud: 'Only favorites + last 30 days',
  sync: 'On user action only (not automatic)'
};
```

**New Capacity:** 300,000 users at $0/month

### 2. Public Collections (CDN Cached)
```typescript
// Marketplace prompts = unlimited reads
collection: 'public_prompts'
- Cached by Firestore CDN
- No auth required for reads
- Only writes cost money
```

**Cost:** 0 (CDN serves all reads)

### 3. Subcollections for Versions
```typescript
// Store versions as subcollections
prompts/{id}/versions/{versionId}
- 1 write for parent + all versions
- Load versions on-demand
- Store diffs, not full content
```

**Cost:** Same as single write

### 4. Cloud Functions (Free Tier)
```typescript
// 2M invocations/month free
- Daily cleanup of expired shares
- Email notifications (SendGrid 100/day free)
- Analytics aggregation
```

**Cost:** 0 (within free tier)

## Features to Add (Zero Cost)

### ✅ Prompt Marketplace
- Public read-only collection
- CDN cached
- Community contributions
- **Cost:** 0 reads (CDN), minimal writes

### ✅ Version History
- Subcollections with diffs
- Load on-demand
- Compress with LZ-string
- **Cost:** 0 additional writes

### ✅ Team Workspaces
- Lazy load team data
- Cache team prompts locally
- Sync only on changes
- **Cost:** 5 writes/user/month = 120K users

### ✅ Usage Analytics
- Aggregate in Cloud Functions
- Store daily summaries (not individual events)
- Display from cached summaries
- **Cost:** 0 (Cloud Functions free tier)

### ✅ A/B Testing
- Run tests locally
- Store results in subcollections
- Aggregate with Cloud Functions
- **Cost:** 0 additional writes

## Implementation Priority

### Week 1: Optimize Current Setup
1. Change sync to favorites-only
2. Add 30-day limit
3. Implement cache-first loading
4. **Result:** 300K users capacity

### Week 2: Add Marketplace
1. Create public_prompts collection
2. Add CDN caching headers
3. Build marketplace UI
4. **Result:** Unlimited reads

### Week 3: Add Version History
1. Implement subcollections
2. Store diffs with LZ-string
3. Add version comparison UI
4. **Result:** 0 additional cost

### Week 4: Add Cloud Functions
1. Scheduled cleanup
2. Email notifications
3. Analytics aggregation
4. **Result:** 0 cost (free tier)

## Free Tier Limits

### Firestore
- 50K reads/day
- 20K writes/day
- 1 GB storage
- 10 GB/month bandwidth

### Cloud Functions
- 2M invocations/month
- 400K GB-seconds compute
- 200K GHz-seconds compute

### Cloud Storage
- 5 GB storage
- 1 GB/day downloads
- 20K operations/day

## Final Capacity

**With All Optimizations:**
- **300,000+ users at $0/month**
- Unlimited marketplace reads (CDN)
- Unlimited version history (subcollections)
- Unlimited analytics (Cloud Functions)
- Team workspaces (120K users)

## Monitoring

### Set up alerts for:
- Daily writes approaching 20K
- Storage approaching 1 GB
- Cloud Functions approaching 2M

### Fallback strategy:
- If limits approached, disable auto-sync
- Keep local-only mode always available
- Prompt users to upgrade to paid tier
