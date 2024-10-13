import React from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between mx-8 lg:mx-24 gap-8 lg:gap-16 py-16 lg:py-2">
      {/* Text Section */}
      <div className="flex flex-col items-center lg:items-start lg:w-1/2">
        <h1 className="font-extrabold text-4xl lg:text-6xl text-center lg:text-left leading-tight">
          <span className="text-[#f56551]">Discover Your Next Adventure with AI:</span> <br />
          Personalized Itineraries at Your Fingertips
        </h1>
        <p className="text-lg lg:text-xl text-gray-500 text-center lg:text-left mt-4 lg:mt-6"><i>
          Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.</i>
        </p>
        <Link to={'/create-trip'}>
          <Button className="mt-8 lg:mt-12 bg-gradient-to-r from-[#f56551] to-[#fc9274] text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-2xl">
            Get Started, It's Free
          </Button>
        </Link>
      </div>

      {/* Image Section */}
      <div className="lg:w-1/2">
        <img
          src="/landing.png"
          alt="Travel Planning"
          className="w-full h-auto object-cover rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
}

export default Hero;
