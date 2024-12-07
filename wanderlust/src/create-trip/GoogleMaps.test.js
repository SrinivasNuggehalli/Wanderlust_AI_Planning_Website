import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CreateTrip from './CreateTrip';
import { useLoadScript } from '@react-google-maps/api';

// Mock useLoadScript
jest.mock('@react-google-maps/api', () => ({
  ...jest.requireActual('@react-google-maps/api'),
  useLoadScript: jest.fn(),
  GoogleMap: jest.fn(({ children }) => <div data-testid="google-map">{children}</div>),
  Marker: jest.fn(({ position }) => (
    <div data-testid="google-marker" data-lat={position.lat} data-lng={position.lng}></div>
  )),
}));

describe('CreateTrip Component - Google Maps', () => {
  beforeEach(() => {
    useLoadScript.mockReturnValue({ isLoaded: true });
  });

  test('renders the Google Map component', () => {
    render(<CreateTrip />);
    const map = screen.getByTestId('google-map');
    expect(map).toBeInTheDocument();
  });

  test('renders a marker at the default position', () => {
    render(<CreateTrip />);
    const marker = screen.getByTestId('google-marker');
    expect(marker).toHaveAttribute('data-lat', '37.7749'); // Default latitude
    expect(marker).toHaveAttribute('data-lng', '-122.4194'); // Default longitude
  });

  test('updates the marker position when the location changes', async () => {
    render(<CreateTrip />);
    const marker = screen.getByTestId('google-marker');

    // Simulate user action to update location
    const updatedLat = 40.7128; // Example new latitude
    const updatedLng = -74.0060; // Example new longitude

    // Mock new location
    expect(marker).toHaveAttribute('data-lat', updatedLat.toString());
    expect(marker).toHaveAttribute('data-lng', updatedLng.toString());
  });
});