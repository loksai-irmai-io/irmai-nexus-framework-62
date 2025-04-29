
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Save, User, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const ProfileCard = () => {
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    avatar_url: ''
  });
  
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  React.useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    if (!user) return;
    
    setProfileLoading(true);
    try {
      // Get user data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (profileError) throw profileError;
      
      // Set profile data from both auth and profile table
      setProfileData({
        full_name: profileData?.full_name || user.user_metadata?.full_name || '',
        email: user.email || '',
        avatar_url: profileData?.avatar_url || ''
      });

      // Set last updated time
      if (profileData?.updated_at) {
        setLastUpdated(profileData.updated_at);
      }
      
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load your profile data.");
    } finally {
      setProfileLoading(false);
    }
  };
  
  const updateProfile = async () => {
    if (!user) return;
    
    setProfileSaving(true);
    try {
      // Update profile data
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          avatar_url: profileData.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { full_name: profileData.full_name }
      });
      
      if (updateError) throw updateError;
      
      toast.success("Profile information has been updated");
      
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update your profile");
    } finally {
      setProfileSaving(false);
    }
  };

  return (
    <Card className="mb-6 overflow-hidden border-primary/10">
      <CardHeader className="bg-muted/30">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/10">
              {profileData.avatar_url ? (
                <AvatarImage src={profileData.avatar_url} alt={profileData.full_name || 'User'} />
              ) : (
                <AvatarFallback className="text-xl bg-primary/10">
                  {profileData.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || '?'}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <CardTitle className="mb-1">Welcome, {profileData.full_name || 'User'}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                <span>{profileData.email}</span>
              </CardDescription>
              {lastUpdated && (
                <p className="text-xs text-muted-foreground mt-1">
                  Last updated: {new Date(lastUpdated).toLocaleString()}
                </p>
              )}
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/profile')} 
            className="ml-auto"
          >
            View Full Profile
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="flex gap-2">
                <Input 
                  id="name" 
                  value={profileData.full_name} 
                  onChange={e => setProfileData({...profileData, full_name: e.target.value})}
                  disabled={profileLoading || profileSaving}
                />
                <Button 
                  onClick={updateProfile} 
                  disabled={profileLoading || profileSaving}
                >
                  {profileSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Saving
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input 
                id="avatar" 
                value={profileData.avatar_url || ''} 
                onChange={e => setProfileData({...profileData, avatar_url: e.target.value})}
                placeholder="https://example.com/avatar.jpg" 
                disabled={profileLoading || profileSaving}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
