import { Users } from 'lucide-react';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';

const CommunityEmptyState = ({ onShare }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-2xl mx-auto py-24 px-6 text-center border border-dashed border-border-strong rounded-[var(--radius-3xl)] bg-surface-primary">
      <div className="w-16 h-16 bg-surface-muted rounded-full flex items-center justify-center mx-auto mb-6 text-secondary">
        <Users size={32} />
      </div>
      <h3 className="font-display text-(length:--text-heading-md) text-primary mb-3">
        No shared journeys yet.
      </h3>
      <p className="text-secondary text-(length:--text-body) max-w-md mx-auto mb-8">
        Share a trip or activity and tell the community about it.
      </p>
      <Button onClick={onShare || (() => navigate('/trips/new'))}>
        Share Experience
      </Button>
    </div>
  );
};

export default CommunityEmptyState;
