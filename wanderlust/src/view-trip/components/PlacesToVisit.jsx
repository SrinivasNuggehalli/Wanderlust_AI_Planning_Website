import React, { useState } from 'react';
import PlaceCardItem from './PlaceCardItem';

function PlacesToVisit({ trip, onSelectPlace, selectedPlaces }) {
  return (
    <div className='p-5'>
      <h2 className='font-bold text-xl'>Places to Visit</h2>
      
      <div>
        {trip.tripData?.itinerary.map((item, index) => (
          <div className='mt-5' key={index}>
            <h2 className='font-medium text-lg'>{item.day}</h2>
            <div className='grid md:grid-cols-2 gap-5'>
              {item.plan.map((place, idx) => (
                <div key={idx}>
                  <h2 className='font-medium text-sm text-orange-600'>{place.time}</h2>
                  <PlaceCardItem
                    place={place}
                    onSelectPlace={() => onSelectPlace(place)}
                    isSelected={selectedPlaces.some((p) => p.placeName === place.placeName)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedPlaces.length > 0 && (
        <div className='mt-10 p-5 bg-white rounded-lg shadow-lg'>
          <h2 className='font-bold text-lg mb-3'>Selected Places</h2>
          <div className='space-y-2'>
            {selectedPlaces.map((place, idx) => (
              <div key={idx} className='p-3 bg-gray-100 rounded-md shadow-sm'>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-700 font-medium'>{place.placeName}</span>
                  <span className='text-sm text-gray-500'>{place.placeDetails}</span>
                </div>
                <p className='text-xs text-gray-500'>🕙 {place.timeToTravel}</p>
                <p className='text-xs text-gray-500'>🎟️ {place.ticketPricing}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PlacesToVisit;