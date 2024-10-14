import React from 'react';
import WeatherWidget from './WeatherWidget';

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
        <a href="/create-trip">
          <button className="mt-8 lg:mt-12 bg-gradient-to-r from-[#160a09] to-[#252423] text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
            Get Started, It's Free
          </button>
        </a>
      </div>

      {/* Image and Weather Widget Section */}
      <div className="lg:w-1/2 flex flex-col items-center">
        {/* Image Section */}
        <div 
          className="w-full h-[300px] lg:h-[325px] rounded-lg shadow-lg bg-cover bg-center"
          style={{
            backgroundImage: "url('/landing.png')",
            backgroundRepeat: 'no-repeat'
          }}
          role="img"
          aria-label="Travel Planning"
        >
        </div>
        
        {/* Weather Widget */}
        <div className="mt-8">
          <WeatherWidget />
        </div>
      </div>
    </div>
  );
}

export default Hero;