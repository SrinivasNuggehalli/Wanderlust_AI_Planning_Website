import React from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <div className="flex flex-col items-center justify-center mx-10 gap-6">
      {/* Text Content */}
      <div className="max-w-2xl text-center">
        {/* Heading */}
        <h1 className="font-extrabold text-[50px] leading-tight">
          <span className="text-[#f5a051e1]">Discover Your Next Adventure with AI:</span> 
        <p> Personalized Itineraries at Your Fingertips </p> 
        </h1>
        {/* Subtext */}
        <p className="text-xl text-gray-500 mt-4">
          Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.
        </p>

        {/* Button */}
        <Link to={'/create-trip'}>
          <Button className="mt-6">Get Started, It's Free</Button>
        </Link>
      </div>

      {/* Image - Below the button */}
      <div className="w-full mt-6">
        <img src="/landing.PNG" alt="Trip Planner" className="w-full h-auto object-cover" />
      </div>
    </div>
  );
}

export default Hero;
