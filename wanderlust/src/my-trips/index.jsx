import { db } from '@/service/firebaseConfig';
import { collection, getDocs, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserTripCardItem from './components/UserTripCardItem';

function MyTrips() {
  const navigate = useNavigate();
  const [userTrips, setUserTrips] = useState([]);
  const [recentPlaces, setRecentPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetUserTrips();
    GetRecentPlaces();
  }, []);

  /**
   * Used to Get All User Trips
   * @returns 
   */
  const GetUserTrips = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/');
      return;
    }
    
    try {
      const q = query(collection(db, 'wanderlust'), where('userEmail', '==', user.email));
      const querySnapshot = await getDocs(q);

      const tripsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      setUserTrips(tripsData);
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Used to Get Recent Places Visited by User with Real-Time Updates
   * @returns 
   */
  const GetRecentPlaces = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      return;
    }

    // Real-time listener for recent places, ordered by `visitedAt` and limited to 5
    const recentQuery = query(
      collection(db, 'wanderlust'),
      where('userEmail', '==', user.email),
      orderBy('visitedAt', 'desc'),
      limit(5)
    );

    const unsubscribe = onSnapshot(recentQuery, (snapshot) => {
      const recentPlacesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecentPlaces(recentPlacesData);
    }, (error) => {
      console.error("Error fetching recent places:", error);
    });

    // Clean up listener on component unmount
    return () => unsubscribe();
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
      <h2 className="font-bold text-3xl">My Trips</h2>
      <div className="grid grid-cols-2 mt-10 md:grid-cols-3 gap-5">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map((_, index) => (
            <div key={index} className="h-[220px] w-full bg-slate-200 animate-pulse rounded-xl" />
          ))
        ) : userTrips.length > 0 ? (
          userTrips.map((trip) => (
            <UserTripCardItem trip={trip} key={trip.id} />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <h3 className="text-xl text-gray-500">No trips found. Create your first trip!</h3>
          </div>
        )}
      </div>
      
      <h2 className="font-bold text-3xl mt-12">Recently Visited Places</h2>
      <div className="grid grid-cols-2 mt-5 md:grid-cols-3 gap-5">
        {recentPlaces.length > 0 ? (
          recentPlaces.map((place) => (
            <UserTripCardItem trip={place} key={place.id} />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <h3 className="text-xl text-gray-500">No recent places found.</h3>
          </div>
        )}
      </div>
    </div> 
  );
}

export default MyTrips;
