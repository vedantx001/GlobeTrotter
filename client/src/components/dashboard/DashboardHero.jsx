import { useNavigate } from 'react-router-dom';
import coverImage from '../../assets/Cover_image.jpeg';

const DashboardHero = ({ userName }) => {
  const navigate = useNavigate();
  return (
    <div className="relative w-full h-[400px] md:h-[480px] rounded-[var(--radius-3xl)] overflow-hidden mb-12 bg-[#1a1a1a] group">
      <style>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .hero-eyebrow {
          opacity: 0;
          animation: heroFadeIn 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
        }
        .hero-heading {
          opacity: 0;
          animation: heroFadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
        }
        .hero-desc {
          opacity: 0;
          animation: heroFadeIn 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards;
        }
        .hero-cta {
          opacity: 0;
          animation: heroFadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.55s forwards;
        }
      `}</style>

      {/* Banner Image */}
      <img 
        src={coverImage} 
        alt="Travel banner" 
        className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[20s] ease-out group-hover:scale-105"
      />
      
      {/* Luxury Cinematic Overlay */}
      <div 
        className="absolute inset-0 backdrop-blur-[1px]"
        style={{
          background: 'linear-gradient(90deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.22) 35%, rgba(0,0,0,0) 65%)'
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end px-8 pb-12 md:px-16 md:pb-[70px] lg:px-[72px] lg:pb-[80px]">
        <div className="max-w-3xl">
          
          {/* Eyebrow */}
          <div className="hero-eyebrow mb-4">
            <span className="text-[12px] md:text-[14px] font-medium tracking-[0.18em] uppercase text-[#FAF7F2]/80">
              Your Personal Travel Hub
            </span>
          </div>

          {/* Heading */}
          <h1 
            className="hero-heading text-[#FAF7F2] font-medium mb-6 drop-shadow-lg"
            style={{ 
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(48px, 5vw + 1rem, 88px)',
              lineHeight: '1.05',
              letterSpacing: '-0.02em',
              textShadow: '0 4px 24px rgba(0,0,0,0.25)'
            }}
          >
            Welcome back, {userName?.split(' ')[0] || 'Traveler'}.
          </h1>

          {/* Description */}
          <p className="hero-desc text-[20px] md:text-[24px] text-[rgba(255,255,255,0.92)] max-w-[560px] leading-relaxed mb-10 font-light drop-shadow">
            Continue crafting unforgettable journeys, discover hidden destinations, and bring your next adventure to life.
          </p>

          {/* CTA Button */}
          <div className="hero-cta w-fit">
            <button 
              onClick={() => navigate('/trips/new')}
              className="relative overflow-hidden group/btn flex items-center gap-3 px-8 py-4 bg-[#FAF7F2]/90 backdrop-blur-md text-gray-900 font-medium rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#FAF7F2] hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[0_16px_40px_rgba(0,0,0,0.2)]"
            >
              <span>Plan Your Next Journey</span>
              <span className="transition-transform duration-500 group-hover/btn:translate-x-1">→</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardHero;
