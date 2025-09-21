'use client';

import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Thermometer, Wind, Droplets } from 'lucide-react';

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  location: string;
}

interface WeatherWidgetProps {
  location: string;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ location }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate weather data (in real app, you'd fetch from weather API)
    const fetchWeather = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock weather data based on location
      const mockWeather: WeatherData = {
        temperature: location.includes('Bhilai') ? 28 : location.includes('Raipur') ? 30 : 26,
        condition: Math.random() > 0.5 ? 'sunny' : Math.random() > 0.5 ? 'cloudy' : 'rainy',
        humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
        windSpeed: Math.floor(Math.random() * 15) + 5, // 5-20 km/h
        location: location
      };
      
      setWeather(mockWeather);
      setLoading(false);
    };

    fetchWeather();
  }, [location]);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'cloudy':
        return <Cloud className="w-8 h-8 text-gray-500" />;
      case 'rainy':
        return <CloudRain className="w-8 h-8 text-blue-500" />;
      default:
        return <Sun className="w-8 h-8 text-yellow-500" />;
    }
  };

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return 'Sunny';
      case 'cloudy':
        return 'Cloudy';
      case 'rainy':
        return 'Rainy';
      default:
        return 'Clear';
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-6 text-white">
        <div className="animate-pulse">
          <div className="h-4 bg-white/20 rounded mb-4"></div>
          <div className="h-8 bg-white/20 rounded mb-2"></div>
          <div className="h-4 bg-white/20 rounded"></div>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Weather</h3>
          <p className="text-blue-100 text-sm">{weather.location}</p>
        </div>
        {getWeatherIcon(weather.condition)}
      </div>
      
      <div className="mb-4">
        <div className="text-3xl font-bold mb-1">{weather.temperature}°C</div>
        <div className="text-blue-100">{getConditionText(weather.condition)}</div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <Droplets className="w-4 h-4" />
          <div>
            <div className="text-blue-100">Humidity</div>
            <div className="font-semibold">{weather.humidity}%</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Wind className="w-4 h-4" />
          <div>
            <div className="text-blue-100">Wind</div>
            <div className="font-semibold">{weather.windSpeed} km/h</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Thermometer className="w-4 h-4" />
          <div>
            <div className="text-blue-100">Feels like</div>
            <div className="font-semibold">{weather.temperature + 2}°C</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;