import React, { useEffect, useState } from 'react';
import FlightCardItem from './FlightCardItem';
function Flights({ trip, onSelectFlight, selectedFlights }) {
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    if (trip?.tripData?.flights) {
      setFlights(trip.tripData.flights);
    }
  }, [trip]);

  return (
    <div className='flight-section p-5'>
      <h2 className='font-bold text-xl mt-5 mb-5'>Flight Recommendations</h2>

      {flights.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 overflow-hidden'>
          {flights.map((flight, index) => (
            <FlightCardItem
              key={index}
              flight={flight}
              isSelected={selectedFlights.some((f) => f.flightNumber === flight.flightNumber)}
              onSelect={() => onSelectFlight(flight)}
            />
          ))}
        </div>
      ) : (
        <div className='mt-5'>
          <p className='text-gray-600 mb-3'>No flight recommendations available.</p>
          <div className='flex space-x-3'>
            <a
              href="https://www.google.com/flights"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
            >
              Search Flights on Google
            </a>
            <a
              href="https://www.kayak.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
            >
              Book with Kayak
            </a>
            <a
              href="https://www.expedia.com/Flights"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
            >
              Book with Expedia
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default Flights;