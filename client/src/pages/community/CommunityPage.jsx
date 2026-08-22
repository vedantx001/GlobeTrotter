import { useState, useEffect, useMemo } from 'react';
import { getCommunityFeed } from '../../api/community_api';
import CommunityToolbar from '../../components/community/CommunityToolbar';
import CommunityPost from '../../components/community/CommunityPost';
import CommunityEmptyState from '../../components/community/CommunityEmptyState';
import ShareExperienceModal from '../../components/community/ShareExperienceModal';
import Button from '../../components/common/Button';
import { RefreshCcw, Plus } from 'lucide-react';

const CommunityPage = () => {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [groupBy, setGroupBy] = useState('Destination');
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadFeed = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCommunityFeed();
      // Expecting data to be an array of posts
      setFeed(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Community Feed Error:', err);
      setError('Unable to load the community feed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  // Filter & Sort Logic
  const processedFeed = useMemo(() => {
    let result = [...feed];

    // Simple Filter
    if (filter === 'Recent') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      result = result.filter(post => new Date(post.createdAt || 0) > thirtyDaysAgo);
    }

    // Search
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(post => 
        post.title?.toLowerCase().includes(q) ||
        post.description?.toLowerCase().includes(q) ||
        post.destination?.toLowerCase().includes(q) ||
        post.author?.name?.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      
      if (sortBy === 'Newest') return dateB - dateA;
      if (sortBy === 'Oldest') return dateA - dateB;
      return 0;
    });

    return result;
  }, [feed, filter, debouncedSearch, sortBy]);

  // Grouping Logic
  const groupedFeed = useMemo(() => {
    if (groupBy === 'Destination') {
      const groups = {};
      processedFeed.forEach(post => {
        const key = post.destination || 'Global Explorer';
        if (!groups[key]) groups[key] = [];
        groups[key].push(post);
      });
      // Sort keys alphabetically
      const sortedKeys = Object.keys(groups).sort();
      const sortedGroups = {};
      sortedKeys.forEach(k => { sortedGroups[k] = groups[k] });
      return sortedGroups;
    } 
    if (groupBy === 'User') {
      const groups = {};
      processedFeed.forEach(post => {
        const key = post.author?.name || 'Anonymous Traveler';
        if (!groups[key]) groups[key] = [];
        groups[key].push(post);
      });
      return groups;
    }
    // Default / Trip Grouping (No explicit grouping headers, just list)
    return { 'All Journeys': processedFeed };
  }, [processedFeed, groupBy]);

  return (
    <div className="w-full max-w-6xl mx-auto pb-24 flex flex-col min-h-screen">
      
      {/* Header (Always Visible) */}
      <div className="mb-12 text-center shrink-0">
        <h1 className="font-display text-(length:--text-heading-lg) text-primary mb-3">
          Community tab
        </h1>
        <p className="text-(length:--text-body-lg) text-secondary mx-auto max-w-2xl">
          Shared experiences from journeys and activities.
        </p>
      </div>

      {/* Toolbar & Actions (Always Visible) */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-12 shrink-0">
        <div className="flex-1 w-full">
          <CommunityToolbar 
            searchQuery={searchQuery} onSearchChange={setSearchQuery}
            groupBy={groupBy} onGroupByChange={setGroupBy}
            filter={filter} onFilterChange={setFilter}
            sortBy={sortBy} onSortByChange={setSortBy}
          />
        </div>
        <div className="shrink-0 w-full xl:w-auto flex">
          <Button 
            onClick={() => setIsShareModalOpen(true)} 
            className="w-full xl:w-auto flex items-center justify-center gap-2 py-3.5 px-8 shadow-sm"
          >
            <Plus size={18} /> Share Experience
          </Button>
        </div>
      </div>

      {/* Dynamic Feed Content Area */}
      <div className="flex-1">
        {loading ? (
          <div className="w-full animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-6 mb-12">
                 <div className="w-12 h-12 rounded-full bg-surface-muted shrink-0 mt-1"></div>
                 <div className="flex-1 h-48 bg-surface-muted rounded-[var(--radius-2xl)]"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="w-full py-24 px-6 text-center border border-dashed border-border-strong rounded-[var(--radius-3xl)] bg-surface-primary shadow-sm">
            <p className="text-secondary text-(length:--text-body-lg) mb-8 font-medium">{error}</p>
            <Button onClick={loadFeed} variant="secondary" className="flex items-center justify-center gap-2 mx-auto">
              <RefreshCcw size={16} /> Retry Connection
            </Button>
          </div>
        ) : (
          <>
            {processedFeed.length === 0 ? (
              searchQuery.trim() || filter !== 'All' ? (
                <div className="py-24 text-center text-secondary border border-dashed border-border-strong rounded-[var(--radius-2xl)] bg-surface-primary">
                  No shared journeys match your filters.
                </div>
              ) : (
                <CommunityEmptyState onShare={() => setIsShareModalOpen(true)} />
              )
            ) : (
              <div className="flex flex-col gap-12 mt-8">
                {Object.entries(groupedFeed).map(([groupName, posts]) => (
                  <div key={groupName}>
                    {groupBy !== 'Trip' && (
                      <h2 className="font-display text-(length:--text-heading-sm) text-primary mb-8 border-b border-border-default pb-3 pl-16">
                        {groupName}
                      </h2>
                    )}
                    <div className="flex flex-col gap-10">
                      {posts.map(post => (
                        <CommunityPost key={post.id || post._id || Math.random()} post={post} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Share Modal */}
      <ShareExperienceModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onSuccess={() => {
          setIsShareModalOpen(false);
          loadFeed();
        }}
      />
    </div>
  );
};

export default CommunityPage;
