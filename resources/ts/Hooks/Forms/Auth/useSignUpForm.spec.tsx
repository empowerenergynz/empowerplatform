import useSignUpForm from 'src/Hooks/Forms/Auth/useSignUpForm';
import { useForm } from '@inertiajs/inertia-react';
import { FormEvent } from 'react';
import { UserFactory } from 'src/Types/User';
import { renderHook } from '@testing-library/react';

jest.mock('@inertiajs/inertia-react');

describe('The use signup form hook', () => {
  it('prevents the default submit handling and posts a request to the signup endpoint when the submit handler is called', () => {
    const post = jest.fn();
    const mockUseForm = useForm as jest.Mock;
    mockUseForm.mockImplementationOnce(() => {
      return { post };
    });

    const user = UserFactory.build();

    const { result } = renderHook(() => useSignUpForm(user, 'foo'));

    const preventDefault = jest.fn();
    result.current.handlers.submit({ preventDefault } as unknown as FormEvent);

    expect(post).toHaveBeenCalledWith('/sign-up');
    expect(preventDefault).toHaveBeenCalled();
    expect(mockUseForm).toHaveBeenCalledWith(
      expect.objectContaining({
        email: user.email,
        phone_number: user.phone_number,
        token: 'foo',
      })
    );
  });
});
