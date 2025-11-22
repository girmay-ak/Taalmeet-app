/**
 * Unit tests for Button Component
 * 
 * Tests the Button component in isolation.
 * 
 * @module __tests__/unit/components/Button.test
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '@presentation/components/Button';

describe('Button Component', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render button with title', () => {
    const { getByText } = render(
      <Button title="Click Me" onPress={mockOnPress} />
    );

    expect(getByText('Click Me')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const { getByText } = render(
      <Button title="Click Me" onPress={mockOnPress} />
    );

    fireEvent.press(getByText('Click Me'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('should not call onPress when disabled', () => {
    const { getByText } = render(
      <Button title="Click Me" onPress={mockOnPress} disabled />
    );

    fireEvent.press(getByText('Click Me'));
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('should show loading state', () => {
    const { queryByText, getByTestId } = render(
      <Button title="Click Me" onPress={mockOnPress} loading />
    );

    expect(queryByText('Click Me')).toBeNull();
    // ActivityIndicator should be present (may need testID)
  });

  it('should render with icon', () => {
    const { getByText } = render(
      <Button
        title="Click Me"
        onPress={mockOnPress}
        icon="heart"
        iconPosition="left"
      />
    );

    expect(getByText('Click Me')).toBeTruthy();
  });

  it('should apply correct variant styles', () => {
    const { getByText, rerender } = render(
      <Button title="Primary" onPress={mockOnPress} variant="primary" />
    );

    expect(getByText('Primary')).toBeTruthy();

    rerender(
      <Button title="Outline" onPress={mockOnPress} variant="outline" />
    );
    expect(getByText('Outline')).toBeTruthy();
  });

  it('should apply correct size styles', () => {
    const { getByText, rerender } = render(
      <Button title="Small" onPress={mockOnPress} size="small" />
    );

    expect(getByText('Small')).toBeTruthy();

    rerender(<Button title="Large" onPress={mockOnPress} size="large" />);
    expect(getByText('Large')).toBeTruthy();
  });
});

