
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Calendar, ExternalLink } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  description: string;
  link: string;
}

interface AnnouncementsListProps {
  announcements: Announcement[];
  dataLoaded: boolean;
}

const AnnouncementsList: React.FC<AnnouncementsListProps> = ({ announcements, dataLoaded }) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="h-5 w-5 text-primary mr-2" />
            <CardTitle>Announcements</CardTitle>
          </div>
          <Badge variant="outline" className="font-normal">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            Updated: {new Date().toLocaleDateString()}
          </Badge>
        </div>
        <CardDescription>Important updates and notices</CardDescription>
      </CardHeader>
      <CardContent>
        {dataLoaded ? (
          <div className="space-y-4">
            {announcements.length > 0 ? (
              announcements.map((announcement) => (
                <div 
                  key={announcement.id} 
                  className="p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center mb-1">
                        <h4 className="font-medium">{announcement.title}</h4>
                        <Badge 
                          variant="outline" 
                          className={`ml-2 text-xs ${
                            announcement.priority === 'high' ? 'bg-red-100 text-red-800 border-red-300' :
                            announcement.priority === 'medium' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                            'bg-blue-100 text-blue-800 border-blue-300'
                          }`}
                        >
                          {announcement.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{announcement.description}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(announcement.date).toLocaleDateString()}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs h-8"
                      onClick={() => navigate(announcement.link)}
                    >
                      View Details
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center p-8 text-muted-foreground">
                <p>No announcements at this time.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted/20 rounded-lg animate-pulse"></div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnnouncementsList;
