import React, { useState } from 'react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { Button } from '../ui/button';

function Header() {
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (response) => {
    console.log('Login Success:', response);
    // Use the token to get user profile information
    const token = response.credential;
    // Send token to your backend to retrieve profile info or decode it on the frontend
    // Assuming `jwt-decode` is used to decode the JWT
    const decoded = jwtDecode(token);
    setUser(decoded);
  };

  const handleLogout = () => {
    googleLogout(); // Call the logout function
    setUser(null);  // Clear user data on logout
  };

  return (

    <div className='p-3 shadow-sm flex justify-between items-center px-5'>
      {/* Logo and Wanderlust AI title */}
      <div className='flex items-center gap-3'>
        <img src='/logo.svg' alt='Wanderlust AI Logo' className='w-10 h-10' />
        <h1 className='text-xl font-bold'>Wanderlust AI</h1>
      </div>

      {/* Sign in / Logout Button */}
      <div>
        {!user ? (
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => {
              console.log('Login Failed');
            }}
          />
        ) : (
          <div className="flex items-center gap-3">
            <p>Welcome, {user.name}</p>
            <Button onClick={handleLogout}>Logout</Button>
          </div>
        )}
      </div>
    </div>
  );

}

export default Header;