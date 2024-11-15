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
import { FaPlane, FaTrain, FaCar, FaBus } from 'react-icons/fa';
import Footer from '../view-trip/components/Footer';

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

// Validation constants
const VALIDATION_RULES = {
  MIN_DAYS: 1,
  MAX_DAYS: 15,
  REQUIRED_FIELDS: ['location', 'noOfDays', 'budget', 'traveler', 'transport']
};

function CreateTrip() {
  const [place, setPlace] = useState(null);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [openDailog, setOpenDailog] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Initialize Google login hook
  const googleLogin = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => {
      console.log(error);
      toast.error("Failed to login with Google");
    }
  });

  // State for map center coordinates
  const [mapCenter, setMapCenter] = useState({
    lat: 37.7749,
    lng: -122.4194
  });

  // Load Google Maps Script
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_PLACE_API_KEY,
    libraries: ['places']
  });

  // Handle place selection and update map center
  const handlePlaceSelect = async (selectedPlace) => {
    setPlace(selectedPlace);
    
    if (selectedPlace?.value?.place_id) {
      // Create a Places service instance
      const placesService = new window.google.maps.places.PlacesService(document.createElement('div'));
      
      // Get place details including geometry
      placesService.getDetails(
        {
          placeId: selectedPlace.value.place_id,
          fields: ['geometry']
        },
        (placeResult, status) => {
          if (status === 'OK' && placeResult.geometry?.location) {
            const newCenter = {
              lat: placeResult.geometry.location.lat(),
              lng: placeResult.geometry.location.lng()
            };
            setMapCenter(newCenter);
            handleInputChange('location', selectedPlace);
          } else {
            console.error('Error fetching place details:', status);
            toast.error('Failed to load location details');
          }
        }
      );
    }
  };

  // Validate single field
  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'noOfDays':
        const days = parseInt(value);
        if (isNaN(days)) {
          error = 'Please enter a valid number';
        } else if (days < VALIDATION_RULES.MIN_DAYS || days > VALIDATION_RULES.MAX_DAYS) {
          error = `Please enter between ${VALIDATION_RULES.MIN_DAYS} and ${VALIDATION_RULES.MAX_DAYS} days`;
        }
        break;
      case 'location':
        if (!value?.label) {
          error = 'Please select a valid location';
        }
        break;
      case 'budget':
        if (!SelectBudgetOptions.some(option => option.title === value)) {
          error = 'Please select a valid budget option';
        }
        break;
      case 'traveler':
        if (!SelectTravelesList.some(option => option.people === value)) {
          error = 'Please select a valid traveler option';
        }
        break;
      case 'transport':
        if (!transportOptions.some(option => option.name === value)) {
          error = 'Please select a valid transport option';
        }
        break;
    }
    
    return error;
  };

  // Handle form data changes with validation
  const handleInputChange = (name, value) => {
    const error = validateField(name, value);
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    setFormErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // Validate entire form
  const validateForm = () => {
    const errors = {};
    let isValid = true;

    VALIDATION_RULES.REQUIRED_FIELDS.forEach(field => {
      const value = formData[field];
      if (!value) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        isValid = false;
      } else {
        const error = validateField(field, value);
        if (error) {
          errors[field] = error;
          isValid = false;
        }
      }
    });

    setFormErrors(errors);
    return isValid;
  };

  const OnGenerateTrip = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);

    const user = localStorage.getItem('user');
    if (!user) {
      setOpenDailog(true);
      setLoading(false);
      return;
    }

    const FINAL_PROMPT = AI_PROMPT
      .replace('{location}', formData?.location?.label)
      .replace('{totalDays}', formData?.noOfDays)
      .replace('{traveler}', formData?.traveler)
      .replace('{budget}', formData?.budget)
      .replace('{transport}', formData?.transport);

    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      await SaveAiTrip(result?.response?.text());
    } catch (error) {
      console.error("Error in generating trip:", error);
      toast.error("Failed to generate the trip.");
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
      toast.success("Trip saved successfully.");
      navigate('/view-trip/' + docId);
    } catch (error) {
      console.error("Error saving trip:", error);
      toast.error("Failed to save trip.");
    } finally {
      setLoading(false);
    }
  };

  const GetUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
      headers: {
        Authorization: `Bearer ${tokenInfo?.access_token}`,
        Accept: 'Application/json'
      }
    }).then((resp) => {
      localStorage.setItem('user', JSON.stringify(resp.data));
      window.dispatchEvent(new Event('userLogin'));
      setOpenDailog(false);
      OnGenerateTrip();
    }).catch(error => {
      console.error("Error fetching user profile:", error);
      toast.error("Failed to log in.");
    });
  };

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
                onChange: handlePlaceSelect
              }}
              autocompletionRequest={{
                fields: ['geometry', 'place_id'],
              }}
            />
            {formErrors.location && (
              <p className="text-red-500 text-sm mt-1">{formErrors.location}</p>
            )}
          </div>

          <div>
            <h2 className='text-xl my-3 font-medium'>How many days are you planning your trip?</h2>
            <Input 
              placeholder={'Enter number of days (1-15)'} 
              type="number"
              min={VALIDATION_RULES.MIN_DAYS}
              max={VALIDATION_RULES.MAX_DAYS}
              onChange={(e) => handleInputChange('noOfDays', e.target.value)}
            />
            {formErrors.noOfDays && (
              <p className="text-red-500 text-sm mt-1">{formErrors.noOfDays}</p>
            )}
          </div>

          <div className="mt-10">
            <h2 className='text-xl my-3 font-medium'>Map Preview of Selected Location</h2>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={mapCenter}
              zoom={12}
            >
              <Marker position={mapCenter} />
            </GoogleMap>
          </div>

          {/* Rest of the component remains the same */}
          
          {/* Transportation options */}
          <div>
            <h2 className='text-xl my-3 font-medium'>Preferred Mode of Transportation</h2>
            <div className='grid grid-cols-2 gap-5 mt-5'>
              {transportOptions.map((option, index) => (
                <div key={index}
                  onClick={() => handleInputChange('transport', option.name)} 
                  className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg transition-all ease-in-out duration-200 transform hover:-translate-y-1 ${formData?.transport === option.name ? 'shadow-lg border-black' : 'border-gray-300'}`}>
                  <div className="flex items-center gap-4">
                    {option.icon}
                    <h2 className='text-lg font-medium'>{option.name}</h2>
                  </div>
                </div>
              ))}
            </div>
            {formErrors.transport && (
              <p className="text-red-500 text-sm mt-1">{formErrors.transport}</p>
            )}
          </div>

          {/* Budget options */}
          <div>
            <h2 className='text-xl my-3 font-medium'>What is Your Budget?</h2>
            <div className='grid grid-cols-3 gap-5 mt-5'>
              {SelectBudgetOptions.map((item, index) => (
                <div key={index}
                  onClick={() => handleInputChange('budget', item.title)}
                  className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg transition-all ease-in-out duration-200 transform hover:-translate-y-1 ${formData?.budget === item.title ? 'shadow-lg border-black' : 'border-gray-300'}`}>
                  <h2 className='text-4xl'>{item.icon}</h2>
                  <h2 className='font-bold text-lg'>{item.title}</h2>
                  <h2 className='text-sm text-gray-500'>{item.desc}</h2>
                </div>
              ))}
            </div>
            {formErrors.budget && (
              <p className="text-red-500 text-sm mt-1">{formErrors.budget}</p>
            )}
          </div>

          {/* Travelers options */}
          <div>
            <h2 className='text-xl my-3 font-medium'>Who do you plan on traveling with on your next adventure?</h2>
            <div className='grid grid-cols-3 gap-5 mt-5'>
              {SelectTravelesList.map((item, index) => (
                <div key={index}
                  onClick={() => handleInputChange('traveler', item.people)}
                  className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg transition-all ease-in-out duration-200 transform hover:-translate-y-1 ${formData?.traveler === item.people ? 'shadow-lg border-black' : 'border-gray-300'}`}>
                  <h2 className='text-4xl'>{item.icon}</h2>
                  <h2 className='font-bold text-lg'>{item.title}</h2>
                  <h2 className='text-sm text-gray-500'>{item.desc}</h2>
                </div>
              ))}
            </div>
            {formErrors.traveler && (
              <p className="text-red-500 text-sm mt-1">{formErrors.traveler}</p>
            )}
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
                  onClick={() => googleLogin()}
                  className="w-full mt-5 flex gap-4 items-center">
                  <FcGoogle className='h-7 w-7' />
                  Sign In With Google
                </Button>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        {/* Add Footer component */}
        <Footer />
      </div>
    </>
  );
}

export default CreateTrip;