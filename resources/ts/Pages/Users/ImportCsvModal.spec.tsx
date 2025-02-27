import { act, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { Inertia } from '@inertiajs/inertia';
import ImportCsvModal from 'src/Pages/Users/ImportCsvModal';

// eslint-disable-next-line @typescript-eslint/no-empty-function
let onSuccess = () => {};

jest.mock('@inertiajs/inertia', () => ({
  ...jest.requireActual('@inertiajs/inertia'),
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Inertia: {
    post: jest.fn((url, data, options) => {
      onSuccess = options.onSuccess;
    }),
  },
}));

describe('The import donors modal', () => {
  beforeEach(() => jest.clearAllMocks());

  const onClose = jest.fn();

  const renderAndWaitToOpen = async () => {
    render(
      <ImportCsvModal
        onClose={onClose}
        endpoint="/users/import-donors"
        title="Import Donors"
      />
    );
    await waitFor(() =>
      expect(screen.queryByTestId('modal-title')).toBeVisible()
    );
  };

  it('renders modal', async () => {
    await renderAndWaitToOpen();

    expect(screen.getByTestId('modal-title')).toHaveTextContent(
      'Import Donors'
    );
    expect(screen.getByLabelText('CSV File*')).toHaveValue('');
    expect(screen.getByText('Cancel')).toBeVisible();
    expect(screen.getByText('Import')).toBeVisible();
  });

  it('posts the data to the expected endpoint and calls the onClose callback', async () => {
    const file = new File(['Content'], 'import.csv', { type: 'test/csv' });

    await renderAndWaitToOpen();
    await userEvent.upload(screen.getByLabelText('CSV File*'), file);
    await userEvent.click(screen.getByText('Import'));

    expect(Inertia.post).toHaveBeenCalledWith(
      '/users/import-donors',
      {
        csv: file,
      },
      expect.anything()
    );

    expect(onClose).not.toHaveBeenCalled();

    // call the success function
    await act(() => onSuccess());
    expect(onClose).toHaveBeenCalled();
  });

  it('allows the user to click Cancel to close the modal', async () => {
    await renderAndWaitToOpen();
    expect(onClose).not.toHaveBeenCalled();
    await userEvent.click(screen.getByText('Cancel'));

    expect(onClose).toHaveBeenCalled();
  });

  it('renders error messages for an invalid field', async () => {
    const file = new File(['Content'], 'import.csv', { type: 'test/csv' });
    const errors = {
      csv: 'csv invalid',
    };

    const mockInertiaPost = Inertia.post as jest.Mock;
    mockInertiaPost.mockImplementationOnce((url, data, { onError }) => {
      onError(errors);
    });

    await renderAndWaitToOpen();

    await userEvent.upload(screen.getByLabelText('CSV File*'), file);

    expect(screen.getByText('Import')).toBeEnabled();
    await userEvent.click(screen.getByText('Import'));

    Object.values(errors).forEach((message) => {
      expect(screen.getByText(message)).toBeVisible();
    });
  });
});
