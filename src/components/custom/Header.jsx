import React, { useState } from 'react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { Button } from '../ui/button';

function Header() {
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (response) => {
    console.log('Login Success:', response);
    const token = response.credential;
    const decoded = jwtDecode(token); // Assuming jwtDecode is available
    setUser(decoded);
  };

  const handleLogout = () => {
    googleLogout();
    setUser(null);
  };

  return (
    <header className="w-full bg-background text-foreground shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <img src='/logo.svg' alt='Wanderlust AI Logo' className='w-10 h-10' />
          <h1 className='text-xl font-bold'>Wanderlust AI</h1>
        </div>

        {/* Login/Logout Button */}
        <div>
          {!user ? (
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={() => console.log('Login Failed')}
              render={({ onClick, disabled }) => (
                <button
                  onClick={onClick}
                  disabled={disabled}
                  className="bg-primary-foreground text-primary px-4 py-2 rounded transition-colors duration-300 hover:bg-muted-foreground"
                >
                  Sign In
                </button>
              )}
            />
          ) : (
            <div className="flex items-center gap-3">
              <p>Welcome, {user.name}</p>
              <Button
                className="bg-destructive text-white px-4 py-2 rounded transition-colors duration-300 hover:bg-destructive-foreground"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
