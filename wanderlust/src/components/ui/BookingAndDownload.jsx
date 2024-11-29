import React from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // Make sure to install: npm install jspdf-autotable

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

    // Add background color to header
    doc.setFillColor(41, 128, 185); // Blue background
    doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');

    // Main Title
    doc.setTextColor(255, 255, 255); // White text
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Travel Itinerary', doc.internal.pageSize.width/2, 25, { align: 'center' });

    let yPosition = 50;

    // Function to add section headers with styling
    const addSectionHeader = (title) => {
      // Add background rectangle
      doc.setFillColor(240, 240, 240);
      doc.rect(10, yPosition - 6, doc.internal.pageSize.width - 20, 10, 'F');
      
      // Add header text
      doc.setTextColor(41, 128, 185);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(title, 15, yPosition);
      
      // Add underline
      doc.setDrawColor(41, 128, 185);
      doc.setLineWidth(0.5);
      doc.line(10, yPosition + 2, doc.internal.pageSize.width - 10, yPosition + 2);
      
      yPosition += 15;
    };

    // Function to add content with box
    const addContentBox = (content) => {
      // Add box background
      doc.setFillColor(250, 250, 250);
      doc.roundedRect(15, yPosition - 5, doc.internal.pageSize.width - 30, content.length * 7 + 5, 2, 2, 'F');
      
      // Add content
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      content.forEach((text, index) => {
        doc.text(text, 20, yPosition + (index * 7));
      });
      
      yPosition += content.length * 7 + 10;
    };

    // Hotels Section
    if (selectedHotels.length > 0) {
      addSectionHeader('Hotels');
      selectedHotels.forEach((hotel, idx) => {
        const content = [
          `Hotel ${idx + 1}: ${hotel.hotelName}`,
          `Address: ${hotel.hotelAddress}`
        ];
        addContentBox(content);
      });
    }

    // Places Section
    if (selectedPlaces.length > 0) {
      addSectionHeader('Places to Visit');
      selectedPlaces.forEach((place, idx) => {
        const content = [
          `Place ${idx + 1}: ${place.placeName}`,
          `Details: ${place.placeDetails}`
        ];
        addContentBox(content);
      });
    }

    // Flights Section
    if (selectedFlights.length > 0) {
      addSectionHeader('Flight Details');
      selectedFlights.forEach((flight, idx) => {
        const content = [
          `Flight ${idx + 1}: ${flight.airline}`,
          `Flight Number: ${flight.flightNumber}`,
          `Departure: ${flight.departureTime}`
        ];
        addContentBox(content);
      });
    }

    // Packages Section
    if (selectedPackages.length > 0) {
      addSectionHeader('Travel Packages');
      selectedPackages.forEach((pkg, idx) => {
        const content = [
          `Package ${idx + 1}: ${pkg.packageName}`,
          `Price: ${pkg.budget}`,
          `Description: ${pkg.description}`
        ];
        addContentBox(content);
      });
    }

    // Add footer
    doc.setFillColor(41, 128, 185);
    doc.rect(0, doc.internal.pageSize.height - 20, doc.internal.pageSize.width, 20, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    const today = new Date().toLocaleDateString();
    doc.text(
      `Generated on ${today} | Wanderlust`,
      doc.internal.pageSize.width/2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );

    // Add page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width - 20,
        doc.internal.pageSize.height - 10
      );
    }

    doc.save('travel-itinerary.pdf');
  };

  return (
    <div className='p-5'>
      <h2 className='font-bold text-lg mb-3'>Selected Itinerary</h2>
      <button 
        onClick={exportToPDF} 
        className='mt-5 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2'
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download Itinerary PDF
      </button>
    </div>
  );
}

export default BookingAndDownload;