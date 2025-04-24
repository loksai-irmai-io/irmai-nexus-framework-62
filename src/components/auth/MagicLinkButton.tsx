
interface MagicLinkButtonProps {
  onMagicLink: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
}

export const MagicLinkButton = ({ onMagicLink, loading }: MagicLinkButtonProps) => {
  return (
    <button
      type="button"
      onClick={onMagicLink}
      className="text-primary hover:underline"
      disabled={loading}
    >
      Sign in with Magic Link
    </button>
  );
};
