import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function UserTripCardItem({ trip }) {
  const [photoUrl, setPhotoUrl] = useState('/placeholder.jpg');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (trip?.userSelection?.location?.label) {
      GetPlacePhoto();
    }
  }, [trip]);

  const GetPlacePhoto = async () => {
    try {
      const data = {
        textQuery: trip?.userSelection?.location?.label,
      };

      const resp = await GetPlaceDetails(data);
      if (resp?.data?.places?.[0]?.photos?.[0]?.name) {
        const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', resp.data.places[0].photos[0].name);
        setPhotoUrl(PhotoUrl);
      }
    } catch (error) {
      console.error("Error fetching place photo:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!trip?.userSelection?.location?.label) {
    return null;
  }

  return (
    <Link to={`/view-trip/${trip.id}`}>
      <div className="hover:scale-105 transition-all cursor-pointer">
        <div className="relative h-[220px] rounded-xl overflow-hidden">
          {loading ? (
            <div className="w-full h-full bg-slate-200 animate-pulse" />
          ) : (
            <img 
              src={photoUrl} 
              alt={trip.userSelection.location.label} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '/placeholder.jpg';
                e.target.onerror = null;
              }}
            />
          )}
        </div>
        <div className="mt-3">
          <h2 className="font-bold text-lg">{trip.userSelection.location.label}</h2>
          <h2 className="text-sm text-gray-500">
            {trip.userSelection.noOfDays} Days trip with {trip.userSelection.budget} Budget
          </h2>
        </div>
      </div>
    </Link>
  );
}

export default UserTripCardItem;