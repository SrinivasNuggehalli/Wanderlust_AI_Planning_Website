import { db } from '@/service/firebaseConfig';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels';
import PlacesToVisit from '../components/PlacesToVisit';
import Footer from '../components/Footer';
import BookingAndDownload from '../../components/ui/BookingAndDownload';
import Flights from '../components/Flights';
import Package from '../components/Package';


function Viewtrip() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);


  // State for selected hotels, places, flights, and packages
  const [selectedHotels, setSelectedHotels] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [selectedFlights, setSelectedFlights] = useState([]);
  const [selectedPackages, setSelectedPackages] = useState([]);


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
        console.error('No such document!');
        toast.error('No trip found!');
      }
    } catch (error) {
      console.error('Error fetching trip:', error);
      toast.error('Failed to fetch trip data.');
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteTrip = async () => {
    if (!window.confirm('Are you sure you want to delete this trip? This action cannot be undone.')) {
      return;
    }


    try {
      const docRef = doc(db, 'wanderlust', tripId);
      await deleteDoc(docRef);
      toast.success('Trip deleted successfully!');
      navigate('/my-trips'); // Redirect to "My Trips" page after deletion
    } catch (error) {
      console.error('Error deleting trip:', error);
      toast.error('Failed to delete trip. Please try again later.');
    }
  };


  // Add selected package to itinerary
  const handleAddPackageToItinerary = (pkg) => {
    setSelectedPackages((prevPackages) =>
      prevPackages.some((p) => p.packageName === pkg.packageName)
        ? prevPackages // Keep it the same if already selected
        : [...prevPackages, pkg]
    );
  };


  // Remove selected package from itinerary
  const handleRemovePackageFromItinerary = (pkg) => {
    setSelectedPackages((prevPackages) =>
      prevPackages.filter((p) => p.packageName !== pkg.packageName)
    );
  };


  // Selection handlers for hotels, places, and flights
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
    <div className="p-10 md:px-20 lg:px-44 xl:px-56">
      {/* Delete Trip Button */}
      <div className="flex justify-end mb-5">
        <button
          onClick={handleDeleteTrip}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition ease-in-out"
        >
          Delete Trip
        </button>
      </div>


      {/* Information Section */}
      <InfoSection trip={trip} />
      <section className="mt-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Discover Our Curated Travel Packages Just for You!
        </h2>
        <p className="text-center text-gray-600 mb-8">
          <h1 className="text-xl font-bold text-center text-gray-600 mb-6">Featured Packages!</h1>
        </p>
        {/* Packages Section */}
        <Package
          trip={trip}
          selectedPackages={selectedPackages} // Pass selected packages to manage button state
          onAddPackageToItinerary={handleAddPackageToItinerary}
          onRemovePackageFromItinerary={handleRemovePackageFromItinerary}
        />
      </section>


      {/* Hotels Section */}
      <Hotels trip={trip} onSelectHotel={handleSelectHotel} selectedHotels={selectedHotels} />


      {/* Places to Visit Section */}
      <PlacesToVisit trip={trip} onSelectPlace={handleSelectPlace} selectedPlaces={selectedPlaces} />


      {/* Flights Section */}
      <Flights trip={trip} onSelectFlight={handleSelectFlight} selectedFlights={selectedFlights} />


      {/* Booking and Download Options */}
      <BookingAndDownload
        selectedHotels={selectedHotels}
        selectedPlaces={selectedPlaces}
        selectedFlights={selectedFlights}
        selectedPackages={selectedPackages} // Pass selected packages for download
      />


      {/* Footer */}
      <Footer trip={trip} />
    </div>
  );
}


export default Viewtrip;


