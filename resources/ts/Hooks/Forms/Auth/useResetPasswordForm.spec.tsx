import { useForm } from '@inertiajs/inertia-react';
import { FormEvent } from 'react';
import useResetPasswordForm from 'src/Hooks/Forms/Auth/useResetPasswordForm';
import { renderHook } from '@testing-library/react';

jest.mock('@inertiajs/inertia-react');

describe('The use reset password form hook', () => {
  it('prevents the default submit handling and posts a request to the reset password endpoint when the submit handler is called', () => {
    const post = jest.fn();
    const mockUseForm = useForm as jest.Mock;
    mockUseForm.mockImplementationOnce(() => {
      return { post };
    });

    const email = 'foo@empower.local';
    const token = 'foo';

    const { result } = renderHook(() => useResetPasswordForm(email, token));

    const preventDefault = jest.fn();
    result.current.handlers.submit({ preventDefault } as unknown as FormEvent);

    expect(post).toHaveBeenCalledWith('/reset-password');
    expect(preventDefault).toHaveBeenCalled();
    expect(mockUseForm).toHaveBeenCalledWith(
      expect.objectContaining({
        email,
        token,
      })
    );
  });
});
