import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { act } from '@testing-library/react-hooks';
import AppLayout from 'src/Layouts/AppLayout';
import userEvent from '@testing-library/user-event';
import useUploadFilesForm from 'src/Hooks/Forms/useUploadFilesForm';
import UploadFilesForm from 'src/Components/Forms/UploadFilesForm';

jest.mock('src/Hooks/Forms/useUploadFilesForm');
jest.mock('src/Layouts/AppLayout');

describe('The UploadFiles form', () => {
  const mockAppLayout = AppLayout as jest.Mock;
  mockAppLayout.mockImplementation(({ children }) => <div>{children}</div>);

  const filesUploadUrl = `/upload`;

  it('renders error messages for any invalid fields', () => {
    const errors = {
      files: 'file invalid',
    };

    const files = [
      new File(['hello'], 'hello.png', { type: 'image/png' }),
      new File(['there'], 'there.png', { type: 'image/png' }),
    ];

    const mockUseUploadFilesForm = useUploadFilesForm as jest.Mock;
    mockUseUploadFilesForm.mockImplementation(() => {
      return {
        formState: {
          data: {
            files,
          },
          errors,
          processing: false,
          setData: jest.fn(),
        },
        handlers: { submit: jest.fn() },
      };
    });

    render(<UploadFilesForm postUrl={filesUploadUrl} />);

    Object.values(errors).forEach((message) => {
      expect(screen.getByText(message)).toBeVisible();
    });
  });

  it('calls the submit handler when the form is submitted', () => {
    const submit = jest.fn();
    const files = [
      new File(['hello'], 'hello.png', { type: 'image/png' }),
      new File(['there'], 'there.png', { type: 'image/png' }),
    ];

    const mockUseUploadFilesForm = useUploadFilesForm as jest.Mock;
    mockUseUploadFilesForm.mockImplementation(() => {
      return {
        formState: {
          data: {
            files,
          },
          errors: {},
          processing: false,
          setData: jest.fn(),
        },
        handlers: { submit },
      };
    });

    render(<UploadFilesForm postUrl={filesUploadUrl} />);

    fireEvent.submit(screen.getByTestId('upload-files-form'));

    expect(submit).toHaveBeenCalled();
  });

  it('sets files form state when files have been uploaded', async () => {
    const setData = jest.fn();
    const mockUseUploadFilesForm = useUploadFilesForm as jest.Mock;
    mockUseUploadFilesForm.mockImplementation(() => {
      return {
        formState: {
          data: {
            files: [],
          },
          errors: {},
          processing: false,
          setData,
        },
        handlers: { submit: jest.fn() },
      };
    });

    render(<UploadFilesForm postUrl={filesUploadUrl} />);

    const files = [
      new File(['hello'], 'hello.png', { type: 'image/png' }),
      new File(['there'], 'there.png', { type: 'image/png' }),
    ];

    const input = screen.getByLabelText('Files upload');

    await act(async () => {
      await userEvent.upload(input, files);
    });

    expect(setData).toHaveBeenCalledWith('files', files);
  });
});
