
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Brain, User, Calendar, Clock, Sparkles } from 'lucide-react';

const AIAssistant = ({ events, onAddEvent, currentDate }) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI calendar assistant. You can ask me to schedule meetings, check your availability, or get smart suggestions. Try saying something like 'Schedule a team meeting tomorrow at 2 PM' or 'What's my schedule today?'",
      timestamp: new Date(),
      suggestions: [
        "What's my schedule today?",
        "Schedule a meeting with Sarah tomorrow",
        "Find time for a 1-hour focus session"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message = inputValue) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse = processAIMessage(message);
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const processAIMessage = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Schedule meeting pattern
    if (lowerMessage.includes('schedule') || lowerMessage.includes('meeting')) {
      const event = {
        title: extractEventTitle(userMessage),
        start: extractDateTime(userMessage) || new Date(currentDate.getTime() + 2 * 60 * 60 * 1000),
        end: new Date((extractDateTime(userMessage) || new Date(currentDate.getTime() + 2 * 60 * 60 * 1000)).getTime() + 60 * 60 * 1000),
        type: 'meeting',
        attendees: extractAttendees(userMessage)
      };
      
      onAddEvent(event);
      
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: `Perfect! I've scheduled "${event.title}" for ${event.start.toLocaleString()}. The meeting is set for 1 hour. Would you like me to send invitations to the attendees?`,
        timestamp: new Date(),
        eventCreated: event,
        suggestions: [
          "Send calendar invites",
          "Add agenda items",
          "Set reminder 15 minutes before"
        ]
      };
    }
    
    // Check schedule pattern
    if (lowerMessage.includes("what's my schedule") || lowerMessage.includes('today') || lowerMessage.includes('schedule')) {
      const todayEvents = events.filter(event => 
        event.start.toDateString() === currentDate.toDateString()
      );
      
      let content = `Here's your schedule for ${currentDate.toLocaleDateString()}:\n\n`;
      
      if (todayEvents.length === 0) {
        content += "You have no scheduled events today. Perfect time for focused work!";
      } else {
        todayEvents.forEach(event => {
          content += `• ${event.title} at ${event.start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}\n`;
        });
      }
      
      return {
        id: Date.now().toString(),
        type: 'ai',
        content,
        timestamp: new Date(),
        suggestions: [
          "Schedule focus time",
          "Add a lunch break",
          "Check tomorrow's schedule"
        ]
      };
    }
    
    // Find time pattern
    if (lowerMessage.includes('find time') || lowerMessage.includes('available')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: "I've analyzed your calendar and found several optimal time slots:\n\n• 9:00 AM - 10:30 AM (90 minutes free)\n• 11:30 AM - 12:00 PM (30 minutes free)\n• 3:00 PM - 5:00 PM (2 hours free)\n\nBased on your energy patterns, I recommend the 9:00 AM slot for deep focus work.",
        timestamp: new Date(),
        suggestions: [
          "Book the 9 AM slot",
          "Schedule for tomorrow instead",
          "Find time next week"
        ]
      };
    }
    
    // Default response
    return {
      id: Date.now().toString(),
      type: 'ai',
      content: "I understand you want help with your calendar. I can help you schedule meetings, check your availability, find optimal times for tasks, and provide smart suggestions. What would you like to do?",
      timestamp: new Date(),
      suggestions: [
        "Schedule a new meeting",
        "Check my availability",
        "Optimize my schedule"
      ]
    };
  };

  const extractEventTitle = (message) => {
    const patterns = [
      /schedule (?:a )?(.+?) (?:with|at|for|tomorrow|today)/i,
      /(.+?) meeting/i,
      /meeting (?:with )?(.+)/i
    ];
    
    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }
    
    return 'New Meeting';
  };

  const extractDateTime = (message) => {
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (message.includes('tomorrow')) {
      tomorrow.setHours(14, 0, 0, 0); // Default to 2 PM
      return tomorrow;
    }
    
    if (message.includes('today')) {
      const today = new Date(currentDate);
      today.setHours(15, 0, 0, 0); // Default to 3 PM
      return today;
    }
    
    // Extract time patterns like "at 2 PM", "at 14:00"
    const timePattern = /at (\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i;
    const match = message.match(timePattern);
    
    if (match) {
      let hour = parseInt(match[1]);
      const minute = parseInt(match[2]) || 0;
      const ampm = match[3];
      
      if (ampm && ampm.toLowerCase() === 'pm' && hour !== 12) {
        hour += 12;
      } else if (ampm && ampm.toLowerCase() === 'am' && hour === 12) {
        hour = 0;
      }
      
      const dateTime = new Date(currentDate);
      dateTime.setHours(hour, minute, 0, 0);
      return dateTime;
    }
    
    return null;
  };

  const extractAttendees = (message) => {
    const withPattern = /with (.+?)(?:\s+(?:at|tomorrow|today|for)|\s*$)/i;
    const match = message.match(withPattern);
    
    if (match) {
      return match[1].split(/[,\s]+/).filter(name => name.length > 0);
    }
    
    return [];
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/70 backdrop-blur-sm border-white/20 h-96 flex flex-col">
        <CardHeader className="pb-3 border-b border-gray-200/50">
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <span>AI Calendar Assistant</span>
            <Badge variant="outline" className="bg-purple-50 text-purple-700">
              <Sparkles className="w-3 h-3 mr-1" />
              GPT-4 Enhanced
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-hidden p-4">
          <div className="h-full overflow-y-auto space-y-4 pr-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                }`}>
                  {message.type === 'user' ? <User className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
                </div>
                
                <div className={`max-w-[80%] ${message.type === 'user' ? 'text-right' : ''}`}>
                  <div className={`p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    {message.eventCreated && (
                      <div className="mt-2 p-2 bg-white/20 rounded border">
                        <div className="flex items-center space-x-2 text-xs">
                          <Calendar className="w-3 h-3" />
                          <span>Event Created: {message.eventCreated.title}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {message.suggestions && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="text-xs h-6 px-2"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white">
                  <Brain className="w-4 h-4" />
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>

      {/* Input Area */}
      <Card className="bg-white/70 backdrop-blur-sm border-white/20">
        <CardContent className="p-4">
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me to schedule meetings, check availability, or optimize your day..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputValue.trim()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistant;
