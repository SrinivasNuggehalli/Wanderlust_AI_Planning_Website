import { db } from '@/service/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserTripCardItem from './components/UserTripCardItem';

function MyTrips() {
  const navigate = useNavigate();
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetUserTrips();
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
      // Changed collection name from 'AITrips' to 'wanderlust'
      const q = query(collection(db, 'wanderlust'), where('userEmail', '==', user.email));
      const querySnapshot = await getDocs(q);

      // Map the query results to an array
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

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
      <h2 className="font-bold text-3xl">My Trips</h2>
      <div className="grid grid-cols-2 mt-10 md:grid-cols-3 gap-5">
        {loading ? (
          // Show loading skeleton
          [1, 2, 3, 4, 5, 6].map((_, index) => (
            <div key={index} className="h-[220px] w-full bg-slate-200 animate-pulse rounded-xl" />
          ))
        ) : userTrips.length > 0 ? (
          userTrips.map((trip, index) => (
            <UserTripCardItem trip={trip} key={trip.id} />
          ))
        ) : (
          // Show no trips message
          <div className="col-span-full text-center py-10">
            <h3 className="text-xl text-gray-500">No trips found. Create your first trip!</h3>
          </div>
        )}
      </div>
    </div> 
  );
}

export default MyTrips;