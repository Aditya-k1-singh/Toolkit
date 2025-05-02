import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTrekSchema, insertBookingSchema, insertTestimonialSchema } from "@shared/schema";
import { setupAuth } from "./auth";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Trek routes
  app.get('/api/treks', async (req, res) => {
    try {
      const treks = await storage.getAllTreks();
      res.json(treks);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch treks' });
    }
  });

  app.get('/api/treks/popular', async (req, res) => {
    try {
      const popularTreks = await storage.getPopularTreks();
      res.json(popularTreks);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch popular treks' });
    }
  });

  app.get('/api/treks/upcoming', async (req, res) => {
    try {
      const upcomingTreks = await storage.getUpcomingTreks();
      res.json(upcomingTreks);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch upcoming treks' });
    }
  });

  app.get('/api/treks/:id', async (req, res) => {
    try {
      const trek = await storage.getTrekById(parseInt(req.params.id));
      if (!trek) {
        return res.status(404).json({ message: 'Trek not found' });
      }
      res.json(trek);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch trek details' });
    }
  });

  app.post('/api/treks', async (req, res) => {
    try {
      const trekData = insertTrekSchema.parse(req.body);
      const trek = await storage.createTrek(trekData);
      res.status(201).json(trek);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid trek data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create trek' });
    }
  });

  // Booking routes
  app.get('/api/bookings', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    try {
      const userId = req.user?.id;
      const bookings = await storage.getBookingsByUserId(userId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch bookings' });
    }
  });

  app.post('/api/bookings', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    try {
      const bookingData = insertBookingSchema.parse({
        ...req.body,
        userId: req.user?.id
      });
      
      // Check if trek exists and has available seats
      const trek = await storage.getTrekById(bookingData.trekId);
      if (!trek) {
        return res.status(404).json({ message: 'Trek not found' });
      }
      
      if (trek.availableSeats && trek.availableSeats < bookingData.participantsCount) {
        return res.status(400).json({ message: 'Not enough available seats' });
      }
      
      const booking = await storage.createBooking(bookingData);
      
      // Update available seats
      if (trek.availableSeats) {
        await storage.updateTrekSeats(
          bookingData.trekId, 
          trek.availableSeats - bookingData.participantsCount
        );
      }
      
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid booking data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create booking' });
    }
  });

  // Testimonial routes
  app.get('/api/testimonials', async (req, res) => {
    try {
      const testimonials = await storage.getAllTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch testimonials' });
    }
  });

  app.post('/api/testimonials', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    try {
      const testimonialData = insertTestimonialSchema.parse({
        ...req.body,
        userId: req.user?.id
      });
      
      const testimonial = await storage.createTestimonial(testimonialData);
      res.status(201).json(testimonial);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid testimonial data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create testimonial' });
    }
  });

  // Search and filter routes
  app.get('/api/search', async (req, res) => {
    try {
      const { location, difficulty, minPrice, maxPrice, startDate, endDate, activities } = req.query;
      
      // Convert to proper types
      const filters: any = {};
      if (location) filters.location = location as string;
      if (difficulty) filters.difficulty = difficulty as string;
      if (minPrice) filters.minPrice = parseInt(minPrice as string);
      if (maxPrice) filters.maxPrice = parseInt(maxPrice as string);
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);
      if (activities) filters.activities = (activities as string).split(',');
      
      const results = await storage.searchTreks(filters);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: 'Failed to search treks' });
    }
  });

  // Recommendation routes
  app.get('/api/recommendations', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    try {
      const userId = req.user?.id;
      const recommendations = await storage.getRecommendedTreks(userId);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get recommendations' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
