import React from 'react';
import { screen, render } from '@testing-library/react';
import { UploadFactory } from 'src/Types/Upload';
import Attachment from 'src/Components/Attachments/Attachment';

describe('The Attachment', () => {
  it('should show the expected data for an image', () => {
    const name = 'Foo';
    const upload = UploadFactory.build({
      name,
      mime_type: 'image/jpeg',
    });

    render(<Attachment upload={upload} />);

    expect(screen.getByText(name)).toBeVisible();
    // get the image from the alt property
    expect(screen.getByAltText(name)).toBeVisible();
  });

  it('should show the expected data for a document', () => {
    const name = 'Foo';
    const upload = UploadFactory.build({
      name,
      mime_type: 'application/pdf',
      can_be_deleted: true,
    });

    render(<Attachment upload={upload} />);

    expect(screen.getByText(name)).toBeVisible();
    // get the icon from the svg's title
    expect(screen.getByLabelText('pdf')).toBeVisible();
    // show the delete icon
    expect(screen.getByTestId('delete-attachment')).toBeInTheDocument();
  });

  it('should not show the delete icon when users can not delete an attachment', () => {
    const name = 'Foo';
    const upload = UploadFactory.build({
      name,
      mime_type: 'image/jpeg',
      can_be_deleted: false,
    });

    render(<Attachment upload={upload} />);

    expect(screen.getByAltText(name)).toBeVisible();
  });
});
