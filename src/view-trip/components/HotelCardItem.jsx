import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';

function HotelCardItem({ hotel, isSelected, onSelect }) {
  const [photoUrl, setPhotoUrl] = useState();

  useEffect(() => {
    hotel && GetPlacePhoto();
  }, [hotel]);

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: hotel?.hotelName,
    };
    try {
      const result = await GetPlaceDetails(data);
      const photoUrl = PHOTO_REF_URL.replace(
        '{NAME}',
        result.data.places[0].photos[3].name
      );
      setPhotoUrl(photoUrl);
    } catch (error) {
      console.error('Error fetching photo:', error);
    }
  };

  return (
    <div
      className={`relative p-4 bg-white rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 ${
        isSelected ? 'border-4 border-blue-600 shadow-lg' : 'border border-gray-200'
      }`}
    >
      <Link
        to={`https://www.google.com/maps/search/?api=1&query=${hotel.hotelName},${hotel?.hotelAddress}`}
        target='_blank'
        className="block"
      >
        <img
          src={photoUrl ? photoUrl : '/placeholder.jpg'}
          className='rounded-lg h-[180px] w-full object-cover'
          alt={hotel?.hotelName}
        />
      </Link>
      <div className='mt-3'>
        <h2 className='font-semibold text-lg truncate'>{hotel?.hotelName}</h2>
        <p className='text-xs text-gray-500 truncate'>📍 {hotel?.hotelAddress}</p>
        <p className='text-sm mt-1'>💰 {hotel?.price}</p>
        <p className='text-sm'>⭐ {hotel?.rating}</p>
      </div>
      <button
        onClick={onSelect}
        className={`mt-4 w-full py-2 rounded text-sm font-medium transition-colors ${
          isSelected ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
        } text-white`}
      >
        {isSelected ? 'Deselect' : 'Select'}
      </button>
    </div>
  );
}

export default HotelCardItem;
