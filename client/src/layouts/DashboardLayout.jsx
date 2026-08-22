import { Outlet } from 'react-router-dom';
import DashboardHeader from '../components/dashboard/DashboardHeader';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <DashboardHeader />
      <main className="flex-1 w-full max-w-[var(--content-max-width)] mx-auto px-[var(--page-padding)] py-8 md:py-12">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
