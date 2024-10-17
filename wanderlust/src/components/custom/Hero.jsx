import React from 'react';
import { Link } from 'react-router-dom';
import WeatherWidget from './WeatherWidget';
import Testimonials from './Testimonials';


function Hero() {
  return (
    <div className="flex flex-col lg:flex-row items-start justify-between min-h-screen p-8 lg:p-4 mt-8">
      {/* Left Section: Text and Button */}
      <div className="flex flex-col items-start lg:w-3/5 space-y-8 pr-8 pl-8">
        <h1 className="font-extrabold text-5xl lg:text-6xl leading-tight">
          <span className="text-violet-600">Discover Your Next Adventure with AI:</span> <br />
          <span className="text-black">Personalized Itineraries at Your Fingertips</span>
        </h1>
        <p className="text-2xl text-gray-600 italic">
          Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.
        </p>


        <Link to="/create-trip">
          <button className="bg-[#160a09] text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition duration-300 text-lg mt-4">
            Get Started, It's Free
          </button>
        </Link>


        {/* Testimonials Below the Button */}
        <Testimonials />
      </div>


      {/* Right Section: Image and Weather Widget */}
      <div className="flex flex-col lg:w-2/5 mt-8 lg:mt-2">
        <div
          className="w-full h-48 lg:h-72 rounded-lg shadow-lg bg-cover bg-center mb-8"
          style={{
            backgroundImage: "url('/landing.png')",
            backgroundRepeat: 'no-repeat'
          }}
          role="img"
          aria-label="Travel Planning"
        ></div>


        {/* Weather Widget */}
        <WeatherWidget />
      </div>
    </div>
  );
}


export default Hero;