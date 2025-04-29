
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Loader2, Save, Bell, User, ShieldCheck } from 'lucide-react';

export default function Profile() {
  const { user, session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [subscriberLoading, setSubscriberLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    avatar_url: ''
  });
  const [isSubscribed, setIsSubscribed] = useState(false);
  const navigate = useNavigate();

  // Fetch profile data
  useEffect(() => {
    if (!user) return;
    
    const fetchProfile = async () => {
      setLoading(true);
      try {
        // Get user data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError) throw profileError;
        
        // Check if user is subscribed
        const { data: subscriberData, error: subscriberError } = await supabase
          .from('subscribers')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (subscriberError) throw subscriberError;
        
        setIsSubscribed(!!subscriberData);
        
        // Set profile data from both auth and profile table
        setProfileData({
          full_name: profileData?.full_name || user.user_metadata?.full_name || '',
          email: user.email || '',
          avatar_url: profileData?.avatar_url || ''
        });
        
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          variant: "destructive",
          title: "Error loading profile",
          description: "Failed to load your profile data."
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user]);

  const updateProfile = async () => {
    if (!user) return;
    
    setSaveLoading(true);
    try {
      // Update profile data
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          avatar_url: profileData.avatar_url
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { full_name: profileData.full_name }
      });
      
      if (updateError) throw updateError;
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated."
      });
      
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Failed to update your profile."
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSubscriptionToggle = async () => {
    if (!user) return;
    
    setSubscriberLoading(true);
    try {
      if (isSubscribed) {
        // Unsubscribe
        const { error } = await supabase
          .from('subscribers')
          .delete()
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        toast({
          title: "Unsubscribed",
          description: "You have been unsubscribed from IRMAI updates."
        });
        
        setIsSubscribed(false);
      } else {
        // Subscribe
        const { error } = await supabase
          .from('subscribers')
          .insert({
            user_id: user.id,
            email: user.email,
            name: profileData.full_name
          });
          
        if (error) throw error;
        
        // Send confirmation email
        try {
          await supabase.functions.invoke('send-auth-email', {
            body: { 
              email: user.email, 
              type: 'subscribe'
            }
          });
        } catch (emailError) {
          console.error("Error sending subscription confirmation:", emailError);
        }
        
        toast({
          title: "Subscribed",
          description: "You have been subscribed to IRMAI updates."
        });
        
        setIsSubscribed(true);
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast({
        variant: "destructive",
        title: "Subscription update failed",
        description: "Failed to update your subscription."
      });
    } finally {
      setSubscriberLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <Layout>
      <div className="container py-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Profile Settings</h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User size={16} />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell size={16} />
              <span>Notifications</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>User Profile</CardTitle>
                <CardDescription>
                  Manage your account information and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={profileData.email} 
                    disabled 
                    className="bg-muted" 
                  />
                  <p className="text-sm text-muted-foreground">
                    Email address cannot be changed directly.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={profileData.full_name} 
                    onChange={e => setProfileData({...profileData, full_name: e.target.value})} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="avatar">Avatar URL</Label>
                  <Input 
                    id="avatar" 
                    value={profileData.avatar_url || ''} 
                    onChange={e => setProfileData({...profileData, avatar_url: e.target.value})} 
                    placeholder="https://example.com/avatar.jpg" 
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={updateProfile} 
                  disabled={saveLoading}
                  className="flex items-center gap-2"
                >
                  {saveLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>
                  Control which updates you want to receive from IRMAI.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between py-4">
                  <div>
                    <h4 className="font-medium">Subscribe to Updates</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive emails when new features, updates, and important information is available.
                    </p>
                  </div>
                  <Switch 
                    checked={isSubscribed} 
                    disabled={subscriberLoading}
                    onCheckedChange={handleSubscriptionToggle} 
                  />
                </div>
                
                {subscriberLoading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Updating subscription preferences...</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <Card className="bg-muted/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Account Security</CardTitle>
              </div>
              <CardDescription>
                Manage your account security settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">
                For security reasons, use the login page to reset your password or update authentication methods.
              </p>
              <Button
                variant="outline"
                onClick={() => navigate('/auth')}
              >
                Go to Login Page
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
