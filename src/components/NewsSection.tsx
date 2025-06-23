
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Newspaper, Clock, ExternalLink, RefreshCw } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: Date;
  url: string;
  category: string;
}

const NewsSection = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('general');

  const categories = ['general', 'technology', 'business', 'health', 'science'];

  // Simulate AI-powered news fetching
  const fetchNews = async (category = 'general') => {
    setLoading(true);
    console.log(`Fetching ${category} news...`);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock news data - in real implementation, this would fetch from news API
      const mockNews: NewsItem[] = [
        {
          id: '1',
          title: 'AI Revolution in Calendar Management',
          summary: 'New artificial intelligence technologies are transforming how we manage our daily schedules and productivity.',
          source: 'Tech Daily',
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          url: '#',
          category: 'technology'
        },
        {
          id: '2',
          title: 'Remote Work Trends Continue to Shape Business',
          summary: 'Companies are adapting their scheduling and meeting practices to accommodate hybrid work environments.',
          source: 'Business Weekly',
          publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
          url: '#',
          category: 'business'
        },
        {
          id: '3',
          title: 'Health Benefits of Structured Daily Routines',
          summary: 'Research shows that well-organized schedules can significantly improve mental health and productivity.',
          source: 'Health Today',
          publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
          url: '#',
          category: 'health'
        },
        {
          id: '4',
          title: 'Climate Change Impact on Business Scheduling',
          summary: 'Extreme weather events are forcing companies to develop more flexible scheduling systems.',
          source: 'Science Journal',
          publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
          url: '#',
          category: 'science'
        }
      ];

      // Filter by category if not general
      const filteredNews = category === 'general' 
        ? mockNews 
        : mockNews.filter(item => item.category === category);

      setNews(filteredNews);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(selectedCategory);
  }, [selectedCategory]);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      technology: 'bg-blue-100 text-blue-700',
      business: 'bg-green-100 text-green-700',
      health: 'bg-red-100 text-red-700',
      science: 'bg-purple-100 text-purple-700',
      general: 'bg-gray-100 text-gray-700'
    };
    return colors[category] || colors.general;
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-white/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Newspaper className="w-5 h-5 text-orange-600" />
            <span>Today's News</span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchNews(selectedCategory)}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mt-3">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer capitalize"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-sm text-gray-500">Loading news...</span>
            </div>
          </div>
        ) : news.length > 0 ? (
          news.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-lg border bg-white/50 hover:bg-white/70 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900 line-clamp-2 flex-1">
                  {item.title}
                </h4>
                <ExternalLink className="w-3 h-3 text-gray-400 ml-2 flex-shrink-0" />
              </div>
              
              <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                {item.summary}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className={`text-xs ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </Badge>
                  <span className="text-xs text-gray-500">{item.source}</span>
                </div>
                
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{formatTimeAgo(item.publishedAt)}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Newspaper className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No news available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NewsSection;
