import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import ErrorMessage from './index';

describe('ErrorMessage Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders the provided message successfully', () => {
    render(<ErrorMessage message="Invalid Email Address" />);

    const messageElement = screen.getByText(/invalid email address/i);
    expect(messageElement).toBeInTheDocument();
  });

  it('merges custom className payloads properly via cn wrapper', () => {
    render(<ErrorMessage message="Custom Style Message" className="translate-y-full" />);

    const messageElement = screen.getByText(/custom style message/i);
    expect(messageElement.className).toContain('translate-y-full');
    expect(messageElement.className).toContain('text-red-600'); 
  });
});
