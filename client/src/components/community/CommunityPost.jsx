import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CommunityPost = ({ post }) => {
  const navigate = useNavigate();

  const handleViewJourney = () => {
    if (post.shareToken) {
      navigate(`/trips/share/${post.shareToken}`);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 group">
      
      {/* Avatar Section */}
      <div className="w-12 h-12 shrink-0 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center font-display text-xl overflow-hidden mt-1 shadow-sm">
        {post.author?.avatar ? (
          <img src={post.author.avatar} alt="Author" className="w-full h-full object-cover" />
        ) : (
          getInitials(post.author?.name)
        )}
      </div>

      {/* Content Block */}
      <div className="flex-1 w-full bg-surface-primary border border-border-default rounded-[var(--radius-2xl)] p-6 md:p-8 shadow-sm">
        
        {/* User / Date Metadata */}
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-4">
          <div className="text-(length:--text-body) font-bold text-primary">
            {post.author?.name || 'Anonymous Traveler'}
          </div>
          <div className="text-(length:--text-caption) text-secondary">
            {new Date(post.createdAt || Date.now()).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Trip Info */}
        <div className="mb-6">
          <h3 className="font-display text-(length:--text-heading-md) text-primary mb-3">
            {post.title || 'Untitled Experience'}
          </h3>
          
          <div className="flex flex-wrap items-center gap-4 text-(length:--text-caption) text-stone font-bold uppercase tracking-wider mb-5">
            {post.destination && (
              <div className="flex items-center gap-1.5">
                <MapPin size={14} className="text-terracotta" />
                {post.destination}
              </div>
            )}
            {post.startDate && (
              <div className="flex items-center gap-1.5">
                <Calendar size={14} className="text-secondary" />
                {new Date(post.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' })}
                {post.endDate && ` — ${new Date(post.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' })}`}
              </div>
            )}
          </div>

          {post.description && (
            <p className="text-(length:--text-body-lg) text-secondary leading-relaxed font-serif mb-4">
              {post.description}
            </p>
          )}

          {/* Optional Image inside content block */}
          {post.coverImage && (
             <div className="w-full h-64 mt-6 rounded-[var(--radius-xl)] overflow-hidden bg-surface-muted border border-border-subtle">
               <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
             </div>
          )}
        </div>

        {/* Action */}
        <div className="pt-4 border-t border-border-subtle">
          <button 
            onClick={handleViewJourney}
            disabled={!post.shareToken}
            title={!post.shareToken ? 'This experience is currently unavailable for viewing.' : ''}
            className="flex items-center gap-2 text-(length:--text-body-sm) font-bold uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-primary hover:text-terracotta"
          >
            View Experience <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityPost;
