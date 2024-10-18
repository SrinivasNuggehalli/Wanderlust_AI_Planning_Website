import { db } from '@/service/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels';
import PlacesToVisit from '../components/PlacesToVisit';
import Footer from '../components/Footer';

function Viewtrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tripId) {
      GetTripData();
    }
  }, [tripId]);

  /**
   * Used to get Trip Information from Firebase
   */
  const GetTripData = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'wanderlust', tripId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const tripData = docSnap.data();
        console.log("Fetched trip data:", tripData);
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

  if (loading) {
    return <div>Loading trip details...</div>; 
  }

  if (!trip) {
    return <div>No trip data available.</div>; 
  }

  return (
    <div className='p-10 md:px-20 lg:px-44 xl:px-56'>
      {/* Information Section  */}
      <InfoSection trip={trip} />
      {/* Recommended Hotels  */}
      <Hotels trip={trip} />
      {/* Daily Plan  */}
      <PlacesToVisit trip={trip} />
      {/* Footer  */}
      <Footer trip={trip} />
    </div>
  );
}

export default Viewtrip;
