# Development Guidelines & Standards

**Purpose**: Maintain code quality and consistency across the project  
**Version**: 1.0  
**Updated**: January 25, 2026

---

## Code Organization Standards

### Folder Structure Rules

**Frontend (src/)**

```
src/
├── components/        # React components only
├── screens/          # Full-page components (via app/ routing)
├── services/         # Business logic, API calls
├── hooks/            # Custom React hooks
├── context/          # React Context providers
├── types/            # TypeScript interfaces and types
├── constants/        # App-wide constants
├── utils/            # Pure utility functions
└── styles/           # Global and shared styles
```

**Backend (backend/)**

```
backend/
├── src/
│   ├── config/       # Configuration files
│   ├── controllers/  # Route handlers
│   ├── routes/       # Route definitions
│   ├── middleware/   # Express middleware
│   ├── services/     # Business logic
│   ├── db/           # Database queries
│   ├── utils/        # Utility functions
│   └── README.md
└── server.js
```

### File Naming Conventions

| Type       | Pattern                      | Example                                 |
| ---------- | ---------------------------- | --------------------------------------- |
| Components | PascalCase                   | `TrailCard.tsx`, `WeatherWidget.tsx`    |
| Screens    | PascalCase                   | `TrailDetailScreen.tsx`                 |
| Hooks      | camelCase, starts with "use" | `useTrails.ts`, `useFavorites.ts`       |
| Services   | camelCase + Service          | `apiService.ts`, `weatherService.ts`    |
| Types      | PascalCase + Type            | `trail.types.ts`, `api.types.ts`        |
| Constants  | camelCase or SCREAMING_SNAKE | `colors.ts`, `API_ENDPOINTS.ts`         |
| Utils      | camelCase                    | `formatDate.ts`, `calculateDistance.ts` |
| Styles     | filename.styles.ts           | `TrailCard.styles.ts`                   |

---

## TypeScript Standards

### Type Definition Rules

**Always Define Types**

```typescript
// ❌ Bad - Using any
function fetchTrail(id: any): any {
  return apiCall(id);
}

// ✅ Good - Explicit types
function fetchTrail(id: string): Promise<Trail> {
  return apiCall(id);
}
```

**Export Types from Dedicated Files**

```typescript
// src/types/trail.types.ts
export interface Trail {
  id: string;
  name: string;
  distance: number;
  elevation: number;
  difficulty: "Easy" | "Moderate" | "Hard" | "Expert";
  description: string;
}

// src/services/api/trailService.ts
import { Trail } from "@/types/trail.types";
```

**Use Interfaces for Objects, Types for Unions**

```typescript
// ✅ Good - Interface for object
export interface Trail {
  id: string;
  name: string;
}

// ✅ Good - Type for union
export type Difficulty = "Easy" | "Moderate" | "Hard" | "Expert";
export type ApiResponse<T> = Success<T> | Error;
```

### Generic Type Usage

```typescript
// ✅ Good - Reusable generic types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  return response.json();
}
```

---

## Component Structure

### Functional Component Template

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '@/constants';

interface TrailCardProps {
  trail: Trail;
  onPress: (trailId: string) => void;
}

/**
 * TrailCard - Displays a summary card for a trail
 *
 * @param trail - Trail data to display
 * @param onPress - Callback when card is pressed
 */
export const TrailCard: React.FC<TrailCardProps> = ({
  trail,
  onPress,
}) => {
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    // Side effects here
  }, []);

  const handlePress = () => {
    onPress(trail.id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{trail.name}</Text>
      {/* Component content */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});
```

### Component Best Practices

1. **Props Interface**: Always define interface for props
2. **JSDoc Comments**: Add for complex components
3. **Memoization**: Use `React.memo` for frequently re-rendered components
4. **Single Responsibility**: Component does one thing
5. **Props Drilling**: Use Context for global state
6. **Error Boundaries**: Wrap feature sections
7. **Loading States**: Always handle loading/error

### Component File Organization

```typescript
// 1. Imports (external, then local)
import React from 'react';
import { View, Text } from 'react-native';
import { TrailService } from '@/services';
import { colors } from '@/constants';

// 2. Type definitions
interface TrailCardProps {
  trail: Trail;
  onPress: (id: string) => void;
}

// 3. Component definition
export const TrailCard: React.FC<TrailCardProps> = ({ trail, onPress }) => {
  // Hooks
  const [state, setState] = useState();

  // Effects
  useEffect(() => {}, []);

  // Handlers
  const handlePress = () => {};

  // Render
  return <View></View>;
};

// 4. Styles
const styles = StyleSheet.create({});

// 5. Exports
export default TrailCard;
```

---

## Hook Standards

### Custom Hook Template

```typescript
import { useEffect, useState, useCallback } from "react";
import { apiService } from "@/services";
import { Trail } from "@/types";

interface UseTrailsReturn {
  trails: Trail[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * useTrails - Fetch all trails from API
 *
 * @returns Object with trails, loading state, error, and refetch function
 */
export const useTrails = (): UseTrailsReturn => {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getTrails();
      setTrails(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrails();
  }, [fetchTrails]);

  return { trails, loading, error, refetch: fetchTrails };
};
```

### Hook Best Practices

1. **Naming**: Always start with "use"
2. **Return Type**: Always specify return interface
3. **Error Handling**: Always include error state
4. **Loading State**: Always include loading state
5. **Cleanup**: Use return function in useEffect
6. **Dependencies**: Specify all dependencies in useEffect
7. **Documentation**: Add JSDoc comment with parameters and return

---

## Service/Utility Standards

### Service Template

```typescript
import axios, { AxiosInstance } from "axios";
import { Trail, ApiResponse } from "@/types";
import { API_BASE_URL } from "@/constants";

class TrailService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
    });
  }

  /**
   * Fetch all trails
   *
   * @returns Array of trails
   * @throws Error if request fails
   */
  async getTrails(): Promise<Trail[]> {
    try {
      const response = await this.api.get<ApiResponse<Trail[]>>("/trails");
      return response.data.data ?? [];
    } catch (error) {
      throw new Error(`Failed to fetch trails: ${error}`);
    }
  }

  /**
   * Fetch single trail by ID
   *
   * @param id - Trail ID
   * @returns Trail data
   * @throws Error if trail not found
   */
  async getTrailById(id: string): Promise<Trail> {
    const response = await this.api.get<ApiResponse<Trail>>(`/trails/${id}`);
    return response.data.data!;
  }
}

export const trailService = new TrailService();
```

### Utility Function Template

```typescript
/**
 * Calculate distance between two coordinates in kilometers
 *
 * @param lat1 - Starting latitude
 * @param lon1 - Starting longitude
 * @param lat2 - Ending latitude
 * @param lon2 - Ending longitude
 * @returns Distance in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
```

---

## Error Handling Standards

### Error Handling Pattern

```typescript
// ✅ Good - Consistent error handling
async function fetchTrail(id: string): Promise<Trail | null> {
  try {
    const response = await apiService.getTrailById(id);
    return response;
  } catch (error) {
    if (error instanceof NetworkError) {
      // Handle network error
      showToast("Network connection failed");
    } else if (error instanceof ValidationError) {
      // Handle validation error
      showToast(error.message);
    } else {
      // Handle generic error
      console.error("Unexpected error:", error);
      showToast("Something went wrong");
    }
    return null;
  }
}
```

### API Error Response Handling

```typescript
interface ApiError {
  success: false;
  error: string;
  code: string;
}

interface ApiSuccess<T> {
  success: true;
  data: T;
}

type ApiResponse<T> = ApiSuccess<T> | ApiError;

// Usage
const response = await api.getTrail(id);
if (!response.success) {
  console.error("API Error:", response.error);
  // Handle error
} else {
  console.log("Success:", response.data);
  // Handle success
}
```

---

## State Management Standards

### Context Template

```typescript
import React, { createContext, useContext, useState } from 'react';
import { Trail } from '@/types';

interface FavoritesContextType {
  favorites: Trail[];
  addFavorite: (trail: Trail) => void;
  removeFavorite: (trailId: string) => void;
  isFavorited: (trailId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<Trail[]>([]);

  const addFavorite = (trail: Trail) => {
    setFavorites((prev) => [...prev, trail]);
  };

  const removeFavorite = (trailId: string) => {
    setFavorites((prev) => prev.filter((t) => t.id !== trailId));
  };

  const isFavorited = (trailId: string) => {
    return favorites.some((t) => t.id === trailId);
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorited }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
};
```

---

## Styling Standards

### Stylesheet Organization

```typescript
import { StyleSheet } from "react-native";
import { colors, spacing } from "@/constants";

export const styles = StyleSheet.create({
  // Layout styles first
  container: {
    flex: 1,
    padding: spacing.lg,
  },

  // Content styles
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.md,
  },

  // State-specific styles
  disabled: {
    opacity: 0.5,
  },
});
```

### Dynamic Styles

```typescript
// ✅ Good - Use style composition
const getDifficultyColor = (difficulty: string): string => {
  const difficultyColors: Record<string, string> = {
    Easy: colors.success,
    Moderate: colors.warning,
    Hard: colors.error,
    Expert: colors.darkError,
  };
  return difficultyColors[difficulty] ?? colors.text;
};

// Usage
<Text style={{ color: getDifficultyColor(trail.difficulty) }}>
  {trail.difficulty}
</Text>
```

---

## Constants Standards

### How to Organize Constants

**colors.ts**

```typescript
export const colors = {
  primary: "#2D5016",
  secondary: "#4A7C2C",
  background: "#FAFAF9",
  text: "#1F2937",
  error: "#EF4444",
  // ... more colors
};
```

**spacing.ts**

```typescript
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 32,
};
```

**api.ts**

```typescript
export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000",
  TIMEOUT: 10000,
  RETRY_COUNT: 3,
};

export const API_ENDPOINTS = {
  TRAILS: "/api/trails",
  TRAIL_DETAIL: (id: string) => `/api/trails/${id}`,
  FAVORITES: "/api/favorites",
  AUTH: {
    LOGIN: "/api/auth/login",
    SIGNUP: "/api/auth/signup",
    LOGOUT: "/api/auth/logout",
  },
};
```

---

## Testing Standards

### Unit Test Template

```typescript
import { describe, it, expect, beforeEach } from "@jest/globals";
import { calculateDistance } from "@/utils/distance";

describe("calculateDistance", () => {
  beforeEach(() => {
    // Setup if needed
  });

  it("should calculate distance between two points correctly", () => {
    const distance = calculateDistance(39.7392, -104.9903, 40.7128, -74.006);
    expect(distance).toBeCloseTo(2625, -1);
  });

  it("should handle same coordinates", () => {
    const distance = calculateDistance(40, -105, 40, -105);
    expect(distance).toBe(0);
  });
});
```

### Integration Test Template

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { TrailCard } from '@/components/trail/TrailCard';

describe('TrailCard', () => {
  const mockTrail = {
    id: '1',
    name: 'Bear Lake Trail',
    distance: 3.2,
    difficulty: 'Easy',
  };

  it('should render trail information', () => {
    render(<TrailCard trail={mockTrail} onPress={jest.fn()} />);
    expect(screen.getByText('Bear Lake Trail')).toBeTruthy();
  });

  it('should call onPress when pressed', async () => {
    const onPress = jest.fn();
    render(<TrailCard trail={mockTrail} onPress={onPress} />);
    fireEvent.press(screen.getByText('Bear Lake Trail'));
    await waitFor(() => {
      expect(onPress).toHaveBeenCalledWith('1');
    });
  });
});
```

---

## Git Commit Standards

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type**: feature, fix, docs, style, refactor, perf, test, chore  
**Scope**: component/service affected  
**Subject**: 50 chars or less, imperative mood

### Examples

```
feature(trail-detail): add elevation profile chart
fix(favorites): persist favorites to supabase
docs(api): update endpoint documentation
refactor(hooks): consolidate api calls into service
```

---

## Code Review Checklist

Before submitting for review:

- [ ] All TypeScript types are defined
- [ ] No `any` types used
- [ ] Error handling implemented
- [ ] Loading states handled
- [ ] No console.logs left
- [ ] Styles follow design system
- [ ] Components are reusable where possible
- [ ] Props are documented
- [ ] No memory leaks
- [ ] Tests pass (if applicable)
- [ ] No critical console warnings

---

## Performance Guidelines

### Memoization

```typescript
// ✅ Good - Memoize expensive components
export const TrailCard = React.memo(({ trail, onPress }: Props) => {
  return <View>{/* ... */}</View>;
}, (prevProps, nextProps) => {
  return prevProps.trail.id === nextProps.trail.id;
});
```

### List Performance

```typescript
// ✅ Good - Use FlatList with optimization
<FlatList
  data={trails}
  renderItem={({ item }) => <TrailCard trail={item} />}
  keyExtractor={(item) => item.id}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
/>
```

### Image Optimization

```typescript
// ✅ Good - Use Cloudinary transforms
const imageUrl = `${CLOUDINARY_URL}/w_300,h_200,c_fill/${imageId}`;
```

---

## Documentation Standards

### README Format

Every feature should have a README explaining:

1. What it does
2. How to use it
3. Dependencies
4. Configuration
5. Examples

### JSDoc Format

```typescript
/**
 * Fetch a trail by ID
 *
 * @param id - The trail ID
 * @returns Promise resolving to Trail data
 * @throws {Error} If trail not found
 *
 * @example
 * const trail = await getTrail('123');
 */
```

---

## Accessibility Standards

### Text Size

- Minimum 14px for body text
- Minimum 12px for secondary text
- Use relative sizing where possible

### Color Contrast

- Always test with WebAIM contrast checker
- Minimum 4.5:1 for normal text
- Minimum 3:1 for large text

### Touch Targets

- Minimum 44×44 points for interactive elements
- Adequate spacing between touch targets

### Screen Reader Support

- Use accessibilityLabel for icons
- Use accessibilityHint for context
- Test with screen readers

---

## Environment Variables

### Required .env Variables

```
EXPO_PUBLIC_API_URL=
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_WEATHER_API_KEY=
EXPO_PUBLIC_MAPBOX_TOKEN=
```

### Never Commit Secrets

- Use `.env.local` for local overrides
- Add `.env.local` to `.gitignore`
- Document all required variables in `.env.example`

---

## Deployment Checklist

Before deploying:

- [ ] All tests pass
- [ ] No console errors/warnings
- [ ] All TypeScript types valid
- [ ] Bundle size checked
- [ ] Performance metrics verified
- [ ] Environment variables set
- [ ] Security review completed
- [ ] Accessibility verified
- [ ] Device testing completed
- [ ] Release notes prepared

---

**Last Updated**: January 25, 2026  
**Version**: 1.0  
**Owner**: Development Team
