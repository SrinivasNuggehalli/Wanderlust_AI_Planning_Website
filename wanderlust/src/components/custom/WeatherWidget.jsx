import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, Snowflake, Wind, Moon, Star, Droplets, Thermometer, Gauge, Sunrise, Sunset } from 'lucide-react';

function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [isNight, setIsNight] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        (err) => {
          console.error('Error fetching location:', err);
          setError('Unable to fetch your location');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }

    // Check if it's night time (between 8 PM and 6 AM)
    const currentHour = new Date().getHours();
    setIsNight(currentHour >= 20 || currentHour < 6);
  }, []);

  const fetchWeather = async (latitude, longitude) => {
    const API_KEY = 'ffb6d26a504c2a613ac37c6a4c71cf01'; 
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${API_KEY}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError('Unable to fetch weather data');
    }
  };

  const getWeatherIcon = (weatherCode) => {
    if (isNight) {
      return <Moon className="w-8 h-8 text-yellow-200" />;
    }
    switch (true) {
      case weatherCode >= 200 && weatherCode < 300:
        return <CloudRain className="w-8 h-8 text-blue-500" />;
      case weatherCode >= 300 && weatherCode < 600:
        return <CloudRain className="w-8 h-8 text-blue-400" />;
      case weatherCode >= 600 && weatherCode < 700:
        return <Snowflake className="w-8 h-8 text-blue-200" />;
      case weatherCode >= 700 && weatherCode < 800:
        return <Wind className="w-8 h-8 text-gray-400" />;
      case weatherCode === 800:
        return <Sun className="w-8 h-8 text-yellow-400" />;
      default:
        return <Cloud className="w-8 h-8 text-gray-400" />;
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`w-full h-48 lg:h-50 rounded-lg shadow-md p-6 text-white ${isNight ? 'bg-gradient-to-br from-indigo-900 to-purple-900' : 'bg-gradient-to-br from-blue-400 to-purple-500'}`}>
      {weather ? (
        <div className="flex flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-semibold">{weather.name}</p>
              <p className="text-4xl font-bold">{Math.round(weather.main.temp)}°F</p>
            </div>
            <div className="flex flex-col items-center">
              {getWeatherIcon(weather.weather[0].id)}
              <p className="text-sm mt-1 capitalize">{weather.weather[0].description}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <Thermometer className="w-5 h-5 mr-2" />
              <span>Feels like: {Math.round(weather.main.feels_like)}°F</span>
            </div>
            <div className="flex items-center">
              <Droplets className="w-5 h-5 mr-2" />
              <span>Humidity: {weather.main.humidity}%</span>
            </div>
            <div className="flex items-center">
              <Wind className="w-5 h-5 mr-2" />
              <span>Wind: {Math.round(weather.wind.speed)} mph</span>
            </div>
            <div className="flex items-center">
              <Gauge className="w-5 h-5 mr-2" />
              <span>Pressure: {weather.main.pressure} hPa</span>
            </div>
          </div>
          <div className="flex justify-between text-xs mt-2">
            <div className="flex items-center">
              <Sunrise className="w-4 h-4 mr-1" />
              <span>Sunrise: {formatTime(weather.sys.sunrise)}</span>
            </div>
            <div className="flex items-center">
              <Sunset className="w-4 h-4 mr-1" />
              <span>Sunset: {formatTime(weather.sys.sunset)}</span>
            </div>
          </div>
          {isNight && (
            <div className="absolute top-2 right-2">
              <Star className="w-4 h-4 text-yellow-200" />
              <Star className="w-3 h-3 text-yellow-200 absolute top-3 right-3" />
              <Star className="w-2 h-2 text-yellow-200 absolute bottom-1 left-1" />
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm">{error || 'Fetching weather...'}</p>
      )}
    </div>
  );
}

export default WeatherWidget;