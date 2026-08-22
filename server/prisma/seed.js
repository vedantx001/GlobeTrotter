import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";

// Initialize Prisma Client with PrismaMariaDb driver adapter
const url = new URL(process.env.DATABASE_URL || "mysql://root:password@localhost:3306/globetrotter");
const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: parseInt(url.port || "3306"),
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.slice(1),
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting GlobeTrotter database seed...");

  // 1. Clean up existing records in reverse dependency order for idempotency
  console.log("🧹 Cleaning up existing data...");
  await prisma.itineraryActivity.deleteMany();
  await prisma.tripExpense.deleteMany();
  await prisma.tripStop.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.savedDestination.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.city.deleteMany();
  await prisma.user.deleteMany();

  // Common development password bcrypt hash (GlobeTrotter@123)
  const defaultPasswordHash = await bcrypt.hash("GlobeTrotter@123", 10);

  // 2. Seed Users (10 users: 1 Admin + 9 Travelers)
  console.log("👤 Seeding users...");
  const usersData = [
    {
      firstName: "Admin",
      lastName: "User",
      email: "admin@globetrotter.local",
      phone: "+1-555-0100",
      passwordHash: defaultPasswordHash,
      profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
      city: "New York",
      country: "United States",
      role: "ADMIN",
      isActive: true,
      bio: "GlobeTrotter system administrator and avid mountaineer.",
      language: "en",
      currency: "USD",
    },
    {
      firstName: "Alex",
      lastName: "Johnson",
      email: "alex@globetrotter.local",
      phone: "+44-7700-900077",
      passwordHash: defaultPasswordHash,
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      city: "London",
      country: "United Kingdom",
      role: "USER",
      isActive: true,
      bio: "Digital nomad and architectural photographer exploring European capitals.",
      language: "en",
      currency: "GBP",
    },
    {
      firstName: "Sarah",
      lastName: "Connor",
      email: "sarah@globetrotter.local",
      phone: "+1-555-0144",
      passwordHash: defaultPasswordHash,
      profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      city: "San Francisco",
      country: "United States",
      role: "USER",
      isActive: true,
      bio: "Adventure enthusiast, culinary explorer, and solo traveler.",
      language: "en",
      currency: "USD",
    },
    {
      firstName: "Priya",
      lastName: "Sharma",
      email: "priya@globetrotter.local",
      phone: "+91-98200-12345",
      passwordHash: defaultPasswordHash,
      profileImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
      city: "Mumbai",
      country: "India",
      role: "USER",
      isActive: true,
      bio: "Culture lover and heritage preservation researcher.",
      language: "en",
      currency: "INR",
    },
    {
      firstName: "Carlos",
      lastName: "Rodriguez",
      email: "carlos@globetrotter.local",
      phone: "+34-600-112233",
      passwordHash: defaultPasswordHash,
      profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      city: "Madrid",
      country: "Spain",
      role: "USER",
      isActive: true,
      bio: "Food blogger and wine enthusiast with a passion for Mediterranean landscapes.",
      language: "es",
      currency: "EUR",
    },
    {
      firstName: "Elena",
      lastName: "Rostova",
      email: "elena@globetrotter.local",
      phone: "+39-06-69812345",
      passwordHash: defaultPasswordHash,
      profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
      city: "Rome",
      country: "Italy",
      role: "USER",
      isActive: true,
      bio: "Art historian and museum curator traveling the ancient world.",
      language: "it",
      currency: "EUR",
    },
    {
      firstName: "Yuki",
      lastName: "Tanaka",
      email: "yuki@globetrotter.local",
      phone: "+81-90-1234-5678",
      passwordHash: defaultPasswordHash,
      profileImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
      city: "Tokyo",
      country: "Japan",
      role: "USER",
      isActive: true,
      bio: "Tech developer, cycling tourer, and coffee connoisseur.",
      language: "ja",
      currency: "JPY",
    },
    {
      firstName: "Liam",
      lastName: "O'Connor",
      email: "liam@globetrotter.local",
      phone: "+353-87-1234567",
      passwordHash: defaultPasswordHash,
      profileImage: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400",
      city: "Dublin",
      country: "Ireland",
      role: "USER",
      isActive: true,
      bio: "Backpacker and hiking guide eager to explore every continent.",
      language: "en",
      currency: "EUR",
    },
    {
      firstName: "Fatima",
      lastName: "Al-Mansoor",
      email: "fatima@globetrotter.local",
      phone: "+971-50-9876543",
      passwordHash: defaultPasswordHash,
      profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
      city: "Dubai",
      country: "United Arab Emirates",
      role: "USER",
      isActive: true,
      bio: "Luxury travel curator and desert safari specialist.",
      language: "ar",
      currency: "AED",
    },
    {
      firstName: "Marcus",
      lastName: "Vance",
      email: "marcus@globetrotter.local",
      phone: "+1-416-555-0188",
      passwordHash: defaultPasswordHash,
      profileImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400",
      city: "Toronto",
      country: "Canada",
      role: "USER",
      isActive: true,
      bio: "Wildlife filmmaker and outdoor gear tester.",
      language: "en",
      currency: "CAD",
    },
  ];

  const createdUsers = [];
  for (const u of usersData) {
    const user = await prisma.user.create({ data: u });
    createdUsers.push(user);
  }

  // 3. Seed Cities (20 Global Destinations)
  console.log("🏙️ Seeding cities...");
  const citiesData = [
    {
      name: "Paris",
      country: "France",
      region: "Europe",
      costIndex: 4.5,
      popularityScore: 98.5,
      imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
      description: "The City of Light, famed for romantic boulevards, iconic monuments, world-class gastronomy, and vibrant art culture.",
    },
    {
      name: "Tokyo",
      country: "Japan",
      region: "Asia",
      costIndex: 4.2,
      popularityScore: 97.8,
      imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800",
      description: "A dazzling juxtaposition of ultramodern neon skyscrapers, ancient shrines, bullet trains, and unparalleled culinary craft.",
    },
    {
      name: "New York",
      country: "United States",
      region: "North America",
      costIndex: 4.8,
      popularityScore: 96.9,
      imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800",
      description: "The premier global metropolis with world-renowned Broadway theaters, towering skyline views, and eclectic neighborhoods.",
    },
    {
      name: "Rome",
      country: "Italy",
      region: "Europe",
      costIndex: 3.8,
      popularityScore: 95.7,
      imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800",
      description: "The Eternal City, overflowing with ancient Roman architecture, timeless piazzas, Renaissance fountains, and trattorias.",
    },
    {
      name: "Bali",
      country: "Indonesia",
      region: "Asia",
      costIndex: 2.2,
      popularityScore: 94.6,
      imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
      description: "Island paradise celebrated for lush terraced rice paddies, serene volcanic beaches, sacred temples, and holistic wellness.",
    },
    {
      name: "Cairo",
      country: "Egypt",
      region: "Africa",
      costIndex: 2.1,
      popularityScore: 91.4,
      imageUrl: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=800",
      description: "The gateway to antiquity along the legendary Nile River, home of the Great Pyramids of Giza and historic bazaars.",
    },
    {
      name: "London",
      country: "United Kingdom",
      region: "Europe",
      costIndex: 4.6,
      popularityScore: 96.4,
      imageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800",
      description: "A timeless global hub featuring regal palaces, the historic River Thames, West End shows, and legendary museums.",
    },
    {
      name: "Dubai",
      country: "United Arab Emirates",
      region: "Middle East",
      costIndex: 4.4,
      popularityScore: 93.8,
      imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800",
      description: "Futuristic desert oasis known for awe-inspiring architecture, luxury mega-resorts, expansive shopping, and desert safaris.",
    },
    {
      name: "Singapore",
      country: "Singapore",
      region: "Asia",
      costIndex: 4.3,
      popularityScore: 92.9,
      imageUrl: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800",
      description: "The Garden City blending lush biophilic architecture, world-famous hawker centers, and waterfront marvels.",
    },
    {
      name: "Barcelona",
      country: "Spain",
      region: "Europe",
      costIndex: 3.6,
      popularityScore: 94.2,
      imageUrl: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800",
      description: "Vibrant Catalan jewel featuring Antoni Gaudí's whimsical architecture, sun-kissed beaches, and lively tapas culture.",
    },
    {
      name: "Amsterdam",
      country: "Netherlands",
      region: "Europe",
      costIndex: 4.1,
      popularityScore: 93.1,
      imageUrl: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800",
      description: "Picture-perfect canal rings, cycling culture, historic gabled townhouses, and world-class fine art museums.",
    },
    {
      name: "Sydney",
      country: "Australia",
      region: "Oceania",
      costIndex: 4.2,
      popularityScore: 91.8,
      imageUrl: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800",
      description: "Harbourside city with the famed Opera House, Harbour Bridge, golden surf beaches, and relaxed coastal lifestyle.",
    },
    {
      name: "Bangkok",
      country: "Thailand",
      region: "Asia",
      costIndex: 2.3,
      popularityScore: 93.5,
      imageUrl: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800",
      description: "High-energy metropolis with ornate gilded temples, bustling river canals, and legendary street food markets.",
    },
    {
      name: "Istanbul",
      country: "Turkey",
      region: "Europe/Asia",
      costIndex: 2.6,
      popularityScore: 92.3,
      imageUrl: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800",
      description: "The bridge between continents straddling the Bosphorus, rich in Byzantine and Ottoman architectural wonders.",
    },
    {
      name: "Kyoto",
      country: "Japan",
      region: "Asia",
      costIndex: 3.7,
      popularityScore: 94.9,
      imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800",
      description: "The cultural heart of Japan boasting classical wooden temples, serene Zen gardens, bamboo groves, and geisha districts.",
    },
    {
      name: "Los Angeles",
      country: "United States",
      region: "North America",
      costIndex: 4.4,
      popularityScore: 90.7,
      imageUrl: "https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=800",
      description: "Entertainment capital featuring sun-drenched Pacific coastlines, Hollywood glamour, and diverse culinary scenes.",
    },
    {
      name: "Toronto",
      country: "Canada",
      region: "North America",
      costIndex: 3.9,
      popularityScore: 89.6,
      imageUrl: "https://images.unsplash.com/photo-1517090504586-fde19ea6066f?w=800",
      description: "Dynamic multicultural powerhouse anchored by the CN Tower on Lake Ontario with thriving arts and food districts.",
    },
    {
      name: "Cape Town",
      country: "South Africa",
      region: "Africa",
      costIndex: 2.8,
      popularityScore: 91.2,
      imageUrl: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800",
      description: "Stunning coastal city dominated by Table Mountain, penguin beaches, and world-renowned Winelands.",
    },
    {
      name: "Zurich",
      country: "Switzerland",
      region: "Europe",
      costIndex: 5.0,
      popularityScore: 89.2,
      imageUrl: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=800",
      description: "Pristine lakeside financial capital offering Alpine views, historic Old Town alleys, and luxury shopping.",
    },
    {
      name: "Jaipur",
      country: "India",
      region: "Asia",
      costIndex: 2.0,
      popularityScore: 90.5,
      imageUrl: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800",
      description: "The Royal Pink City of Rajasthan, famous for grand hilltop forts, ornate palaces, and vibrant block-print textiles.",
    },
  ];

  const createdCities = [];
  for (const c of citiesData) {
    const city = await prisma.city.create({ data: c });
    createdCities.push(city);
  }

  // 4. Seed Activities (60 Activities - exactly 3 per city)
  console.log("🎟️ Seeding activities...");
  const activitiesSeedSpec = [
    // 0: Paris
    [
      { title: "Eiffel Tower Summit & Champagne", description: "Ascend to the summit for breathtaking panoramic views over Paris with a glass of champagne.", category: "Sightseeing", cost: 45.0, durationHours: 2.5, imageUrl: "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=600" },
      { title: "Louvre Museum Masterpieces Tour", description: "Skip-the-line guided exploration of the Mona Lisa, Venus de Milo, and Winged Victory.", category: "Culture", cost: 65.0, durationHours: 3.5, imageUrl: "https://images.unsplash.com/photo-1565099824688-e93eb20fe622?w=600" },
      { title: "Seine River Sunset Dinner Cruise", description: "Gourmet multi-course French dinner gliding past illuminated Parisian landmarks.", category: "Food & Dining", cost: 95.0, durationHours: 2.0, imageUrl: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600" },
    ],
    // 1: Tokyo
    [
      { title: "Shibuya & Harajuku Culture Walk", description: "Experience the world's busiest pedestrian crossing and vibrant street fashion culture.", category: "Culture", cost: 30.0, durationHours: 3.0, imageUrl: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600" },
      { title: "Tsukiji Outer Market Street Food Tour", description: "Taste fresh sashimi, tamagoyaki, wagyu skewers, and matcha delicacies with a local guide.", category: "Food & Dining", cost: 55.0, durationHours: 2.5, imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600" },
      { title: "Mount Fuji Panoramic Day Trip", description: "Full-day coach trip to Mount Fuji 5th Station, Lake Kawaguchi, and Oshino Hakkai springs.", category: "Adventure", cost: 120.0, durationHours: 8.0, imageUrl: "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=600" },
    ],
    // 2: New York
    [
      { title: "Statue of Liberty & Ellis Island", description: "Ferry cruise and guided historic grounds access to Lady Liberty and immigration museum.", category: "Sightseeing", cost: 35.0, durationHours: 4.0, imageUrl: "https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?w=600" },
      { title: "Broadway Evening Musical Show", description: "Prime orchestra seating for an award-winning musical production in the Theater District.", category: "Culture", cost: 140.0, durationHours: 3.0, imageUrl: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=600" },
      { title: "Central Park Guided Bike Tour", description: "Leisurely cycle through Bethesda Terrace, Bow Bridge, and Strawberry Fields.", category: "Relaxation", cost: 40.0, durationHours: 2.0, imageUrl: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600" },
    ],
    // 3: Rome
    [
      { title: "Colosseum & Roman Forum Guided Walk", description: "Step back into antiquity exploring the gladiatorial arena floor and ancient ruins.", category: "Culture", cost: 55.0, durationHours: 3.0, imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600" },
      { title: "Trastevere Evening Food & Wine Tasting", description: "Sample authentic Roman cacio e pepe, supplì, artisanal gelato, and local Lazio wines.", category: "Food & Dining", cost: 75.0, durationHours: 3.5, imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600" },
      { title: "Vatican Museums & Sistine Chapel", description: "Marvel at Michelangelo's ceiling frescoes and St. Peter's Basilica with priority entry.", category: "Culture", cost: 68.0, durationHours: 4.0, imageUrl: "https://images.unsplash.com/photo-1548625361-195feee8d7c9?w=600" },
    ],
    // 4: Bali
    [
      { title: "Ubud Sacred Monkey Forest & Rice Terraces", description: "Walk among ancient temple banyan trees and majestic Tegalalang rice field valleys.", category: "Sightseeing", cost: 25.0, durationHours: 4.0, imageUrl: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600" },
      { title: "Mount Batur Sunrise Volcano Hike", description: "Pre-dawn trek to the summit crater for breakfast with views above the morning clouds.", category: "Adventure", cost: 60.0, durationHours: 6.0, imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600" },
      { title: "Traditional Balinese Spa & Healing Massage", description: "Herbal floral bath and rejuvenating Balinese lulur body scrub in a tranquil jungle pavilion.", category: "Relaxation", cost: 45.0, durationHours: 2.0, imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600" },
    ],
    // 5: Cairo
    [
      { title: "Giza Pyramids & Sphinx Camel Trek", description: "Stand before the Great Pyramid of Khufu and ride across the desert plateau.", category: "Adventure", cost: 50.0, durationHours: 4.0, imageUrl: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=600" },
      { title: "Khan el-Khalili Bazaar Walking Tour", description: "Immerse in vibrant spice markets, copper crafts, and historic El-Fishawy cafe aromas.", category: "Culture", cost: 25.0, durationHours: 3.0, imageUrl: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=600" },
      { title: "Nile River Traditional Felucca Sail", description: "Peaceful late afternoon wooden sailboat cruise watching the Cairo skyline illuminate.", category: "Relaxation", cost: 30.0, durationHours: 1.5, imageUrl: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600" },
    ],
    // 6: London
    [
      { title: "Tower of London & Crown Jewels", description: "Discover 1,000 years of royal history, Beefeater tales, and the dazzling Crown Jewels.", category: "Sightseeing", cost: 42.0, durationHours: 3.0, imageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600" },
      { title: "West End Historic Pub Crawl", description: "Sample craft ales and hear literary ghost stories in centuries-old London taverns.", category: "Food & Dining", cost: 38.0, durationHours: 2.5, imageUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600" },
      { title: "Thames River Kayaking Expedition", description: "Paddle along London's historic waterway past Battersea and the Houses of Parliament.", category: "Adventure", cost: 58.0, durationHours: 2.0, imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600" },
    ],
    // 7: Dubai
    [
      { title: "Burj Khalifa At the Top Observation Deck", description: "Ascend to Level 148 of the world's tallest building for sweeping desert and gulf views.", category: "Sightseeing", cost: 70.0, durationHours: 2.0, imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600" },
      { title: "Desert 4x4 Safari with BBQ Dinner", description: "Thrilling dune bashing, sandboarding, falconry show, and traditional Bedouin camp feast.", category: "Adventure", cost: 85.0, durationHours: 6.0, imageUrl: "https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=600" },
      { title: "Dubai Marina Luxury Yacht Cruise", description: "Glide past Ain Dubai and the Palm Jumeirah on a modern 50ft motor yacht.", category: "Relaxation", cost: 110.0, durationHours: 3.0, imageUrl: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=600" },
    ],
    // 8: Singapore
    [
      { title: "Gardens by the Bay & Supertree Grove", description: "Explore the Cloud Forest indoor waterfall and the futuristic Flower Dome conservatories.", category: "Sightseeing", cost: 32.0, durationHours: 3.0, imageUrl: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600" },
      { title: "Chinatown & Little India Hawker Feasts", description: "Taste Michelin-rated chicken rice, laksa, satay, and roti prata across bustling food courts.", category: "Food & Dining", cost: 40.0, durationHours: 2.5, imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600" },
      { title: "Sentosa Island Night Safari Adventure", description: "Tram ride through naturalistic nocturnal wildlife habitats under moonlight.", category: "Adventure", cost: 65.0, durationHours: 4.0, imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600" },
    ],
    // 9: Barcelona
    [
      { title: "Sagrada Familia Express Guided Tour", description: "Marvel at Gaudí's soaring basilica columns and kaleidoscopic stained glass windows.", category: "Culture", cost: 48.0, durationHours: 2.0, imageUrl: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600" },
      { title: "Tapas and Sangria Culinary Experience", description: "Sample Iberian ham, patatas bravas, pimientos de padrón, and artisanal sangria in El Born.", category: "Food & Dining", cost: 60.0, durationHours: 3.0, imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600" },
      { title: "Park Güell Architectural Exploration", description: "Stroll through colorful mosaic serpentine benches and fairy-tale pavilions.", category: "Sightseeing", cost: 22.0, durationHours: 2.0, imageUrl: "https://images.unsplash.com/photo-1564221710304-0b37c8b9d729?w=600" },
    ],
    // 10: Amsterdam
    [
      { title: "Van Gogh Museum Masterpiece Tour", description: "Immerse in Sunflowers, Almond Blossom, and the genius of Vincent van Gogh.", category: "Culture", cost: 35.0, durationHours: 2.5, imageUrl: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600" },
      { title: "Historic Canal Ring Boat Cruise", description: "Audio-guided open-top electric boat tour through UNESCO-listed golden age waterways.", category: "Relaxation", cost: 28.0, durationHours: 1.5, imageUrl: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=600" },
      { title: "Dutch Countryside Windmills Bike Tour", description: "Cycle through Zaanse Schans to visit working wooden windmills and artisan cheese farms.", category: "Adventure", cost: 52.0, durationHours: 5.0, imageUrl: "https://images.unsplash.com/photo-1508873696983-2df5703bc20d?w=600" },
    ],
    // 11: Sydney
    [
      { title: "Sydney Opera House Architectural Tour", description: "Step inside the iconic shell sails and world-famous concert halls with an expert guide.", category: "Culture", cost: 45.0, durationHours: 2.0, imageUrl: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600" },
      { title: "Sydney Harbour BridgeClimb Experience", description: "Scale the steel arches 134 meters above Sydney Harbour for unmatched 360-degree views.", category: "Adventure", cost: 195.0, durationHours: 3.5, imageUrl: "https://images.unsplash.com/photo-1524293581917-878a6d017cba?w=600" },
      { title: "Bondi to Coogee Coastal Walk", description: "Scenic clifftop ocean path passing Tamarama, Bronte Beach, and natural rock pools.", category: "Relaxation", cost: 0.0, durationHours: 2.5, imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600" },
    ],
    // 12: Bangkok
    [
      { title: "Grand Palace & Wat Phra Kaew", description: "Gaze upon the Emerald Buddha and spectacular gold-leaf spires of Thai royal architecture.", category: "Culture", cost: 28.0, durationHours: 3.0, imageUrl: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600" },
      { title: "Damnoen Saduak Floating Market Tour", description: "Longtail boat ride through lively canal stalls laden with tropical fruits and hot pad thai.", category: "Food & Dining", cost: 35.0, durationHours: 4.5, imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600" },
      { title: "Traditional Thai Herbal Massage", description: "Ancient restorative pressure-point massage and heated herbal compress therapy.", category: "Relaxation", cost: 30.0, durationHours: 2.0, imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600" },
    ],
    // 13: Istanbul
    [
      { title: "Hagia Sophia & Blue Mosque Historical Walk", description: "Explore magnificent Byzantine mosaics and Ottoman iznik tiles spanning fifteen centuries.", category: "Culture", cost: 35.0, durationHours: 3.0, imageUrl: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600" },
      { title: "Bosphorus Sunset Cruise with Turkish Meze", description: "Sail between Europe and Asia enjoying fresh meze, baklava, and panoramic waterfront palaces.", category: "Food & Dining", cost: 50.0, durationHours: 2.5, imageUrl: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=600" },
      { title: "Grand Bazaar Spice and Treasure Hunt", description: "Navigate covered alleys packed with Persian carpets, Turkish delight, and handmade lanterns.", category: "Sightseeing", cost: 20.0, durationHours: 2.5, imageUrl: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=600" },
    ],
    // 14: Kyoto
    [
      { title: "Fushimi Inari 10,000 Torii Gates Hike", description: "Trek the spiritual scarlet shrine trail winding through sacred Mount Inari forest.", category: "Sightseeing", cost: 15.0, durationHours: 3.0, imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600" },
      { title: "Arashiyama Bamboo Grove & Monkey Park", description: "Stroll through towering green bamboo stalks and meet wild macaques at Iwatayama.", category: "Adventure", cost: 25.0, durationHours: 3.5, imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600" },
      { title: "Authentic Gion Matcha Tea Ceremony", description: "Learn the Zen rituals of powdered green tea preparation in a traditional wooden machiya.", category: "Culture", cost: 45.0, durationHours: 1.5, imageUrl: "https://images.unsplash.com/photo-1545641203-7d072a14e3b2?w=600" },
    ],
    // 15: Los Angeles
    [
      { title: "Hollywood Hills & Sign Hiking Tour", description: "Guided scenic hike through Griffith Park to a stunning vantage point right behind the Hollywood Sign.", category: "Adventure", cost: 35.0, durationHours: 2.5, imageUrl: "https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=600" },
      { title: "Universal Studios Hollywood VIP Pass", description: "Behind-the-scenes backlot tram tour and express theme park attractions access.", category: "Culture", cost: 160.0, durationHours: 7.0, imageUrl: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=600" },
      { title: "Santa Monica Pier & Venice Boardwalk", description: "Beach cruiser ride visiting the famous coaster, Muscle Beach, and street art murals.", category: "Relaxation", cost: 15.0, durationHours: 3.0, imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600" },
    ],
    // 16: Toronto
    [
      { title: "CN Tower EdgeWalk Thrill", description: "Walk hands-free along the outdoor ledge of the CN Tower main pod 356 meters in the air.", category: "Adventure", cost: 175.0, durationHours: 2.0, imageUrl: "https://images.unsplash.com/photo-1517090504586-fde19ea6066f?w=600" },
      { title: "St. Lawrence Market Food Discovery", description: "Sample famous peameal bacon sandwiches, artisanal cheeses, and Canadian butter tarts.", category: "Food & Dining", cost: 42.0, durationHours: 2.5, imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600" },
      { title: "Toronto Islands Sunset Ferry & Bike", description: "Escape to tranquil island beaches and take in the best view of the Toronto city skyline.", category: "Relaxation", cost: 25.0, durationHours: 3.0, imageUrl: "https://images.unsplash.com/photo-1508873696983-2df5703bc20d?w=600" },
    ],
    // 17: Cape Town
    [
      { title: "Table Mountain Cableway & Summit", description: "Revolving cable car ascent to the flat-top summit overlooking the Atlantic Ocean and City Bowl.", category: "Sightseeing", cost: 40.0, durationHours: 3.0, imageUrl: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600" },
      { title: "Cape Point & Boulders Beach Penguins", description: "Encounter endangered African penguins on the white sands and explore the dramatic Cape Point cliffs.", category: "Adventure", cost: 75.0, durationHours: 7.0, imageUrl: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=600" },
      { title: "Stellenbosch Wine Valley Tasting Tour", description: "Private cellar tastings of world-class Pinotage, Chenin Blanc, and artisanal cheese pairings.", category: "Food & Dining", cost: 85.0, durationHours: 5.5, imageUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600" },
    ],
    // 18: Zurich
    [
      { title: "Lake Zurich Scenic Steamboat Cruise", description: "Relax on an authentic historic paddle steamer with snow-capped Alpine mountain views.", category: "Relaxation", cost: 35.0, durationHours: 2.0, imageUrl: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=600" },
      { title: "Swiss Alps & Mount Titlis Day Trip", description: "Glacier cave exploration, revolving cable car ride, and Cliff Walk suspension bridge.", category: "Adventure", cost: 180.0, durationHours: 8.5, imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600" },
      { title: "Lindt Home of Chocolate Tasting Tour", description: "Interactive museum featuring the 9-meter chocolate fountain and unlimited confection tastings.", category: "Food & Dining", cost: 30.0, durationHours: 2.5, imageUrl: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600" },
    ],
    // 19: Jaipur
    [
      { title: "Amber Fort & Palace Heritage Tour", description: "Discover royal Rajput courtyards, Sheesh Mahal mirror palaces, and hilltop fortification walls.", category: "Culture", cost: 25.0, durationHours: 3.5, imageUrl: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600" },
      { title: "Old Pink City Street Food & Bazaars", description: "Indulge in pyaz kachoris, lassi in clay cups, ghewar sweets, and gemstone workshops.", category: "Food & Dining", cost: 20.0, durationHours: 3.0, imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600" },
      { title: "Hot Air Balloon Safari Over Forts", description: "Float gracefully at sunrise over the Aravalli hills and ancient Rajasthani palaces.", category: "Adventure", cost: 160.0, durationHours: 3.0, imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600" },
    ],
  ];

  const createdActivitiesByCityIndex = [];
  for (let i = 0; i < createdCities.length; i++) {
    const city = createdCities[i];
    const activities = activitiesSeedSpec[i];
    const cityActivities = [];
    for (const a of activities) {
      const createdActivity = await prisma.activity.create({
        data: {
          ...a,
          cityId: city.id,
        },
      });
      cityActivities.push(createdActivity);
    }
    createdActivitiesByCityIndex.push(cityActivities);
  }

  // 5. Seed Trips, Stops, Itinerary Activities & Expenses
  console.log("🗺️ Seeding trips, stops, itinerary activities & expenses...");

  const tripsSpec = [
    // Trip 1: Alex Johnson - European Grand Tour (Upcoming, Public)
    {
      userIndex: 1, // Alex
      title: "European Grand Tour 2026",
      description: "Two-week adventure discovering the history, art, and food of London, Paris, and Amsterdam.",
      startDate: new Date("2026-09-10"),
      endDate: new Date("2026-09-24"),
      coverImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
      totalBudget: 3500.0,
      isPublic: true,
      shareToken: "eu-grand-tour-2026",
      stops: [
        {
          cityIndex: 6, // London
          stopOrder: 1,
          startDate: new Date("2026-09-10"),
          endDate: new Date("2026-09-14"),
          notes: "Stay at Covent Garden boutique hotel; explore historic sights and theatres.",
          activities: [
            { activityCityIndex: 6, activityItemIndex: 0, scheduledDate: new Date("2026-09-11"), timeSlot: "Morning", customCost: null, notes: "Arrive early before crowds." },
            { activityCityIndex: 6, activityItemIndex: 2, scheduledDate: new Date("2026-09-12"), timeSlot: "Afternoon", customCost: 55.0, notes: "Booked with group discount." },
            { activityCityIndex: 6, activityItemIndex: 1, scheduledDate: new Date("2026-09-13"), timeSlot: "Evening", customCost: null, notes: "Historic pub crawl through Soho." },
          ],
        },
        {
          cityIndex: 0, // Paris
          stopOrder: 2,
          startDate: new Date("2026-09-14"),
          endDate: new Date("2026-09-19"),
          notes: "Eurostar from London St Pancras to Gare du Nord. Apartment in Le Marais.",
          activities: [
            { activityCityIndex: 0, activityItemIndex: 0, scheduledDate: new Date("2026-09-15"), timeSlot: "Morning", customCost: null, notes: "Summit elevator tickets reserved." },
            { activityCityIndex: 0, activityItemIndex: 1, scheduledDate: new Date("2026-09-16"), timeSlot: "Afternoon", customCost: null, notes: "Meet guide under the Pyramid." },
            { activityCityIndex: 0, activityItemIndex: 2, scheduledDate: new Date("2026-09-17"), timeSlot: "Evening", customCost: 110.0, notes: "Special window table reservation." },
          ],
        },
        {
          cityIndex: 10, // Amsterdam
          stopOrder: 3,
          startDate: new Date("2026-09-19"),
          endDate: new Date("2026-09-24"),
          notes: "Thalys train from Paris to Amsterdam Centraal. Canal side stay.",
          activities: [
            { activityCityIndex: 10, activityItemIndex: 1, scheduledDate: new Date("2026-09-20"), timeSlot: "Morning", customCost: null, notes: "Morning light cruise." },
            { activityCityIndex: 10, activityItemIndex: 0, scheduledDate: new Date("2026-09-21"), timeSlot: "Afternoon", customCost: null, notes: "Audio guide included." },
            { activityCityIndex: 10, activityItemIndex: 2, scheduledDate: new Date("2026-09-22"), timeSlot: "Morning", customCost: 50.0, notes: "Rental bikes provided at hotel." },
          ],
        },
      ],
      expenses: [
        { category: "Transport", title: "Eurostar London to Paris", amount: 180.0, expenseDate: new Date("2026-09-14") },
        { category: "Accommodation", title: "Le Marais Boutique Hotel 5 Nights", amount: 950.0, expenseDate: new Date("2026-09-14") },
        { category: "Meals", title: "Latin Quarter Welcome Bistro Dinner", amount: 125.5, expenseDate: new Date("2026-09-15") },
        { category: "Activities", title: "Special Museum Pass Bundle", amount: 160.0, expenseDate: new Date("2026-09-16") },
      ],
    },

    // Trip 2: Sarah Connor - Japan Blossom Expedition (Completed, Public)
    {
      userIndex: 2, // Sarah
      title: "Japan Blossom & Temples Expedition",
      description: "Cherry blossom season across Tokyo and Kyoto with traditional culinary experiences.",
      startDate: new Date("2026-04-01"),
      endDate: new Date("2026-04-12"),
      coverImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800",
      totalBudget: 4200.0,
      isPublic: true,
      shareToken: "japan-spring-blossoms-2026",
      stops: [
        {
          cityIndex: 1, // Tokyo
          stopOrder: 1,
          startDate: new Date("2026-04-01"),
          endDate: new Date("2026-04-06"),
          notes: "Shinjuku district hotel near metro.",
          activities: [
            { activityCityIndex: 1, activityItemIndex: 0, scheduledDate: new Date("2026-04-02"), timeSlot: "Morning", customCost: null, notes: "Walking tour of Meiji Shrine and Harajuku." },
            { activityCityIndex: 1, activityItemIndex: 1, scheduledDate: new Date("2026-04-03"), timeSlot: "Morning", customCost: null, notes: "Early morning market visit." },
            { activityCityIndex: 1, activityItemIndex: 2, scheduledDate: new Date("2026-04-04"), timeSlot: "Morning", customCost: null, notes: "Full day excursion." },
          ],
        },
        {
          cityIndex: 14, // Kyoto
          stopOrder: 2,
          startDate: new Date("2026-04-06"),
          endDate: new Date("2026-04-12"),
          notes: "Shinkansen bullet train from Tokyo. Traditional ryokan in Higashiyama.",
          activities: [
            { activityCityIndex: 14, activityItemIndex: 0, scheduledDate: new Date("2026-04-07"), timeSlot: "Morning", customCost: null, notes: "Sunrise photo walk." },
            { activityCityIndex: 14, activityItemIndex: 1, scheduledDate: new Date("2026-04-08"), timeSlot: "Afternoon", customCost: null, notes: "Explore Sagano romantic train." },
            { activityCityIndex: 14, activityItemIndex: 2, scheduledDate: new Date("2026-04-09"), timeSlot: "Afternoon", customCost: 50.0, notes: "Kimono rental upgrade." },
          ],
        },
      ],
      expenses: [
        { category: "Transport", title: "JR Pass 7-Day Unlimited", amount: 320.0, expenseDate: new Date("2026-04-01") },
        { category: "Accommodation", title: "Higashiyama Traditional Ryokan 6 Nights", amount: 1400.0, expenseDate: new Date("2026-04-06") },
        { category: "Meals", title: "Kaiseki Multi-Course Dinner", amount: 210.0, expenseDate: new Date("2026-04-08") },
        { category: "Misc", title: "Local Handicrafts and Pottery", amount: 130.0, expenseDate: new Date("2026-04-10") },
      ],
    },

    // Trip 3: Priya Sharma - Southeast Asia Escape (Upcoming, Public)
    {
      userIndex: 3, // Priya
      title: "Southeast Asia Island & Heritage Escape",
      description: "Sun, temples, and street food across Singapore, Bali, and Bangkok.",
      startDate: new Date("2026-10-05"),
      endDate: new Date("2026-10-18"),
      coverImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
      totalBudget: 2200.0,
      isPublic: true,
      shareToken: "sea-escape-bali-singapore",
      stops: [
        {
          cityIndex: 8, // Singapore
          stopOrder: 1,
          startDate: new Date("2026-10-05"),
          endDate: new Date("2026-10-09"),
          notes: "Marina Bay area accommodation.",
          activities: [
            { activityCityIndex: 8, activityItemIndex: 0, scheduledDate: new Date("2026-10-06"), timeSlot: "Afternoon", customCost: null, notes: "Sunset light show at Supertree Grove." },
            { activityCityIndex: 8, activityItemIndex: 1, scheduledDate: new Date("2026-10-07"), timeSlot: "Evening", customCost: null, notes: "Maxwell Food Centre." },
            { activityCityIndex: 8, activityItemIndex: 2, scheduledDate: new Date("2026-10-08"), timeSlot: "Evening", customCost: null, notes: "Guided night safari." },
          ],
        },
        {
          cityIndex: 4, // Bali
          stopOrder: 2,
          startDate: new Date("2026-10-09"),
          endDate: new Date("2026-10-14"),
          notes: "Private villa in Ubud with infinity pool.",
          activities: [
            { activityCityIndex: 4, activityItemIndex: 0, scheduledDate: new Date("2026-10-10"), timeSlot: "Morning", customCost: null, notes: "Photography session in rice paddies." },
            { activityCityIndex: 4, activityItemIndex: 1, scheduledDate: new Date("2026-10-11"), timeSlot: "Morning", customCost: null, notes: "Hotel pickup at 3:00 AM." },
            { activityCityIndex: 4, activityItemIndex: 2, scheduledDate: new Date("2026-10-12"), timeSlot: "Afternoon", customCost: null, notes: "Deep tissue massage." },
          ],
        },
        {
          cityIndex: 12, // Bangkok
          stopOrder: 3,
          startDate: new Date("2026-10-14"),
          endDate: new Date("2026-10-18"),
          notes: "Riverside hotel with Chao Phraya view.",
          activities: [
            { activityCityIndex: 12, activityItemIndex: 0, scheduledDate: new Date("2026-10-15"), timeSlot: "Morning", customCost: null, notes: "Dress code respectful clothing required." },
            { activityCityIndex: 12, activityItemIndex: 1, scheduledDate: new Date("2026-10-16"), timeSlot: "Morning", customCost: null, notes: "Early morning boat tour." },
            { activityCityIndex: 12, activityItemIndex: 2, scheduledDate: new Date("2026-10-17"), timeSlot: "Evening", customCost: null, notes: "Relaxing end of trip." },
          ],
        },
      ],
      expenses: [
        { category: "Transport", title: "Regional Flights (SIN-DPS-BKK)", amount: 380.0, expenseDate: new Date("2026-10-05") },
        { category: "Accommodation", title: "Ubud Private Pool Villa 5 Nights", amount: 650.0, expenseDate: new Date("2026-10-09") },
        { category: "Meals", title: "Michelin Street Food Tasting Tour", amount: 85.0, expenseDate: new Date("2026-10-16") },
        { category: "Activities", title: "Spa Package Upgrade", amount: 70.0, expenseDate: new Date("2026-10-12") },
      ],
    },

    // Trip 4: Carlos Rodriguez - Mediterranean Romance (Completed, Private)
    {
      userIndex: 4, // Carlos
      title: "Mediterranean Architecture & Coastline",
      description: "Exploring Gaudí masterpieces in Barcelona followed by the ancient ruins and trattorias of Rome.",
      startDate: new Date("2026-06-15"),
      endDate: new Date("2026-06-25"),
      coverImage: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800",
      totalBudget: 2800.0,
      isPublic: false,
      shareToken: null,
      stops: [
        {
          cityIndex: 9, // Barcelona
          stopOrder: 1,
          startDate: new Date("2026-06-15"),
          endDate: new Date("2026-06-20"),
          notes: "Eixample apartment near Passeig de Gràcia.",
          activities: [
            { activityCityIndex: 9, activityItemIndex: 0, scheduledDate: new Date("2026-06-16"), timeSlot: "Morning", customCost: null, notes: "Tower view ticket." },
            { activityCityIndex: 9, activityItemIndex: 1, scheduledDate: new Date("2026-06-17"), timeSlot: "Evening", customCost: null, notes: "Tasting tour in El Born." },
            { activityCityIndex: 9, activityItemIndex: 2, scheduledDate: new Date("2026-06-18"), timeSlot: "Afternoon", customCost: null, notes: "Sunset view over the city." },
          ],
        },
        {
          cityIndex: 3, // Rome
          stopOrder: 2,
          startDate: new Date("2026-06-20"),
          endDate: new Date("2026-06-25"),
          notes: "Short flight from BCN to FCO. Hotel near Campo de' Fiori.",
          activities: [
            { activityCityIndex: 3, activityItemIndex: 0, scheduledDate: new Date("2026-06-21"), timeSlot: "Morning", customCost: null, notes: "Underground arena access." },
            { activityCityIndex: 3, activityItemIndex: 1, scheduledDate: new Date("2026-06-22"), timeSlot: "Evening", customCost: null, notes: "Trastevere walking dinner." },
            { activityCityIndex: 3, activityItemIndex: 2, scheduledDate: new Date("2026-06-23"), timeSlot: "Morning", customCost: null, notes: "Early bird museum admission." },
          ],
        },
      ],
      expenses: [
        { category: "Transport", title: "Vueling Flight BCN to FCO", amount: 110.0, expenseDate: new Date("2026-06-20") },
        { category: "Accommodation", title: "Campo de Fiori Hotel 5 Nights", amount: 800.0, expenseDate: new Date("2026-06-20") },
        { category: "Meals", title: "Michelin Star Dinner at Aroma Rome", amount: 260.0, expenseDate: new Date("2026-06-23") },
      ],
    },

    // Trip 5: Elena Rostova - Pyramids & Skylines (Upcoming, Public)
    {
      userIndex: 5, // Elena
      title: "Wonders of the Nile & Dubai Skyline",
      description: "Tracing human achievement from the Giza Pyramids to modern engineering marvels in Dubai.",
      startDate: new Date("2026-11-01"),
      endDate: new Date("2026-11-12"),
      coverImage: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=800",
      totalBudget: 3100.0,
      isPublic: true,
      shareToken: "cairo-dubai-heritage-2026",
      stops: [
        {
          cityIndex: 5, // Cairo
          stopOrder: 1,
          startDate: new Date("2026-11-01"),
          endDate: new Date("2026-11-06"),
          notes: "Nile-facing hotel in Zamalek.",
          activities: [
            { activityCityIndex: 5, activityItemIndex: 0, scheduledDate: new Date("2026-11-02"), timeSlot: "Morning", customCost: null, notes: "Camel ride with Egyptologist." },
            { activityCityIndex: 5, activityItemIndex: 1, scheduledDate: new Date("2026-11-03"), timeSlot: "Afternoon", customCost: null, notes: "Spice market exploration." },
            { activityCityIndex: 5, activityItemIndex: 2, scheduledDate: new Date("2026-11-04"), timeSlot: "Evening", customCost: null, notes: "Sunset sail." },
          ],
        },
        {
          cityIndex: 7, // Dubai
          stopOrder: 2,
          startDate: new Date("2026-11-06"),
          endDate: new Date("2026-11-12"),
          notes: "Downtown Dubai hotel adjacent to Dubai Mall.",
          activities: [
            { activityCityIndex: 7, activityItemIndex: 0, scheduledDate: new Date("2026-11-07"), timeSlot: "Morning", customCost: null, notes: "Level 148 fast track access." },
            { activityCityIndex: 7, activityItemIndex: 1, scheduledDate: new Date("2026-11-08"), timeSlot: "Afternoon", customCost: null, notes: "Red dunes safari." },
            { activityCityIndex: 7, activityItemIndex: 2, scheduledDate: new Date("2026-11-09"), timeSlot: "Evening", customCost: null, notes: "Sunset yacht cruise." },
          ],
        },
      ],
      expenses: [
        { category: "Transport", title: "Emirates Flight Cairo to Dubai", amount: 290.0, expenseDate: new Date("2026-11-06") },
        { category: "Accommodation", title: "Zamalek Nile Hotel 5 Nights", amount: 620.0, expenseDate: new Date("2026-11-01") },
        { category: "Meals", title: "Traditional Egyptian Feast", amount: 75.0, expenseDate: new Date("2026-11-03") },
      ],
    },

    // Trip 6: Yuki Tanaka - Coast to Coast USA (Upcoming, Public)
    {
      userIndex: 6, // Yuki
      title: "Coast to Coast: New York to Los Angeles",
      description: "From Manhattan skyscraper canyons to sunny California Pacific beaches.",
      startDate: new Date("2026-12-18"),
      endDate: new Date("2026-12-30"),
      coverImage: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800",
      totalBudget: 4800.0,
      isPublic: true,
      shareToken: "nyc-la-holiday-2026",
      stops: [
        {
          cityIndex: 2, // New York
          stopOrder: 1,
          startDate: new Date("2026-12-18"),
          endDate: new Date("2026-12-24"),
          notes: "Midtown Manhattan hotel near Rockefeller Center.",
          activities: [
            { activityCityIndex: 2, activityItemIndex: 0, scheduledDate: new Date("2026-12-19"), timeSlot: "Morning", customCost: null, notes: "First ferry departure." },
            { activityCityIndex: 2, activityItemIndex: 1, scheduledDate: new Date("2026-12-20"), timeSlot: "Evening", customCost: 160.0, notes: "Holiday show tickets." },
            { activityCityIndex: 2, activityItemIndex: 2, scheduledDate: new Date("2026-12-21"), timeSlot: "Morning", customCost: null, notes: "Winter park bike ride." },
          ],
        },
        {
          cityIndex: 15, // Los Angeles
          stopOrder: 2,
          startDate: new Date("2026-12-24"),
          endDate: new Date("2026-12-30"),
          notes: "Santa Monica beachfront hotel.",
          activities: [
            { activityCityIndex: 15, activityItemIndex: 0, scheduledDate: new Date("2026-12-26"), timeSlot: "Morning", customCost: null, notes: "Morning scenic trail." },
            { activityCityIndex: 15, activityItemIndex: 1, scheduledDate: new Date("2026-12-27"), timeSlot: "Morning", customCost: null, notes: "Full day theme park access." },
            { activityCityIndex: 15, activityItemIndex: 2, scheduledDate: new Date("2026-12-28"), timeSlot: "Afternoon", customCost: null, notes: "Sunset roller coaster and bike ride." },
          ],
        },
      ],
      expenses: [
        { category: "Transport", title: "United Airlines JFK to LAX", amount: 340.0, expenseDate: new Date("2026-12-24") },
        { category: "Accommodation", title: "Santa Monica Beach Hotel 6 Nights", amount: 1650.0, expenseDate: new Date("2026-12-24") },
        { category: "Meals", title: "Nobu Malibu Oceanfront Lunch", amount: 220.0, expenseDate: new Date("2026-12-26") },
      ],
    },

    // Trip 7: Liam O'Connor - Swiss Alps & Paris Highlights (Completed, Private)
    {
      userIndex: 7, // Liam
      title: "Alpine Peaks & Parisian Cafes",
      description: "Glacier trekking in Switzerland followed by quiet art appreciation in Paris.",
      startDate: new Date("2026-01-10"),
      endDate: new Date("2026-01-18"),
      coverImage: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=800",
      totalBudget: 2900.0,
      isPublic: false,
      shareToken: null,
      stops: [
        {
          cityIndex: 18, // Zurich
          stopOrder: 1,
          startDate: new Date("2026-01-10"),
          endDate: new Date("2026-01-14"),
          notes: "Old Town Zurich hotel.",
          activities: [
            { activityCityIndex: 18, activityItemIndex: 0, scheduledDate: new Date("2026-01-11"), timeSlot: "Afternoon", customCost: null, notes: "Lake boat cruise." },
            { activityCityIndex: 18, activityItemIndex: 1, scheduledDate: new Date("2026-01-12"), timeSlot: "Morning", customCost: 190.0, notes: "Glacier park pass included." },
            { activityCityIndex: 18, activityItemIndex: 2, scheduledDate: new Date("2026-01-13"), timeSlot: "Afternoon", customCost: null, notes: "Chocolate tasting session." },
          ],
        },
        {
          cityIndex: 0, // Paris
          stopOrder: 2,
          startDate: new Date("2026-01-14"),
          endDate: new Date("2026-01-18"),
          notes: "TGV Lyria train from Zurich HB to Paris Gare de Lyon.",
          activities: [
            { activityCityIndex: 0, activityItemIndex: 1, scheduledDate: new Date("2026-01-15"), timeSlot: "Morning", customCost: null, notes: "Louvre morning tour." },
            { activityCityIndex: 0, activityItemIndex: 0, scheduledDate: new Date("2026-01-16"), timeSlot: "Evening", customCost: null, notes: "Eiffel Tower light show." },
          ],
        },
      ],
      expenses: [
        { category: "Transport", title: "TGV Lyria Train Zurich to Paris", amount: 145.0, expenseDate: new Date("2026-01-14") },
        { category: "Accommodation", title: "Zurich Old Town Hotel 4 Nights", amount: 890.0, expenseDate: new Date("2026-01-10") },
        { category: "Meals", title: "Swiss Cheese Fondue & Wine Dinner", amount: 110.0, expenseDate: new Date("2026-01-11") },
      ],
    },

    // Trip 8: Fatima Al-Mansoor - Royal India & Ottoman Splendour (Upcoming, Public)
    {
      userIndex: 8, // Fatima
      title: "Royal Palaces & Ottoman Splendour",
      description: "Fortresses of the Rajput kings in Jaipur followed by the Bosphorus strait in Istanbul.",
      startDate: new Date("2026-10-20"),
      endDate: new Date("2026-10-31"),
      coverImage: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800",
      totalBudget: 2600.0,
      isPublic: true,
      shareToken: "royal-jaipur-istanbul-voyage",
      stops: [
        {
          cityIndex: 19, // Jaipur
          stopOrder: 1,
          startDate: new Date("2026-10-20"),
          endDate: new Date("2026-10-25"),
          notes: "Heritage Haveli stay in Jaipur.",
          activities: [
            { activityCityIndex: 19, activityItemIndex: 0, scheduledDate: new Date("2026-10-21"), timeSlot: "Morning", customCost: null, notes: "Early morning fort tour." },
            { activityCityIndex: 19, activityItemIndex: 1, scheduledDate: new Date("2026-10-22"), timeSlot: "Evening", customCost: null, notes: "Culinary walk in Bapu Bazaar." },
            { activityCityIndex: 19, activityItemIndex: 2, scheduledDate: new Date("2026-10-23"), timeSlot: "Morning", customCost: null, notes: "Sunrise flight over Amber Fort." },
          ],
        },
        {
          cityIndex: 13, // Istanbul
          stopOrder: 2,
          startDate: new Date("2026-10-25"),
          endDate: new Date("2026-10-31"),
          notes: "Sultanahmet boutique hotel overlooking the sea.",
          activities: [
            { activityCityIndex: 13, activityItemIndex: 0, scheduledDate: new Date("2026-10-26"), timeSlot: "Morning", customCost: null, notes: "Historical mosque tour." },
            { activityCityIndex: 13, activityItemIndex: 1, scheduledDate: new Date("2026-10-27"), timeSlot: "Evening", customCost: null, notes: "Sunset Bosphorus dinner." },
            { activityCityIndex: 13, activityItemIndex: 2, scheduledDate: new Date("2026-10-28"), timeSlot: "Afternoon", customCost: null, notes: "Handicraft shopping in Grand Bazaar." },
          ],
        },
      ],
      expenses: [
        { category: "Transport", title: "Turkish Airlines Delhi to Istanbul", amount: 410.0, expenseDate: new Date("2026-10-25") },
        { category: "Accommodation", title: "Jaipur Heritage Haveli 5 Nights", amount: 480.0, expenseDate: new Date("2026-10-20") },
        { category: "Meals", title: "Ottoman Palace Cuisine Dinner", amount: 95.0, expenseDate: new Date("2026-10-27") },
      ],
    },

    // Trip 9: Marcus Vance - Cape Town Nature & Wine Safari (Completed, Private)
    {
      userIndex: 9, // Marcus
      title: "Cape Town Nature & Wildlife Safari",
      description: "Hiking Table Mountain, visiting the Boulders Beach penguin colony, and wine tasting in Stellenbosch.",
      startDate: new Date("2026-02-05"),
      endDate: new Date("2026-02-14"),
      coverImage: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800",
      totalBudget: 3400.0,
      isPublic: false,
      shareToken: null,
      stops: [
        {
          cityIndex: 17, // Cape Town
          stopOrder: 1,
          startDate: new Date("2026-02-05"),
          endDate: new Date("2026-02-14"),
          notes: "Camps Bay ocean view villa.",
          activities: [
            { activityCityIndex: 17, activityItemIndex: 0, scheduledDate: new Date("2026-02-06"), timeSlot: "Morning", customCost: null, notes: "Clear weather summit hike." },
            { activityCityIndex: 17, activityItemIndex: 1, scheduledDate: new Date("2026-02-08"), timeSlot: "Morning", customCost: null, notes: "Full day coastal drive to Cape Point." },
            { activityCityIndex: 17, activityItemIndex: 2, scheduledDate: new Date("2026-02-10"), timeSlot: "Afternoon", customCost: 100.0, notes: "Private estate tasting upgrade." },
          ],
        },
      ],
      expenses: [
        { category: "Transport", title: "4x4 SUV Rental 9 Days", amount: 520.0, expenseDate: new Date("2026-02-05") },
        { category: "Accommodation", title: "Camps Bay Villa 9 Nights", amount: 1350.0, expenseDate: new Date("2026-02-05") },
        { category: "Meals", title: "Seafood Platter at V&A Waterfront", amount: 120.0, expenseDate: new Date("2026-02-07") },
        { category: "Misc", title: "National Park Entrance Passes", amount: 80.0, expenseDate: new Date("2026-02-08") },
      ],
    },

    // Trip 10: Admin User - Global Cities Tour (Upcoming, Public)
    {
      userIndex: 0, // Admin
      title: "Trans-Pacific Cities & Harbour Life",
      description: "From Toronto's CN Tower to Sydney's iconic harbour and sun-drenched beaches.",
      startDate: new Date("2026-12-01"),
      endDate: new Date("2026-12-10"),
      coverImage: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800",
      totalBudget: 5000.0,
      isPublic: true,
      shareToken: "sydney-toronto-admin-tour",
      stops: [
        {
          cityIndex: 16, // Toronto
          stopOrder: 1,
          startDate: new Date("2026-12-01"),
          endDate: new Date("2026-12-05"),
          notes: "Downtown Toronto hotel near Union Station.",
          activities: [
            { activityCityIndex: 16, activityItemIndex: 0, scheduledDate: new Date("2026-12-02"), timeSlot: "Afternoon", customCost: null, notes: "Afternoon EdgeWalk." },
            { activityCityIndex: 16, activityItemIndex: 1, scheduledDate: new Date("2026-12-03"), timeSlot: "Morning", customCost: null, notes: "Morning gourmet tasting." },
          ],
        },
        {
          cityIndex: 11, // Sydney
          stopOrder: 2,
          startDate: new Date("2026-12-05"),
          endDate: new Date("2026-12-10"),
          notes: "Circular Quay hotel with Opera House views.",
          activities: [
            { activityCityIndex: 11, activityItemIndex: 0, scheduledDate: new Date("2026-12-06"), timeSlot: "Morning", customCost: null, notes: "Behind the scenes tour." },
            { activityCityIndex: 11, activityItemIndex: 1, scheduledDate: new Date("2026-12-07"), timeSlot: "Morning", customCost: 210.0, notes: "Summit twilight climb." },
            { activityCityIndex: 11, activityItemIndex: 2, scheduledDate: new Date("2026-12-08"), timeSlot: "Afternoon", customCost: null, notes: "Relaxing coastal walk." },
          ],
        },
      ],
      expenses: [
        { category: "Transport", title: "Qantas Flight Toronto to Sydney via LAX", amount: 1650.0, expenseDate: new Date("2026-12-05") },
        { category: "Accommodation", title: "Circular Quay Luxury Suite 5 Nights", amount: 1750.0, expenseDate: new Date("2026-12-05") },
        { category: "Meals", title: "Bennelong Restaurant Dinner", amount: 240.0, expenseDate: new Date("2026-12-07") },
      ],
    },
  ];

  let totalTripStopsCount = 0;
  let totalItineraryActivitiesCount = 0;
  let totalTripExpensesCount = 0;

  for (const t of tripsSpec) {
    const user = createdUsers[t.userIndex];
    const createdTrip = await prisma.trip.create({
      data: {
        userId: user.id,
        title: t.title,
        description: t.description,
        startDate: t.startDate,
        endDate: t.endDate,
        coverImage: t.coverImage,
        totalBudget: t.totalBudget,
        isPublic: t.isPublic,
        shareToken: t.shareToken,
      },
    });

    // Create stops for this trip
    for (const s of t.stops) {
      const city = createdCities[s.cityIndex];
      const createdStop = await prisma.tripStop.create({
        data: {
          tripId: createdTrip.id,
          cityId: city.id,
          stopOrder: s.stopOrder,
          startDate: s.startDate,
          endDate: s.endDate,
          notes: s.notes,
        },
      });
      totalTripStopsCount++;

      // Create itinerary activities for this stop
      for (const act of s.activities) {
        const activity = createdActivitiesByCityIndex[act.activityCityIndex][act.activityItemIndex];
        await prisma.itineraryActivity.create({
          data: {
            tripStopId: createdStop.id,
            activityId: activity.id,
            scheduledDate: act.scheduledDate,
            timeSlot: act.timeSlot,
            customCost: act.customCost,
            notes: act.notes,
          },
        });
        totalItineraryActivitiesCount++;
      }
    }

    // Create expenses for this trip
    for (const exp of t.expenses) {
      await prisma.tripExpense.create({
        data: {
          tripId: createdTrip.id,
          category: exp.category,
          title: exp.title,
          amount: exp.amount,
          expenseDate: exp.expenseDate,
        },
      });
      totalTripExpensesCount++;
    }
  }

  // 6. Seed Saved Destinations (18 Unique Bookmarks)
  console.log("🔖 Seeding saved destinations (bookmarks)...");
  const savedDestinationsSpec = [
    { userIndex: 0, cityIndex: 0 },  // Admin -> Paris
    { userIndex: 0, cityIndex: 1 },  // Admin -> Tokyo
    { userIndex: 0, cityIndex: 3 },  // Admin -> Rome
    { userIndex: 1, cityIndex: 1 },  // Alex -> Tokyo
    { userIndex: 1, cityIndex: 4 },  // Alex -> Bali
    { userIndex: 1, cityIndex: 14 }, // Alex -> Kyoto
    { userIndex: 2, cityIndex: 0 },  // Sarah -> Paris
    { userIndex: 2, cityIndex: 6 },  // Sarah -> London
    { userIndex: 2, cityIndex: 11 }, // Sarah -> Sydney
    { userIndex: 3, cityIndex: 2 },  // Priya -> New York
    { userIndex: 3, cityIndex: 7 },  // Priya -> Dubai
    { userIndex: 3, cityIndex: 18 }, // Priya -> Zurich
    { userIndex: 4, cityIndex: 1 },  // Carlos -> Tokyo
    { userIndex: 4, cityIndex: 5 },  // Carlos -> Cairo
    { userIndex: 5, cityIndex: 8 },  // Elena -> Singapore
    { userIndex: 5, cityIndex: 9 },  // Elena -> Barcelona
    { userIndex: 6, cityIndex: 3 },  // Yuki -> Rome
    { userIndex: 7, cityIndex: 17 }, // Liam -> Cape Town
  ];

  let totalSavedDestinationsCount = 0;
  for (const b of savedDestinationsSpec) {
    const user = createdUsers[b.userIndex];
    const city = createdCities[b.cityIndex];
    await prisma.savedDestination.create({
      data: {
        userId: user.id,
        cityId: city.id,
      },
    });
    totalSavedDestinationsCount++;
  }

  console.log("\n========================================");
  console.log("GLOBETROTTER DATABASE SEED SUMMARY");
  console.log("========================================");
  console.log(`Users:                ${createdUsers.length}`);
  console.log(`Cities:               ${createdCities.length}`);
  console.log(`Activities:           ${createdCities.length * 3}`);
  console.log(`Trips:                ${tripsSpec.length}`);
  console.log(`Trip Stops:           ${totalTripStopsCount}`);
  console.log(`Itinerary Activities: ${totalItineraryActivitiesCount}`);
  console.log(`Trip Expenses:        ${totalTripExpensesCount}`);
  console.log(`Saved Destinations:   ${totalSavedDestinationsCount}`);
  console.log("========================================");
  console.log("Development Credentials (FOR DEVELOPMENT ONLY):");
  console.log("  Admin:    admin@globetrotter.local / GlobeTrotter@123");
  console.log("  Traveler: alex@globetrotter.local  / GlobeTrotter@123");
  console.log("  Traveler: sarah@globetrotter.local / GlobeTrotter@123");
  console.log("========================================\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed execution error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
