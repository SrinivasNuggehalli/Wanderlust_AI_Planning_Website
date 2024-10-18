import React, { useEffect, useState } from 'react';
import HotelCardItem from './HotelCardItem';

function Hotels({ trip }) {
  const [hotels, setHotels] = useState([]);
  const [selectedHotels, setSelectedHotels] = useState([]);

  useEffect(() => {
    if (trip?.tripData?.hotels) {
      setHotels(trip.tripData.hotels);
    }
  }, [trip]);

  const handleSelectHotel = (hotel) => {
    setSelectedHotels((prevSelected) =>
      prevSelected.some((h) => h.hotelName === hotel.hotelName)
        ? prevSelected.filter((h) => h.hotelName !== hotel.hotelName)
        : [...prevSelected, hotel]
    );
  };

  return (
    <div className='hotel-section p-5'>
      <h2 className='font-bold text-xl mt-5 mb-5'>Hotel Recommendation</h2>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 overflow-hidden'>
        {hotels.map((hotel, index) => (
          <HotelCardItem
            key={index}
            hotel={hotel}
            isSelected={selectedHotels.some((h) => h.hotelName === hotel.hotelName)}
            onSelect={() => handleSelectHotel(hotel)}
          />
        ))}
      </div>

      {selectedHotels.length > 0 && (
        <div className='mt-10 p-5 bg-white rounded-lg shadow-lg'>
          <h2 className='font-bold text-lg mb-3'>Selected Hotels</h2>
          <div className='space-y-2'>
            {selectedHotels.map((hotel, idx) => (
              <div key={idx} className='flex justify-between items-center'>
                <span className='text-gray-700'>{hotel.hotelName}</span>
                <span className='text-sm text-gray-500'>{hotel.hotelAddress}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Hotels;
