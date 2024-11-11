import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Location-based package data
const locationPackages = {
  "New York": [
    {
      packageName: "NYC Adventure Package",
      description: "Explore NYC's top attractions including the Statue of Liberty and Central Park.",
      price: 399,
      duration: "3 days / 2 nights",
    },
    {
      packageName: "NYC Cultural Package",
      description: "Experience Broadway shows, museums, and historical neighborhoods.",
      price: 299,
      duration: "2 days / 1 night",
    },
  ],
  "California": [
    {
      packageName: "California Beach Getaway",
      description: "Relax at Santa Monica Beach, visit Malibu, and enjoy coastal views.",
      price: 499,
      duration: "4 days / 3 nights",
    },
    {
      packageName: "California Wine Tour",
      description: "Visit Napa Valley vineyards with tastings and scenic tours.",
      price: 450,
      duration: "3 days / 2 nights",
    },
  ],
  "Chicago": [
    {
      packageName: "Chicago City Highlights",
      description: "Discover Millennium Park, Navy Pier, and the Chicago River Architecture Tour.",
      price: 350,
      duration: "2 days / 1 night",
    },
    {
      packageName: "Chicago Food and Culture",
      description: "Enjoy deep-dish pizza, food tours, and museum visits.",
      price: 299,
      duration: "3 days / 2 nights",
    },
  ],
  default: [
    {
      packageName: "Adventure Package",
      description: "Outdoor activities including hiking, zip-lining, and rafting.",
      price: 299,
      duration: "3 days / 2 nights",
    },
    {
      packageName: "Relaxation Package",
      description: "Unwind with spa treatments, beach access, and yoga.",
      price: 399,
      duration: "4 days / 3 nights",
    },
  ],
};

function Packages({ trip, onSelectPackage }) {
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const location = trip?.location || "default";
    setPackages(locationPackages[location] || locationPackages.default);
  }, [trip]);

  const handleSelectPackage = (pkg) => {
    onSelectPackage(pkg);
    navigate('/view-packages', { state: { selectedPackages: [pkg] } });
  };

  return (
    <div className='packages-section p-5'>
      <h2 className='font-bold text-xl mt-5 mb-5'>Packages for {trip?.location || "Your Destination"}</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
        {packages.map((pkg, index) => (
          <div
            key={index}
            className="border p-4 rounded-lg border-gray-200 cursor-pointer hover:shadow-md"
            onClick={() => handleSelectPackage(pkg)}
          >
            <h3 className='font-semibold text-lg'>{pkg.packageName}</h3>
            <p className='text-sm text-gray-600 mt-2'>{pkg.description}</p>
            <p className='text-sm text-gray-500 mt-2'>Duration: {pkg.duration}</p>
            <p className='text-sm text-gray-500'>Price: ${pkg.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Packages;