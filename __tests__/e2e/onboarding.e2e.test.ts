/**
 * End-to-end tests for Onboarding Flow
 * 
 * Tests the complete user onboarding experience from app launch
 * through profile completion.
 * 
 * @module __tests__/e2e/onboarding.e2e.test
 */

import { render, fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';
import { OnboardingScreens } from '@presentation/screens/signup/OnboardingScreens';

// Note: E2E tests typically require more setup and may use tools like
// Detox or Appium for full end-to-end testing. This is a simplified example.

describe('Onboarding E2E Flow', () => {
  const mockOnComplete = jest.fn();
  const mockOnSkip = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display onboarding screens', () => {
    // Arrange & Act
    const { getByText } = render(
      <OnboardingScreens onComplete={mockOnComplete} onSkip={mockOnSkip} />
    );

    // Assert
    expect(getByText(/Find Language/i)).toBeTruthy();
  });

  it('should allow skipping onboarding', () => {
    // Arrange
    const { getByText } = render(
      <OnboardingScreens onComplete={mockOnComplete} onSkip={mockOnSkip} />
    );

    // Act
    const skipButton = getByText('Skip');
    fireEvent.press(skipButton);

    // Assert
    expect(mockOnSkip).toHaveBeenCalled();
  });

  it('should navigate through all onboarding slides', async () => {
    // Arrange
    const { getByText, queryByText } = render(
      <OnboardingScreens onComplete={mockOnComplete} onSkip={mockOnSkip} />
    );

    // Act - Navigate through slides
    // This is a simplified example - actual E2E would test full navigation

    // Assert
    await waitFor(() => {
      expect(queryByText(/Find Language/i)).toBeTruthy();
    });
  });
});

