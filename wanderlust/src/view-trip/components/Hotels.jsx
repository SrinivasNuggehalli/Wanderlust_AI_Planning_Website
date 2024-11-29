import React, { useEffect, useState } from 'react';
import HotelCardItem from './HotelCardItem';
import { getNewHotel } from '@/service/gemini';

function Hotels({ trip, onSelectHotel, selectedHotels }) {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [replacingIndex, setReplacingIndex] = useState(null);

  useEffect(() => {
    if (trip?.tripData?.hotels) {
      setHotels(trip.tripData.hotels);
    }
  }, [trip]);

  const replaceHotel = async (index, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    setReplacingIndex(index);
    setLoading(true);

    try {
      // Access the destination from the correct path in the data structure
      const destination = trip?.userSelection?.location?.label;
      if (!destination) {
        throw new Error("Destination not found in trip data");
      }

      const budget = trip?.userSelection?.budget || "Moderate";
      console.log('Fetching new hotel for:', destination, budget);

      const newHotel = await getNewHotel(destination, budget);
      console.log('New hotel data received:', newHotel);

      if (newHotel) {
        const updatedHotels = [...hotels];
        updatedHotels[index] = newHotel;

        console.log('Updating hotels array:', updatedHotels);
        setHotels(updatedHotels);

        if (selectedHotels.some(h => h.hotelName === hotels[index].hotelName)) {
          const updatedSelection = selectedHotels.map(h => 
            h.hotelName === hotels[index].hotelName ? newHotel : h
          );
          onSelectHotel(updatedSelection);
        }

        alert('Hotel replaced successfully!');
      }
    } catch (error) {
      console.error('Error replacing hotel:', error);
      alert(error.message || 'Failed to replace hotel. Please try again.');
    } finally {
      setLoading(false);
      setReplacingIndex(null);
    }
  };

  return (
    <div className='hotel-section p-5'>
      <h2 className='font-bold text-xl mt-5 mb-5'>Hotel Recommendation</h2>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 overflow-hidden'>
        {hotels.map((hotel, index) => (
          <div key={index} className="relative group">
            <HotelCardItem
              hotel={hotel}
              isSelected={selectedHotels.some((h) => h.hotelName === hotel.hotelName)}
              onSelect={() => onSelectHotel(hotel)}
            />
            <button
              onClick={(e) => replaceHotel(index, e)}
              disabled={loading && replacingIndex === index}
              className={`
                absolute top-2 right-2 z-10
                ${loading && replacingIndex === index 
                  ? 'bg-gray-400' 
                  : 'bg-red-500 hover:bg-red-600'} 
                text-white px-3 py-1.5 rounded-md text-sm
                transition-all duration-200
                opacity-0 group-hover:opacity-100
                ${loading && replacingIndex === index ? 'opacity-100 cursor-not-allowed' : ''}
              `}
            >
              {loading && replacingIndex === index ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Replacing...
                </span>
              ) : (
                'Replace'
              )}
            </button>
          </div>
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