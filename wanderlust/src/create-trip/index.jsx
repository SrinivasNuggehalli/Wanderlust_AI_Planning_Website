import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { AI_PROMPT, SelectBudgetOptions, SelectTravelesList } from '@/constants/options';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { chatSession } from "@/service/AIModel";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/service/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

// Import transportation icons
import { FaPlane, FaTrain, FaCar, FaBus } from 'react-icons/fa';

// Map container style
const containerStyle = {
  width: '100%',
  height: '400px'
};

// Transportation options with corresponding icons
const transportOptions = [
  { name: "Flight", icon: <FaPlane className="text-4xl text-blue-500" /> },
  { name: "Train", icon: <FaTrain className="text-4xl text-green-500" /> },
  { name: "Car", icon: <FaCar className="text-4xl text-yellow-500" /> },
  { name: "Bus", icon: <FaBus className="text-4xl text-red-500" /> },
];

function CreateTrip() {
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState({});
  const [openDailog, setOpenDailog] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // State for map center coordinates
  const [mapCenter, setMapCenter] = useState({
    lat: 37.7749, // Default center: San Francisco
    lng: -122.4194
  });

  // Load Google Maps Script
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_PLACE_API_KEY, // Ensure API key is correctly loaded
    libraries: ['places'] // Add 'places' for autocomplete
  });

  // Helper function to automatically select transportation based on the number of travelers
  const suggestTransport = (travelerCount) => {
    if (travelerCount <= 2) {
      return "Car";
    } else if (travelerCount <= 4) {
      return "Train";
    } else {
      return "Bus";
    }
  };

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });

    // Automatically set transport based on traveler count
    if (name === 'traveler') {
      const suggestedTransport = suggestTransport(value);
      setFormData(prev => ({
        ...prev,
        transport: suggestedTransport
      }));
    }
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error)
  });

  const OnGenerateTrip = async () => {
    setLoading(true);

    const user = localStorage.getItem('user');
    if (!user) {
      setOpenDailog(true);
      setLoading(false);
      return;
    }

    if (!formData?.location || formData?.noOfDays > 30 || !formData?.budget || !formData?.traveler || !formData?.transport) {
      toast("Please fill all details");
      setLoading(false);
      return;
    }

    const FINAL_PROMPT = AI_PROMPT
      .replace('{location}', formData?.location?.label)
      .replace('{totalDays}', formData?.noOfDays)
      .replace('{traveler}', formData?.traveler)
      .replace('{budget}', formData?.budget)
      .replace('{transport}', formData?.transport); // Include transport in AI prompt

    console.log(FINAL_PROMPT);

    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      console.log("--", result?.response?.text());
      SaveAiTrip(result?.response?.text());
    } catch (error) {
      console.error("Error in generating trip:", error);
      toast("Failed to generate the trip.");
    } finally {
      setLoading(false);
    }
  };

  const SaveAiTrip = async (TripData) => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user'));
    const docId = Date.now().toString();

    try {
      const parsedTripData = JSON.parse(TripData);

      await setDoc(doc(db, "wanderlust", docId), {
        userSelection: formData,
        tripData: parsedTripData,
        userEmail: user?.email,
        id: docId
      });
      toast("Trip saved successfully.");
    } catch (error) {
      console.error("Error saving trip:", error);
      toast("Failed to save trip.");
    } finally {
      setLoading(false);
      navigate('/view-trip/' + docId);
    }
  };

  const GetUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
      headers: {
        Authorization: `Bearer ${tokenInfo?.access_token}`,
        Accept: 'Application/json'
      }
    }).then((resp) => {
      console.log(resp);
      localStorage.setItem('user', JSON.stringify(resp.data));
      setOpenDailog(false);
      OnGenerateTrip();
    }).catch(error => {
      console.error("Error fetching user profile:", error);
      toast("Failed to log in.");
    });
  };

  // Update map center when a place is selected
  useEffect(() => {
    if (place?.value?.geometry?.location) {
      const { lat, lng } = place.value.geometry.location;
      setMapCenter({
        lat: lat(), // Use the function returned by Google Places API for lat/lng
        lng: lng()
      });
    }
  }, [place]);

  // Render loading state if the Google Maps script is not yet loaded
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <>
      <div className='sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10'>
        <h2 className='font-bold text-3xl'>Tell us your travel preferences 🏕️🌴</h2>
        <p className='mt-3 text-gray-500 text-xl'>Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.</p>

        <div className='mt-20 flex flex-col gap-10'>
          <div>
            <h2 className='text-xl my-3 font-medium'>What is your destination of choice?</h2>
            <GooglePlacesAutocomplete
              apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
              selectProps={{
                value: place,
                onChange: (v) => {
                  setPlace(v);
                  handleInputChange('location', v);
                }
              }}
              autocompletionRequest={{
                fields: ['geometry'], // Ensure geometry field is included to get lat/lng
              }}
            />
          </div>

          <div>
            <h2 className='text-xl my-3 font-medium'>How many days are you planning your trip?</h2>
            <Input placeholder={'Ex.3'} type="number"
              onChange={(e) => handleInputChange('noOfDays', e.target.value)} />
          </div>

          {/* Google Map */}
          <div className="mt-10">
            <h2 className='text-xl my-3 font-medium'>Map Preview of Selected Location</h2>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={mapCenter} // Center the map on the selected place
              zoom={12} // Adjust zoom level for better clarity
            >
              {/* Marker at the selected location */}
              {place && <Marker position={mapCenter} />}
            </GoogleMap>
          </div>

          {/* Transportation Selection */}
          <div>
            <h2 className='text-xl my-3 font-medium'>Preferred Mode of Transportation</h2>
            <div className='grid grid-cols-2 gap-5 mt-5'>
              {transportOptions.map((option, index) => (
                <div key={index}
                  onClick={() => handleInputChange('transport', option.name)} 
                  className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg transition-all ease-in-out duration-200 transform hover:-translate-y-1 ${formData?.transport === option.name && 'shadow-lg border-black'}`}>
                  <div className="flex items-center gap-4">
                    {option.icon}
                    <h2 className='text-lg font-medium'>{option.name}</h2>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className='text-xl my-3 font-medium'>What is Your Budget?</h2>
            <div className='grid grid-cols-3 gap-5 mt-5'>
              {SelectBudgetOptions.map((item, index) => (
                <div key={index}
                  onClick={() => handleInputChange('budget', item.title)}
                  className={`p-4 border cursor-pointer
                  rounded-lg hover:shadow-lg transition-all ease-in-out duration-200 transform hover:-translate-y-1
                  ${formData?.budget === item.title && 'shadow-lg border-black'}`}>
                  <h2 className='text-4xl'>{item.icon}</h2>
                  <h2 className='font-bold text-lg'>{item.title}</h2>
                  <h2 className='text-sm text-gray-500'>{item.desc}</h2>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className='text-xl my-3 font-medium'>Who do you plan on traveling with on your next adventure?</h2>
            <div className='grid grid-cols-3 gap-5 mt-5'>
              {SelectTravelesList.map((item, index) => (
                <div key={index}
                  onClick={() => handleInputChange('traveler', item.people)}
                  className={`p-4 border cursor-pointer rounded-lg
                  hover:shadow-lg transition-all ease-in-out duration-200 transform hover:-translate-y-1
                  ${formData?.traveler === item.people && 'shadow-lg border-black'}`}>
                  <h2 className='text-4xl'>{item.icon}</h2>
                  <h2 className='font-bold text-lg'>{item.title}</h2>
                  <h2 className='text-sm text-gray-500'>{item.desc}</h2>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className='my-10 justify-end flex'>
          <Button
            disabled={loading}
            onClick={OnGenerateTrip}>
            {loading ? <AiOutlineLoading3Quarters className='h-7 w-7 animate-spin' /> : 'Generate Trip'}
          </Button>
        </div>

        <Dialog open={openDailog}>
          <DialogContent>
            <DialogHeader>
              <DialogDescription>
                <img src="/logo.svg" alt="logo" />
                <h2 className='font-bold text-lg mt-7'>Sign In With Google</h2>
                <p>Sign in to the App with Google authentication securely</p>

                <Button
                  onClick={login}
                  className="w-full mt-5 flex gap-4 items-center">
                  <FcGoogle className='h-7 w-7' />
                  Sign In With Google
                </Button>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export default CreateTrip;
