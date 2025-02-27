import { useForm } from '@inertiajs/inertia-react';
import { FormEvent } from 'react';
import useForgotPasswordForm from 'src/Hooks/Forms/Auth/useForgotPasswordForm';
import { renderHook } from '@testing-library/react';

jest.mock('@inertiajs/inertia-react');

describe('The use forgot password form hook', () => {
  it('prevents the default submit handling and posts a request to the forgot password endpoint when the submit handler is called', () => {
    const post = jest.fn();
    const mockUseForm = useForm as jest.Mock;
    mockUseForm.mockImplementationOnce(() => {
      return { post };
    });

    const { result } = renderHook(() => useForgotPasswordForm());

    const preventDefault = jest.fn();
    result.current.handlers.submit({ preventDefault } as unknown as FormEvent);

    expect(post).toHaveBeenCalledWith('/forgot-password');
    expect(preventDefault).toHaveBeenCalled();
  });
});
