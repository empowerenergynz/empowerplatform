import React from 'react';
import { render, screen } from '@testing-library/react';
import ApiRequestErrorBoundary from 'src/ErrorBoundaries/ApiRequestErrorBoundary';
import { AxiosError } from 'axios';

describe('The API request error boundary', () => {
  beforeAll(() => {
    // Quieten Jest else it gets very noisy when we're throwing errors around
    jest.spyOn(console, 'error').mockImplementation(jest.fn());
  });

  it('catches API request errors', async () => {
    const BrokenComponent = () => {
      const error = new Error('Broken') as AxiosError;
      error.isAxiosError = true;
      throw error;
    };

    render(
      <ApiRequestErrorBoundary>
        <BrokenComponent />
      </ApiRequestErrorBoundary>
    );

    expect(await screen.findByTestId('api-error')).toBeVisible();
  });
});
