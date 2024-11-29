import React, { useEffect, useState } from 'react';
import PlaceCardItem from './PlaceCardItem';
import { getNewPlace } from '@/service/gemini';

function PlacesToVisit({ trip, onSelectPlace, selectedPlaces }) {
  const [loading, setLoading] = useState(false);
  const [replacingIndex, setReplacingIndex] = useState(null);
  const [itinerary, setItinerary] = useState([]);

  useEffect(() => {
    console.log('--- PlacesToVisit Component Mounted or Updated ---');
    console.log('Received trip prop:', trip);

    if (trip && trip.tripData && trip.tripData.itinerary) {
      const itineraryData = trip.tripData.itinerary;
      console.log('Itinerary Data:', itineraryData);

      if (Array.isArray(itineraryData.dailyPlans)) {
        console.log('Setting itinerary to itineraryData.dailyPlans');
        setItinerary(itineraryData.dailyPlans);
      } else if (Array.isArray(itineraryData)) {
        console.log('Itinerary is already an array. Setting itinerary directly.');
        setItinerary(itineraryData);
      } else {
        console.error('Unexpected itinerary format:', itineraryData);
        setItinerary([]);
      }
    } else {
      console.warn('Trip data or itinerary is not available.');
      setItinerary([]);
    }
  }, [trip]);

  const replacePlace = async (dayIndex, placeIndex, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    const replacementKey = `${dayIndex}-${placeIndex}`;
    setReplacingIndex(replacementKey);
    setLoading(true);

    try {
      const destination = trip?.userSelection?.location?.label;
      if (!destination) {
        throw new Error('Destination not found');
      }

      const budget = trip?.userSelection?.budget || 'Moderate';

      // Collect all existing place names in the itinerary
      const allPlaceNames = itinerary.flatMap((day) =>
        Array.isArray(day.plan) ? day.plan.map((place) => place.placeName) : []
      );
      const oldPlaceName = itinerary[dayIndex]?.plan?.[placeIndex]?.placeName;

      // Exclude the old place name (since we're replacing it)
      const existingPlaceNames = allPlaceNames.filter(
        (name) => name !== oldPlaceName
      );

      let newPlace = null;
      let attempts = 0;
      const maxAttempts = 5; // Limit the number of retries to prevent infinite loops

      while (attempts < maxAttempts) {
        const potentialPlace = await getNewPlace(destination, budget);
        if (
          potentialPlace &&
          !existingPlaceNames.includes(potentialPlace.placeName)
        ) {
          newPlace = potentialPlace;
          break;
        }
        attempts++;
        console.log(`Attempt ${attempts}: Found duplicate or invalid place. Retrying...`);
      }

      if (newPlace) {
        const updatedItinerary = [...itinerary];
        const dayPlan = updatedItinerary[dayIndex];

        if (dayPlan && Array.isArray(dayPlan.plan)) {
          const oldPlace = dayPlan.plan[placeIndex];
          newPlace.time = oldPlace.time; // Preserve the original time slot
          dayPlan.plan[placeIndex] = newPlace;
          setItinerary(updatedItinerary);
          console.log(`Replaced place "${oldPlace.placeName}" with "${newPlace.placeName}" on Day ${dayPlan.day}`);

          // Update selected places if necessary
          if (
            selectedPlaces.some((p) => p.placeName === oldPlace.placeName)
          ) {
            const updatedSelection = selectedPlaces.map((p) =>
              p.placeName === oldPlace.placeName ? newPlace : p
            );
            onSelectPlace(updatedSelection);
            console.log(`Updated selected places due to replacement.`);
          }
        }
      } else {
        console.error(
          'Could not find a new place that is not already in the itinerary.'
        );
      }
    } catch (error) {
      console.error('Error replacing place:', error);
    } finally {
      setLoading(false);
      setReplacingIndex(null);
    }
  };

  // Handle cases where itinerary data might not be available yet
  if (!trip || !trip.tripData || !trip.tripData.itinerary) {
    return <p>Loading itinerary...</p>;
  }

  return (
    <div className='p-5'>
      <h2 className='font-bold text-xl'>Places to Visit</h2>

      <div>
        {Array.isArray(itinerary) && itinerary.length > 0 ? (
          itinerary.map((item, dayIndex) => (
            <div className='mt-5' key={dayIndex}>
              <h2 className='font-medium text-lg'>Day {item.day}</h2>
              <div className='grid md:grid-cols-2 gap-5'>
                {Array.isArray(item.plan) && item.plan.length > 0 ? (
                  item.plan.map((place, placeIndex) => (
                    <div key={placeIndex} className='relative group'>
                      <div>
                        <h2 className='font-medium text-sm text-orange-600'>
                          {place.time}
                        </h2>
                        <PlaceCardItem
                          place={place}
                          onSelectPlace={() => onSelectPlace(place)}
                          isSelected={selectedPlaces.some(
                            (p) => p.placeName === place.placeName
                          )}
                        />
                      </div>
                      <button
                        onClick={(e) => replacePlace(dayIndex, placeIndex, e)}
                        disabled={loading && replacingIndex === `${dayIndex}-${placeIndex}`}
                        className={`
                          absolute top-2 right-2 z-10
                          ${loading && replacingIndex === `${dayIndex}-${placeIndex}` 
                            ? 'bg-gray-400' 
                            : 'bg-red-500 hover:bg-red-600'} 
                          text-white px-3 py-1.5 rounded-md text-sm
                          transition-all duration-200
                          opacity-0 group-hover:opacity-100
                          ${loading && replacingIndex === `${dayIndex}-${placeIndex}` ? 'opacity-100 cursor-not-allowed' : ''}
                        `}
                      >
                        {loading && replacingIndex === `${dayIndex}-${placeIndex}` ? (
                          <span className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Replacing...
                          </span>
                        ) : (
                          'Replace'
                        )}
                      </button>
                    </div>
                  ))
                ) : (
                  <p>No places planned for this day.</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No itinerary available.</p>
        )}
      </div>

      {selectedPlaces.length > 0 && (
        <div className='mt-10 p-5 bg-white rounded-lg shadow-lg'>
          <h2 className='font-bold text-lg mb-3'>Selected Places</h2>
          <div className='space-y-2'>
            {selectedPlaces.map((place, idx) => (
              <div key={idx} className='p-3 bg-gray-100 rounded-md shadow-sm'>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-700 font-medium'>
                    {place.placeName}
                  </span>
                  <span className='text-sm text-gray-500'>
                    {place.placeDetails}
                  </span>
                </div>
                <p className='text-xs text-gray-500'>🕙 {place.timeToTravel}</p>
                <p className='text-xs text-gray-500'>
                  🎟️ {place.ticketPricing}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PlacesToVisit;