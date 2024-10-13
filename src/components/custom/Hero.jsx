import React from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen mx-auto gap-8 py-6 px-4 md:py-12 lg:flex-row lg:justify-between lg:px-8 lg:py-16 bg-white">
      {/* Text Content */}
      <div className="max-w-2xl text-center lg:text-left lg:max-w-lg">
        {/* Heading */}
        <h1 className="font-extrabold text-3xl leading-tight lg:text-5xl lg:leading-tight">
          <span className="text-[#f5a051e1] block">Discover Your Next Adventure with AI:</span> 
          <span className="text-gray-800">Personalized Itineraries at Your Fingertips</span>
        </h1>
        {/* Subtext */}
        <p className="text-base text-gray-600 mt-4 lg:mt-6 lg:text-xl">
          Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.
        </p>

        {/* Button */}
        <Link to={'/create-trip'}>
          <Button className="mt-6 px-4 py-2 text-base lg:px-6 lg:py-3 lg:text-lg font-medium text-white bg-[#f5a051e1] rounded-lg shadow-lg hover:bg-[#e98d3e] transition-colors duration-200 ease-in-out">
            Get Started, It's Free
          </Button>
        </Link>
      </div>

      {/* Image - Right side on large screens */}
      <div className="w-full mt-10 lg:mt-0 lg:w-[60%]">
        <img 
          src="/landing.PNG" 
          alt="Trip Planner" 
          className="w-full h-auto object-cover rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
}

export default Hero;