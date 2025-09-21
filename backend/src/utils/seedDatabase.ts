import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { Event } from '../models/Event.js';
import { Location } from '../models/Location.js';
import { User } from '../models/User.js';
import { MembershipApplication } from '../models/MembershipApplication.js';

const seedData = {
  locations: [
    {
      name: "Eiffel Tower",
      description: "A wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower.",
      images: ["https://images.pexels.com/photos/1549326/pexels-photo-1549326.jpeg"],
      coordinates: { type: 'Point', coordinates: [2.2945, 48.8584] }, // [lng, lat]
      address: "Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France",
      category: "historical",
    },
    {
      name: "Grand Canyon National Park",
      description: "A national park in northwestern Arizona, the park's central feature is the Grand Canyon, a gorge of the Colorado River, which is often considered one of the Seven Natural Wonders of the World.",
      images: ["https://images.pexels.com/photos/933054/pexels-photo-933054.jpeg"],
      coordinates: { type: 'Point', coordinates: [-112.1401, 36.0544] },
      address: "Arizona, USA",
      category: "natural",
    },
    {
      name: "Times Square",
      description: "A major commercial intersection, tourist destination, entertainment center, and neighborhood in the Midtown Manhattan section of New York City, at the junction of Broadway and Seventh Avenue.",
      images: ["https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg"],
      coordinates: { type: 'Point', coordinates: [-73.9855, 40.7580] },
      address: "Manhattan, NY 10036, USA",
      category: "urban",
    },
    {
        name: "Machu Picchu",
        description: "An Incan citadel set high in the Andes Mountains in Peru, above the Urubamba River valley. Built in the 15th century and later abandoned, it’s renowned for its sophisticated dry-stone walls that fuse huge blocks without the use of mortar.",
        images: ["https://images.pexels.com/photos/2929906/pexels-photo-2929906.jpeg"],
        coordinates: { type: 'Point', coordinates: [-72.5450, -13.1631] },
        address: "08680, Peru",
        category: "adventure",
    }
  ],
};

export const seedDatabase = async (): Promise<void> => {
  try {
    console.log('🌱 Starting database seeding...');
    await connectDatabase();

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Promise.all([
      Event.deleteMany({}),
      Location.deleteMany({}),
      User.deleteMany({}),
      MembershipApplication.deleteMany({})
    ]);

    // Create users
    console.log('👤 Creating sample users...');
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@tourista.com',
      password: 'adminpassword',
      role: 'admin',
      membershipStatus: 'plus_approved'
    });

    const plusUser = await User.create({
        username: 'plusmember',
        email: 'plus@tourista.com',
        password: 'pluspassword',
        membershipStatus: 'plus_approved',
        socialLinks: { instagram: 'https://instagram.com/plusmember' }
    });

    const regularUser = await User.create({
        username: 'testuser',
        email: 'test@tourista.com',
        password: 'testpassword',
    });

    // Seed locations
    console.log('📍 Seeding locations...');
    await Location.insertMany(seedData.locations);

    console.log('✅ Database seeding completed successfully!');
    
    // Print summary
    const counts = await Promise.all([
      Location.countDocuments(),
      User.countDocuments(),
    ]);

    console.log(`📊 Seeded data summary:
    - Locations: ${counts[0]}
    - Users: ${counts[1]}`);

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  } finally {
    await disconnectDatabase();
  }
};

// Run seeding if this file is executed directly
if (process.argv[1].includes('seedDatabase.ts')) {
    seedDatabase();
}
