import { Outlet, Link } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="relative min-h-screen bg-ivory flex flex-col md:flex-row overflow-hidden">
      {/* Refined Minimal Abstract Background (Static, non-grid, no blur) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Soft, quiet sculptural plane - paper-like geometry */}
        <div className="absolute top-0 right-0 w-[50vw] h-[120vh] bg-warm-white/60 border-l border-border-subtle transform origin-top-right -rotate-2 mix-blend-multiply"></div>
        {/* Subtle architectural intersection */}
        <div className="absolute -bottom-[20vh] -left-[10vw] w-[60vw] h-[50vh] bg-surface-muted/40 border-t border-border-subtle transform rotate-3 rounded-tr-[80px] mix-blend-multiply"></div>
      </div>

      {/* Left Column: Brand & Editorial Context */}
      <div className="relative z-10 w-full md:w-5/12 lg:w-1/2 p-8 md:px-12 lg:px-20 lg:py-12 flex flex-col justify-between">
        <header>
          <Link
            to="/"
            className="font-display text-(length:--text-heading-sm) text-primary tracking-tight hover:opacity-80 transition-opacity"
          >
            GlobeTrotter
          </Link>
        </header>

        <div className="hidden md:block mt-auto pb-10">
          <h2 className="font-display text-(length:--text-heading-lg) text-primary leading-[1.05] max-w-[400px]">
            Curate your next expedition.
          </h2>
          <p className="text-secondary text-(length:--text-body) mt-4 max-w-[320px]">
            Access your personalized itineraries, elegant bookings, and travel memories.
          </p>
        </div>
      </div>

      {/* Right Column: Auth Card Container */}
      <main className="relative z-10 w-full md:w-7/12 lg:w-1/2 flex items-center justify-center p-6 sm:p-8 md:px-12 lg:px-20 lg:py-8">
        <div className="w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
