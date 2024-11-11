import React from 'react';
import { useLocation } from 'react-router-dom';

function ViewPackages() {
  const { state } = useLocation();
  const selectedPackages = state?.selectedPackages || [];

  return (
    <div className='p-10'>
      <h2 className='font-bold text-xl mb-5'>Your Selected Packages</h2>
      {selectedPackages.length > 0 ? (
        <div className='space-y-4'>
          {selectedPackages.map((pkg, idx) => (
            <div key={idx} className='p-4 bg-gray-100 rounded-lg shadow'>
              <h3 className='font-semibold text-lg'>{pkg.packageName}</h3>
              <p className='text-sm text-gray-600 mt-2'>{pkg.description}</p>
              <p className='text-sm text-gray-500'>Duration: {pkg.duration}</p>
              <p className='text-sm text-gray-500'>Price: ${pkg.price}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className='text-gray-600'>No packages selected.</p>
      )}
    </div>
  );
}

export default ViewPackages;