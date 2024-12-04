// Card.component.test.tsx
import { render, screen } from '@testing-library/react';

import Card from './card.component';

const mockMonster = {
  id: '1',
  name: 'Monster One',
  email: 'monster1@example.com',
};

describe('Card Component', () => {
  test('renders the monster name', () => {
    render(<Card monster={mockMonster} />);

    expect(screen.getByText('Monster One')).toBeInTheDocument();
  });

  test('renders the monster email', () => {
    render(<Card monster={mockMonster} />);

    expect(screen.getByText('monster1@example.com')).toBeInTheDocument();
  });

  test('renders the monster image', () => {
    render(<Card monster={mockMonster} />);

    const imgElement = screen.getByRole('img', { name: /monster/i });
    expect(imgElement).toHaveAttribute(
      'src',
      'https://robohash.org/1?set=set2&size=180x180'
    );
  });
});
