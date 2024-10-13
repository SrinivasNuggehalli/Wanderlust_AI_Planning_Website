import React, { useState, useEffect } from 'react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { Button } from '../ui/button';
import { jwtDecode } from 'jwt-decode';

function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for existing user data in localStorage on component mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    googleLogout();
    setUser(null);
    // console.log(localStorage.getItem('user'))
    // console.log(localStorage.getItem('user'))
    localStorage.removeItem('user');
    // console.log('Logged out');
    localStorage.removeItem('Token');
    // Force a re-render by updating a timestamp
    setUser({ loggedOut: new Date().getTime() });
  };

  const handleLoginSuccess = (response) => {
    console.log('Login Success:', response);
    const token = response.credential;
    console.log('Token:', token);
    const decoded = jwtDecode(token);
    login(decoded);
  };

  // Debug logging
  useEffect(() => {
    console.log('Current user state:', user);
  }, [user]);

  return (
    <div className='p-3 shadow-sm flex justify-between items-center px-5'>
      <div className='flex items-center gap-3'>
        <img src='/logo.svg' alt='Wanderlust AI Logo' className='w-10 h-10' />
        <h1 className='text-xl font-bold'>Wanderlust AI</h1>
      </div>

      <div>
        {!user || user.loggedOut ? (
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={(error) => {
              console.log('Login Failed:', error);
            }}
          />
        ) : (
          <div className="flex items-center gap-3">
            <p>Welcome, {user.name}</p>
            <Button onClick={logout}>Logout</Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;