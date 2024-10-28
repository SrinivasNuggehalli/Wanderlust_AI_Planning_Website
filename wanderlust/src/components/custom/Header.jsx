import React, { useState, useEffect } from 'react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { Button } from '../ui/button';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Add event listener for storage changes
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };

    // Check for existing user data on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange);
    // Also listen for custom event
    window.addEventListener('userLogin', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLogin', handleStorageChange);
    };
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    // Dispatch custom event
    window.dispatchEvent(new Event('userLogin'));
  };

  const logout = () => {
    googleLogout();
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('Token');
    navigate('/');
  };

  const handleLoginSuccess = (response) => {
    const token = response.credential;
    const decoded = jwtDecode(token);
    login(decoded);
  };

  return (
    <div className='p-3 shadow-sm flex justify-between items-center px-5'>
      <div className='flex items-center gap-3'>
        <img src='/logo.svg' alt='Wanderlust AI Logo' className='w-10 h-10' />
        <h1 className='text-xl font-bold'>Wanderlust AI</h1>
      </div>

      <div>
        {!user ? (
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