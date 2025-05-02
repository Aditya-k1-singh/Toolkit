import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  email: text("email"),
  profileImage: text("profile_image"),
  preferences: jsonb("preferences"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
});

export const treks = pgTable("treks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  imageUrl: text("image_url").notNull(),
  duration: integer("duration").notNull(), // in days
  difficulty: text("difficulty").notNull(), // easy, moderate, difficult, extreme
  price: integer("price").notNull(), // in rupees
  rating: real("rating"),
  activities: jsonb("activities"), // array of activities
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  availableSeats: integer("available_seats"),
  featured: boolean("featured").default(false),
  upcoming: boolean("upcoming").default(false),
});

export const insertTrekSchema = createInsertSchema(treks).omit({
  id: true,
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  trekId: integer("trek_id").notNull(),
  bookingDate: timestamp("booking_date").notNull().defaultNow(),
  status: text("status").notNull(), // pending, confirmed, cancelled
  totalAmount: integer("total_amount").notNull(),
  participantsCount: integer("participants_count").notNull(),
  specialRequirements: text("special_requirements"),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  bookingDate: true,
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  trekId: integer("trek_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  date: timestamp("date").notNull().defaultNow(),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  date: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Trek = typeof treks.$inferSelect;
export type InsertTrek = z.infer<typeof insertTrekSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
