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
      text: jest.fn(),
      setFillColor: jest.fn(),
      rect: jest.fn(),
      line: jest.fn(),
      roundedRect: jest.fn(),
      setDrawColor: jest.fn(),
      setLineWidth: jest.fn(), // Added this to mock `setLineWidth`
      save: jest.fn(),
      setTextColor: jest.fn(),
      setFont: jest.fn(),
      internal: {
        pageSize: {
          width: 210,
          height: 297,
        },
        getNumberOfPages: jest.fn().mockReturnValue(1),
      },
      setPage: jest.fn(),
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
    expect(screen.getByText('Download Itinerary PDF')).toBeInTheDocument();
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
    fireEvent.click(screen.getByText('Download Itinerary PDF'));


    // Check if alert was called
    expect(global.alert).toHaveBeenCalledWith('No items selected to export.');
  });


  // Test 3: Ensure jsPDF methods are called when items are selected
  test('calls jsPDF methods when exporting PDF', () => {
    render(
      <BookingAndDownload
        selectedHotels={mockSelectedHotels}
        selectedPlaces={mockSelectedPlaces}
        selectedFlights={mockSelectedFlights}
        selectedPackages={mockSelectedPackages}
      />
    );


    // Fire click event on the button
    fireEvent.click(screen.getByText('Download Itinerary PDF'));


    // Check if jsPDF methods are called
    expect(jsPDF).toHaveBeenCalled();
    const mockPDFInstance = jsPDF.mock.results[0].value;


    // Verify key jsPDF method calls
    expect(mockPDFInstance.setFontSize).toHaveBeenCalled();
    expect(mockPDFInstance.setDrawColor).toHaveBeenCalled();
    expect(mockPDFInstance.setLineWidth).toHaveBeenCalled(); // Verify `setLineWidth` is called
    expect(mockPDFInstance.setFillColor).toHaveBeenCalled();
    expect(mockPDFInstance.text).toHaveBeenCalled();
    expect(mockPDFInstance.save).toHaveBeenCalledWith('travel-itinerary.pdf');
  });
});
