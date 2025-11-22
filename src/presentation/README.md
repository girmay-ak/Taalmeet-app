# Presentation Layer

The **presentation layer** contains all UI-related code. This includes React Native components, screens, navigation, and custom hooks.

## Purpose

The presentation layer is responsible for:
- Rendering the user interface
- Handling user interactions
- Managing UI state
- Connecting UI to business logic through use cases

## Structure

```
presentation/
├── screens/        # Screen components (HomeScreen, ProfileScreen, etc.)
├── components/     # Reusable UI components (Button, Card, etc.)
├── navigation/     # Navigation configuration
└── hooks/          # Custom React hooks (useUser, useMatches, etc.)
```

## Principles

- **UI Only**: Contains only presentation logic, no business logic
- **Use Case Integration**: Uses use cases from core layer for business operations
- **Reusable Components**: Components are designed for reuse
- **State Management**: Manages UI state, delegates business state to use cases

## Screens

Screens are top-level components that represent full app screens:

- `HomeScreen`: Main dashboard screen
- `ProfileScreen`: User profile screen (to be implemented)
- `MatchesScreen`: Language exchange matches screen (to be implemented)

Screens:
- Compose multiple components
- Handle navigation
- Use hooks to connect to business logic

## Components

Components are reusable UI elements:

- `Button`: Reusable button with variants
- More components to be added (Card, Input, etc.)

Components:
- Are framework-specific (React Native)
- Follow design system
- Are highly reusable
- Accept props for customization

## Navigation

Navigation configuration sets up app navigation:

- `AppNavigator`: Main navigation container
- Stack and tab navigators

Navigation:
- Uses React Navigation
- Defines app structure
- Handles deep linking (to be implemented)

## Hooks

Custom hooks connect UI to business logic:

- `useUser`: User state and operations
- `useMatches`: Match state and operations (to be implemented)

Hooks:
- Encapsulate use case calls
- Manage loading/error states
- Provide clean API for components

## Usage Example

```typescript
// Presentation layer uses core layer through hooks
const { user, loading, createUser } = useUser(createUserUseCase);

// Component uses hook
<Button
  title="Create Account"
  onPress={() => createUser({ email, displayName, ... })}
  loading={loading}
/>
```

## State Management

The presentation layer manages:
- **UI State**: Loading indicators, form inputs, etc.
- **Business State**: Delegated to use cases and hooks

## Testing

Presentation layer can be tested with:
- React Native Testing Library
- Component snapshots
- Hook testing utilities

