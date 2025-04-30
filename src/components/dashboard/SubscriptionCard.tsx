
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Bell, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const SubscriptionCard = () => {
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriberLoading, setSubscriberLoading] = useState(false);

  React.useEffect(() => {
    if (user) {
      checkSubscriptionStatus();
    }
  }, [user]);

  const checkSubscriptionStatus = async () => {
    if (!user) return;
    
    setSubscriberLoading(true);
    try {
      // Check if user is subscribed
      const { data: subscriberData, error: subscriberError } = await supabase
        .from('subscribers')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (subscriberError) throw subscriberError;
      
      setIsSubscribed(!!subscriberData);
      
    } catch (error) {
      console.error("Error checking subscription:", error);
    } finally {
      setSubscriberLoading(false);
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
        
        toast.success("You have been unsubscribed from IRMAI updates");
        setIsSubscribed(false);
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
        setIsSubscribed(true);
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast.error("Failed to update your subscription");
    } finally {
      setSubscriberLoading(false);
    }
  };

  return (
    <Card className="col-span-1 border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center">
          <Bell className="h-4 w-4 mr-2 text-primary" />
          <CardTitle className="text-base">Subscription Status</CardTitle>
        </div>
        <Separator />
      </CardHeader>
      <CardContent className="pt-0 pb-0">
        <div className="flex items-center justify-between py-4">
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
              disabled={subscriberLoading}
              onCheckedChange={handleSubscriptionToggle} 
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        {subscriberLoading ? (
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
