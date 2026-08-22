import { Outlet, Link, useLocation } from 'react-router-dom';
import loginSvg from '../assets/login.svg';
import signupSvg from '../assets/sign-up.svg';
import logo from '../assets/logo.png';

const AuthLayout = () => {
  const location = useLocation();
  const isRegister = location.pathname.includes('register');
  const currentIllustration = isRegister ? signupSvg : loginSvg;
  const illustrationAlt = isRegister ? 'GlobeTrotter Sign Up Illustration' : 'GlobeTrotter Login Illustration';

  return (
    <div className="relative min-h-screen bg-ivory flex flex-col md:flex-row overflow-hidden">
      {/* Refined Minimal Abstract Background (Static, non-grid, no blur) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Soft, quiet sculptural plane - paper-like geometry */}
        <div className="absolute top-0 right-0 w-[50vw] h-[120vh] bg-warm-white/60 border-l border-border-subtle transform origin-top-right -rotate-2 mix-blend-multiply"></div>
        {/* Subtle architectural intersection */}
        <div className="absolute -bottom-[20vh] -left-[10vw] w-[60vw] h-[50vh] bg-surface-muted/40 border-t border-border-subtle transform rotate-3 rounded-tr-[80px] mix-blend-multiply"></div>
      </div>

      {/* Left Column: Brand, SVG Illustration & Editorial Context */}
      <div className="relative z-10 w-full md:w-5/12 lg:w-1/2 p-8 md:px-12 lg:px-16 xl:px-20 lg:py-10 flex flex-col justify-between">
        <header className="flex items-center">
          <Link
            to="/login"
            className="inline-flex items-center hover:opacity-80 transition-opacity"
            aria-label="GlobeTrotter Home"
          >
            <img 
              src={logo} 
              alt="GlobeTrotter Logo" 
              className="object-contain"
              style={{ height: '40px', width: 'auto' }} 
            />
          </Link>
        </header>

        {/* Dynamic SVG Illustration in the left side space */}
        <div className="hidden md:flex flex-1 items-center justify-center my-4 py-2">
          <img
            src={currentIllustration}
            alt={illustrationAlt}
            className="w-full max-w-[360px] lg:max-w-[420px] max-h-[44vh] object-contain drop-shadow-sm transition-transform duration-300 hover:scale-[1.02]"
          />
        </div>

        <div className="hidden md:block pb-4">
          <h2 className="font-display text-(length:--text-heading-lg) text-primary leading-[1.05] max-w-[420px]">
            {isRegister ? 'Begin your journey.' : 'Curate your next expedition.'}
          </h2>
          <p className="text-secondary text-(length:--text-body) mt-3 max-w-[360px]">
            {isRegister
              ? 'Join our community of travelers and craft unforgettable, personalized adventures.'
              : 'Access your personalized itineraries, elegant bookings, and travel memories.'
            }
          </p>
        </div>
      </div>

      {/* Right Column: Auth Card Container */}
      <main className="relative z-10 w-full md:w-7/12 lg:w-1/2 flex items-center justify-center p-6 sm:p-8 md:px-12 lg:px-20 lg:py-8 overflow-y-auto">
        <div className="w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;

