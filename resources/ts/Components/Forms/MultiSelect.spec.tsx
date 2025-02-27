import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MultiSelect from 'src/Components/Forms/MultiSelect';

describe('The multi select component', () => {
  it('renders the name of the select component', async () => {
    const name = 'Foo';
    render(<MultiSelect name={name} items={[]} onChange={jest.fn()} />);
    expect(await screen.findByRole('button', { name })).toBeVisible();
  });

  it('displays the values of all provided options', async () => {
    const options: [string, string][] = [
      ['0', 'foo'],
      ['1', 'bar'],
      ['2', 'baz'],
    ];

    const name = 'Select';
    render(<MultiSelect name={name} items={options} onChange={jest.fn()} />);
    const toggle = await screen.findByRole('button', { name });
    await userEvent.click(toggle);

    for (const option of options) {
      expect(await screen.findByText(option[1])).toBeInTheDocument();
    }
  });

  it('notifies the parent when an option is added to or removed from the selection', async () => {
    const options: [string, string][] = [
      ['0', 'foo'],
      ['1', 'bar'],
      ['2', 'baz'],
    ];

    const name = 'Select';
    const onChange = jest.fn();
    render(<MultiSelect name={name} items={options} onChange={onChange} />);
    const toggle = await screen.findByRole('button', { name });
    await userEvent.click(toggle);

    await userEvent.click(await screen.findByText(options[0][1]));

    expect(onChange).toHaveBeenCalledWith([options[0][0]]);

    await userEvent.click(await screen.findByText(options[1][1]));

    expect(onChange).toHaveBeenCalledWith([options[0][0], options[1][0]]);

    await userEvent.click(await screen.findByText(options[0][1]));

    expect(onChange).toHaveBeenCalledWith([options[1][0]]);
  });

  it('displays the count of selected options', async () => {
    const options: [string, string][] = [
      ['0', 'foo'],
      ['1', 'bar'],
      ['2', 'baz'],
    ];

    const name = 'Select';
    const onChange = jest.fn();
    render(<MultiSelect name={name} items={options} onChange={onChange} />);
    const toggle = await screen.findByRole('button', { name });
    await userEvent.click(toggle);

    const firstOption = await screen.findByText(options[0][1]);
    await userEvent.click(firstOption);

    const thirdOption = await screen.findByText(options[2][1]);
    await userEvent.click(thirdOption);

    const updatedButton = await screen.findByRole('button', {
      name: `${name} 2`,
    });
    expect(updatedButton).toBeVisible();
  });

  it('checks the checkboxes for the default values', async () => {
    const options: [string, string][] = [
      ['0', 'foo'],
      ['1', 'bar'],
      ['2', 'baz'],
    ];

    const defaultValues = ['0', '2'];

    const name = 'Select';
    const onChange = jest.fn();
    render(
      <MultiSelect
        name={name}
        items={options}
        onChange={onChange}
        selectedOptions={defaultValues}
      />
    );

    const firstOption = await screen.findByText(options[0][1]);
    expect(firstOption.closest('button')?.getAttribute('aria-checked')).toBe(
      'true'
    );

    const thirdOption = await screen.findByText(options[2][1]);
    expect(thirdOption.closest('button')?.getAttribute('aria-checked')).toBe(
      'true'
    );

    const toggle = await screen.findByRole('button', {
      name: `${name} 2`,
    });
    expect(toggle).toBeVisible();
  });
});
