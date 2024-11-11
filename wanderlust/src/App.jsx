import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Hero from './components/custom/Hero';
import Viewtrip from './view-trip/[tripId]/index';
import ViewPackages from './view-trip/ViewPackages'; // Import the ViewPackages component

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Home Route */}
          <Route path="/" element={<Hero />} />

          {/* Dynamic Route for Viewing Specific Trip by tripId */}
          <Route path="/view-trip/:tripId" element={<Viewtrip />} />

          {/* Route for Viewing Selected Packages */}
          <Route path="/view-packages" element={<ViewPackages />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;