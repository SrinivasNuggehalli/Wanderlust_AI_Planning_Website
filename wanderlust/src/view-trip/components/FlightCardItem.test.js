import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FlightCardItem from './FlightCardItem';
import '@testing-library/jest-dom';
describe('FlightCardItem Component', () => {
  const mockFlight = {
    airline: 'Airline Test',
    flightNumber: '1234',
    departureTime: '2023-11-14T10:00',
    arrivalTime: '2023-11-14T14:00',
    price: 300,
  };

  test('renders flight details', () => {
    render(<FlightCardItem flight={mockFlight} isSelected={false} onSelect={() => {}} />);
    expect(screen.getByText('Airline Test')).toBeInTheDocument();
    expect(screen.getByText('Flight: 1234')).toBeInTheDocument();
    expect(screen.getByText('Departure: 2023-11-14T10:00')).toBeInTheDocument();
    expect(screen.getByText('Arrival: 2023-11-14T14:00')).toBeInTheDocument();
    expect(screen.getByText('Price: $300')).toBeInTheDocument();
  });

  test('applies selected styles when isSelected is true', () => {
    const { container } = render(<FlightCardItem flight={mockFlight} isSelected={true} onSelect={() => {}} />);
    expect(container.firstChild).toHaveClass('bg-blue-50');
    expect(container.firstChild).toHaveClass('border-blue-400');
  });

  test('calls onSelect when clicked', () => {
    const onSelect = jest.fn();
    render(<FlightCardItem flight={mockFlight} isSelected={false} onSelect={onSelect} />);
    fireEvent.click(screen.getByText('Airline Test'));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});