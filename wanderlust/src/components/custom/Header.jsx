import React from 'react'
import { Button } from '../ui/button'

function Header() {
  return (
    <header className="w-full bg-white shadow-md">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <img src="/logo.svg" alt="Logo" className="h-10" />

        {/* Sign in button */}
        <div>
          <Button>Sign in</Button>
        </div>
      </div>
    </header>
  )
}

export default Header