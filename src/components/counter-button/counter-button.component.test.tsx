import { fireEvent, render, screen } from '@testing-library/react';

import CounterButton from './counter-button.component';

describe('CounterButton Component', () => {
  test('expect to render CounterButton component', () => {
    const { container } = render(<CounterButton />);
    expect(container).toMatchSnapshot();
  });

  test('correctly increment the counter', () => {
    render(<CounterButton />);

    // Get the button and counter display
    const button = screen.getByRole('button', { name: /increment/i });
    const counterText = screen.getByText(/count/i);

    // Initial state
    expect(counterText).toHaveTextContent('Count: 0');

    // Simulate a click on the button
    fireEvent.click(button);

    // Verify that the count has incremented
    expect(counterText).toHaveTextContent('Count: 1');
  });
});
