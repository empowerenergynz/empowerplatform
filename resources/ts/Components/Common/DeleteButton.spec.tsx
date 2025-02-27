/* eslint-disable @typescript-eslint/no-empty-function */
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import DeleteButton from 'src/Components/Common/DeleteButton';

describe('The DeleteButton component', () => {
  it('displays and closes the modal with default text', async () => {
    const mockCallback = jest.fn();

    render(
      <DeleteButton
        title="This is the title"
        message="This is the message"
        onConfirm={mockCallback}
      />
    );
    const deleteButton = await screen.findByTestId('delete-btn');
    await userEvent.click(deleteButton);

    const modal = await screen.findByTestId('delete-modal');
    expect(modal).toHaveTextContent('This is the title');
    expect(modal).toHaveTextContent('This is the message');
    expect(modal).toHaveTextContent('Delete');
    expect(modal).toHaveTextContent('Cancel');

    const cancelButton = await screen.findByTestId('delete-cancel-btn');
    await userEvent.click(cancelButton);

    await waitForElementToBeRemoved(() => screen.queryByTestId('delete-modal'));

    expect(mockCallback).toHaveBeenCalledTimes(0);
  });

  it('calls the onConfirm callback', async () => {
    const mockCallback = jest.fn();

    render(<DeleteButton title="" message="" onConfirm={mockCallback} />);

    const deleteButton = await screen.findByTestId('delete-btn');
    await userEvent.click(deleteButton);

    const confirmButton = await screen.findByTestId('delete-confirm-btn');
    expect(confirmButton).not.toHaveAttribute('data-loading');
    await userEvent.click(confirmButton);

    expect(confirmButton).toHaveAttribute('data-loading');
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('uses the custom button text in both buttons', async () => {
    const mockCallback = jest.fn();

    render(
      <DeleteButton
        title="This is the title"
        message="This is the message"
        buttonText="Custom Button"
        onConfirm={mockCallback}
      />
    );
    const deleteButton = await screen.findByTestId('delete-btn');
    expect(deleteButton).toHaveTextContent('Custom Button');
    await userEvent.click(deleteButton);

    expect(await screen.findByTestId('delete-confirm-btn')).toHaveTextContent(
      'Custom Button'
    );
  });

  it('uses all custom button texts', async () => {
    const mockCallback = jest.fn();

    render(
      <DeleteButton
        title="This is the title"
        message="This is the message"
        buttonText="Custom Button"
        confirmButtonText="Confirm Button"
        cancelButtonText="Cancel Button"
        onConfirm={mockCallback}
      />
    );
    const deleteButton = await screen.findByTestId('delete-btn');
    expect(deleteButton).toHaveTextContent('Custom Button');
    await userEvent.click(deleteButton);

    expect(await screen.findByTestId('delete-confirm-btn')).toHaveTextContent(
      'Confirm Button'
    );
    expect(await screen.findByTestId('delete-cancel-btn')).toHaveTextContent(
      'Cancel Button'
    );
  });

  it('uses custom disclosure if provided', async () => {
    const mockCallback = jest.fn();

    const myDisclosure = {
      isOpen: false,
      onOpen: jest.fn(),
      onClose: () => {},
      onToggle: () => {},
      isControlled: false,
      getDisclosureProps: () => {},
      getButtonProps: () => {},
    };

    render(
      <DeleteButton
        title="This is the title"
        message="This is the message"
        onConfirm={mockCallback}
        disclosure={myDisclosure}
      />
    );

    await userEvent.click(await screen.findByTestId('delete-btn'));
    expect(myDisclosure.onOpen).toHaveBeenCalled();
  });
});
