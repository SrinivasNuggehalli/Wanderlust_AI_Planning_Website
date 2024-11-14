
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Flights from './Flights';

describe('Flights Component', () => {
  const mockTrip = {
    tripData: {
      flights: [
        { airline: 'Airline A', flightNumber: '1001', departureTime: '10:00', arrivalTime: '12:00', price: 200 },
        { airline: 'Airline B', flightNumber: '1002', departureTime: '13:00', arrivalTime: '15:00', price: 250 },
      ],
    },
  };

  test('renders flight recommendations', () => {
    render(<Flights trip={mockTrip} onSelectFlight={() => {}} selectedFlights={[]} />);
    expect(screen.getByText('Flight Recommendations')).toBeInTheDocument();
    expect(screen.getByText('Airline A')).toBeInTheDocument();
    expect(screen.getByText('Airline B')).toBeInTheDocument();
  });

  test('shows message when no flights are available', () => {
    render(<Flights trip={{}} onSelectFlight={() => {}} selectedFlights={[]} />);
    expect(screen.getByText('No flight recommendations available.')).toBeInTheDocument();
  });

  test('opens external links', () => {
    render(<Flights trip={{}} onSelectFlight={() => {}} selectedFlights={[]} />);
    expect(screen.getByText('Search Flights on Google')).toHaveAttribute('href', 'https://www.google.com/flights');
    expect(screen.getByText('Book with Kayak')).toHaveAttribute('href', 'https://www.kayak.com');
    expect(screen.getByText('Book with Expedia')).toHaveAttribute('href', 'https://www.expedia.com/Flights');
  });

  test('calls onSelectFlight when a flight is clicked', () => {
    const onSelectFlight = jest.fn();
    render(<Flights trip={mockTrip} onSelectFlight={onSelectFlight} selectedFlights={[]} />);
    fireEvent.click(screen.getByText('Airline A'));
    expect(onSelectFlight).toHaveBeenCalledWith(mockTrip.tripData.flights[0]);
  });
});