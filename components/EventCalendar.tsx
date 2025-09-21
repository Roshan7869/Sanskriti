'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, MapPin, Clock } from 'lucide-react';
import { useEvents } from '@/lib/hooks/useEvents';
import { Event } from '@/lib/types/api';

const EventCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarEvents, setCalendarEvents] = useState<Event[]>([]);

  const { events, loading } = useEvents({ limit: 50 });

  useEffect(() => {
    if (events) {
      setCalendarEvents(events);
    }
  }, [events]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (date: Date) => {
    return calendarEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`h-12 p-1 cursor-pointer rounded-lg transition-all duration-200 ${
            isToday ? 'bg-orange-100 border-2 border-orange-500' :
            isSelected ? 'bg-orange-500 text-white' :
            dayEvents.length > 0 ? 'bg-blue-50 hover:bg-blue-100' :
            'hover:bg-gray-50'
          }`}
        >
          <div className="text-sm font-medium">{day}</div>
          {dayEvents.length > 0 && (
            <div className="flex space-x-1 mt-1">
              {dayEvents.slice(0, 2).map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    isSelected ? 'bg-white' : 'bg-orange-500'
                  }`}
                />
              ))}
              {dayEvents.length > 2 && (
                <div className={`text-xs ${isSelected ? 'text-white' : 'text-orange-600'}`}>
                  +{dayEvents.length - 2}
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl font-bold text-gray-800 font-serif">Event Calendar</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h3 className="text-lg font-semibold text-gray-800 min-w-[140px] text-center">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="h-8 flex items-center justify-center text-sm font-semibold text-gray-600">
              {day}
            </div>
          ))}
          {renderCalendarDays()}
        </div>
      </div>

      {/* Selected Date Events */}
      {selectedDate && (
        <div className="p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Events on {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h4>
          
          {selectedDateEvents.length > 0 ? (
            <div className="space-y-4">
              {selectedDateEvents.map(event => (
                <div key={event._id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex items-start space-x-3">
                    <img src={event.imageUrl} alt={event.title} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-800 mb-1">{event.title}</h5>
                      <div className="flex items-center text-gray-600 text-sm mb-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm mb-2">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{new Date(event.date).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}</span>
                      </div>
                      <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                        {event.category}
                      </span>
                    </div>
                    <button
                      onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${event.coordinates.lat},${event.coordinates.lng}`, '_blank')}
                      className="bg-orange-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-orange-600 transition-colors"
                    >
                      Directions
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No events scheduled for this date</p>
          )}
        </div>
      )}
    </div>
  );
};

export default EventCalendar;