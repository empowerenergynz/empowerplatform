import React from 'react';
import { screen, render } from '@testing-library/react';
import { UploadFactory } from 'src/Types/Upload';
import AttachmentsGallery from 'src/Components/Attachments/AttachmentsGallery';
import userEvent from '@testing-library/user-event';

describe('The Attachments Gallery', () => {
  const attachments = [
    UploadFactory.build({
      name: 'Image',
      mime_type: 'image/jpeg',
    }),
    UploadFactory.build({
      name: 'PDF',
      mime_type: 'application/pdf',
    }),
    UploadFactory.build({
      name: 'Word',
      mime_type: 'application/msword',
    }),
  ];

  it('should open the lightbox after clicking on an image', async () => {
    render(<AttachmentsGallery attachments={attachments} />);

    const image = await screen.findByAltText('Image');
    await userEvent.click(image);

    expect(document.body).toHaveClass('ReactModal__Body--open');
  });

  it('should open a new tab after clicking on a document', async () => {
    global.open = jest.fn();

    render(<AttachmentsGallery attachments={attachments} />);

    const pdf = await screen.findByLabelText('pdf');
    await userEvent.click(pdf);

    expect(document.body).not.toHaveClass('ReactModal__Body--open');
    expect(global.open).toHaveBeenCalled();
  });
});
