import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import App, { Monster } from './App';
import { error } from 'console';

const mockMonsters: Monster[] = [
  { id: '1', name: 'Monster One', email: 'monster1@example.com' },
  { id: '2', name: 'Monster Two', email: 'monster2@example.com' },
  { id: '3', name: 'Monster Three', email: 'monster3@example.com' },
];

jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQuery: jest.fn(),
}));

// Create a function to return a new query client for each test
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retries to simplify testing
      },
    },
  });

export const renderWithQueryClient = (ui: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

describe('App Component', () => {
  // beforeEach(() => {
  //   jest.clearAllMocks(); // Reset mocks before each test
  // });
  beforeEach(() => {
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined, // No monsters initially
      isLoading: false, // Not in loading state
      error: null, // No error
    });
  });

  test('expect to render App component', () => {
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });

  test('displays loading state when data is being fetched', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    renderWithQueryClient(<App />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('displays error message when data fetching fails', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Network error'), // Simulate error
    });

    renderWithQueryClient(<App />);

    expect(screen.getByText('Error loading monsters')).toBeInTheDocument();
  });

  test('displays the list of monsters after data is loaded', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: mockMonsters,
      isLoading: false,
      error: null,
    });

    renderWithQueryClient(<App />);

    await waitFor(() => {
      expect(screen.getByText('Monster One')).toBeInTheDocument();
      expect(screen.getByText('Monster Two')).toBeInTheDocument();
      expect(screen.getByText('Monster Three')).toBeInTheDocument();
    });
  });

  test('displays filtered monsters based on search fields', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: mockMonsters,
      isLoading: false,
      error: null,
    });

    renderWithQueryClient(<App />);

    // Simulate typing "One" in the search box
    const searchBox = screen.getByPlaceholderText('search monsters');
    fireEvent.change(searchBox, { target: { value: 'One' } });

    // Wait for filtered results
    await waitFor(() => {
      expect(screen.getByText('Monster One')).toBeInTheDocument();
      expect(screen.queryByText('Monster Two')).not.toBeInTheDocument();
      expect(screen.queryByText('Monster Three')).not.toBeInTheDocument();
      //or
      // expect(screen.queryByText('Monster Two')).toBeNull();
      // expect(screen.queryByText('Monster Three')).toBeNull();
    });
  });

  test('displays no monsters when search query has no matches', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: mockMonsters,
      isLoading: false,
      error: null,
    });

    renderWithQueryClient(<App />);

    // Simulate typing a query that doesn't match any monster
    const searchBox = screen.getByPlaceholderText('search monsters');
    fireEvent.change(searchBox, { target: { value: 'NonExistent' } });

    await waitFor(() => {
      // Assert no monsters are shown
      expect(screen.queryByText('Monster One')).not.toBeInTheDocument();
      expect(screen.queryByText('Monster Two')).not.toBeInTheDocument();
      expect(screen.queryByText('Monster Three')).not.toBeInTheDocument();
    });
  });

  // test('displays retry button on error and reloads data when clicked', async () => {
  //   (useQuery as jest.Mock).mockReturnValue({
  //     data: undefined,
  //     isLoading: false,
  //     error: null,
  //   });

  //   renderWithQueryClient(<App />);

  //   // Verify error message is displayed
  //   expect(screen.getByText('Error loading monsters')).toBeInTheDocument();

  //   // Simulate clicking retry (assuming a retry button exists)
  //   fireEvent.click(screen.getByText('Retry'));

  //   // Mock successful data loading
  //   (useQuery as jest.Mock).mockReturnValue({
  //     data: mockMonsters,
  //     isLoading: false,
  //     error: null,
  //   });

  //   await waitFor(() => {
  //     expect(screen.getByText('Monster One')).toBeInTheDocument();
  //     expect(screen.getByText('Monster Two')).toBeInTheDocument();
  //     expect(screen.getByText('Monster Three')).toBeInTheDocument();
  //   });
  // });

  test('does not display search box or monsters while loading', () => {
    // Mock the loading state for this specific test
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    renderWithQueryClient(<App />);

    // Assert that the loading message is displayed
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Assert that the search box and monster list are not rendered
    expect(
      screen.queryByPlaceholderText('search monsters')
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Monster One')).not.toBeInTheDocument();
    expect(screen.queryByText('Monster Two')).not.toBeInTheDocument();
    expect(screen.queryByText('Monster Three')).not.toBeInTheDocument();
  });

  test('initial render has empty search field and no monsters displayed', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    });

    renderWithQueryClient(<App />);

    // Assert that the search box is present and empty
    const searchBox = screen.getByPlaceholderText('search monsters');
    expect(searchBox).toBeInTheDocument();
    expect(searchBox).toHaveValue('');

    // Assert that no monsters are displayed
    expect(screen.queryByText('Monster One')).not.toBeInTheDocument();
    expect(screen.queryByText('Monster Two')).not.toBeInTheDocument();
  });
});
