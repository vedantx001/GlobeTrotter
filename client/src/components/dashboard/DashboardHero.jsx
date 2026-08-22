import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import { ImagePlus } from 'lucide-react';

const DashboardHero = ({ userName }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // Local state for banner image to simulate upload interaction
  const [bannerUrl, setBannerUrl] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBannerUrl(url);
    }
  };

  return (
    <div className="relative w-full h-[400px] md:h-[480px] rounded-[var(--radius-3xl)] overflow-hidden mb-12 bg-surface-muted border border-border-subtle group">
      {/* Banner Image */}
      {bannerUrl ? (
        <img 
          src={bannerUrl} 
          alt="Travel banner" 
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-warm-ash/30 to-stone/10" />
      )}
      
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Upload Control */}
      <button 
        onClick={() => fileInputRef.current?.click()}
        className="absolute top-4 right-4 z-20 bg-warm-white/90 backdrop-blur-sm text-primary px-3 py-1.5 rounded-[var(--radius-lg)] text-(length:--text-caption) font-medium flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-[var(--shadow-soft)]"
      >
        <ImagePlus size={14} />
        Change cover
      </button>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImageUpload} 
        accept="image/*"
        className="hidden" 
      />

      {/* Content */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end p-8 md:p-12 lg:p-16">
        <div className="max-w-2xl text-warm-white">
          <h1 className="font-display text-(length:--text-heading-xl) mb-4 leading-tight text-white drop-shadow-md">
            Welcome back, {userName?.split(' ')[0] || 'Traveler'}.
          </h1>
          <p className="text-(length:--text-body-lg) text-white/90 mb-8 max-w-md drop-shadow">
            Your next journey is waiting. Discover new destinations or continue planning your upcoming expeditions.
          </p>
          <div className="w-fit">
            <Button 
              onClick={() => navigate('/trips/new')}
              className="bg-white text-primary hover:bg-ivory !w-auto shadow-[var(--shadow-card)]"
            >
              Plan a new trip →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHero;
