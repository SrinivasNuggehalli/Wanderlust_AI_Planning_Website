import { db } from '@/service/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels';
import PlacesToVisit from '../components/PlacesToVisit';
import Footer from '../components/Footer';
import BookingAndDownload from '../../components/ui/BookingAndDownload';
import Flights from '../components/Flights';

function Viewtrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  // State for selected hotels, places, and flights
  const [selectedHotels, setSelectedHotels] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [selectedFlights, setSelectedFlights] = useState([]);

  useEffect(() => {
    if (tripId) {
      GetTripData();
    }
  }, [tripId]);

  const GetTripData = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'wanderlust', tripId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const tripData = docSnap.data();
        setTrip(tripData);
      } else {
        console.error("No such document!");
        toast('No trip found!');
      }
    } catch (error) {
      console.error('Error fetching trip:', error);
      toast('Failed to fetch trip data.');
    } finally {
      setLoading(false);
    }
  };

  // Selection handlers
  const handleSelectHotel = (hotel) => {
    setSelectedHotels((prevSelected) =>
      prevSelected.some((h) => h.hotelName === hotel.hotelName)
        ? prevSelected.filter((h) => h.hotelName !== hotel.hotelName)
        : [...prevSelected, hotel]
    );
  };

  const handleSelectPlace = (place) => {
    setSelectedPlaces((prevSelected) =>
      prevSelected.some((p) => p.placeName === place.placeName)
        ? prevSelected.filter((p) => p.placeName !== place.placeName)
        : [...prevSelected, place]
    );
  };

  const handleSelectFlight = (flight) => {
    setSelectedFlights((prevSelected) =>
      prevSelected.some((f) => f.flightNumber === flight.flightNumber)
        ? prevSelected.filter((f) => f.flightNumber !== flight.flightNumber)
        : [...prevSelected, flight]
    );
  };

  if (loading) {
    return <div>Loading trip details...</div>;
  }

  if (!trip) {
    return <div>No trip data available.</div>;
  }

  return (
    <div className='p-10 md:px-20 lg:px-44 xl:px-56'>
      {/* Information Section */}
      <InfoSection trip={trip} />

      {/* Hotels Section */}
      <Hotels 
        trip={trip} 
        onSelectHotel={handleSelectHotel} 
        selectedHotels={selectedHotels} 
      />

      {/* Places to Visit Section */}
      <PlacesToVisit 
        trip={trip} 
        onSelectPlace={handleSelectPlace} 
        selectedPlaces={selectedPlaces} 
      />

      {/* Flights Section */}
      <Flights 
        trip={trip} 
        onSelectFlight={handleSelectFlight} 
        selectedFlights={selectedFlights} 
      />

      {/* Booking and Download Options */}
      <BookingAndDownload 
        selectedHotels={selectedHotels} 
        selectedPlaces={selectedPlaces} 
        selectedFlights={selectedFlights}
      />

      {/* Footer */}
      <Footer trip={trip} />
    </div>
  );
}

export default Viewtrip;