
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, MapPin, Brain, Sparkles, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const EventCreator = ({ onAddEvent, currentDate }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
    attendees: '',
    category: 'meeting'
  });
  const [naturalLanguageInput, setNaturalLanguageInput] = useState('');
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const processNaturalLanguage = async () => {
    if (!naturalLanguageInput.trim()) return;
    
    setIsProcessingAI(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const parsed = parseNaturalLanguage(naturalLanguageInput);
      setFormData(parsed);
      setAiSuggestions({
        confidence: Math.random() * 0.3 + 0.7,
        suggestions: [
          "Add buffer time before/after",
          "Suggest optimal meeting room",
          "Check attendee availability"
        ]
      });
      setIsProcessingAI(false);
      
      toast({
        title: "AI Parsing Complete",
        description: "I've automatically filled in the event details based on your description.",
      });
    }, 2000);
  };

  const parseNaturalLanguage = (input) => {
    const lowerInput = input.toLowerCase();
    
    // Extract title
    let title = "New Meeting";
    const titlePatterns = [
      /(?:schedule|create|add) (?:a )?(.+?) (?:meeting|call|session)/i,
      /(.+?) (?:meeting|call|session)/i,
      /(?:meeting|call|session) (?:about|for|regarding) (.+)/i
    ];
    
    for (const pattern of titlePatterns) {
      const match = input.match(pattern);
      if (match) {
        title = match[1].trim();
        break;
      }
    }
    
    // Extract time
    let startTime = '';
    let endTime = '';
    const now = new Date();
    const today = new Date(currentDate);
    
    if (lowerInput.includes('tomorrow')) {
      today.setDate(today.getDate() + 1);
    }
    
    // Extract specific time
    const timePattern = /(?:at )?(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i;
    const timeMatch = input.match(timePattern);
    
    if (timeMatch) {
      let hour = parseInt(timeMatch[1]);
      const minute = parseInt(timeMatch[2]) || 0;
      const ampm = timeMatch[3];
      
      if (ampm && ampm.toLowerCase() === 'pm' && hour !== 12) {
        hour += 12;
      } else if (ampm && ampm.toLowerCase() === 'am' && hour === 12) {
        hour = 0;
      }
      
      const startDate = new Date(today);
      startDate.setHours(hour, minute, 0, 0);
      
      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + 1); // Default 1 hour duration
      
      startTime = startDate.toISOString().slice(0, 16);
      endTime = endDate.toISOString().slice(0, 16);
    } else {
      // Default to next available hour
      const defaultStart = new Date(today);
      defaultStart.setHours(defaultStart.getHours() + 1, 0, 0, 0);
      const defaultEnd = new Date(defaultStart);
      defaultEnd.setHours(defaultEnd.getHours() + 1);
      
      startTime = defaultStart.toISOString().slice(0, 16);
      endTime = defaultEnd.toISOString().slice(0, 16);
    }
    
    // Extract attendees
    let attendees = '';
    const attendeePatterns = [
      /with (.+?)(?:\s+(?:at|in|about)|\s*$)/i,
      /(?:invite|include) (.+?)(?:\s+(?:at|in|about)|\s*$)/i
    ];
    
    for (const pattern of attendeePatterns) {
      const match = input.match(pattern);
      if (match) {
        attendees = match[1].trim();
        break;
      }
    }
    
    // Extract location
    let location = '';
    const locationPatterns = [
      /(?:in|at) (.+?)(?:\s+(?:with|about)|\s*$)/i,
      /(?:room|office|conference) (.+)/i
    ];
    
    for (const pattern of locationPatterns) {
      const match = input.match(pattern);
      if (match) {
        location = match[1].trim();
        break;
      }
    }
    
    // Determine category
    let category = 'meeting';
    if (lowerInput.includes('review') || lowerInput.includes('retrospective')) {
      category = 'review';
    } else if (lowerInput.includes('demo') || lowerInput.includes('presentation')) {
      category = 'demo';
    } else if (lowerInput.includes('personal') || lowerInput.includes('break')) {
      category = 'personal';
    }
    
    return {
      title,
      description: `Automatically created from: "${input}"`,
      startTime,
      endTime,
      location,
      attendees,
      category
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.startTime || !formData.endTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least the title and time fields.",
        variant: "destructive"
      });
      return;
    }
    
    const newEvent = {
      title: formData.title,
      description: formData.description,
      start: new Date(formData.startTime),
      end: new Date(formData.endTime),
      location: formData.location,
      type: formData.category,
      attendees: formData.attendees ? formData.attendees.split(',').map(a => a.trim()) : []
    };
    
    onAddEvent(newEvent);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      location: '',
      attendees: '',
      category: 'meeting'
    });
    setNaturalLanguageInput('');
    setAiSuggestions(null);
    
    toast({
      title: "Event Created",
      description: `Successfully created "${newEvent.title}"`,
    });
  };

  return (
    <div className="space-y-6">
      {/* AI-Powered Quick Creation */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <Wand2 className="w-5 h-5 text-purple-600" />
            <span>AI Quick Create</span>
            <Badge variant="outline" className="bg-purple-100 text-purple-700">
              <Brain className="w-3 h-3 mr-1" />
              Smart
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="natural-input" className="text-sm font-medium">
              Describe your event in natural language
            </Label>
            <Textarea
              id="natural-input"
              value={naturalLanguageInput}
              onChange={(e) => setNaturalLanguageInput(e.target.value)}
              placeholder="Try: 'Schedule a team standup tomorrow at 9 AM with John and Sarah in conference room A'"
              className="mt-1"
              rows={3}
            />
          </div>
          
          <Button 
            onClick={processNaturalLanguage}
            disabled={!naturalLanguageInput.trim() || isProcessingAI}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {isProcessingAI ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing with AI...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Parse with AI
              </>
            )}
          </Button>
          
          {aiSuggestions && (
            <div className="bg-white/60 p-3 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">AI Analysis Complete</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {Math.round(aiSuggestions.confidence * 100)}% confidence
                </Badge>
              </div>
              <div className="flex flex-wrap gap-1">
                {aiSuggestions.suggestions.map((suggestion, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manual Event Creation Form */}
      <Card className="bg-white/70 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span>Event Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Team Standup"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="meeting">Meeting</option>
                  <option value="review">Review</option>
                  <option value="demo">Demo</option>
                  <option value="personal">Personal</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Event description or agenda..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time *</Label>
                <Input
                  id="start-time"
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="end-time">End Time *</Label>
                <Input
                  id="end-time"
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., Conference Room A, Zoom, etc."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="attendees">Attendees</Label>
                <Input
                  id="attendees"
                  value={formData.attendees}
                  onChange={(e) => handleInputChange('attendees', e.target.value)}
                  placeholder="e.g., John, Sarah, Mike (comma separated)"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button type="submit" className="flex-1">
                <Calendar className="w-4 h-4 mr-2" />
                Create Event
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  setFormData({
                    title: '',
                    description: '',
                    startTime: '',
                    endTime: '',
                    location: '',
                    attendees: '',
                    category: 'meeting'
                  });
                  setNaturalLanguageInput('');
                  setAiSuggestions(null);
                }}
              >
                Clear
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventCreator;
