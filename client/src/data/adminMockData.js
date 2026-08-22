export const adminMockData = {
  stats: {
    totalUsers: { value: '12,458', trend: '+12.4%', isPositive: true },
    totalTrips: { value: '4,893', trend: '+18.1%', isPositive: true },
    publicTrips: { value: '1,245', trend: '+9.2%', isPositive: true },
    activitiesPlanned: { value: '28,731', trend: '+21.8%', isPositive: true },
  },
  
  monthlyUserGrowth: [
    { name: 'Jan', users: 8200 },
    { name: 'Feb', users: 8600 },
    { name: 'Mar', users: 9100 },
    { name: 'Apr', users: 9800 },
    { name: 'May', users: 10200 },
    { name: 'Jun', users: 10800 },
    { name: 'Jul', users: 11200 },
    { name: 'Aug', users: 11500 },
    { name: 'Sep', users: 11800 },
    { name: 'Oct', users: 12000 },
    { name: 'Nov', users: 12200 },
    { name: 'Dec', users: 12458 },
  ],

  tripCreationTrends: [
    { name: 'Jan', trips: 200 },
    { name: 'Feb', trips: 250 },
    { name: 'Mar', trips: 310 },
    { name: 'Apr', trips: 400 },
    { name: 'May', trips: 450 },
    { name: 'Jun', trips: 520 },
    { name: 'Jul', trips: 580 },
    { name: 'Aug', trips: 600 },
    { name: 'Sep', trips: 540 },
    { name: 'Oct', trips: 480 },
    { name: 'Nov', trips: 410 },
    { name: 'Dec', trips: 450 },
  ],

  popularDestinations: [
    { city: 'Paris', trips: 850 },
    { city: 'Tokyo', trips: 720 },
    { city: 'New York', trips: 680 },
    { city: 'Rome', trips: 590 },
    { city: 'Dubai', trips: 510 },
    { city: 'Singapore', trips: 460 },
    { city: 'Bali', trips: 410 },
    { city: 'London', trips: 390 },
  ],

  categoryDistribution: [
    { name: 'Sightseeing', value: 35 },
    { name: 'Relaxation', value: 25 },
    { name: 'Adventure', value: 20 },
    { name: 'Culture', value: 12 },
    { name: 'Food', value: 8 },
  ],

  sharingAnalytics: [
    { name: 'Jan', shared: 40 },
    { name: 'Feb', shared: 55 },
    { name: 'Mar', shared: 75 },
    { name: 'Apr', shared: 90 },
    { name: 'May', shared: 110 },
    { name: 'Jun', shared: 140 },
    { name: 'Jul', shared: 170 },
    { name: 'Aug', shared: 200 },
    { name: 'Sep', shared: 220 },
    { name: 'Oct', shared: 240 },
    { name: 'Nov', shared: 260 },
    { name: 'Dec', shared: 290 },
  ],

  recentActivity: [
    {
      id: 1,
      user: 'Sarah Jenkins',
      avatar: 'https://i.pravatar.cc/150?u=sarah',
      tripName: 'Summer in Kyoto',
      destination: 'Japan',
      createdDate: 'Oct 12, 2026',
      status: 'Active'
    },
    {
      id: 2,
      user: 'Michael Chen',
      avatar: 'https://i.pravatar.cc/150?u=michael',
      tripName: 'Euro Trip 2027',
      destination: 'France, Italy',
      createdDate: 'Oct 11, 2026',
      status: 'Planning'
    },
    {
      id: 3,
      user: 'Emma Watson',
      avatar: 'https://i.pravatar.cc/150?u=emma',
      tripName: 'Bali Retreat',
      destination: 'Indonesia',
      createdDate: 'Oct 10, 2026',
      status: 'Completed'
    },
    {
      id: 4,
      user: 'David Miller',
      avatar: 'https://i.pravatar.cc/150?u=david',
      tripName: 'NYC Weekend',
      destination: 'USA',
      createdDate: 'Oct 10, 2026',
      status: 'Active'
    },
    {
      id: 5,
      user: 'Sophia Garcia',
      avatar: 'https://i.pravatar.cc/150?u=sophia',
      tripName: 'Desert Adventure',
      destination: 'UAE',
      createdDate: 'Oct 09, 2026',
      status: 'Planning'
    },
    {
      id: 6,
      user: 'James Wilson',
      avatar: 'https://i.pravatar.cc/150?u=james',
      tripName: 'Alps Skiing',
      destination: 'Switzerland',
      createdDate: 'Oct 08, 2026',
      status: 'Planning'
    },
    {
      id: 7,
      user: 'Olivia Brown',
      avatar: 'https://i.pravatar.cc/150?u=olivia',
      tripName: 'Thai Islands',
      destination: 'Thailand',
      createdDate: 'Oct 07, 2026',
      status: 'Active'
    },
    {
      id: 8,
      user: 'Daniel Taylor',
      avatar: 'https://i.pravatar.cc/150?u=daniel',
      tripName: 'London Calling',
      destination: 'UK',
      createdDate: 'Oct 07, 2026',
      status: 'Completed'
    },
    {
      id: 9,
      user: 'Isabella Martinez',
      avatar: 'https://i.pravatar.cc/150?u=isabella',
      tripName: 'Safari Tour',
      destination: 'Kenya',
      createdDate: 'Oct 06, 2026',
      status: 'Planning'
    },
    {
      id: 10,
      user: 'William Anderson',
      avatar: 'https://i.pravatar.cc/150?u=william',
      tripName: 'Patagonia Trek',
      destination: 'Argentina',
      createdDate: 'Oct 05, 2026',
      status: 'Active'
    }
  ],

  topDestinationsRanking: [
    { rank: 1, city: 'Paris', tripsCount: 850, growth: '+15%' },
    { rank: 2, city: 'Tokyo', tripsCount: 720, growth: '+22%' },
    { rank: 3, city: 'Rome', tripsCount: 590, growth: '+8%' },
    { rank: 4, city: 'Bali', tripsCount: 410, growth: '+18%' },
    { rank: 5, city: 'Dubai', tripsCount: 510, growth: '+25%' },
  ],

  quickStats: {
    averageBudget: '$2,450',
    averageTripDuration: '7 Days',
    mostPopularCategory: 'Sightseeing',
    averageDailySpend: '$185',
  }
};
