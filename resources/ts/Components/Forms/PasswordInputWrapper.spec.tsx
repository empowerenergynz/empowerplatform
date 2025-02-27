import React from 'react';
import { render, screen } from '@testing-library/react';
import PasswordInputWrapper from 'src/Components/Forms/PasswordInputWrapper';
import userEvent from '@testing-library/user-event';

describe('The PasswordInputWrapper component', () => {
  it('shows / hide the password', async () => {
    const onChange = jest.fn();
    const input = (
      <input
        data-testid="input-el"
        type="password"
        name="password"
        value="hello"
        onChange={onChange}
      />
    );
    render(<PasswordInputWrapper>{input}</PasswordInputWrapper>);

    const showButton = screen.getByRole('button', { name: 'Show' });

    expect(showButton).toBeVisible();
    expect(screen.getByTestId('input-el')).toHaveAttribute('type', 'password');

    await userEvent.click(showButton);

    expect(screen.queryByRole('button', { name: 'Show' })).toBeNull();

    expect(screen.getByRole('button', { name: 'Hide' })).toBeVisible();
    expect(screen.getByTestId('input-el')).toHaveAttribute('type', 'text');
  });
});
