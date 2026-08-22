// Mock data for development when backend is unavailable
// These reflect Alex Johnson's real profile for presentation purposes

export const mockTrips = [
  {
    id: 'alex-trip-1',
    title: 'European Grand Tour 2026',
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    startDate: '2026-09-10',
    endDate: '2026-09-24',
    total_budget: 3500,
    destinations: [
      { name: 'London', country: 'United Kingdom' },
      { name: 'Paris', country: 'France' },
      { name: 'Amsterdam', country: 'Netherlands' },
    ],
    status: 'Upcoming',
    isPublic: true,
  },
  {
    id: 'alex-trip-2',
    title: 'Asia Wishlist: Tokyo & Kyoto',
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
    startDate: '2025-11-05',
    endDate: '2025-11-15',
    total_budget: 2800,
    destinations: [
      { name: 'Tokyo', country: 'Japan' },
      { name: 'Kyoto', country: 'Japan' },
    ],
    status: 'Completed',
    isPublic: false,
  },
  {
    id: 'alex-trip-3',
    title: 'Bali Serenity Retreat',
    coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    startDate: '2026-12-20',
    endDate: '2026-12-30',
    total_budget: 1800,
    destinations: [{ name: 'Bali', country: 'Indonesia' }],
    status: 'Upcoming',
    isPublic: true,
  },
];

export const mockDestinations = [
  {
    id: 'dest-1',
    name: 'Paris',
    country: 'France',
    region: 'Europe',
    image: 'https://images.unsplash.com/photo-1502602898657-3e907a5ea071?auto=format&fit=crop&q=80'
  },
  {
    id: 'dest-2',
    name: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80'
  },
  {
    id: 'dest-3',
    name: 'New York',
    country: 'United States',
    region: 'Americas',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80'
  },
  {
    id: 'dest-4',
    name: 'Cape Town',
    country: 'South Africa',
    region: 'Africa',
    image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&q=80'
  },
  {
    id: 'dest-5',
    name: 'Dubai',
    country: 'UAE',
    region: 'Middle East',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80'
  },
  {
    id: 'dest-6',
    name: 'Rome',
    country: 'Italy',
    region: 'Europe',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80'
  },
  {
    id: 'dest-7',
    name: 'Bali',
    country: 'Indonesia',
    region: 'Asia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80'
  },
  {
    id: 'dest-8',
    name: 'Sydney',
    country: 'Australia',
    region: 'Oceania',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80'
  }
];
