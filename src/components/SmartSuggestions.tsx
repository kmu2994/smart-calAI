
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Clock, Users, Zap, Calendar, TrendingUp } from 'lucide-react';

const SmartSuggestions = ({ events, currentDate, onAddEvent }) => {
  const [suggestions] = useState([
    {
      id: '1',
      type: 'focus-time',
      title: 'Schedule Focus Time',
      description: 'You have a 2-hour gap tomorrow. Perfect for deep work!',
      confidence: 0.92,
      action: 'Block 2 hours',
      time: 'Tomorrow 10:00 AM - 12:00 PM',
      impact: 'High productivity boost'
    },
    {
      id: '2',
      type: 'meeting-prep',
      title: 'Meeting Preparation',
      description: 'Add 15-minute prep time before your 2 PM meeting',
      confidence: 0.88,
      action: 'Add prep time',
      time: 'Today 1:45 PM - 2:00 PM',
      impact: 'Better meeting outcomes'
    },
    {
      id: '3',
      type: 'break-time',
      title: 'Take a Break',
      description: 'You\'ve been in meetings for 3 hours. Time for a break!',
      confidence: 0.85,
      action: 'Schedule 15-min break',
      time: 'Today 3:00 PM - 3:15 PM',
      impact: 'Energy restoration'
    },
    {
      id: '4',
      type: 'follow-up',
      title: 'Follow-up Reminder',
      description: 'Schedule follow-up for yesterday\'s product review',
      confidence: 0.79,
      action: 'Add follow-up',
      time: 'This week',
      impact: 'Maintain momentum'
    }
  ]);

  const [insights] = useState({
    productivity: {
      score: 85,
      trend: '+5%',
      description: 'Your productivity is trending upward this week'
    },
    timeManagement: {
      score: 78,
      trend: '+2%',
      description: 'Good balance of meetings vs focus time'
    },
    suggestions: {
      implemented: 12,
      total: 15,
      percentage: 80
    }
  });

  const getSuggestionIcon = (type) => {
    switch (type) {
      case 'focus-time':
        return <Brain className="w-4 h-4" />;
      case 'meeting-prep':
        return <Clock className="w-4 h-4" />;
      case 'break-time':
        return <Zap className="w-4 h-4" />;
      case 'follow-up':
        return <Users className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getSuggestionColor = (type) => {
    switch (type) {
      case 'focus-time':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'meeting-prep':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'break-time':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'follow-up':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleApplySuggestion = (suggestion) => {
    const now = new Date();
    let eventStart, eventEnd;

    switch (suggestion.type) {
      case 'focus-time':
        eventStart = new Date(currentDate);
        eventStart.setHours(10, 0, 0, 0);
        eventEnd = new Date(eventStart.getTime() + 2 * 60 * 60 * 1000);
        break;
      case 'meeting-prep':
        eventStart = new Date(currentDate);
        eventStart.setHours(13, 45, 0, 0);
        eventEnd = new Date(eventStart.getTime() + 15 * 60 * 1000);
        break;
      case 'break-time':
        eventStart = new Date(currentDate);
        eventStart.setHours(15, 0, 0, 0);
        eventEnd = new Date(eventStart.getTime() + 15 * 60 * 1000);
        break;
      default:
        eventStart = new Date(currentDate);
        eventStart.setHours(16, 0, 0, 0);
        eventEnd = new Date(eventStart.getTime() + 30 * 60 * 1000);
    }

    const newEvent = {
      title: suggestion.title,
      start: eventStart,
      end: eventEnd,
      type: 'personal',
      description: `AI Suggested: ${suggestion.description}`,
      aiGenerated: true
    };

    onAddEvent(newEvent);
  };

  return (
    <div className="space-y-6">
      {/* AI Insights */}
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span>AI Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{insights.productivity.score}%</div>
              <div className="text-xs text-gray-600">Productivity</div>
              <div className="text-xs text-green-600">{insights.productivity.trend}</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{insights.timeManagement.score}%</div>
              <div className="text-xs text-gray-600">Time Mgmt</div>
              <div className="text-xs text-green-600">{insights.timeManagement.trend}</div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Suggestions Applied</span>
              <span className="text-sm text-gray-600">
                {insights.suggestions.implemented}/{insights.suggestions.total}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                style={{ width: `${insights.suggestions.percentage}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Smart Suggestions */}
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <span>Smart Suggestions</span>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              <Calendar className="w-3 h-3 mr-1" />
              AI Powered
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className={`p-4 rounded-lg border ${getSuggestionColor(suggestion.type)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getSuggestionIcon(suggestion.type)}
                  <h4 className="font-medium text-sm">{suggestion.title}</h4>
                </div>
                <Badge 
                  variant="outline" 
                  className="text-xs"
                >
                  {Math.round(suggestion.confidence * 100)}% confidence
                </Badge>
              </div>
              
              <p className="text-xs text-gray-600 mb-3">{suggestion.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="text-xs">
                  <div className="text-gray-500">Time: {suggestion.time}</div>
                  <div className="text-green-600">Impact: {suggestion.impact}</div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleApplySuggestion(suggestion)}
                  className="text-xs"
                >
                  {suggestion.action}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            <span>Quick Optimizations</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => {
              const focusEvent = {
                title: 'Deep Work Session',
                start: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000), // Tomorrow
                end: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours
                type: 'personal',
                description: 'AI-scheduled focus time for maximum productivity'
              };
              onAddEvent(focusEvent);
            }}
          >
            <Brain className="w-4 h-4 mr-2" />
            <span className="text-sm">Schedule Focus Time</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => {
              const breakEvent = {
                title: 'Wellness Break',
                start: new Date(currentDate.getTime() + 3 * 60 * 60 * 1000), // 3 hours from now
                end: new Date(currentDate.getTime() + 3 * 60 * 60 * 1000 + 15 * 60 * 1000), // 15 minutes
                type: 'personal',
                description: 'AI-recommended break for optimal performance'
              };
              onAddEvent(breakEvent);
            }}
          >
            <Zap className="w-4 h-4 mr-2" />
            <span className="text-sm">Add Wellness Break</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
          >
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm">Optimize This Week</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartSuggestions;
