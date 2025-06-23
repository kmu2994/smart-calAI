import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Calendar, Clock, MapPin, Users } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions: string[];
  eventCreated?: {
    title: string;
    start: Date;
    end: Date;
    type: string;
    attendees?: string[];
  };
}

const AIAssistant = ({ events, onAddEvent, currentDate }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI calendar assistant. I can help you create events, find optimal meeting times, and answer questions about your schedule. Try saying something like "Schedule a meeting with John tomorrow at 2 PM"',
      timestamp: new Date(),
      suggestions: ['Show my schedule for today', 'Find time for a 1-hour meeting this week', 'What meetings do I have tomorrow?']
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const processMessage = async (message) => {
    setIsProcessing(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simple NLP simulation
    const lowerMessage = message.toLowerCase();
    let response = '';
    let eventCreated = null;
    
    if (lowerMessage.includes('schedule') || lowerMessage.includes('meeting') || lowerMessage.includes('event')) {
      // Extract event details (simplified)
      const title = message.match(/(?:schedule|create|add)(?:\s+a)?\s+(.+?)(?:\s+(?:at|on|for|with)|\s*$)/i)?.[1] || 'New Event';
      const timeMatch = message.match(/(?:at|@)\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
      const dateMatch = message.match(/(?:tomorrow|today|(?:next|this)\s+\w+|monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i);
      
      let eventDate = new Date(currentDate);
      if (dateMatch) {
        const dateStr = dateMatch[0].toLowerCase();
        if (dateStr === 'tomorrow') {
          eventDate.setDate(eventDate.getDate() + 1);
        } else if (dateStr === 'today') {
          // Keep current date
        } else if (dateStr.includes('next')) {
          eventDate.setDate(eventDate.getDate() + 7);
        }
      }
      
      let eventTime = timeMatch ? timeMatch[1] : '10:00 AM';
      const [time, period] = eventTime.split(/\s*(am|pm)/i);
      let [hours, minutes = 0] = time.split(':').map(Number);
      
      if (period && period.toLowerCase() === 'pm' && hours !== 12) {
        hours += 12;
      } else if (period && period.toLowerCase() === 'am' && hours === 12) {
        hours = 0;
      }
      
      eventDate.setHours(hours, minutes, 0, 0);
      const endDate = new Date(eventDate);
      endDate.setHours(hours + 1, minutes, 0, 0);
      
      eventCreated = {
        title: title.charAt(0).toUpperCase() + title.slice(1),
        start: eventDate,
        end: endDate,
        type: 'meeting',
        attendees: message.includes('with') ? [message.match(/with\s+([^,]+)/i)?.[1] || 'Someone'] : []
      };
      
      onAddEvent(eventCreated);
      response = `Perfect! I've created "${eventCreated.title}" for ${eventCreated.start.toLocaleDateString()} at ${eventCreated.start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}. The event has been added to your calendar.`;
    } else if (lowerMessage.includes('schedule') || lowerMessage.includes('today') || lowerMessage.includes('tomorrow')) {
      const targetDate = lowerMessage.includes('tomorrow') ? 
        new Date(currentDate.getTime() + 24 * 60 * 60 * 1000) : currentDate;
      
      const dayEvents = events.filter(event => 
        event.start.toDateString() === targetDate.toDateString()
      );
      
      if (dayEvents.length === 0) {
        response = `You have no events scheduled for ${targetDate.toLocaleDateString()}.`;
      } else {
        response = `Here's your schedule for ${targetDate.toLocaleDateString()}:\n\n${dayEvents.map(event => 
          `• ${event.title} at ${event.start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
        ).join('\n')}`;
      }
    } else if (lowerMessage.includes('find time') || lowerMessage.includes('available')) {
      response = 'Based on your current schedule, I suggest these available time slots:\n\n• Tomorrow 9:00 AM - 10:00 AM\n• Tomorrow 2:00 PM - 3:00 PM\n• Thursday 11:00 AM - 12:00 PM\n\nWould you like me to schedule something for any of these times?';
    } else {
      response = 'I understand you want help with your calendar. You can ask me to:\n\n• Schedule meetings or events\n• Check your availability\n• Find optimal meeting times\n• Review your upcoming schedule\n\nTry being more specific about what you need!';
    }
    
    const aiMessage: Message = {
      id: Date.now().toString(),
      type: 'ai',
      content: response,
      timestamp: new Date(),
      suggestions: eventCreated ? 
        ['Edit this event', 'Add another event', 'View full schedule'] :
        ['Schedule another meeting', 'Check tomorrow\'s schedule', 'Find available times'],
      eventCreated
    };
    
    setMessages(prev => [...prev, aiMessage]);
    setIsProcessing(false);
  };

  const handleSend = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      suggestions: []
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    
    await processMessage(inputMessage);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/70 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <span>AI Assistant</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto space-y-3 p-4 bg-gray-50/50 rounded-lg">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white border shadow-sm'
                }`}>
                  <div className="text-sm whitespace-pre-line">{message.content}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </div>
                  
                  {/* Event Created Card */}
                  {message.type === 'ai' && message.eventCreated && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2 text-green-800">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">Event Created</span>
                      </div>
                      <div className="mt-2 space-y-1 text-sm text-green-700">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-3 h-3" />
                          <span>{message.eventCreated.start.toLocaleDateString()} at {message.eventCreated.start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                        </div>
                        {message.eventCreated.attendees?.length > 0 && (
                          <div className="flex items-center space-x-2">
                            <Users className="w-3 h-3" />
                            <span>{message.eventCreated.attendees.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Suggestions */}
                  {message.type === 'ai' && message.suggestions.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="block w-full text-left text-xs px-2 py-1 bg-blue-50 hover:bg-blue-100 rounded border text-blue-700"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-white border shadow-sm rounded-lg px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <span className="text-sm text-gray-500">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Input Area */}
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything about your calendar..."
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button onClick={handleSend} disabled={isProcessing || !inputMessage.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistant;
