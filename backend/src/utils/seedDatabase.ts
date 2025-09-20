import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { Event } from '../models/Event.js';
import { HistoricalPlace } from '../models/HistoricalPlace.js';
import { Influencer } from '../models/Influencer.js';
import { Reporter } from '../models/Reporter.js';
import { InstagramReel } from '../models/InstagramReel.js';
import { MembershipApplication } from '../models/MembershipApplication.js';
import { User } from '../models/User.js';

const seedData = {
  events: [
    {
      title: "Bhilai Steel Plant Heritage Walk",
      description: "Explore the industrial heritage of one of India's premier steel plants with guided tours and historical insights.",
      category: "Cultural Event",
      location: "Bhilai Steel Plant, Bhilai",
      coordinates: { lat: 21.1925, lng: 81.3186 },
      date: new Date('2025-03-15T10:00:00Z'),
      imageUrl: "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      title: "Chhattisgarh Rajyotsav Celebration",
      description: "Annual state formation day celebration featuring traditional dance, music, and cultural performances.",
      category: "State Festival",
      location: "Civic Center, Bhilai",
      coordinates: { lat: 21.2000, lng: 81.3000 },
      date: new Date('2025-11-01T18:00:00Z'),
      imageUrl: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      title: "Teej Festival at Maitri Bagh",
      description: "Traditional Teej festival celebration with folk dances, local cuisine, and cultural activities.",
      category: "Traditional Festival",
      location: "Maitri Bagh, Bhilai",
      coordinates: { lat: 21.2100, lng: 81.2900 },
      date: new Date('2025-08-20T17:00:00Z'),
      imageUrl: "https://images.pexels.com/photos/1729931/pexels-photo-1729931.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      title: "Dussehra Mela",
      description: "Grand Dussehra celebration with Ravana effigy burning, cultural programs, and traditional fair.",
      category: "Religious Festival",
      location: "Supela Ground, Bhilai",
      coordinates: { lat: 21.1800, lng: 81.3200 },
      date: new Date('2025-10-12T19:00:00Z'),
      imageUrl: "https://images.pexels.com/photos/3585047/pexels-photo-3585047.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      title: "Tribal Art Exhibition",
      description: "Showcase of traditional tribal art, handicrafts, and cultural heritage of Chhattisgarh.",
      category: "Art & Culture",
      location: "Bhilai Cultural Center",
      coordinates: { lat: 21.1950, lng: 81.3100 },
      date: new Date('2025-04-05T11:00:00Z'),
      imageUrl: "https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=800"
    }
  ],

  places: [
    {
      title: "Maitri Bagh",
      description: "A beautiful park and zoo featuring diverse flora, fauna, and recreational facilities for families.",
      category: "Park & Zoo",
      coordinates: { lat: 21.2100, lng: 81.2900 },
      imageUrl: "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800",
      rating: 4.5
    },
    {
      title: "Bhilai Steel Plant",
      description: "Historic steel manufacturing plant that shaped the industrial landscape of modern India.",
      category: "Industrial Heritage",
      coordinates: { lat: 21.1925, lng: 81.3186 },
      imageUrl: "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800",
      rating: 4.2
    },
    {
      title: "Siyadevi Temple",
      description: "Ancient temple dedicated to Goddess Siyadevi, known for its architectural beauty and spiritual significance.",
      category: "Religious Site",
      coordinates: { lat: 21.2200, lng: 81.2800 },
      imageUrl: "https://images.pexels.com/photos/1729931/pexels-photo-1729931.jpeg?auto=compress&cs=tinysrgb&w=800",
      rating: 4.7
    },
    {
      title: "Civic Center",
      description: "Modern cultural hub hosting various events, exhibitions, and community gatherings.",
      category: "Cultural Center",
      coordinates: { lat: 21.2000, lng: 81.3000 },
      imageUrl: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800",
      rating: 4.3
    },
    {
      title: "Nehru Stadium",
      description: "Premier sports facility hosting major sporting events and cultural programs.",
      category: "Sports Complex",
      coordinates: { lat: 21.1850, lng: 81.3150 },
      imageUrl: "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800",
      rating: 4.1
    }
  ],

  influencers: [
    {
      username: "bhilai_foodie",
      name: "Priya Sharma",
      category: "Food & Culture",
      imageUrl: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
      followers: "25.4K",
      bio: "Exploring the culinary heritage of Chhattisgarh",
      socialLinks: { instagram: "https://instagram.com/bhilai_foodie" }
    },
    {
      username: "cg_heritage",
      name: "Rajesh Kumar",
      category: "Heritage",
      imageUrl: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400",
      followers: "18.7K",
      bio: "Documenting the rich heritage of Chhattisgarh",
      socialLinks: { instagram: "https://instagram.com/cg_heritage" }
    },
    {
      username: "bhilai_explorer",
      name: "Anita Verma",
      category: "Travel",
      imageUrl: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
      followers: "32.1K",
      bio: "Travel enthusiast exploring hidden gems of Bhilai",
      socialLinks: { instagram: "https://instagram.com/bhilai_explorer" }
    },
    {
      username: "steel_city_vibes",
      name: "Amit Patel",
      category: "Lifestyle",
      imageUrl: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400",
      followers: "15.9K",
      bio: "Lifestyle blogger capturing the essence of steel city",
      socialLinks: { instagram: "https://instagram.com/steel_city_vibes" }
    },
    {
      username: "cg_traditions",
      name: "Sunita Jain",
      category: "Traditions",
      imageUrl: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
      followers: "22.3K",
      bio: "Preserving and sharing traditional customs of Chhattisgarh",
      socialLinks: { instagram: "https://instagram.com/cg_traditions" }
    }
  ],

  reporters: [
    {
      username: "cg_news_live",
      name: "Vikash Tiwari",
      outlet: "CG News Live",
      imageUrl: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400",
      followers: "45.2K",
      bio: "Senior correspondent covering Chhattisgarh news",
      articles: [
        {
          title: "Heritage Conservation Efforts in Bhilai",
          link: "https://example.com/article1",
          publishedAt: new Date('2025-01-10')
        }
      ],
      socialLinks: { instagram: "https://instagram.com/cg_news_live" }
    },
    {
      username: "bhilai_reporter",
      name: "Meera Singh",
      outlet: "Bhilai Times",
      imageUrl: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
      followers: "38.7K",
      bio: "Local news reporter focusing on community stories",
      articles: [
        {
          title: "Cultural Events Boost Tourism in Bhilai",
          link: "https://example.com/article2",
          publishedAt: new Date('2025-01-08')
        }
      ],
      socialLinks: { instagram: "https://instagram.com/bhilai_reporter" }
    },
    {
      username: "steel_city_news",
      name: "Rahul Gupta",
      outlet: "Steel City News",
      imageUrl: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400",
      followers: "52.1K",
      bio: "Investigative journalist covering industrial and cultural news",
      articles: [
        {
          title: "Steel Plant's Role in Shaping Bhilai's Culture",
          link: "https://example.com/article3",
          publishedAt: new Date('2025-01-05')
        }
      ],
      socialLinks: { instagram: "https://instagram.com/steel_city_news" }
    },
    {
      username: "cg_updates",
      name: "Kavita Sharma",
      outlet: "CG Updates",
      imageUrl: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
      followers: "29.8K",
      bio: "Digital journalist covering cultural and social updates",
      articles: [
        {
          title: "Traditional Festivals Gain Modern Appeal",
          link: "https://example.com/article4",
          publishedAt: new Date('2025-01-03')
        }
      ],
      socialLinks: { instagram: "https://instagram.com/cg_updates" }
    }
  ],

  // Sample Instagram Reels data
  reels: [
    {
      locationId: null, // Will be populated with actual location IDs after seeding
      reelUrl: "https://www.instagram.com/p/ABC123/",
      caption: "Beautiful sunset at Maitri Bagh! The perfect place to unwind after a long day. 🌅 #Bhilai #MaitriBagh #Sunset",
      uploaderName: "admin",
      uploaderType: "admin",
      isApproved: true
    },
    {
      locationId: null,
      reelUrl: "https://www.instagram.com/reel/DEF456/",
      caption: "The industrial heritage of Bhilai Steel Plant is truly remarkable. A testament to India's progress! 🏭 #BhilaiSteelPlant #Heritage",
      uploaderName: "heritage_lover",
      uploaderType: "creator",
      isApproved: true
    }
  ]
};

export const seedDatabase = async (): Promise<void> => {
  try {
    console.log('🌱 Starting database seeding...');

    await connectDatabase();

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Promise.all([
      Event.deleteMany({}),
      HistoricalPlace.deleteMany({}),
      Influencer.deleteMany({}),
      Reporter.deleteMany({}),
      InstagramReel.deleteMany({}),
      MembershipApplication.deleteMany({})
    ]);

    // Create a sample admin user
    console.log('👤 Creating sample admin user...');
    const adminUser = new User({
      email: 'admin@sanskriti.com',
      password: 'admin123',
      region: 'Bhilai, CG',
      membershipLevel: 'plus',
      approved: true
    });
    await adminUser.save();

    // Seed events
    console.log('📅 Seeding events...');
    const events = await Event.insertMany(seedData.events);

    // Seed places
    console.log('🏛️ Seeding historical places...');
    const places = await HistoricalPlace.insertMany(seedData.places);

    // Seed influencers
    console.log('👥 Seeding influencers...');
    await Influencer.insertMany(seedData.influencers);

    // Seed reporters
    console.log('📰 Seeding reporters...');
    await Reporter.insertMany(seedData.reporters);

    // Seed Instagram Reels with actual location IDs
    console.log('📱 Seeding Instagram Reels...');
    const reelsWithLocationIds = seedData.reels.map((reel, index) => ({
      ...reel,
      locationId: places[index % places.length]._id,
      uploaderId: adminUser._id,
      instagramId: `sample_${index + 1}`
    }));
    await InstagramReel.insertMany(reelsWithLocationIds);

    console.log('✅ Database seeding completed successfully!');
    
    // Print summary
    const counts = await Promise.all([
      Event.countDocuments(),
      HistoricalPlace.countDocuments(),
      Influencer.countDocuments(),
      Reporter.countDocuments(),
      InstagramReel.countDocuments(),
      User.countDocuments()
    ]);

    console.log(`📊 Seeded data summary:
    - Events: ${counts[0]}
    - Historical Places: ${counts[1]}
    - Influencers: ${counts[2]}
    - Reporters: ${counts[3]}
    - Instagram Reels: ${counts[4]}
    - Users: ${counts[5]}`);

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  } finally {
    await disconnectDatabase();
  }
};

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}