# Shared Layer

The **shared layer** contains utilities, constants, types, and validators that are used across multiple layers of the application.

## Purpose

The shared layer provides:

- Common utilities and helper functions
- Shared TypeScript types and interfaces
- Application constants
- Validation functions
- Framework-agnostic utilities

## Structure

```
shared/
├── constants/      # App constants (languages, etc.)
├── types/          # Shared TypeScript types
├── utils/          # Helper functions
└── validators/     # Input validation functions
```

## Principles

- **Framework Agnostic**: No framework dependencies
- **Reusable**: Used across all layers
- **Pure Functions**: No side effects where possible
- **Well Documented**: Clear JSDoc comments

## Constants

Application-wide constants:

- `languages.ts`: Supported languages and codes
- More constants to be added (API endpoints, etc.)

Constants:

- Are immutable
- Provide type safety
- Centralize configuration values

## Types

Shared TypeScript types:

- `Result<T, E>`: Result type for operations
- `PaginationParams`: Pagination parameters
- `ApiError`: API error response type

Types:

- Used across layers
- Provide type safety
- Document data structures

## Utils

Utility functions:

- `validation.ts`: Validation helpers
- More utilities to be added (formatting, etc.)

Utils:

- Are pure functions where possible
- Have no side effects
- Are well tested

## Validators

Input validation functions:

- `isValidEmail`: Email validation
- `isValidLanguageCode`: Language code validation
- `isNotEmpty`: String validation
- `isInRange`: Number range validation

Validators:

- Return boolean results
- Are framework-agnostic
- Can be used in any layer

## Usage Example

```typescript
// Used in any layer
import { isValidEmail } from '@shared/utils/validation';
import { SUPPORTED_LANGUAGES } from '@shared/constants/languages';
import { Result } from '@shared/types';

if (isValidEmail(email)) {
  // Valid email
}
```

## Testing

Shared utilities are:

- Highly testable (pure functions)
- Well covered by unit tests
- Used in integration tests
