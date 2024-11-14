import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MyTrips from './MyTrips';
import { db } from '@/service/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import '@testing-library/jest-dom';

// Mock Firebase and Navigation dependencies
jest.mock('firebase/firestore');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mock localStorage
global.localStorage = {
  getItem: jest.fn(),
};

describe('MyTrips Component', () => {
  beforeEach(() => {
    localStorage.getItem.mockReturnValue(JSON.stringify({ email: 'test@example.com' }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render loading state initially', async () => {
    getDocs.mockResolvedValueOnce({
      docs: [],
    });
    
    render(
      <MemoryRouter>
        <MyTrips />
      </MemoryRouter>
    );

    // Check that loading skeletons are displayed
    expect(screen.getAllByRole('loading-skeleton')).toHaveLength(6);
  });

  test('should display trips fetched from Firebase', async () => {
    const mockTrips = [
      { id: '1', title: 'Trip to Paris' },
      { id: '2', title: 'Trip to Tokyo' },
    ];

    getDocs.mockResolvedValueOnce({
      docs: mockTrips.map(trip => ({ id: trip.id, data: () => trip })),
    });

    render(
      <MemoryRouter>
        <MyTrips />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Trip to Paris')).toBeInTheDocument();
      expect(screen.getByText('Trip to Tokyo')).toBeInTheDocument();
    });
  });

  test('should display "No trips found" when there are no trips', async () => {
    getDocs.mockResolvedValueOnce({ docs: [] });

    render(
      <MemoryRouter>
        <MyTrips />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No trips found. Create your first trip!')).toBeInTheDocument();
    });
  });

  test('should display feedback section on scroll to bottom', async () => {
    getDocs.mockResolvedValueOnce({ docs: [] });

    render(
      <MemoryRouter>
        <MyTrips />
      </MemoryRouter>
    );

    fireEvent.scroll(window, { target: { scrollY: 1000 } });

    await waitFor(() => {
      expect(screen.getByText('Share Your Experience')).toBeInTheDocument();
    });
  });
});
