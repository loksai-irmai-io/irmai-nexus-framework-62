
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  UserCircle, 
  Menu, 
  Bell, 
  Settings, 
  LogOut, 
  User,
  Loader2,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import SidebarLogo from './SidebarLogo';
import { useSidebar } from './SidebarProvider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const Header = () => {
  const { user, signOut } = useAuth();
  const { toggleSidebar } = useSidebar();
  const [notifications, setNotifications] = useState([]);
  const [subscriberLoading, setSubscriberLoading] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Fetch subscription status using React Query
  const { data: subscriptionData, isLoading } = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (error) throw error;
      return data;
    },
    enabled: !!user,
    staleTime: 1000 * 60 // 1 minute
  });
  
  const isSubscribed = !!subscriptionData;
  
  const handleSignOut = async () => {
    await signOut();
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
        
        toast.success("You have been unsubscribed from IRMAI updates");
        queryClient.invalidateQueries({ queryKey: ['subscription', user.id] });
      } else {
        // Subscribe
        const { error } = await supabase
          .from('subscribers')
          .insert({
            user_id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || ''
          });
          
        if (error) throw error;
        
        // Send confirmation email
        try {
          await supabase.functions.invoke('send-auth-email', {
            body: { 
              email: user.email, 
              type: 'subscribe',
              name: user.user_metadata?.full_name || ''
            }
          });
        } catch (emailError) {
          console.error("Error sending subscription confirmation:", emailError);
        }
        
        toast.success("You have been subscribed to IRMAI updates");
        queryClient.invalidateQueries({ queryKey: ['subscription', user.id] });
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast.error("Failed to update your subscription");
    } finally {
      setSubscriberLoading(false);
    }
  };

  // Set up realtime subscription when component mounts
  useEffect(() => {
    if (!user) return;
    
    // Set up subscription for notifications and subscriber changes
    const channel = supabase.channel('header-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'subscribers', filter: `user_id=eq.${user.id}` }, 
        (payload) => {
          console.log('Subscribers table changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['subscription', user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  return (
    <header className="h-16 bg-background border-b flex items-center px-4 sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={toggleSidebar}
          data-sidebar-toggle
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Link to="/dashboard" className="flex items-center gap-2">
          <SidebarLogo isOpen={true} />
          <span className="font-semibold text-xl hidden md:inline-block">IRMAI</span>
        </Link>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {user && (
          <Button
            variant={isSubscribed ? "success" : "outline"}
            size="sm"
            className="flex items-center gap-1 mr-2"
            onClick={handleSubscriptionToggle}
            disabled={subscriberLoading || isLoading}
          >
            {subscriberLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Mail className="h-4 w-4" />
            )}
            <span className="hidden sm:inline-block">
              {isSubscribed ? "Subscribed" : "Subscribe to Updates"}
            </span>
            <span className="inline-block sm:hidden">
              {isSubscribed ? "Subscribed" : "Subscribe"}
            </span>
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full relative"
            >
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {user && (
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-sm">Subscribe to Updates</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Receive new feature announcements and important updates
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isSubscribed && <Badge variant="secondary" className="bg-green-500 text-white">Subscribed</Badge>}
                    <Switch 
                      checked={isSubscribed} 
                      disabled={subscriberLoading || isLoading}
                      onCheckedChange={handleSubscriptionToggle} 
                    />
                  </div>
                </div>
                
                {(subscriberLoading || isLoading) && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground w-full justify-center mt-4">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Updating subscription...</span>
                  </div>
                )}
              </div>
            )}
            
            <DropdownMenuSeparator />
            
            {notifications.length === 0 ? (
              <div className="text-center p-4 text-muted-foreground text-sm">
                No new notifications
              </div>
            ) : (
              // Render notifications here if needed
              <div className="text-center p-4 text-muted-foreground text-sm">
                Notification list would go here
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full"
              >
                <UserCircle className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                {user?.email || 'My Account'}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                <User className="h-4 w-4 mr-2" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/api-integrations')} className="cursor-pointer">
                <Settings className="h-4 w-4 mr-2" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                <LogOut className="h-4 w-4 mr-2" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="ghost" onClick={() => navigate('/auth')}>
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
