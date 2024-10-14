import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Snowflake } from 'lucide-react';

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API call with setTimeout
    setTimeout(() => {
      // Mock weather data
      const mockWeather = {
        temperature: 22,
        condition: 'Sunny',
        location: 'New York'
      };
      setWeather(mockWeather);
      setLoading(false);
    }, 1000);
  }, []);

  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun className="h-8 w-8 text-yellow-400" />;
      case 'cloudy':
        return <Cloud className="h-8 w-8 text-gray-400" />;
      case 'rainy':
        return <CloudRain className="h-8 w-8 text-blue-400" />;
      case 'snowy':
        return <Snowflake className="h-8 w-8 text-blue-200" />;
      default:
        return <Sun className="h-8 w-8 text-yellow-400" />;
    }
  };

  if (loading) {
    return <div className="animate-pulse bg-gray-200 rounded-lg p-4 w-48 h-24"></div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-48">
      <div className="flex items-center justify-between">
        {getWeatherIcon(weather.condition)}
        <div className="text-2xl font-bold">{weather.temperature}°C</div>
      </div>
      <div className="mt-2 text-sm text-gray-600">{weather.condition}</div>
      <div className="mt-1 text-xs text-gray-500">{weather.location}</div>
    </div>
  );
};

export default WeatherWidget;