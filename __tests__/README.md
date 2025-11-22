# Testing Guide

This directory contains all test files for the TaalMeet application.

## Test Structure

```
__tests__/
├── unit/                    # Unit tests (isolated functions/classes)
│   ├── services/           # Service layer tests
│   ├── utils/              # Utility function tests
│   └── usecases/           # Use case tests
├── integration/            # Integration tests (multiple components)
├── e2e/                    # End-to-end tests (full user flows)
├── mocks/                  # Mock data and utilities
│   ├── mockData.ts         # Mock data structures
│   ├── mockSupabase.ts     # Mock Supabase client
│   └── mockUsers.ts        # Mock user utilities
└── setup.ts                # Global test setup
```

## Running Tests

### All Tests
```bash
npm test
```

### Watch Mode
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

### Unit Tests Only
```bash
npm run test:unit
```

### Integration Tests Only
```bash
npm run test:integration
```

### E2E Tests Only
```bash
npm run test:e2e
```

### CI Mode
```bash
npm run test:ci
```

## Writing Tests

### Unit Tests

Test individual functions or classes in isolation:

```typescript
describe('MyFunction', () => {
  it('should do something', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = myFunction(input);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

### Integration Tests

Test multiple components working together:

```typescript
describe('Feature Integration', () => {
  it('should complete full flow', async () => {
    // Test multiple services/components together
  });
});
```

### E2E Tests

Test complete user flows (may require additional setup):

```typescript
describe('User Flow E2E', () => {
  it('should complete onboarding', async () => {
    // Test full user journey
  });
});
```

## Mock Utilities

### Using Mock Supabase

```typescript
import { createMockSupabaseClient, mockSupabaseResponse } from '../mocks/mockSupabase';

const mockSupabase = createMockSupabaseClient();
mockSupabase.auth.signUp.mockResolvedValue(
  mockSupabaseResponse.success({ user: mockUser })
);
```

### Using Mock Data

```typescript
import { mockUser, mockPartner } from '../mocks/mockData';
import { createMockUser } from '../mocks/mockUsers';

const user = createMockUser({ name: 'Custom Name' });
```

## Coverage Thresholds

The project maintains minimum coverage thresholds:
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

## Best Practices

1. **Arrange-Act-Assert**: Structure tests clearly
2. **Test one thing**: Each test should verify one behavior
3. **Use descriptive names**: Test names should describe what they test
4. **Mock external dependencies**: Don't hit real APIs or databases
5. **Clean up**: Use `beforeEach`/`afterEach` to reset state
6. **Test edge cases**: Include error cases and boundary conditions

## Troubleshooting

### Tests not running?
- Check that test files match the pattern: `*.test.ts` or `*.spec.ts`
- Verify Jest configuration in `jest.config.js`

### Mock not working?
- Ensure mocks are set up in `__tests__/setup.ts`
- Check that modules are properly mocked before import

### Coverage not generating?
- Run `npm run test:coverage`
- Check `coverage/` directory for HTML report

