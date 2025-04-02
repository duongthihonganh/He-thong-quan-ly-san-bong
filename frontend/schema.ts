import { pgTable, text, serial, integer, boolean, timestamp, real, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User/Staff schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().default("staff"), // admin, manager, staff
  phoneNumber: text("phone_number"),
  email: text("email"),
  isActive: boolean("is_active").default(true)
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Fields schema
export const fields = pgTable("fields", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // mini, large
  quality: text("quality").notNull(), // standard, premium
  size: text("size"),
  pricePerHour: real("price_per_hour").notNull(),
  status: text("status").notNull().default("available"), // available, booked, maintenance
  maintenanceReason: text("maintenance_reason"),
  canMerge: boolean("can_merge").default(false),
  mergedWith: integer("merged_with")
});

export const insertFieldSchema = createInsertSchema(fields).omit({ id: true });
export type InsertField = z.infer<typeof insertFieldSchema>;
export type Field = typeof fields.$inferSelect;

// Customers schema
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  email: text("email"),
  address: text("address"),
  type: text("type").notNull().default("individual"), // individual, company
  company: text("company"),
  taxCode: text("tax_code"),
  membershipLevel: text("membership_level").default("regular"), // regular, silver, gold, platinum
  registrationDate: text("registration_date"),
  notes: text("notes"),
  bookingCount: integer("booking_count").default(0),
  cancelCount: integer("cancel_count").default(0)
});

export const insertCustomerSchema = createInsertSchema(customers).omit({ id: true });
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customers.$inferSelect;

// Services schema
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: real("price").notNull(),
  isAvailable: boolean("is_available").default(true),
  stockQuantity: integer("stock_quantity"),
  minStockThreshold: integer("min_stock_threshold")
});

export const insertServiceSchema = createInsertSchema(services).omit({ id: true });
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

// Bookings schema
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  fieldId: integer("field_id").notNull(),
  customerId: integer("customer_id").notNull(),
  userId: integer("user_id").notNull(), // staff who created the booking
  date: text("date").notNull(), // YYYY-MM-DD format
  startTime: text("start_time").notNull(), // HH:MM format
  endTime: text("end_time").notNull(), // HH:MM format
  status: text("status").notNull().default("confirmed"), // confirmed, cancelled, completed
  totalPrice: real("total_price").notNull(),
  note: text("note")
});

export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true });
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

// Payment schema
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull(),
  amount: real("amount").notNull(),
  paymentMethod: text("payment_method").notNull(), // cash, bank_transfer, momo, etc.
  paymentStatus: text("payment_status").notNull(), // deposit, full, pending
  depositAmount: real("deposit_amount").default(0),
  date: timestamp("date").notNull().defaultNow(),
  receiptNumber: text("receipt_number")
});

export const insertPaymentSchema = createInsertSchema(payments).omit({ id: true });
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

// Booking_Services (many-to-many relationship between bookings and services)
export const bookingServices = pgTable("booking_services", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull(),
  serviceId: integer("service_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  price: real("price").notNull()
});

export const insertBookingServiceSchema = createInsertSchema(bookingServices).omit({ id: true });
export type InsertBookingService = z.infer<typeof insertBookingServiceSchema>;
export type BookingService = typeof bookingServices.$inferSelect;

// Activities schema (for recent activities log)
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  action: text("action").notNull(),
  details: text("details"),
  entityType: text("entity_type"), // booking, field, customer, etc.
  entityId: integer("entity_id"),
  timestamp: timestamp("timestamp").notNull().defaultNow()
});

export const insertActivitySchema = createInsertSchema(activities).omit({ id: true });
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

// Maintenance schema
export const maintenance = pgTable("maintenance", {
  id: serial("id").primaryKey(),
  fieldId: integer("field_id").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  reason: text("reason").notNull(),
  cost: real("cost"),
  status: text("status").notNull().default("scheduled") // scheduled, in_progress, completed
});

export const insertMaintenanceSchema = createInsertSchema(maintenance).omit({ id: true });
export type InsertMaintenance = z.infer<typeof insertMaintenanceSchema>;
export type Maintenance = typeof maintenance.$inferSelect;

// For dashboard summary
export interface DashboardSummary {
  todayBookings: number;
  todayRevenue: number;
  newCustomers: number;
  fieldsInMaintenance: number;
}

// For field status view
export interface FieldTimeSlot {
  fieldId: number;
  fieldName: string;
  status: string; // available, booked, maintenance
  startTime: string;
  endTime: string;
  customerName?: string;
  customerPhone?: string;
  maintenanceReason?: string;
}

// Define a type for the currently logged in user
export interface CurrentUser {
  id: number;
  username: string;
  fullName: string;
  role: string;
}
