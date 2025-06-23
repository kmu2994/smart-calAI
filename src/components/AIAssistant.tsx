
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Brain, Clock, Users, MapPin, Calendar } from 'lucide-react';

const AIAssistant = ({ events, onAddEvent, currentDate }) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI calendar assistant. I can help you create events, find optimal meeting times, and manage your schedule. Try saying something like "Schedule a team meeting tomorrow at 2 PM".',
      timestamp: new Date(),
      suggestions: ['What\'s my schedule today?', 'Schedule a meeting', 'Find free time this week']
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      timestamp: new Date(),
      suggestions: []
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputText, events, currentDate);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.content,
        timestamp: new Date(),
        suggestions: aiResponse.suggestions,
        eventCreated: aiResponse.eventCreated
      }]);
      
      if (aiResponse.eventCreated) {
        onAddEvent(aiResponse.eventCreated);
      }
      
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (input, events, currentDate) => {
    const lowerInput = input.toLowerCase();
    
    // Event creation patterns
    if (lowerInput.includes('schedule') || lowerInput.includes('meeting') || lowerInput.includes('appointment')) {
      const eventTime = new Date(currentDate);
      eventTime.setHours(14, 0, 0, 0); // Default to 2 PM
      
      const newEvent = {
        title: extractEventTitle(input),
        start: eventTime,
        end: new Date(eventTime.getTime() + 60 * 60 * 1000), // 1 hour duration
        type: 'meeting',
        attendees: extractAttendees(input)
      };

      return {
        content: `I've created a new event: "${newEvent.title}" for ${eventTime.toLocaleDateString()} at ${eventTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}. Would you like me to adjust the time or add more details?`,
        suggestions: ['Change the time', 'Add more attendees', 'Set a reminder'],
        eventCreated: newEvent
      };
    }

    // Schedule inquiry
    if (lowerInput.includes('schedule') || lowerInput.includes('today') || lowerInput.includes('tomorrow')) {
      const todaysEvents = events.filter(event => 
        event.start.toDateString() === currentDate.toDateString()
      );

      return {
        content: `You have ${todaysEvents.length} events scheduled for today. ${todaysEvents.length > 0 ? `Your next event is "${todaysEvents[0]?.title}" at ${todaysEvents[0]?.start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}.` : 'Your schedule is clear!'}`,
        suggestions: ['Schedule a new meeting', 'Find free time', 'View tomorrow\'s schedule']
      };
    }

    // Free time inquiry
    if (lowerInput.includes('free') || lowerInput.includes('available')) {
      return {
        content: 'Based on your current schedule, you have the following free time slots: 10:00 AM - 12:00 PM, 3:00 PM - 5:00 PM. Would you like me to help you schedule something during these times?',
        suggestions: ['Schedule a focus session', 'Block time for calls', 'Add a break']
      };
    }

    // Default response
    return {
      content: 'I understand you want help with your calendar. I can help you schedule meetings, find free time, check your availability, and optimize your schedule. What would you like me to help you with?',
      suggestions: ['Show my schedule', 'Schedule a meeting', 'Find free time', 'Optimize my calendar']
    };
  };

  const extractEventTitle = (input) => {
    // Simple extraction - in a real app, this would use more sophisticated NLP
    if (input.toLowerCase().includes('meeting')) return 'Team Meeting';
    if (input.toLowerCase().includes('call')) return 'Phone Call';
    if (input.toLowerCase().includes('lunch')) return 'Lunch Meeting';
    if (input.toLowerCase().includes('review')) return 'Project Review';
    return 'New Event';
  };

  const extractAttendees = (input) => {
    // Simple extraction - would be more sophisticated in production
    const attendees = [];
    if (input.toLowerCase().includes('team')) attendees.push('Team Members');
    if (input.toLowerCase().includes('john')) attendees.push('John');
    if (input.toLowerCase().includes('sarah')) attendees.push('Sarah');
    return attendees;
  };

  const handleSuggestionClick = (suggestion) => {
    setInputText(suggestion);
  };

  return (
    <div className="space-y-6">
      {/* AI Chat Interface */}
      <Card className="bg-white/70 backdrop-blur-sm border-white/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <span>AI Calendar Assistant</span>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              <Calendar className="w-3 h-3 mr-1" />
              Smart
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Messages */}
          <div className="h-96 overflow-y-auto space-y-4 bg-gray-50/50 rounded-lg p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit' 
                    })}
                  </p>
                  
                  {/* Event Created Notification */}
                  {message.eventCreated && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2 text-green-700">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs font-medium">Event Created: {message.eventCreated.title}</span>
                      </div>
                    </div>
                  )}
                  
                  {/* AI Suggestions */}
                  {message.type === 'ai' && message.suggestions.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="block w-full text-left text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-600 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 max-w-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="flex space-x-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything about your calendar..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !inputText.trim()}
              className="px-4 py-2"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="flex items-center space-x-2 h-auto py-3"
            onClick={() => setInputText("What's my schedule today?")}
          >
            <Clock className="w-4 h-4" />
            <span className="text-sm">Today's Schedule</span>
          </Button>
          <Button
            variant="outline"
            className="flex items-center space-x-2 h-auto py-3"
            onClick={() => setInputText("Schedule a team meeting")}
          >
            <Users className="w-4 h-4" />
            <span className="text-sm">Schedule Meeting</span>
          </Button>
          <Button
            variant="outline"
            className="flex items-center space-x-2 h-auto py-3"
            onClick={() => setInputText("Find free time this week")}
          >
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Find Free Time</span>
          </Button>
          <Button
            variant="outline"
            className="flex items-center space-x-2 h-auto py-3"
            onClick={() => setInputText("Optimize my schedule")}
          >
            <Brain className="w-4 h-4" />
            <span className="text-sm">Optimize Calendar</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistant;
