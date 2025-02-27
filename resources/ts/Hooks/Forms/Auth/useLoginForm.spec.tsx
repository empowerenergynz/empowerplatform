import useLoginForm from 'src/Hooks/Forms/Auth/useLoginForm';
import { useForm } from '@inertiajs/inertia-react';
import { FormEvent } from 'react';
import { renderHook } from '@testing-library/react';

jest.mock('@inertiajs/inertia-react');

describe('The use login form hook', () => {
  it('prevents the default submit handling and posts a request to the login endpoint when the submit handler is called', () => {
    const post = jest.fn();
    const mockUseForm = useForm as jest.Mock;
    mockUseForm.mockImplementationOnce(() => {
      return { post };
    });

    const { result } = renderHook(() => useLoginForm());

    const preventDefault = jest.fn();
    result.current.handlers.submit({ preventDefault } as unknown as FormEvent);

    expect(post).toHaveBeenCalledWith('/login', expect.anything());
    expect(preventDefault).toHaveBeenCalled();
  });
});
