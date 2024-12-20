import { db } from '@/service/firebaseConfig';
import { collection, getDocs, query, where, addDoc, deleteDoc, doc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserTripCardItem from './components/UserTripCardItem';


function MyTrips() {
  const navigate = useNavigate();
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFeedbackSection, setShowFeedbackSection] = useState(false);


  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(1);


  useEffect(() => {
    GetUserTrips();
    const handleScroll = () => {
      const bottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight;
      setShowFeedbackSection(bottom);
    };


    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


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
      console.error('Error fetching trips:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };


  const handleRatingChange = (e) => {
    setRating(e.target.value);
  };


  const handleSubmitFeedback = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert('Please log in to submit feedback.');
      return;
    }


    try {
      await addDoc(collection(db, 'feedback'), {
        userEmail: user.email,
        feedback,
        rating: parseInt(rating, 10),
        tripId: 'some_trip_id', // You may want to associate the feedback with a specific trip
        timestamp: new Date(),
      });


      setFeedback('');
      setRating(1);
      alert('Feedback submitted successfully!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again later.');
    }
  };


  const handleRemoveTrip = async (tripId) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;


    try {
      await deleteDoc(doc(db, 'wanderlust', tripId));
      setUserTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== tripId));
      alert('Trip removed successfully!');
    } catch (error) {
      console.error('Error removing trip:', error);
      alert('Failed to remove trip. Please try again later.');
    }
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
            <UserTripCardItem
              trip={trip}
              key={trip.id}
              onRemove={() => handleRemoveTrip(trip.id)} // Pass remove function
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <h3 className="text-xl text-gray-500">No trips found. Create your first trip!</h3>
          </div>
        )}
      </div>


      {/* White Background Feedback Section */}
      {showFeedbackSection && (
        <div className="fixed bottom-4 right-4 bg-white text-gray-800 shadow-lg p-3 w-64 rounded-lg border border-gray-300 transition-transform duration-500 ease-in-out">
          <h3 className="font-bold text-base">Share Your Experience</h3>
          <p className="text-sm text-gray-600 mt-1">Tell us about your trip, or leave a quick rating below!</p>


          <textarea
            placeholder="Your comments..."
            className="w-full p-2 mt-2 bg-gray-100 text-gray-800 rounded-md border border-gray-300 focus:ring-2 focus:ring-teal-400 transition ease-in-out duration-300"
            rows="2"
            value={feedback}
            onChange={handleFeedbackChange}
          />
          <input
            type="number"
            placeholder="Rating (1-5)"
            min="1"
            max="5"
            className="w-full p-2 mt-2 bg-gray-100 text-gray-800 rounded-md border border-gray-300 focus:ring-2 focus:ring-teal-400 transition ease-in-out duration-300"
            value={rating}
            onChange={handleRatingChange}
          />
          <button
            className="mt-3 bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-3 rounded-md w-full transition ease-in-out transform hover:scale-105 hover:shadow-md"
            onClick={handleSubmitFeedback}
          >
            Submit Feedback
          </button>
        </div>
      )}
    </div>
  );
}


export default MyTrips;
