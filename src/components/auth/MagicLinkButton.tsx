
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface MagicLinkButtonProps {
  onMagicLink: (e: React.MouseEvent) => Promise<void>;
  loading?: boolean;
}

export const MagicLinkButton = ({ onMagicLink, loading: parentLoading }: MagicLinkButtonProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleClick = async (e: React.MouseEvent) => {
    setLoading(true);
    try {
      await onMagicLink(e);
    } catch (error: any) {
      console.error("Magic link error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send magic link",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="link"
      className="p-0 h-auto font-normal text-muted-foreground"
      onClick={handleClick}
      disabled={loading || parentLoading}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
          Sending...
        </>
      ) : (
        "Send magic link"
      )}
    </Button>
  );
};
