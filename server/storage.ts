import { users, treks, bookings, testimonials } from "@shared/schema";
import type { User, InsertUser, Trek, InsertTrek, Booking, InsertBooking, Testimonial, InsertTestimonial } from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Trek operations
  getAllTreks(): Promise<Trek[]>;
  getPopularTreks(limit?: number): Promise<Trek[]>;
  getUpcomingTreks(limit?: number): Promise<Trek[]>;
  getTrekById(id: number): Promise<Trek | undefined>;
  createTrek(trek: InsertTrek): Promise<Trek>;
  updateTrekSeats(id: number, availableSeats: number): Promise<void>;
  searchTreks(filters: any): Promise<Trek[]>;
  getRecommendedTreks(userId: number): Promise<Trek[]>;
  
  // Booking operations
  getBookingsByUserId(userId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  
  // Testimonial operations
  getAllTestimonials(): Promise<Testimonial[]>;
  getTestimonialsByTrekId(trekId: number): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private treks: Map<number, Trek>;
  private bookings: Map<number, Booking>;
  private testimonials: Map<number, Testimonial>;
  currentUserId: number;
  currentTrekId: number;
  currentBookingId: number;
  currentTestimonialId: number;
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.treks = new Map();
    this.bookings = new Map();
    this.testimonials = new Map();
    this.currentUserId = 1;
    this.currentTrekId = 1;
    this.currentBookingId = 1;
    this.currentTestimonialId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
    
    // Initialize with some sample treks
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample treks
    const sampleTreks: InsertTrek[] = [
      {
        name: "Valley of Flowers",
        description: "Experience the magical UNESCO World Heritage site known for its meadows of endemic alpine flowers.",
        location: "Uttarakhand",
        imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
        duration: 6,
        difficulty: "Moderate",
        price: 15999,
        rating: 4.8,
        activities: ["Hiking", "Photography", "Camping", "Nature Walk"],
        startDate: new Date(2023, 9, 15), // Oct 15, 2023
        endDate: new Date(2023, 9, 21), // Oct 21, 2023
        availableSeats: 12,
        featured: true,
        upcoming: true
      },
      {
        name: "Kedarkantha Trek",
        description: "A perfect winter trek with stunning views of snow-capped peaks in the Garhwal Himalayas.",
        location: "Uttarakhand",
        imageUrl: "https://images.unsplash.com/photo-1515876305430-f06edab8282a",
        duration: 5,
        difficulty: "Easy",
        price: 12499,
        rating: 4.9,
        activities: ["Hiking", "Camping", "Snow Activities"],
        startDate: new Date(2023, 10, 5), // Nov 5, 2023
        endDate: new Date(2023, 10, 10), // Nov 10, 2023
        availableSeats: 15,
        featured: true,
        upcoming: false
      },
      {
        name: "Hampta Pass Trek",
        description: "Cross from the verdant Kullu Valley to the barren landscapes of Lahaul through this dramatic pass.",
        location: "Himachal Pradesh",
        imageUrl: "https://images.unsplash.com/photo-1544198365-f5d60b6d8190",
        duration: 6,
        difficulty: "Moderate",
        price: 14999,
        rating: 4.7,
        activities: ["Hiking", "Camping", "River Crossing", "Glacier Walk"],
        startDate: new Date(2023, 9, 25), // Oct 25, 2023
        endDate: new Date(2023, 9, 31), // Oct 31, 2023
        availableSeats: 10,
        featured: true,
        upcoming: true
      },
      {
        name: "Sandakphu Trek",
        description: "Trek to the highest point of West Bengal with stunning views of four of the world's five highest peaks.",
        location: "West Bengal",
        imageUrl: "https://images.unsplash.com/photo-1516939884455-1445c8652f83",
        duration: 7,
        difficulty: "Moderate",
        price: 16999,
        rating: 4.6,
        activities: ["Hiking", "Camping", "Photography"],
        startDate: new Date(2023, 9, 15), // Oct 15, 2023
        endDate: new Date(2023, 9, 21), // Oct 21, 2023
        availableSeats: 4,
        featured: false,
        upcoming: true
      },
      {
        name: "Brahmatal Trek",
        description: "A spectacular winter trek with frozen lakes, oak forests, and panoramic views of Himalayan peaks.",
        location: "Uttarakhand",
        imageUrl: "https://images.unsplash.com/photo-1543076447-215ad9ba6923",
        duration: 6,
        difficulty: "Moderate",
        price: 13499,
        rating: 4.5,
        activities: ["Hiking", "Camping", "Snow Activities", "Photography"],
        startDate: new Date(2023, 9, 22), // Oct 22, 2023
        endDate: new Date(2023, 9, 27), // Oct 27, 2023
        availableSeats: 7,
        featured: false,
        upcoming: true
      },
      {
        name: "Kudremukh Trek",
        description: "Explore the third highest peak in Karnataka with its horse-face shaped mountain and lush grasslands.",
        location: "Karnataka",
        imageUrl: "https://images.unsplash.com/photo-1625495898389-cbfb276e7a5a",
        duration: 4,
        difficulty: "Moderate",
        price: 8999,
        rating: 4.4,
        activities: ["Hiking", "Camping", "Bird Watching"],
        startDate: new Date(2023, 10, 2), // Nov 2, 2023
        endDate: new Date(2023, 10, 5), // Nov 5, 2023
        availableSeats: 2,
        featured: false,
        upcoming: true
      },
      {
        name: "Dzukou Valley Trek",
        description: "Discover the verdant valley on the Nagaland-Manipur border, famous for its seasonal wildflowers and unique terrain.",
        location: "Nagaland",
        imageUrl: "https://images.unsplash.com/photo-1536293859716-4dcef98fef8b",
        duration: 5,
        difficulty: "Moderate",
        price: 18499,
        rating: 4.7,
        activities: ["Hiking", "Camping", "Cultural Experience", "Photography"],
        startDate: new Date(2023, 10, 10), // Nov 10, 2023
        endDate: new Date(2023, 10, 14), // Nov 14, 2023
        availableSeats: 9,
        featured: false,
        upcoming: true
      }
    ];

    // Add more sample treks to meet requirement of 20+
    const additionalTreks: InsertTrek[] = [
      {
        name: "Roopkund Trek",
        description: "Discover the mysterious Skeleton Lake nestled in the Garhwal Himalayas at an altitude of 16,500 feet.",
        location: "Uttarakhand",
        imageUrl: "https://images.unsplash.com/photo-1544198365-f5d60b6d8190",
        duration: 8,
        difficulty: "Difficult",
        price: 18999,
        rating: 4.7,
        activities: ["Hiking", "Camping", "Cultural Experience", "High Altitude Trekking"],
        startDate: new Date(2023, 11, 5), // Dec 5, 2023
        endDate: new Date(2023, 11, 12), // Dec 12, 2023
        availableSeats: 10,
        featured: false,
        upcoming: false
      },
      {
        name: "Markha Valley Trek",
        description: "Explore the Markha River Valley in Ladakh with stunning views of the Zanskar and Ladakh ranges.",
        location: "Ladakh",
        imageUrl: "https://images.unsplash.com/photo-1515876305430-f06edab8282a",
        duration: 10,
        difficulty: "Difficult",
        price: 22999,
        rating: 4.8,
        activities: ["Hiking", "Camping", "Cultural Experience", "High Altitude Trekking"],
        startDate: new Date(2023, 11, 15), // Dec 15, 2023
        endDate: new Date(2023, 11, 24), // Dec 24, 2023
        availableSeats: 8,
        featured: false,
        upcoming: false
      },
      {
        name: "Tarsar Marsar Trek",
        description: "Journey through the breathtaking twin lakes surrounded by meadows in the Kashmir Valley.",
        location: "Jammu & Kashmir",
        imageUrl: "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d",
        duration: 7,
        difficulty: "Moderate",
        price: 17999,
        rating: 4.9,
        activities: ["Hiking", "Camping", "Photography", "Lakeside Camping"],
        startDate: new Date(2023, 11, 20), // Dec 20, 2023
        endDate: new Date(2023, 11, 26), // Dec 26, 2023
        availableSeats: 12,
        featured: false,
        upcoming: false
      },
      {
        name: "Chadar Trek",
        description: "Walk on the frozen Zanskar River in Ladakh, one of the most challenging and unique winter treks in India.",
        location: "Ladakh",
        imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
        duration: 9,
        difficulty: "Extreme",
        price: 27999,
        rating: 4.6,
        activities: ["Ice Trekking", "Camping", "Photography", "Extreme Adventure"],
        startDate: new Date(2024, 0, 15), // Jan 15, 2024
        endDate: new Date(2024, 0, 23), // Jan 23, 2024
        availableSeats: 6,
        featured: false,
        upcoming: false
      },
      {
        name: "Goechala Trek",
        description: "Trek to the Goechala pass offering the closest view of the Kanchenjunga, the world's third-highest peak.",
        location: "Sikkim",
        imageUrl: "https://images.unsplash.com/photo-1494783367193-149034c05e8f",
        duration: 11,
        difficulty: "Difficult",
        price: 23999,
        rating: 4.8,
        activities: ["Hiking", "Camping", "Photography", "High Altitude Trekking"],
        startDate: new Date(2024, 2, 10), // Mar 10, 2024
        endDate: new Date(2024, 2, 20), // Mar 20, 2024
        availableSeats: 15,
        featured: false,
        upcoming: false
      },
      {
        name: "Rupin Pass Trek",
        description: "Cross the stunning hanging villages and waterfalls as you trek from Uttarakhand to Himachal Pradesh.",
        location: "Uttarakhand/Himachal",
        imageUrl: "https://images.unsplash.com/photo-1511497584788-876760111969",
        duration: 8,
        difficulty: "Difficult",
        price: 19999,
        rating: 4.7,
        activities: ["Hiking", "Camping", "Waterfall Spotting", "High Altitude Trekking"],
        startDate: new Date(2024, 4, 5), // May 5, 2024
        endDate: new Date(2024, 4, 12), // May 12, 2024
        availableSeats: 10,
        featured: false,
        upcoming: false
      },
      {
        name: "Pin Parvati Pass Trek",
        description: "One of the most challenging treks connecting the valleys of Parvati in Kullu and Pin in Spiti.",
        location: "Himachal Pradesh",
        imageUrl: "https://images.unsplash.com/photo-1570641963303-92ce4845ed4c",
        duration: 12,
        difficulty: "Extreme",
        price: 28999,
        rating: 4.9,
        activities: ["High Altitude Trekking", "Glacier Crossing", "Camping", "Photography"],
        startDate: new Date(2024, 5, 15), // Jun 15, 2024
        endDate: new Date(2024, 5, 26), // Jun 26, 2024
        availableSeats: 8,
        featured: false,
        upcoming: false
      },
      {
        name: "Kuari Pass Trek",
        description: "Trek through dense forests and meadows with panoramic views of the mighty Himalayan peaks.",
        location: "Uttarakhand",
        imageUrl: "https://images.unsplash.com/photo-1597843786411-a7fa8ad44e3b",
        duration: 6,
        difficulty: "Moderate",
        price: 14999,
        rating: 4.5,
        activities: ["Hiking", "Camping", "Photography", "Forest Trek"],
        startDate: new Date(2024, 2, 25), // Mar 25, 2024
        endDate: new Date(2024, 2, 30), // Mar 30, 2024
        availableSeats: 14,
        featured: false,
        upcoming: false
      },
      {
        name: "Kheerganga Trek",
        description: "A short but beautiful trek to a hot spring nestled amidst the Parvati Valley in Himachal Pradesh.",
        location: "Himachal Pradesh",
        imageUrl: "https://images.unsplash.com/photo-1527512666523-ff2a58554c17",
        duration: 2,
        difficulty: "Easy",
        price: 5999,
        rating: 4.4,
        activities: ["Hiking", "Hot Springs", "Photography", "Camping"],
        startDate: new Date(2024, 3, 5), // Apr 5, 2024
        endDate: new Date(2024, 3, 6), // Apr 6, 2024
        availableSeats: 20,
        featured: false,
        upcoming: false
      },
      {
        name: "Har Ki Dun Trek",
        description: "Visit one of the most ancient Himalayan trails with breathtaking views of the Swargarohini peak.",
        location: "Uttarakhand",
        imageUrl: "https://images.unsplash.com/photo-1534880282318-be66f2dc5b62",
        duration: 7,
        difficulty: "Moderate",
        price: 15999,
        rating: 4.6,
        activities: ["Hiking", "Camping", "Cultural Experience", "Photography"],
        startDate: new Date(2024, 3, 15), // Apr 15, 2024
        endDate: new Date(2024, 3, 21), // Apr 21, 2024
        availableSeats: 12,
        featured: false,
        upcoming: false
      },
      {
        name: "Chopta Chandrashila Trek",
        description: "Trek to the Chandrashila peak through the Chopta region, offering stunning views of the Himalayan range.",
        location: "Uttarakhand",
        imageUrl: "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d",
        duration: 5,
        difficulty: "Easy",
        price: 10999,
        rating: 4.5,
        activities: ["Hiking", "Camping", "Temple Visit", "Photography"],
        startDate: new Date(2024, 4, 10), // May 10, 2024
        endDate: new Date(2024, 4, 14), // May 14, 2024
        availableSeats: 16,
        featured: false,
        upcoming: false
      },
      {
        name: "Nanda Devi Base Camp Trek",
        description: "Trek to the base of India's second-highest mountain, offering breathtaking views of the Nanda Devi sanctuary.",
        location: "Uttarakhand",
        imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
        duration: 10,
        difficulty: "Difficult",
        price: 24999,
        rating: 4.8,
        activities: ["High Altitude Trekking", "Camping", "Photography", "Wildlife Spotting"],
        startDate: new Date(2024, 5, 5), // Jun 5, 2024
        endDate: new Date(2024, 5, 14), // Jun 14, 2024
        availableSeats: 10,
        featured: false,
        upcoming: false
      },
      {
        name: "Dudhsagar Waterfall Trek",
        description: "Trek to one of India's tallest waterfalls located on the Goa-Karnataka border, offering stunning views.",
        location: "Goa/Karnataka",
        imageUrl: "https://images.unsplash.com/photo-1597843786411-a7fa8ad44e3b",
        duration: 2,
        difficulty: "Easy",
        price: 4999,
        rating: 4.4,
        activities: ["Hiking", "Waterfall Visit", "Swimming", "Photography"],
        startDate: new Date(2024, 7, 15), // Aug 15, 2024
        endDate: new Date(2024, 7, 16), // Aug 16, 2024
        availableSeats: 25,
        featured: false,
        upcoming: false
      },
      {
        name: "Rajmachi Trek",
        description: "A popular trek in the Western Ghats of Maharashtra, offering scenic views and historical forts.",
        location: "Maharashtra",
        imageUrl: "https://images.unsplash.com/photo-1527512666523-ff2a58554c17",
        duration: 2,
        difficulty: "Easy",
        price: 3999,
        rating: 4.3,
        activities: ["Hiking", "Fort Visit", "Historical Exploration", "Photography"],
        startDate: new Date(2024, 6, 20), // Jul 20, 2024
        endDate: new Date(2024, 6, 21), // Jul 21, 2024
        availableSeats: 30,
        featured: false,
        upcoming: false
      }
    ];

    // Combine all treks
    const allTreks = [...sampleTreks, ...additionalTreks];

    // Add treks to storage
    allTreks.forEach(trek => {
      const id = this.currentTrekId++;
      this.treks.set(id, { ...trek, id });
    });

    // Sample testimonials
    const sampleTestimonials: InsertTestimonial[] = [
      {
        userId: 1, // This will be updated when we add users
        trekId: 1,
        rating: 5,
        comment: "The Valley of Flowers trek was beyond my expectations! The guides were knowledgeable, equipment top-notch, and the views... simply breathtaking. Will definitely be booking another trek soon!"
      },
      {
        userId: 2,
        trekId: 3,
        rating: 5,
        comment: "The contrast between Kullu and Lahaul valleys during the Hampta Pass trek was incredible. Our guide Santosh was exceptionally well-prepared and made sure everyone was comfortable throughout the journey."
      },
      {
        userId: 3,
        trekId: 2,
        rating: 5,
        comment: "As a first-time trekker, I was nervous, but the team made sure I was comfortable. The snow-covered trails to Kedarkantha were magical, and the summit sunrise was worth every step of the climb."
      }
    ];

    // We'll add testimonials after adding users
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Trek methods
  async getAllTreks(): Promise<Trek[]> {
    return Array.from(this.treks.values());
  }

  async getPopularTreks(limit: number = 6): Promise<Trek[]> {
    return Array.from(this.treks.values())
      .filter(trek => trek.featured)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit);
  }

  async getUpcomingTreks(limit: number = 4): Promise<Trek[]> {
    return Array.from(this.treks.values())
      .filter(trek => trek.upcoming)
      .sort((a, b) => (a.startDate?.getTime() || 0) - (b.startDate?.getTime() || 0))
      .slice(0, limit);
  }

  async getTrekById(id: number): Promise<Trek | undefined> {
    return this.treks.get(id);
  }

  async createTrek(insertTrek: InsertTrek): Promise<Trek> {
    const id = this.currentTrekId++;
    const trek: Trek = { ...insertTrek, id };
    this.treks.set(id, trek);
    return trek;
  }

  async updateTrekSeats(id: number, availableSeats: number): Promise<void> {
    const trek = this.treks.get(id);
    if (trek) {
      trek.availableSeats = availableSeats;
      this.treks.set(id, trek);
    }
  }

  async searchTreks(filters: any): Promise<Trek[]> {
    let filteredTreks = Array.from(this.treks.values());
    
    // Apply filters
    if (filters.location) {
      filteredTreks = filteredTreks.filter(trek => 
        trek.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    if (filters.difficulty) {
      filteredTreks = filteredTreks.filter(trek => 
        trek.difficulty === filters.difficulty
      );
    }
    
    if (filters.minPrice) {
      filteredTreks = filteredTreks.filter(trek => 
        trek.price >= filters.minPrice
      );
    }
    
    if (filters.maxPrice) {
      filteredTreks = filteredTreks.filter(trek => 
        trek.price <= filters.maxPrice
      );
    }
    
    if (filters.startDate) {
      filteredTreks = filteredTreks.filter(trek => 
        trek.startDate && trek.startDate >= filters.startDate
      );
    }
    
    if (filters.endDate) {
      filteredTreks = filteredTreks.filter(trek => 
        trek.endDate && trek.endDate <= filters.endDate
      );
    }
    
    if (filters.activities && filters.activities.length > 0) {
      filteredTreks = filteredTreks.filter(trek => 
        filters.activities.some((activity: string) => 
          trek.activities && Array.isArray(trek.activities) && 
          trek.activities.includes(activity)
        )
      );
    }
    
    return filteredTreks;
  }

  async getRecommendedTreks(userId: number): Promise<Trek[]> {
    // For this example, we'll recommend treks based on:
    // 1. User's previous bookings (similar difficulty/location)
    // 2. Popular treks they haven't booked yet
    
    const userBookings = await this.getBookingsByUserId(userId);
    const bookedTrekIds = userBookings.map(booking => booking.trekId);
    
    // Get treks the user hasn't booked yet
    let unbookedTreks = Array.from(this.treks.values())
      .filter(trek => !bookedTrekIds.includes(trek.id));
    
    // If user has no bookings, just return popular treks
    if (userBookings.length === 0) {
      return unbookedTreks
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 5);
    }
    
    // Get user's booked treks to analyze preferences
    const bookedTreks = await Promise.all(
      bookedTrekIds.map(id => this.getTrekById(id))
    );
    
    // Extract preferred locations and difficulties
    const filteredBookedTreks = bookedTreks.filter((trek): trek is Trek => trek !== undefined);
    const preferredLocations = Array.from(new Set(filteredBookedTreks.map(trek => trek.location)));
    const preferredDifficulties = Array.from(new Set(filteredBookedTreks.map(trek => trek.difficulty)));
    
    // Sort by preference match
    unbookedTreks.sort((a, b) => {
      let aScore = 0;
      let bScore = 0;
      
      // Location match
      if (preferredLocations.includes(a.location)) aScore += 2;
      if (preferredLocations.includes(b.location)) bScore += 2;
      
      // Difficulty match
      if (preferredDifficulties.includes(a.difficulty)) aScore += 1;
      if (preferredDifficulties.includes(b.difficulty)) bScore += 1;
      
      // Rating bonus
      aScore += (a.rating || 0) / 5;
      bScore += (b.rating || 0) / 5;
      
      return bScore - aScore;
    });
    
    return unbookedTreks.slice(0, 5);
  }

  // Booking methods
  async getBookingsByUserId(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values())
      .filter(booking => booking.userId === userId);
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.currentBookingId++;
    const booking: Booking = { 
      ...insertBooking, 
      id, 
      bookingDate: new Date(),
      status: "confirmed" // Default status
    };
    this.bookings.set(id, booking);
    return booking;
  }

  // Testimonial methods
  async getAllTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async getTestimonialsByTrekId(trekId: number): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values())
      .filter(testimonial => testimonial.trekId === trekId);
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.currentTestimonialId++;
    const testimonial: Testimonial = { 
      ...insertTestimonial, 
      id, 
      date: new Date() 
    };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }
}

export const storage = new MemStorage();
