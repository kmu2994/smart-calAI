
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MessageSquare, Brain, Settings, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CalendarView from '@/components/CalendarView';
import AIAssistant from '@/components/AIAssistant';
import EventCreator from '@/components/EventCreator';
import SmartSuggestions from '@/components/SmartSuggestions';

const Index = () => {
  const [currentView, setCurrentView] = useState('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([
    {
      id: '1',
      title: 'Team Standup',
      start: new Date(2025, 5, 23, 9, 0),
      end: new Date(2025, 5, 23, 9, 30),
      type: 'meeting',
      aiConfidence: 0.95,
      attendees: ['John', 'Sarah', 'Mike']
    },
    {
      id: '2',
      title: 'Product Review',
      start: new Date(2025, 5, 23, 14, 0),
      end: new Date(2025, 5, 23, 15, 0),
      type: 'review',
      aiConfidence: 0.88,
      attendees: ['Product Team']
    },
    {
      id: '3',
      title: 'AI Calendar Demo',
      start: new Date(2025, 5, 24, 10, 0),
      end: new Date(2025, 5, 24, 11, 0),
      type: 'demo',
      aiConfidence: 0.92,
      attendees: ['Development Team']
    }
  ]);

  const addEvent = (newEvent) => {
    const event = {
      ...newEvent,
      id: Date.now().toString(),
      aiConfidence: Math.random() * 0.3 + 0.7 // Simulate AI confidence
    };
    setEvents(prev => [...prev, event]);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const getTodaysEvents = () => {
    return events.filter(event => 
      event.start.toDateString() === currentDate.toDateString()
    );
  };

  const getUpcomingEvents = () => {
    return events
      .filter(event => event.start >= new Date())
      .sort((a, b) => a.start.getTime() - b.start.getTime())
      .slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SmartCal AI
                </h1>
                <p className="text-xs text-gray-500">Intelligent Calendar Assistant</p>
              </div>
            </div>
            
            <nav className="flex items-center space-x-2">
              <Button
                variant={currentView === 'calendar' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('calendar')}
                className="flex items-center space-x-2"
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Calendar</span>
              </Button>
              <Button
                variant={currentView === 'assistant' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('assistant')}
                className="flex items-center space-x-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">AI Assistant</span>
              </Button>
              <Button
                variant={currentView === 'create' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('create')}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Create</span>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Date Navigation */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateDate('prev')}
                  className="flex items-center space-x-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h2 className="text-2xl font-bold text-gray-900">
                  {formatDate(currentDate)}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateDate('next')}
                  className="flex items-center space-x-1"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                <Brain className="w-3 h-3 mr-1" />
                AI Enhanced
              </Badge>
            </div>

            {/* View Content */}
            <div className="animate-fade-in">
              {currentView === 'calendar' && (
                <CalendarView 
                  events={events} 
                  currentDate={currentDate}
                  onDateChange={setCurrentDate}
                />
              )}
              {currentView === 'assistant' && (
                <AIAssistant 
                  events={events} 
                  onAddEvent={addEvent}
                  currentDate={currentDate}
                />
              )}
              {currentView === 'create' && (
                <EventCreator 
                  onAddEvent={addEvent}
                  currentDate={currentDate}
                />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span>Today's Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Events</span>
                  <Badge variant="outline">{getTodaysEvents().length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Free Time</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">6.5 hrs</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">AI Confidence</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">92%</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Smart Suggestions */}
            <SmartSuggestions 
              events={events} 
              currentDate={currentDate}
              onAddEvent={addEvent}
            />

            {/* Upcoming Events */}
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <span>Upcoming Events</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {getUpcomingEvents().map(event => (
                  <div key={event.id} className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50/50">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {event.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {event.start.toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
