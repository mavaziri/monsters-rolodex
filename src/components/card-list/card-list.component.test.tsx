import { render, screen } from '@testing-library/react';

import CardList from './card-list.component';

const mockMonsters = [
  {
    id: '1',
    name: 'Monster One',
    email: 'monster1@example.com',
  },
  {
    id: '2',
    name: 'Monster Two',
    email: 'monster2@example.com',
  },
  {
    id: '3',
    name: 'Monster Three',
    email: 'monster3@example.com',
  },
];

test('renders Card List component with monsters details', () => {
  const { container } = render(<CardList monsters={mockMonsters} />);
  expect(container).toMatchSnapshot();
});
