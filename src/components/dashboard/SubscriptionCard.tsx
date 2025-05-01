
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Bell, Loader2, BellPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const SubscriptionCard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [subscriberLoading, setSubscriberLoading] = useState(false);

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
          // Don't throw here, still consider subscription successful
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

  const handleSubscriptionToggle = async (newState: boolean) => {
    setSubscriberLoading(true);
    try {
      await subscriptionMutation.mutateAsync(newState);
    } finally {
      setSubscriberLoading(false);
    }
  };

  // Setup realtime listener for subscription changes
  useEffect(() => {
    if (user) {
      const channel = supabase
        .channel('subscription-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'subscribers', filter: `user_id=eq.${user?.id}` },
          (payload) => {
            console.log('Subscription updated in real-time:', payload);
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
  const loading = isSubscriptionLoading || subscriberLoading;

  return (
    <Card className="col-span-1 border shadow-sm h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center">
          <Bell className="h-5 w-5 mr-2 text-primary" />
          <CardTitle className="text-base">Updates & Notifications</CardTitle>
        </div>
        <Separator />
      </CardHeader>
      <CardContent className="pt-0 pb-0">
        <div className="flex flex-col py-4">
          <div className="flex items-center justify-between mb-4">
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
          
          <Button
            variant={isSubscribed ? "success" : "outline"}
            className="mt-2"
            onClick={() => handleSubscriptionToggle(!isSubscribed)}
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
                {isSubscribed ? "Unsubscribe" : "Subscribe to Updates"}
              </>
            )}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        {loading ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground w-full justify-center">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Updating subscription...</span>
          </div>
        ) : isSubscribed ? (
          <p className="text-xs text-muted-foreground text-center w-full">
            You will receive notifications about new features and updates
          </p>
        ) : (
          <p className="text-xs text-muted-foreground text-center w-full">
            Subscribe to stay informed about new features
          </p>
        )}
      </CardFooter>
    </Card>
  );
};

export default SubscriptionCard;
