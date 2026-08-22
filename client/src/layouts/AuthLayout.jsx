import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-ivory flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-warm-white rounded-xl shadow-card p-8 border border-warm">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
