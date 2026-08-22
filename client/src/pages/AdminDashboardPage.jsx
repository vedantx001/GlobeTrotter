import React, { useState, useEffect } from 'react';
import { Users, Plane, Globe, Calendar } from 'lucide-react';
import { adminMockData } from '../data/adminMockData';

// Components
import AdminStatCard from '../components/admin/AdminStatCard';
import UserGrowthChart from '../components/admin/UserGrowthChart';
import TripTrendChart from '../components/admin/TripTrendChart';
import DestinationChart from '../components/admin/DestinationChart';
import CategoryPieChart from '../components/admin/CategoryPieChart';
import SharingAnalyticsChart from '../components/admin/SharingAnalyticsChart';
import RecentActivityTable from '../components/admin/RecentActivityTable';
import TopDestinationsPanel from '../components/admin/TopDestinationsPanel';
import QuickStatsPanel from '../components/admin/QuickStatsPanel';
import AdminEmptyState from '../components/admin/AdminEmptyState';

const AdminDashboardPage = () => {
  const [loading, setLoading] = useState(true);

  // Simulate network request
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const renderSkeletons = () => (
    <div className="space-y-8 pb-12 w-full animate-pulse">
      <div className="h-10 w-64 bg-surface-muted rounded mb-8"></div>
      
      {/* Stats row skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-surface-muted rounded-[var(--radius-2xl)]"></div>
        ))}
      </div>
      
      {/* Charts row 1 skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[400px] bg-surface-muted rounded-[var(--radius-2xl)]"></div>
        <div className="h-[400px] bg-surface-muted rounded-[var(--radius-2xl)]"></div>
      </div>

      {/* Charts row 2 skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[450px] bg-surface-muted rounded-[var(--radius-2xl)]"></div>
        <div className="h-[450px] bg-surface-muted rounded-[var(--radius-2xl)]"></div>
      </div>
    </div>
  );

  if (loading) {
    return renderSkeletons();
  }

  const {
    stats,
    monthlyUserGrowth,
    tripCreationTrends,
    popularDestinations,
    categoryDistribution,
    sharingAnalytics,
    recentActivity,
    topDestinationsRanking,
    quickStats
  } = adminMockData;

  return (
    <div className="w-full pb-12 space-y-8">
      <div className="mb-8">
        <h1 className="font-display text-(length:--text-heading-xl) text-primary tracking-tight">
          Executive Overview
        </h1>
        <p className="text-secondary text-(length:--text-body) mt-2">
          Platform analytics and user engagement metrics.
        </p>
      </div>

      {/* Top Summary Cards: 1 col mobile, 2 col tablet, 4 col desktop */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatCard
          title="Total Users"
          value={stats.totalUsers.value}
          trend={stats.totalUsers.trend}
          isPositive={stats.totalUsers.isPositive}
          icon={Users}
        />
        <AdminStatCard
          title="Total Trips"
          value={stats.totalTrips.value}
          trend={stats.totalTrips.trend}
          isPositive={stats.totalTrips.isPositive}
          icon={Plane}
        />
        <AdminStatCard
          title="Public Shared Trips"
          value={stats.publicTrips.value}
          trend={stats.publicTrips.trend}
          isPositive={stats.publicTrips.isPositive}
          icon={Globe}
        />
        <AdminStatCard
          title="Activities Planned"
          value={stats.activitiesPlanned.value}
          trend={stats.activitiesPlanned.trend}
          isPositive={stats.activitiesPlanned.isPositive}
          icon={Calendar}
        />
      </section>

      {/* Primary Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {monthlyUserGrowth.length > 0 ? (
          <UserGrowthChart data={monthlyUserGrowth} />
        ) : (
          <AdminEmptyState title="No User Data" />
        )}
        
        {tripCreationTrends.length > 0 ? (
          <TripTrendChart data={tripCreationTrends} />
        ) : (
          <AdminEmptyState title="No Trip Data" />
        )}
      </section>

      {/* Secondary Charts & Panels */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {popularDestinations.length > 0 ? (
            <DestinationChart data={popularDestinations} />
          ) : (
            <AdminEmptyState title="No Destination Data" />
          )}
        </div>
        <div className="flex flex-col gap-6">
          {categoryDistribution.length > 0 ? (
            <CategoryPieChart data={categoryDistribution} />
          ) : (
            <AdminEmptyState title="No Category Data" />
          )}
          <QuickStatsPanel data={quickStats} />
        </div>
      </section>

      {/* Sharing & Top Destinations */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {sharingAnalytics.length > 0 ? (
            <SharingAnalyticsChart data={sharingAnalytics} />
          ) : (
            <AdminEmptyState title="No Sharing Data" />
          )}
        </div>
        <div>
          {topDestinationsRanking.length > 0 ? (
            <TopDestinationsPanel data={topDestinationsRanking} />
          ) : (
            <AdminEmptyState title="No Ranking Data" />
          )}
        </div>
      </section>

      {/* Recent Activity Table */}
      <section>
        {recentActivity.length > 0 ? (
          <RecentActivityTable data={recentActivity} />
        ) : (
          <AdminEmptyState title="No Recent Activity" />
        )}
      </section>
    </div>
  );
};

export default AdminDashboardPage;
