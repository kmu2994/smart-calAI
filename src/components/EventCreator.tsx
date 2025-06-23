
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, Users, MapPin, Type, Calendar, Brain } from 'lucide-react';

const EventCreator = ({ onAddEvent, currentDate }) => {
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
    attendees: [],
    category: 'meeting'
  });
  const [attendeeInput, setAttendeeInput] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState([]);

  const categories = [
    { value: 'meeting', label: 'Meeting', color: 'bg-blue-500' },
    { value: 'personal', label: 'Personal', color: 'bg-green-500' },
    { value: 'work', label: 'Work', color: 'bg-purple-500' },
    { value: 'health', label: 'Health', color: 'bg-red-500' },
    { value: 'social', label: 'Social', color: 'bg-orange-500' }
  ];

  const handleInputChange = (field, value) => {
    setEventData(prev => ({ ...prev, [field]: value }));
    
    // Generate AI suggestions based on input
    if (field === 'title' && value.length > 3) {
      generateAISuggestions(value);
    }
  };

  const generateAISuggestions = (title) => {
    // Simulate AI suggestions based on event title
    const suggestions = [];
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes('meeting')) {
      suggestions.push('Suggested duration: 1 hour');
      suggestions.push('Common attendees: Team members');
      suggestions.push('Recommended time: 2:00 PM - 3:00 PM');
    }
    
    if (lowerTitle.includes('lunch')) {
      suggestions.push('Suggested duration: 1.5 hours');
      suggestions.push('Recommended time: 12:00 PM - 1:30 PM');
      suggestions.push('Location suggestion: Conference room or restaurant');
    }
    
    if (lowerTitle.includes('review') || lowerTitle.includes('retrospective')) {
      suggestions.push('Suggested duration: 2 hours');
      suggestions.push('Recommended attendees: Project team');
      suggestions.push('Location: Main conference room');
    }
    
    setAiSuggestions(suggestions);
  };

  const addAttendee = () => {
    if (attendeeInput.trim() && !eventData.attendees.includes(attendeeInput.trim())) {
      setEventData(prev => ({
        ...prev,
        attendees: [...prev.attendees, attendeeInput.trim()]
      }));
      setAttendeeInput('');
    }
  };

  const removeAttendee = (attendee) => {
    setEventData(prev => ({
      ...prev,
      attendees: prev.attendees.filter(a => a !== attendee)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!eventData.title || !eventData.startTime || !eventData.endTime) {
      alert('Please fill in the required fields');
      return;
    }

    const startDateTime = new Date(`${currentDate.toDateString()} ${eventData.startTime}`);
    const endDateTime = new Date(`${currentDate.toDateString()} ${eventData.endTime}`);

    const newEvent = {
      title: eventData.title,
      description: eventData.description,
      start: startDateTime,
      end: endDateTime,
      location: eventData.location,
      attendees: eventData.attendees,
      type: eventData.category
    };

    onAddEvent(newEvent);
    
    // Reset form
    setEventData({
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      location: '',
      attendees: [],
      category: 'meeting'
    });
    setAiSuggestions([]);
  };

  const applySuggestion = (suggestion) => {
    if (suggestion.includes('duration: 1 hour')) {
      if (eventData.startTime) {
        const start = new Date(`2000-01-01 ${eventData.startTime}`);
        const end = new Date(start.getTime() + 60 * 60 * 1000);
        setEventData(prev => ({ 
          ...prev, 
          endTime: end.toTimeString().slice(0, 5) 
        }));
      }
    }
    
    if (suggestion.includes('2:00 PM - 3:00 PM')) {
      setEventData(prev => ({ 
        ...prev, 
        startTime: '14:00',
        endTime: '15:00'
      }));
    }
    
    if (suggestion.includes('12:00 PM - 1:30 PM')) {
      setEventData(prev => ({ 
        ...prev, 
        startTime: '12:00',
        endTime: '13:30'
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Event Creation Form */}
      <Card className="bg-white/70 backdrop-blur-sm border-white/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Plus className="w-5 h-5 text-green-600" />
            <span>Create New Event</span>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <Calendar className="w-3 h-3 mr-1" />
              AI Powered
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Type className="w-4 h-4 inline mr-1" />
                Event Title *
              </label>
              <input
                type="text"
                value={eventData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter event title..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* AI Suggestions */}
            {aiSuggestions.length > 0 && (
              <Card className="bg-blue-50/50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Brain className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">AI Suggestions</span>
                  </div>
                  <div className="space-y-2">
                    {aiSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => applySuggestion(suggestion)}
                        className="block w-full text-left text-xs px-2 py-1 bg-white border border-blue-200 rounded hover:bg-blue-50 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Time Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Start Time *
                </label>
                <input
                  type="time"
                  value={eventData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  End Time *
                </label>
                <input
                  type="time"
                  value={eventData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => handleInputChange('category', category.value)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      eventData.category === category.value
                        ? `${category.color} text-white`
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Location
              </label>
              <input
                type="text"
                value={eventData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Enter location (optional)..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Attendees */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Attendees
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={attendeeInput}
                  onChange={(e) => setAttendeeInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAttendee())}
                  placeholder="Add attendee..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button type="button" onClick={addAttendee} size="sm">
                  Add
                </Button>
              </div>
              {eventData.attendees.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {eventData.attendees.map((attendee, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-blue-100 text-blue-700 cursor-pointer"
                      onClick={() => removeAttendee(attendee)}
                    >
                      {attendee} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={eventData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Add event description (optional)..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventCreator;
