import React, { useState } from 'react';

function PackageCard({ packageData, onSelect, isSelected, onViewDetails }) {
  return (
    <div className="package-card p-5 rounded-lg shadow-md bg-gray-100 text-center cursor-pointer" onClick={onViewDetails}>
      <div className="icon mb-4">
        <span className="text-purple-500 text-4xl">📦</span>
      </div>
      <p className="text-gray-800 italic mb-2 font-medium">{packageData.packageName}</p>
      <p className="font-semibold text-gray-900">${packageData.budget}</p>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        className={`mt-3 ${isSelected ? 'bg-red-500' : 'bg-green-500'} hover:${isSelected ? 'bg-red-600' : 'bg-green-600'} text-white p-2 rounded`}
      >
        {isSelected ? 'Deselect' : 'Select'}
      </button>
    </div>
  );
}

function Packages({ selectedPackages, onAddPackageToItinerary, onRemovePackageFromItinerary }) {
  const [selectedPackage, setSelectedPackage] = useState(null);

  const handleViewDetails = (pkg) => {
    setSelectedPackage(pkg);
  };

  const closeModal = () => {
    setSelectedPackage(null);
  };

  // Define packages with calculated budget based on daily activities
  const packages = [
    {
      packageName: "New York Adventure",
      description: "Experience the best of New York with an action-packed itinerary over four days.",
      dailyActivities: [
        {
          day: "Day 1",
          activities: [
            { name: "Statue of Liberty and Ellis Island Guided Tour", cost: 120 },
            { name: "Central Park Bike Tour with Professional Guide", cost: 80 }
          ]
        },
        {
          day: "Day 2",
          activities: [
            { name: "Broadway Show - Prime Seats to a Top Musical", cost: 150 },
            { name: "Times Square Nightlife Tour", cost: 50 }
          ]
        },
        {
          day: "Day 3",
          activities: [
            { name: "Empire State Building Observatory Experience", cost: 70 },
            { name: "Chelsea Market and High Line Walking Tour", cost: 60 }
          ]
        },
        {
          day: "Day 4",
          activities: [
            { name: "Metropolitan Museum of Art with Skip-the-Line Access", cost: 50 },
            { name: "Staten Island Ferry Ride with Views of NYC Skyline", cost: 40 }
          ]
        }
      ]
    },
    {
      packageName: "California Coastal Adventure",
      description: "Explore the iconic beaches, scenic coastlines, and wineries of California over a relaxing four-day trip.",
      dailyActivities: [
        {
          day: "Day 1",
          activities: [
            { name: "Santa Monica Beach Day with Surfing Lessons", cost: 100 },
            { name: "Dinner at an Oceanfront Restaurant on Santa Monica Pier", cost: 75 }
          ]
        },
        {
          day: "Day 2",
          activities: [
            { name: "Malibu Coastal Scenic Drive with Stops at Lookout Points", cost: 70 },
            { name: "Wine Tasting and Vineyard Tour in Napa Valley", cost: 130 }
          ]
        },
        {
          day: "Day 3",
          activities: [
            { name: "Hollywood Walk of Fame and Dolby Theatre Tour", cost: 50 },
            { name: "Rodeo Drive Shopping Experience with Exclusive Discounts", cost: 50 }
          ]
        },
        {
          day: "Day 4",
          activities: [
            { name: "Yosemite National Park Day Trip with Guided Hiking Tour", cost: 150 },
            { name: "Dinner at a Famous Napa Valley Restaurant", cost: 75 }
          ]
        }
      ]
    },
    {
      packageName: "Chicago Ultimate City Tour",
      description: "Discover Chicago’s top attractions, museums, and culinary delights on an engaging four-day city tour.",
      dailyActivities: [
        {
          day: "Day 1",
          activities: [
            { name: "Millennium Park Tour including 'The Bean' and Crown Fountain", cost: 30 },
            { name: "Deep-Dish Pizza Tasting Experience at Local Pizzeria", cost: 30 }
          ]
        },
        {
          day: "Day 2",
          activities: [
            { name: "Chicago River Architecture Cruise with Expert Guide", cost: 100 },
            { name: "Field Museum of Natural History - All-Access Pass", cost: 50 }
          ]
        },
        {
          day: "Day 3",
          activities: [
            { name: "Art Institute of Chicago Tour with Guide", cost: 50 },
            { name: "Biking along the Lakefront Trail with Bike Rentals Included", cost: 20 }
          ]
        },
        {
          day: "Day 4",
          activities: [
            { name: "Navy Pier Rides and Attractions Package", cost: 30 },
            { name: "Comedy Show at Second City - Chicago's Comedy Club", cost: 20 }
          ]
        }
      ]
    }
  ];

  // Calculate the budget dynamically based on activities
  packages.forEach((pkg) => {
    pkg.budget = pkg.dailyActivities.reduce((total, day) => {
      return total + day.activities.reduce((dayTotal, activity) => dayTotal + activity.cost, 0);
    }, 0);
  });

  return (
    <div className="packages-section p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
      {packages.map((pkg) => {
        const isSelected = selectedPackages.some((p) => p.packageName === pkg.packageName);

        return (
          <PackageCard
            key={pkg.packageName}
            packageData={pkg}
            onSelect={() => {
              isSelected ? onRemovePackageFromItinerary(pkg) : onAddPackageToItinerary(pkg);
            }}
            isSelected={isSelected}
            onViewDetails={() => handleViewDetails(pkg)}
          />
        );
      })}

      {/* Modal to show selected package details */}
      {selectedPackage && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="modal-content bg-white p-6 rounded-lg shadow-lg max-w-lg w-full mx-4 md:mx-0 text-center relative">
            <h2 className="text-2xl font-bold mb-4">{selectedPackage.packageName}</h2>
            <p className="mb-4">{selectedPackage.description}</p>

            {/* Display daily activities */}
            <div className="text-left mb-4">
              {selectedPackage.dailyActivities.map((day, idx) => (
                <div key={idx} className="mb-3">
                  <h3 className="font-semibold text-gray-800">{day.day}</h3>
                  <ul>
                    {day.activities.map((activity, i) => (
                      <li key={i} className="text-gray-600 ml-4">
                        {activity.name} - ${activity.cost}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Display total calculated price */}
            <p className="text-lg font-semibold text-gray-900 mt-4">
              Total Price: ${selectedPackage.budget}
            </p>

            <button onClick={closeModal} className="bg-purple-500 text-white px-4 py-2 rounded mt-4">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Packages;
