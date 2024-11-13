import React, { useState } from 'react';

function PackageCard({ packageData, onSelect, isSelected, onViewDetails }) {
  return (
    <div className="package-card p-5 rounded-lg shadow-md bg-gray-100 text-center cursor-pointer" onClick={onViewDetails}>
      <div className="icon mb-4">
        <span className="text-purple-500 text-4xl">📦</span>
      </div>
      <p className="text-gray-800 italic mb-2">{packageData.packageName}</p>
      <p className="font-semibold text-gray-900">${packageData.price}</p>
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering onViewDetails when clicking the button
          onSelect();
        }}
        className={`mt-3 ${isSelected ? 'bg-red-500' : 'bg-green-500'} hover:${isSelected ? 'bg-red-600' : 'bg-green-600'} text-white p-2 rounded`}
      >
        {isSelected ? 'Deselect' : 'Select'}
      </button>
    </div>
  );
}

function Packages({ trip, selectedPackages, onAddPackageToItinerary, onRemovePackageFromItinerary }) {
  const [selectedPackage, setSelectedPackage] = useState(null);

  const handleViewDetails = (pkg) => {
    setSelectedPackage(pkg);
  };

  const closeModal = () => {
    setSelectedPackage(null);
  };

  const packages = trip?.packages || [
    { packageName: "Adventure Package", price: 299, description: "Enjoy adventure activities", activities: ["Hiking", "Zip-lining"] },
    { packageName: "Relaxation Package", price: 399, description: "Relax with spa treatments", activities: ["Spa", "Beach"] },
    { packageName: "Cultural Package", price: 349, description: "Explore cultural sites", activities: ["Museum", "Historical Walk"] }
  ];

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
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="modal-content bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4 text-center">
            <h2 className="text-2xl font-bold mb-4">{selectedPackage.packageName}</h2>
            <p className="mb-4">{selectedPackage.description}</p>
            <p className="text-gray-700 mb-2">Duration: {selectedPackage.duration}</p>
            <p className="text-gray-700 mb-4">Price: ${selectedPackage.price}</p>
            <ul className="text-left mb-4">
              <li className="font-semibold">Activities:</li>
              {selectedPackage.activities.map((activity, idx) => (
                <li key={idx} className="text-gray-600 ml-4">- {activity}</li>
              ))}
            </ul>
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
