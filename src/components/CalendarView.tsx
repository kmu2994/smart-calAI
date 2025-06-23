
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Brain, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

const CalendarView = ({ events, currentDate, onDateChange }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'day'

  // Generate time slots for the day view
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);
  
  const getEventsForDate = (date) => {
    return events.filter(event => 
      event.start.toDateString() === date.toDateString()
    );
  };

  const getEventsForHour = (hour) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      const eventHour = eventDate.getHours();
      const isSameDay = eventDate.toDateString() === currentDate.toDateString();
      return isSameDay && eventHour === hour;
    });
  };

  const getWeekDates = () => {
    const week = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      week.push(date);
    }
    return week;
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

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    onDateChange(newDate);
  };

  const renderMonthView = () => (
    <div className="flex gap-6">
      <div className="flex-1">
        <CalendarComponent
          mode="single"
          selected={currentDate}
          onSelect={onDateChange}
          className="rounded-md border bg-white/50"
          modifiers={{
            hasEvents: (date) => getEventsForDate(date).length > 0
          }}
          modifiersStyles={{
            hasEvents: { 
              backgroundColor: 'rgb(59 130 246 / 0.1)',
              color: 'rgb(59 130 246)',
              fontWeight: 'bold'
            }
          }}
        />
      </div>
      <div className="w-80">
        <Card className="bg-white/70 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3 flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Events for {currentDate.toLocaleDateString()}</span>
            </h3>
            <div className="space-y-2">
              {getEventsForDate(currentDate).map(event => (
                <div 
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className="p-3 rounded-lg border cursor-pointer hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getEventColor(event.type)}`}></div>
                    <span className="font-medium text-sm">{event.title}</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {formatTime(event.start)} - {formatTime(event.end)}
                  </div>
                </div>
              ))}
              {getEventsForDate(currentDate).length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No events for this day</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderWeekView = () => {
    const weekDates = getWeekDates();
    
    return (
      <div className="overflow-x-auto">
        <div className="grid grid-cols-8 gap-0 min-w-[800px]">
          {/* Time column */}
          <div className="bg-gray-50/50">
            <div className="h-12 border-b border-gray-200 flex items-center justify-center text-sm font-medium">
              Time
            </div>
            {timeSlots.slice(6, 22).map(hour => (
              <div key={hour} className="h-16 border-b border-gray-200/50 flex items-center justify-center text-xs text-gray-600">
                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
              </div>
            ))}
          </div>
          
          {/* Day columns */}
          {weekDates.map((date, index) => (
            <div key={index} className="border-r border-gray-200">
              <div className="h-12 border-b border-gray-200 flex flex-col items-center justify-center text-sm">
                <div className="font-medium">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div className={`text-xs ${date.toDateString() === currentDate.toDateString() ? 'text-blue-600 font-bold' : 'text-gray-600'}`}>
                  {date.getDate()}
                </div>
              </div>
              {timeSlots.slice(6, 22).map(hour => {
                const hourEvents = events.filter(event => {
                  const eventDate = new Date(event.start);
                  return eventDate.toDateString() === date.toDateString() && 
                         eventDate.getHours() === hour;
                });
                
                return (
                  <div key={hour} className="h-16 border-b border-gray-200/50 relative">
                    {hourEvents.map((event, eventIndex) => (
                      <div
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        className={`absolute left-1 right-1 rounded text-white text-xs p-1 cursor-pointer hover:shadow-md transition-all ${getEventColor(event.type)}`}
                        style={{
                          top: `${(event.start.getMinutes() / 60) * 64}px`,
                          height: `${Math.max(((event.end - event.start) / (1000 * 60 * 60)) * 64, 20)}px`,
                          zIndex: 10 + eventIndex
                        }}
                      >
                        <div className="font-medium truncate">{event.title}</div>
                        <div className="opacity-90 truncate">{formatTime(event.start)}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDayView = () => (
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
  );

  return (
    <div className="space-y-6">
      {/* View Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateDate('prev')}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateDate('next')}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <h2 className="text-xl font-bold">
            {viewMode === 'month' && currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            {viewMode === 'week' && `Week of ${getWeekDates()[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
            {viewMode === 'day' && currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </h2>
        </div>
        
        <div className="flex space-x-2">
          {['month', 'week', 'day'].map((mode) => (
            <Button
              key={mode}
              variant={viewMode === mode ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode(mode)}
              className="capitalize"
            >
              {mode}
            </Button>
          ))}
        </div>
      </div>

      {/* Calendar Content */}
      <div className="animate-fade-in">
        {viewMode === 'month' && renderMonthView()}
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'day' && renderDayView()}
      </div>

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
