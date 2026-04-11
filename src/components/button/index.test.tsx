import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BUTTON_KIND, BUTTON_TYPE } from '@/constants';
import Button from './index';

describe('Button Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders a primary button with specified text', () => {
    render(<Button type={BUTTON_KIND.PRIMARY} text="Click Me" />);

    const buttonElement = screen.getByRole('button', { name: /click me/i });
    expect(buttonElement).toBeInTheDocument();

    // As per your primary component structure it applies `bg-primary` base style
    expect(buttonElement.className).toContain('bg-primary');
  });

  it('handles click events natively', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button type={BUTTON_KIND.PRIMARY} text="Submit" onClick={handleClick} />);

    const buttonElement = screen.getByRole('button', { name: /submit/i });
    await user.click(buttonElement);

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('disables the button properly when isLoading is passed', () => {
    render(<Button type={BUTTON_KIND.PRIMARY} text="Loading State" isLoading={true} />);

    const buttonElement = screen.getByRole('button', { name: /loading state/i });
    expect(buttonElement).toBeDisabled();

    // Your cn conditional logic checks for isLoading or disabled
    expect(buttonElement.className).toContain('cursor-auto');
    expect(buttonElement.className).toContain('bg-slate-300');
  });

  it('disables the button properly when disabled prop is active', () => {
    render(<Button type={BUTTON_KIND.PRIMARY} text="Disabled State" disabled={true} />);

    const buttonElement = screen.getByRole('button', { name: /disabled state/i });
    expect(buttonElement).toBeDisabled();
  });

  it('sets the HTML native button type appropriately', () => {
    render(
      <Button type={BUTTON_KIND.PRIMARY} text="Form Submit" buttonType={BUTTON_TYPE.SUBMIT} />,
    );

    const buttonElement = screen.getByRole('button', { name: /form submit/i });
    expect(buttonElement).toHaveAttribute('type', 'submit');
  });
});
