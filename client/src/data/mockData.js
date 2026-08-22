// Mock data for development when backend is unavailable

export const mockTrips = [
  {
    id: 'trip-1',
    title: 'Alpine Expedition',
    coverImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80',
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(), // 14 days from now
    destinations: ['Zurich', 'Zermatt', 'Geneva'],
    status: 'Upcoming'
  },
  {
    id: 'trip-2',
    title: 'Mediterranean Coast',
    coverImage: 'https://images.unsplash.com/photo-1516483638261-f4088921eece?auto=format&fit=crop&q=80',
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    destinations: ['Amalfi', 'Positano', 'Capri'],
    status: 'Ongoing'
  },
  {
    id: 'trip-3',
    title: 'Kyoto Sakura Season',
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80',
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180).toISOString(), // 6 months ago
    destinations: ['Kyoto', 'Osaka', 'Nara'],
    status: 'Previous'
  },
  {
    id: 'trip-4',
    title: 'Nordic Lights',
    coverImage: 'https://images.unsplash.com/photo-1579540455088-2580a6b5d929?auto=format&fit=crop&q=80', // Replace with aurora if preferred
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString(),
    destinations: ['Tromso', 'Reykjavik'],
    status: 'Upcoming'
  }
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
