import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { jsPDF } from 'jspdf';
import BookingAndDownload from './BookingAndDownload';
import '@testing-library/jest-dom'; // Import for toBeInTheDocument

// Mock jsPDF so it doesn't actually try to create and download a PDF
jest.mock('jspdf', () => {
  return {
    jsPDF: jest.fn().mockImplementation(() => ({
      setFontSize: jest.fn(),
      text: jest.fn(),  // Ensure text method is mocked
      save: jest.fn(),   // Ensure save method is mocked
    })),
  };
});

describe('BookingAndDownload Component', () => {
  const mockSelectedHotels = [
    { hotelName: 'Hotel ABC', hotelAddress: '123 Street, City' },
  ];
  const mockSelectedPlaces = [
    { placeName: 'Place X', placeDetails: 'Historic Site' },
  ];
  const mockSelectedFlights = [
    { airline: 'Airline Y', flightNumber: 'XY123', departureTime: '10:00 AM' },
  ];
  const mockSelectedPackages = [
    { packageName: 'Package 1', budget: 500, description: 'Package details' },
  ];

  // Test 1: Check if the component renders correctly
  test('renders correctly', () => {
    render(
      <BookingAndDownload
        selectedHotels={mockSelectedHotels}
        selectedPlaces={mockSelectedPlaces}
        selectedFlights={mockSelectedFlights}
        selectedPackages={mockSelectedPackages}
      />
    );
    // Check if the button is rendered
    expect(screen.getByText('Download Itinerary as PDF')).toBeInTheDocument();
  });



  // Test 2: Ensure alert is shown when no items are selected
  test('displays alert if no items are selected', () => {
    global.alert = jest.fn(); // Mock alert

    render(
      <BookingAndDownload
        selectedHotels={[]}
        selectedPlaces={[]}
        selectedFlights={[]}
        selectedPackages={[]}
      />
    );

    // Fire click event on the button
    fireEvent.click(screen.getByText('Download Itinerary as PDF'));

    // Check if alert was called
    expect(global.alert).toHaveBeenCalledWith('No items selected to export.');
  });


});