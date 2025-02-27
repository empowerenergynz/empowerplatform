import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CollapsibleContainer from 'src/Components/Common/CollapsibleContainer';

// remove 'window.scrollTo not implemented' warnings from test logs
jest.spyOn(window, 'scrollTo').mockImplementation(jest.fn());

describe('The collapsible container component', () => {
  it('hides its children by default', async () => {
    const child = <span>Hideme</span>;
    const label = 'My Label';

    render(<CollapsibleContainer label={label}>{child}</CollapsibleContainer>);
    expect(screen.getByText('Hideme')).not.toBeVisible();
    expect(screen.getByText(label)).toBeVisible();
  });

  it('shows its children when specified', async () => {
    const child = <span>Showme</span>;
    const label = 'My Label';

    render(
      <CollapsibleContainer defaultOpen={true} label={label}>
        {child}
      </CollapsibleContainer>
    );
    expect(screen.getByText('Showme')).toBeVisible();
  });

  it('expands and collapses', async () => {
    const child = <span>Showme</span>;
    const label = 'My Label';

    render(<CollapsibleContainer label={label}>{child}</CollapsibleContainer>);
    expect(screen.getByText('Showme')).not.toBeVisible();

    const toggleButton = await screen.findByRole('button');

    fireEvent.click(toggleButton);
    await waitFor(() => {
      expect(screen.getByText('Showme')).toBeVisible();
    });

    fireEvent.click(toggleButton);
    await waitFor(() => {
      expect(screen.getByText('Showme')).not.toBeVisible();
    });
  });
});
