# Technical Debt Tracker

**Purpose**: Track known issues, improvements, and refactoring opportunities  
**Updated**: January 25, 2026

---

## Current Technical Debt

### High Priority (Address Soon)

#### 1. Type Safety Issues

**Status**: ⚠️ In Progress  
**Issue**: Not all TypeScript types are properly defined  
**Impact**: Risk of runtime errors, reduced IDE autocomplete  
**Solution**: Add proper types to all API responses  
**Effort**: 4 hours  
**Owner**: TBD

```typescript
// TODO: Define types for all API responses
// Currently using 'any' in some places
```

**Files Affected**:

- `src/services/api/*`
- `src/hooks/useTrails.ts`
- `src/hooks/useWeather.ts`

---

#### 2. Error Handling Inconsistency

**Status**: ⚠️ Not Started  
**Issue**: Error handling varies across components (some show toast, some silent fail)  
**Impact**: Poor user experience, difficult debugging  
**Solution**: Create centralized error handler, consistent error UI  
**Effort**: 6 hours  
**Owner**: TBD

```typescript
// Need: Error handler utility
// Current: Scattered try/catch blocks
```

**Files Affected**:

- `src/utils/errorHandler.ts` (needs creation)
- All API call locations

---

#### 3. API Response Caching

**Status**: ⚠️ Not Started  
**Issue**: No caching strategy for API responses  
**Impact**: Excessive API calls, slow performance, high bandwidth  
**Solution**: Implement react-query or similar caching solution  
**Effort**: 8 hours  
**Owner**: TBD

```typescript
// TODO: Implement caching strategy
// Currently: Every component fetches independently
```

---

#### 4. Component Prop Drilling

**Status**: ⚠️ In Progress  
**Issue**: Some components pass props through many levels  
**Impact**: Difficult to maintain, prop changes cascade  
**Solution**: Use Context for certain global props (theme, user data)  
**Effort**: 5 hours  
**Owner**: TBD

**Example**:

- Trail data passed through multiple component levels

---

### Medium Priority (Address This Sprint)

#### 5. Missing Loading States

**Status**: 🟡 Partial  
**Issue**: Some screens don't show loading indicators  
**Impact**: User confusion about app state  
**Solution**: Add skeleton screens or spinners where data loads  
**Effort**: 4 hours

**Affected Screens**:

- [ ] Trail Detail (add loading for API fetch)
- [ ] Favorites (add loading for initial fetch)
- [ ] Explore (add loading for data)
- [ ] Weather (add loading for API call)

---

#### 6. Image Optimization

**Status**: ⚠️ Not Started  
**Issue**: Full resolution images loaded for all sizes  
**Impact**: Slow loading, high bandwidth, memory usage  
**Solution**: Use Cloudinary transforms for different screen sizes  
**Effort**: 3 hours

```typescript
// TODO: Use Cloudinary width transforms
// Current: Loading full resolution always
// Should: Load 300w for thumbnails, 800w for detail views
```

---

#### 7. Magic Numbers in Code

**Status**: 🟡 Partial  
**Issue**: Hard-coded values scattered throughout  
**Impact**: Difficult to maintain, inconsistent styling  
**Solution**: Extract to constants  
**Effort**: 2 hours

**Examples**:

- Animation durations
- Border radius values
- Font sizes
- Colors (partially done)

---

#### 8. Missing Unit Tests

**Status**: ⚠️ Not Started  
**Issue**: No unit tests written yet  
**Impact**: Bugs go undetected, refactoring risky  
**Solution**: Add Jest tests for utilities and hooks  
**Effort**: 10+ hours

**Priority Test Coverage**:

- [ ] Auth context
- [ ] useFavorites hook
- [ ] useTrails hook
- [ ] API service utilities
- [ ] Date/format utilities

---

### Low Priority (Address Later)

#### 9. Code Comments

**Status**: 🟡 Partial  
**Issue**: Complex logic missing explanatory comments  
**Impact**: Onboarding difficult, maintenance harder  
**Solution**: Add JSDoc comments to functions  
**Effort**: 4 hours

---

#### 10. Performance Profiling

**Status**: ⚠️ Not Started  
**Issue**: No baseline performance metrics  
**Impact**: Can't detect regressions  
**Solution**: Profile with React DevTools, set performance budgets  
**Effort**: 2 hours

**Metrics to Track**:

- Component render time
- Memory usage
- Bundle size
- API response times

---

#### 11. Unused Dependencies

**Status**: 🔍 Unknown  
**Issue**: Potentially unused npm packages  
**Impact**: Larger bundle size  
**Solution**: Run dependency audit, remove unused packages  
**Effort**: 1 hour

---

#### 12. Navigation State Management

**Status**: 🟡 Partial  
**Issue**: Deep linking not fully implemented  
**Impact**: Can't share trail URLs or return to exact state  
**Solution**: Implement full deep linking with route parameters  
**Effort**: 4 hours

---

## Known Bugs

### Open Issues

#### Bug #1: Map Doesn't Show Trails

**Status**: 🔴 Critical  
**Severity**: High  
**Description**: Mapbox screen shows blank map without trail markers  
**Steps to Reproduce**:

1. Open Map tab
2. Observe no trail markers displayed

**Expected**: Trail markers visible on map  
**Actual**: Blank map  
**Root Cause**: Trail data not being fetched or passed to map component  
**Fix**: Implement map marker rendering from API data  
**Effort**: 3 hours

---

#### Bug #2: Favorites Don't Persist

**Status**: 🟡 In Progress  
**Severity**: High  
**Description**: Favorites clear when app restarts  
**Steps to Reproduce**:

1. Add trail to favorites
2. Close and reopen app
3. Observe favorite is gone

**Expected**: Favorite should persist  
**Actual**: Lost on app restart  
**Root Cause**: Not properly saving to Supabase or local storage  
**Fix**: Verify Supabase sync logic  
**Effort**: 2 hours

---

#### Bug #3: Weather API Fails Silently

**Status**: 🟡 In Progress  
**Severity**: Medium  
**Description**: When weather API fails, no error shown to user  
**Steps to Reproduce**:

1. Disable network
2. Try to load weather
3. Observe blank screen

**Expected**: Error message displayed  
**Actual**: Blank/hanging screen  
**Root Cause**: No error handling in weather service  
**Fix**: Add error handling and fallback UI  
**Effort**: 1 hour

---

#### Bug #4: Tab Bar Jank on Rapid Swipes

**Status**: 🟡 In Progress  
**Severity**: Medium  
**Description**: Tab animation stutters when swiping rapidly  
**Steps to Reproduce**:

1. Swipe between tabs rapidly
2. Observe animation jank

**Expected**: Smooth 60 FPS animation  
**Actual**: Animation drops frames  
**Root Cause**: JavaScript event handling during swipes  
**Fix**: Optimize animation performance, use native driver  
**Effort**: 3 hours

---

#### Bug #5: Image Loading Timeout

**Status**: ⚠️ Not Confirmed  
**Severity**: Medium  
**Description**: Large images timeout sometimes when loading slowly  
**Steps to Reproduce**:

1. Open trail with many images on slow network
2. Wait for timeout

**Expected**: Images load eventually  
**Actual**: Sometimes fails to load  
**Root Cause**: No retry logic, timeout too short  
**Fix**: Implement retry logic and increase timeout  
**Effort**: 2 hours

---

## Refactoring Opportunities

### 1. Consolidate API Service

**Priority**: Medium  
**Description**: Currently have scattered API calls in services/api folder  
**Goal**: Create unified API client with interceptors  
**Effort**: 6 hours

```typescript
// Current: Multiple files, inconsistent error handling
// Goal: Single API client instance with shared configuration
// Benefit: Easier to add interceptors, consistent error handling
```

---

### 2. Extract Common Styles

**Priority**: Medium  
**Description**: Style objects repeated across components  
**Goal**: Create stylesheet utilities  
**Effort**: 3 hours

```typescript
// Current: Each component defines its own styles
// Goal: Shared style utilities and patterns
// Example: commonStyles.glassCard, commonStyles.button, etc.
```

---

### 3. Improve Component Organization

**Priority**: Low  
**Description**: Some components are too large  
**Goal**: Break into smaller, focused components  
**Effort**: 4 hours

**Candidates for Refactoring**:

- TrailDetailScreen (currently too large)
- GlassTabBar (could extract sub-components)

---

### 4. Standardize Hooks

**Priority**: Medium  
**Description**: Custom hooks could be more consistent  
**Goal**: Follow standard hook patterns and naming  
**Effort**: 2 hours

**Standards to Apply**:

- All hooks start with "use"
- All hooks should manage loading/error states
- All hooks should document parameters and return types

---

## Deprecations & Breaking Changes

### None Currently Scheduled

- Current API is stable
- Component interfaces are stable
- Plan changes before implementing

---

## Performance Optimization Opportunities

### Bundle Size

- **Current**: Unknown (needs measurement)
- **Target**: < 5MB gzipped
- **Action**: Run bundle analyzer, identify large modules

### Runtime Performance

- **Current**: Baseline unknown
- **Target**: 60 FPS, initial load < 2s
- **Action**: Profile with React DevTools, identify hot spots

### Memory Usage

- **Current**: Unknown
- **Target**: < 150MB on average device
- **Action**: Monitor with DevTools, identify leaks

---

## Dependency Updates Needed

### Security Updates

- [ ] Check npm audit for vulnerabilities
- [ ] Update critical packages
- [ ] Test after each update

### Feature Updates

- [ ] Review Expo updates
- [ ] Update Mapbox when new features available
- [ ] Update Supabase client library

### Deprecation Warnings

- [ ] Address any deprecation warnings
- [ ] Update to new APIs
- [ ] Remove deprecated code

---

## Documentation Gaps

| Document              | Status     | Priority |
| --------------------- | ---------- | -------- |
| API Documentation     | ⚠️ Needed  | High     |
| Component Prop Types  | ⚠️ Needed  | High     |
| Setup Instructions    | ⚠️ Partial | Medium   |
| Architecture Diagram  | ⚠️ Needed  | Medium   |
| Database Schema       | 🟡 Partial | Medium   |
| Environment Variables | ✅ Done    | -        |

---

## Action Items

### This Week

- [ ] Define all API response types
- [ ] Create centralized error handler
- [ ] Add missing loading states
- [ ] Start implementing caching

### This Month

- [ ] Set up unit tests
- [ ] Complete performance profiling
- [ ] Fix critical bugs
- [ ] Complete refactorings

### Next Quarter

- [ ] Achieve 80% test coverage
- [ ] Zero critical technical debt
- [ ] Full TypeScript coverage
- [ ] Complete documentation

---

## Metrics to Track

### Code Quality

- [ ] TypeScript type coverage: \_\_%
- [ ] Test coverage: \_\_%
- [ ] ESLint errors: \_\_
- [ ] ESLint warnings: \_\_

### Performance

- [ ] Average API response time: \_\_ms
- [ ] Average component render time: \_\_ms
- [ ] App bundle size: \_\_MB
- [ ] Memory usage: \_\_MB

### Bugs

- [ ] Open critical bugs: \_\_
- [ ] Open high priority bugs: \_\_
- [ ] Bug resolution time: \_\_days

---

## Review Schedule

- **Weekly**: Update bug status, add new issues
- **Monthly**: Prioritize debt, plan next sprint
- **Quarterly**: Review metrics, adjust strategy

---

**Last Updated**: January 25, 2026  
**Next Review**: January 31, 2026  
**Owner**: Development Team
