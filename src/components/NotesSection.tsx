
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { StickyNote, Plus, Search, Calendar, Clock, Trash2 } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  color: string;
}

const NotesSection = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    tags: '',
    color: 'yellow'
  });

  const colors = [
    { name: 'yellow', bg: 'bg-yellow-100', border: 'border-yellow-200' },
    { name: 'blue', bg: 'bg-blue-100', border: 'border-blue-200' },
    { name: 'green', bg: 'bg-green-100', border: 'border-green-200' },
    { name: 'pink', bg: 'bg-pink-100', border: 'border-pink-200' },
    { name: 'purple', bg: 'bg-purple-100', border: 'border-purple-200' }
  ];

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('calendar-notes');
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes).map(note => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt)
      }));
      setNotes(parsedNotes);
    } else {
      // Initialize with some sample notes
      const sampleNotes: Note[] = [
        {
          id: '1',
          title: 'Meeting Notes',
          content: 'Discussed Q1 targets and new project initiatives. Follow up with team leads next week.',
          tags: ['work', 'meeting'],
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          color: 'blue'
        },
        {
          id: '2',
          title: 'Calendar Ideas',
          content: 'AI features to implement: smart scheduling, conflict detection, voice commands.',
          tags: ['ideas', 'development'],
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
          color: 'green'
        }
      ];
      setNotes(sampleNotes);
      localStorage.setItem('calendar-notes', JSON.stringify(sampleNotes));
    }
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('calendar-notes', JSON.stringify(notes));
  }, [notes]);

  const createNote = () => {
    if (!newNote.title.trim() && !newNote.content.trim()) return;

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title || 'Untitled Note',
      content: newNote.content,
      tags: newNote.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      createdAt: new Date(),
      updatedAt: new Date(),
      color: newNote.color
    };

    setNotes(prev => [note, ...prev]);
    setNewNote({ title: '', content: '', tags: '', color: 'yellow' });
    setIsCreating(false);
  };

  const deleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getColorClasses = (colorName: string) => {
    const color = colors.find(c => c.name === colorName);
    return color || colors[0];
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-white/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <StickyNote className="w-5 h-5 text-yellow-600" />
            <span>Quick Notes</span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCreating(!isCreating)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-8 text-sm"
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {/* Create Note Form */}
        {isCreating && (
          <div className="p-3 border border-dashed border-gray-300 rounded-lg space-y-3">
            <Input
              placeholder="Note title..."
              value={newNote.title}
              onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
              className="text-sm"
            />
            <Textarea
              placeholder="Write your note here..."
              value={newNote.content}
              onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
              className="text-sm min-h-[60px]"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Tags (comma separated)"
                  value={newNote.tags}
                  onChange={(e) => setNewNote(prev => ({ ...prev, tags: e.target.value }))}
                  className="text-xs h-7 w-32"
                />
                <div className="flex space-x-1">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setNewNote(prev => ({ ...prev, color: color.name }))}
                      className={`w-4 h-4 rounded-full ${color.bg} ${color.border} border-2 ${
                        newNote.color === color.name ? 'ring-2 ring-gray-400' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" onClick={createNote}>Save</Button>
                <Button size="sm" variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Notes List */}
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => {
            const colorClasses = getColorClasses(note.color);
            return (
              <div
                key={note.id}
                className={`p-3 rounded-lg border ${colorClasses.bg} ${colorClasses.border} relative group`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900 line-clamp-1 flex-1">
                    {note.title}
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteNote(note.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>

                <p className="text-xs text-gray-700 mb-2 line-clamp-3">
                  {note.content}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(note.updatedAt)}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <StickyNote className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">
              {searchQuery ? 'No notes match your search' : 'No notes yet'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotesSection;
