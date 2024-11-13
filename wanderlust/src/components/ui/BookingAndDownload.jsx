import React from 'react';
import { jsPDF } from 'jspdf';

function BookingAndDownload({ selectedHotels, selectedPlaces, selectedFlights, selectedPackages }) {
  const exportToPDF = () => {
    if (
      selectedHotels.length === 0 &&
      selectedPlaces.length === 0 &&
      selectedFlights.length === 0 &&
      selectedPackages.length === 0
    ) {
      alert('No items selected to export.');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('Selected Itinerary', 10, 10);

    let yPosition = 20;

    // Add Selected Hotels
    if (selectedHotels.length > 0) {
      doc.text('Selected Hotels', 10, yPosition);
      yPosition += 10;
      selectedHotels.forEach((hotel, idx) => {
        doc.text(`Hotel ${idx + 1}: ${hotel.hotelName}`, 10, yPosition);
        doc.text(`Address: ${hotel.hotelAddress}`, 10, yPosition + 5);
        yPosition += 15;
      });
    }

    // Add Selected Places
    if (selectedPlaces.length > 0) {
      doc.text('Selected Places', 10, yPosition);
      yPosition += 10;
      selectedPlaces.forEach((place, idx) => {
        doc.text(`Place ${idx + 1}: ${place.placeName}`, 10, yPosition);
        doc.text(`Details: ${place.placeDetails}`, 10, yPosition + 5);
        yPosition += 15;
      });
    }

    // Add Selected Flights
    if (selectedFlights.length > 0) {
      doc.text('Selected Flights', 10, yPosition);
      yPosition += 10;
      selectedFlights.forEach((flight, idx) => {
        doc.text(`Flight ${idx + 1}: ${flight.airline}`, 10, yPosition);
        doc.text(`Flight Number: ${flight.flightNumber}`, 10, yPosition + 5);
        doc.text(`Departure: ${flight.departureTime}`, 10, yPosition + 10);
        yPosition += 20;
      });
    }

    // Add Selected Packages
    if (selectedPackages.length > 0) {
      doc.text('Selected Packages', 10, yPosition);
      yPosition += 10;
      selectedPackages.forEach((pkg, idx) => {
        doc.text(`Package ${idx + 1}: ${pkg.packageName}`, 10, yPosition);
        doc.text(`Price: $${pkg.price}`, 10, yPosition + 5);
        doc.text(`Description: ${pkg.description}`, 10, yPosition + 10);
        yPosition += 20;
      });
    }

    doc.save('itinerary.pdf');
  };

  return (
    <div className='p-5'>
      <h2 className='font-bold text-lg mb-3'>Selected Itinerary</h2>
      <button onClick={exportToPDF} className='mt-5 bg-green-500 hover:bg-green-600 text-white p-2 rounded'>
        Download Itinerary as PDF
      </button>
    </div>
  );
}

export default BookingAndDownload;
