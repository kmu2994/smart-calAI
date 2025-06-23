
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, MapPin, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CalendarView = ({ events, currentDate, onDateChange }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Generate time slots for the day view
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);
  
  const getEventsForHour = (hour) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      const eventHour = eventDate.getHours();
      const isSameDay = eventDate.toDateString() === currentDate.toDateString();
      return isSameDay && eventHour === hour;
    });
  };

  const getEventColor = (type) => {
    const colors = {
      meeting: 'bg-blue-500',
      review: 'bg-purple-500',
      demo: 'bg-green-500',
      personal: 'bg-orange-500',
      default: 'bg-gray-500'
    };
    return colors[type] || colors.default;
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="space-y-6">
      {/* Calendar Grid */}
      <Card className="bg-white/70 backdrop-blur-sm border-white/20 overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-12 gap-0">
            {/* Time Column */}
            <div className="col-span-2 bg-gray-50/50">
              {timeSlots.map(hour => (
                <div 
                  key={hour} 
                  className="h-16 border-b border-gray-200/50 flex items-center justify-center text-sm text-gray-600 font-medium"
                >
                  {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                </div>
              ))}
            </div>

            {/* Events Column */}
            <div className="col-span-10">
              {timeSlots.map(hour => {
                const hourEvents = getEventsForHour(hour);
                return (
                  <div 
                    key={hour} 
                    className="h-16 border-b border-gray-200/50 relative hover:bg-blue-50/30 transition-colors cursor-pointer"
                  >
                    {hourEvents.map((event, index) => (
                      <div
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        className={`absolute left-2 right-2 rounded-lg p-2 ${getEventColor(event.type)} text-white shadow-sm hover:shadow-md transition-all cursor-pointer transform hover:scale-105`}
                        style={{
                          top: `${(event.start.getMinutes() / 60) * 64}px`,
                          height: `${((event.end - event.start) / (1000 * 60 * 60)) * 64}px`,
                          zIndex: 10 + index
                        }}
                      >
                        <div className="text-sm font-medium truncate">
                          {event.title}
                        </div>
                        <div className="text-xs opacity-90 truncate">
                          {formatTime(event.start)} - {formatTime(event.end)}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Event Details Modal */}
      {selectedEvent && (
        <Card className="bg-white/90 backdrop-blur-md border-white/20 animate-scale-in">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${getEventColor(selectedEvent.type)}`}></div>
                <h3 className="text-xl font-bold text-gray-900">{selectedEvent.title}</h3>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedEvent(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>
                  {formatTime(selectedEvent.start)} - {formatTime(selectedEvent.end)}
                </span>
              </div>

              {selectedEvent.attendees && (
                <div className="flex items-center space-x-3 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{selectedEvent.attendees.join(', ')}</span>
                </div>
              )}

              <div className="flex items-center space-x-3 text-gray-600">
                <Brain className="w-4 h-4" />
                <span>AI Confidence: {Math.round(selectedEvent.aiConfidence * 100)}%</span>
                <Badge 
                  variant="outline" 
                  className={selectedEvent.aiConfidence > 0.8 ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}
                >
                  {selectedEvent.aiConfidence > 0.8 ? 'High' : 'Medium'}
                </Badge>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <div className="flex space-x-2">
                  <Button size="sm" variant="default">
                    Edit Event
                  </Button>
                  <Button size="sm" variant="outline">
                    Join Meeting
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CalendarView;
