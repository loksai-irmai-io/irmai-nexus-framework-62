
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  UserCircle, 
  Menu, 
  Bell, 
  LogOut, 
  User,
  Loader2,
  BellPlus
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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const Header = () => {
  const { user, signOut } = useAuth();
  const { toggleSidebar } = useSidebar();
  const [notifications, setNotifications] = useState([]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  // Use React Query for subscription status
  const { data: subscriberData, isLoading: isSubscriptionLoading } = useQuery({
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
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Subscription mutation
  const subscriptionMutation = useMutation({
    mutationFn: async (subscribe: boolean) => {
      if (!user) throw new Error("No authenticated user");
      
      if (subscribe) {
        // Subscribe
        const { data, error } = await supabase
          .from('subscribers')
          .insert({
            user_id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || ''
          })
          .select()
          .single();
          
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
        
        return data;
      } else {
        // Unsubscribe
        const { error } = await supabase
          .from('subscribers')
          .delete()
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        return null;
      }
    },
    onSuccess: (data, variables) => {
      if (variables) {
        toast.success("You have been subscribed to IRMAI updates");
      } else {
        toast.success("You have been unsubscribed from IRMAI updates");
      }
      queryClient.invalidateQueries({ queryKey: ['subscription', user?.id] });
    },
    onError: (error) => {
      console.error("Error updating subscription:", error);
      toast.error("Failed to update your subscription");
    }
  });

  const handleSubscriptionToggle = async () => {
    if (!user) return;
    
    try {
      await subscriptionMutation.mutateAsync(!isSubscribed);
    } catch (error) {
      console.error("Error handling subscription:", error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  // Setup realtime listener for subscription changes
  useEffect(() => {
    if (user) {
      const channel = supabase
        .channel('subscription-changes-header')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'subscribers', filter: `user_id=eq.${user?.id}` },
          (payload) => {
            console.log('Subscription updated in real-time (header):', payload);
            queryClient.invalidateQueries({ queryKey: ['subscription', user.id] });
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, queryClient]);

  const isSubscribed = !!subscriberData;
  const loading = isSubscriptionLoading || subscriptionMutation.isPending;

  return (
    <header className="h-16 bg-background border-b flex items-center px-4 sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Link to="/dashboard" className="flex items-center gap-2">
          <SidebarLogo isOpen={true} />
          <span className="font-semibold text-xl hidden md:inline-block">IRMAI</span>
        </Link>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Subscribe to Updates Button */}
        {user && (
          <Button
            variant={isSubscribed ? "success" : "outline"}
            size="sm"
            className="mr-1 hidden sm:flex"
            onClick={handleSubscriptionToggle}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isSubscribed ? "Unsubscribing..." : "Subscribing..."}
              </>
            ) : (
              <>
                <BellPlus className="h-4 w-4 mr-2" />
                {isSubscribed ? "Subscribed" : "Subscribe to Updates"}
              </>
            )}
          </Button>
        )}

        {user && (
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
                      disabled={loading}
                      onCheckedChange={handleSubscriptionToggle} 
                    />
                  </div>
                </div>
                
                {loading ? (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground w-full justify-center mt-4">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Updating subscription...</span>
                  </div>
                ) : null}
              </div>
              
              <DropdownMenuSeparator />
              
              {notifications.length === 0 ? (
                <div className="text-center p-4 text-muted-foreground text-sm">
                  No new notifications
                </div>
              ) : (
                <div className="text-center p-4 text-muted-foreground text-sm">
                  Notification list would go here
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {user && (
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
              <DropdownMenuItem onClick={() => navigate('/api-integrations')} className="cursor-pointer">
                <User className="h-4 w-4 mr-2" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                <LogOut className="h-4 w-4 mr-2" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default Header;
