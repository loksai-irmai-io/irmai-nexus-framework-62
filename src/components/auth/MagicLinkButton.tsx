
import { Loader2 } from 'lucide-react';

interface MagicLinkButtonProps {
  onMagicLink: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
}

export const MagicLinkButton = ({ onMagicLink, loading }: MagicLinkButtonProps) => {
  return (
    <button
      type="button"
      onClick={onMagicLink}
      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
      disabled={loading}
    >
      {loading ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : null}
      Sign in with Magic Link
    </button>
  );
};
