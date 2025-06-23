
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Clock, Brain, TrendingUp, Calendar, Coffee, Focus } from 'lucide-react';

const SmartSuggestions = ({ events, currentDate, onAddEvent }) => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    generateSmartSuggestions();
  }, [events, currentDate]);

  const generateSmartSuggestions = () => {
    const todayEvents = events.filter(event => 
      event.start.toDateString() === currentDate.toDateString()
    );

    const newSuggestions = [];

    // Morning focus time suggestion
    const morningEvents = todayEvents.filter(event => 
      event.start.getHours() >= 6 && event.start.getHours() < 12
    );

    if (morningEvents.length === 0) {
      newSuggestions.push({
        id: 'morning-focus',
        type: 'focus',
        icon: Focus,
        title: 'Morning Focus Session',
        description: 'Block 2 hours for deep work while your energy is high',
        confidence: 0.92,
        action: () => {
          const focusTime = new Date(currentDate);
          focusTime.setHours(9, 0, 0, 0);
          const endTime = new Date(focusTime);
          endTime.setHours(11, 0, 0, 0);
          
          onAddEvent({
            title: 'Deep Work Focus Session',
            start: focusTime,
            end: endTime,
            type: 'personal',
            description: 'Dedicated time for focused, uninterrupted work'
          });
        }
      });
    }

    // Lunch break suggestion
    const lunchTimeEvents = todayEvents.filter(event => 
      event.start.getHours() >= 12 && event.start.getHours() <= 14
    );

    if (lunchTimeEvents.length === 0) {
      newSuggestions.push({
        id: 'lunch-break',
        type: 'break',
        icon: Coffee,
        title: 'Schedule Lunch Break',
        description: 'Take a proper lunch break to recharge for the afternoon',
        confidence: 0.87,
        action: () => {
          const lunchTime = new Date(currentDate);
          lunchTime.setHours(12, 30, 0, 0);
          const endTime = new Date(lunchTime);
          endTime.setHours(13, 30, 0, 0);
          
          onAddEvent({
            title: 'Lunch Break',
            start: lunchTime,
            end: endTime,
            type: 'personal',
            description: 'Time to recharge and have a proper meal'
          });
        }
      });
    }

    // Buffer time suggestion
    const backToBackMeetings = findBackToBackMeetings(todayEvents);
    if (backToBackMeetings.length > 0) {
      newSuggestions.push({
        id: 'buffer-time',
        type: 'optimization',
        icon: Clock,
        title: 'Add Buffer Time',
        description: 'You have back-to-back meetings. Consider adding 15-minute buffers',
        confidence: 0.85,
        isWarning: true
      });
    }

    // Weekly planning suggestion
    if (currentDate.getDay() === 1) { // Monday
      newSuggestions.push({
        id: 'weekly-planning',
        type: 'planning',
        icon: TrendingUp,
        title: 'Weekly Planning Session',
        description: 'Start your week with a 30-minute planning session',
        confidence: 0.89,
        action: () => {
          const planningTime = new Date(currentDate);
          planningTime.setHours(8, 30, 0, 0);
          const endTime = new Date(planningTime);
          endTime.setHours(9, 0, 0, 0);
          
          onAddEvent({
            title: 'Weekly Planning',
            start: planningTime,
            end: endTime,
            type: 'personal',
            description: 'Review goals, plan priorities, and organize the week ahead'
          });
        }
      });
    }

    // End of day wrap-up
    const eveningEvents = todayEvents.filter(event => 
      event.start.getHours() >= 17
    );

    if (eveningEvents.length === 0 && todayEvents.length > 0) {
      newSuggestions.push({
        id: 'day-wrap-up',
        type: 'reflection',
        icon: Calendar,
        title: 'Day Wrap-up',
        description: 'Schedule 15 minutes to review today and plan tomorrow',
        confidence: 0.83,
        action: () => {
          const wrapUpTime = new Date(currentDate);
          wrapUpTime.setHours(17, 30, 0, 0);
          const endTime = new Date(wrapUpTime);
          endTime.setHours(17, 45, 0, 0);
          
          onAddEvent({
            title: 'Day Wrap-up & Tomorrow Planning',
            start: wrapUpTime,
            end: endTime,
            type: 'personal',
            description: 'Review accomplishments and plan tomorrow\'s priorities'
          });
        }
      });
    }

    setSuggestions(newSuggestions);
  };

  const findBackToBackMeetings = (events) => {
    const sortedEvents = events.sort((a, b) => a.start - b.start);
    const backToBack = [];

    for (let i = 0; i < sortedEvents.length - 1; i++) {
      const currentEnd = sortedEvents[i].end;
      const nextStart = sortedEvents[i + 1].start;
      
      if (nextStart - currentEnd < 15 * 60 * 1000) { // Less than 15 minutes gap
        backToBack.push([sortedEvents[i], sortedEvents[i + 1]]);
      }
    }

    return backToBack;
  };

  const getSuggestionColor = (type, isWarning) => {
    if (isWarning) return 'bg-yellow-50 border-yellow-200';
    
    const colors = {
      focus: 'bg-blue-50 border-blue-200',
      break: 'bg-green-50 border-green-200',
      optimization: 'bg-purple-50 border-purple-200',
      planning: 'bg-indigo-50 border-indigo-200',
      reflection: 'bg-orange-50 border-orange-200'
    };
    
    return colors[type] || 'bg-gray-50 border-gray-200';
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.9) return 'bg-green-100 text-green-700';
    if (confidence >= 0.8) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-white/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          <span>Smart Suggestions</span>
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            <Brain className="w-3 h-3 mr-1" />
            AI Powered
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No suggestions right now.</p>
            <p className="text-xs">AI is analyzing your schedule...</p>
          </div>
        ) : (
          suggestions.map((suggestion) => {
            const IconComponent = suggestion.icon;
            return (
              <div
                key={suggestion.id}
                className={`p-3 rounded-lg border ${getSuggestionColor(suggestion.type, suggestion.isWarning)}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                    <IconComponent className="w-4 h-4 text-gray-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {suggestion.title}
                      </h4>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getConfidenceColor(suggestion.confidence)}`}
                      >
                        {Math.round(suggestion.confidence * 100)}%
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-2">
                      {suggestion.description}
                    </p>
                    
                    {suggestion.action && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={suggestion.action}
                        className="text-xs h-6 px-2"
                      >
                        Add to Calendar
                      </Button>
                    )}
                    
                    {suggestion.isWarning && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-6 px-2 text-yellow-700 border-yellow-300"
                      >
                        Review Schedule
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default SmartSuggestions;
