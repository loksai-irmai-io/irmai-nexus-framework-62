
interface MagicLinkButtonProps {
  onMagicLink: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
}

export const MagicLinkButton = ({ onMagicLink, loading }: MagicLinkButtonProps) => {
  return (
    <button
      type="button"
      onClick={onMagicLink}
      className="text-blue-600 hover:text-blue-700 text-base font-medium"
      disabled={loading}
    >
      Sign in with magic link
    </button>
  );
};
