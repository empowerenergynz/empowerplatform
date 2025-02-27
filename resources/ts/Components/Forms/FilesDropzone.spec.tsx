import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import FilesDropzone from 'src/Components/Forms/FilesDropzone';
import { act } from '@testing-library/react-hooks';

describe('The FilesDropzone component', () => {
  it('should call onDrop when files are being uploaded', async function () {
    const onDrop = jest.fn();
    const onRemove = jest.fn();
    const files: File[] = [];

    const filesToUpload = [
      new File(['hello'], 'hello.png', { type: 'image/png' }),
      new File(['there'], 'there.png', { type: 'image/png' }),
    ];

    render(<FilesDropzone onDrop={onDrop} onRemove={onRemove} files={files} />);

    const input = screen.getByLabelText('Files upload');

    await act(async () => {
      await userEvent.upload(input, filesToUpload);
    });

    expect(onDrop).toHaveBeenCalled();
  });

  it('should call onRemove when a file is being removed', async function () {
    const onDrop = jest.fn();
    const onRemove = jest.fn();
    const filesUploaded = [
      new File(['hello'], 'hello.png', { type: 'image/png' }),
      new File(['there'], 'there.png', { type: 'image/png' }),
    ];

    render(
      <FilesDropzone
        onDrop={onDrop}
        onRemove={onRemove}
        files={filesUploaded}
      />
    );

    const removeButton = screen.getAllByLabelText('Remove file')[1];
    removeButton.click();

    expect(onRemove).toHaveBeenCalledWith(1);
  });
});
