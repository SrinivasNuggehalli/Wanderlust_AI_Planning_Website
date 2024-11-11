// src/view-trip/components/FlightCardItem.jsx
import React from 'react';

function FlightCardItem({ flight, isSelected, onSelect }) {
  return (
    <div
      className={`border rounded-lg p-3 bg-white hover:scale-105 transition-all hover:shadow-lg cursor-pointer ${isSelected ? 'bg-blue-50 border-blue-400' : 'border-gray-200'}`}
      onClick={onSelect}
    >
      <h2 className='font-semibold text-lg text-gray-800'>{flight.airline}</h2>
      <p className='text-sm text-gray-500'>Flight: {flight.flightNumber}</p>
      <p className='text-sm text-gray-500'>Departure: {flight.departureTime}</p>
      <p className='text-sm text-gray-500'>Arrival: {flight.arrivalTime}</p>
      <p className='text-sm text-gray-500'>Price: ${flight.price}</p>
    </div>
  );
}

export default FlightCardItem;