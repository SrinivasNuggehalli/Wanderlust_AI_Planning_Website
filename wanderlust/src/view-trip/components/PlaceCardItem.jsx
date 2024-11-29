import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import { FaMapLocationDot } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';

function PlaceCardItem({ place, onSelectPlace, isSelected }) {
  const [photoUrl, setPhotoUrl] = useState();

  useEffect(() => {
    place && GetPlacePhoto();
  }, [place]);

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: place.placeName,
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
      className={`border rounded-lg p-3 flex gap-4 items-start bg-white
        hover:scale-105 transition-all hover:shadow-lg cursor-pointer ${
          isSelected ? 'bg-blue-50 border-blue-400' : 'border-gray-200'
        }`}
      onClick={onSelectPlace}
    >
      <img
        src={photoUrl || '/placeholder.jpg'}
        className='w-36 h-36 rounded-md object-cover'
        alt={place.placeName}
      />
      <div className='flex-1'>
        <h2 className='font-semibold text-lg text-gray-800 truncate'>
          {place.placeName}
        </h2>
        <p className='text-sm text-gray-500 mt-1 line-clamp-2'>
          {place.placeDetails}
        </p>
        <div className='mt-2'>
          <h2 className='text-sm text-gray-600'>🕙 {place.timeToTravel}</h2>
          <h2 className='text-sm text-gray-600'>🎟️ {place.ticketPricing}</h2>
        </div>
        <Button
          size='sm'
          className={`mt-3 flex items-center gap-2 ${
            isSelected ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          } text-white`}
        >
          <FaMapLocationDot className='w-4 h-4' />
          {isSelected ? 'Deselect' : 'Select'}
        </Button>
      </div>
    </div>
  );
}

export default PlaceCardItem;