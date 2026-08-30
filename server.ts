import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import * as dotenv from 'dotenv';
import { GoogleGenAI } from "@google/genai";
import Database from 'better-sqlite3';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

// Initialize SQLite database
const db = new Database('bookings.db');

// Initialize Supabase client lazily with offline fallback and cooldown
let supabaseClient: any = null;
let isSupabaseOffline = false;
let lastSupabaseCheckTime = 0;
const SUPABASE_COOLDOWN_MS = 300000; // 5 minutes cooldown before trying to re-connect

function getSupabaseClient() {
  if (isSupabaseOffline) {
    const now = Date.now();
    if (now - lastSupabaseCheckTime < SUPABASE_COOLDOWN_MS) {
      return null;
    }
    // Cooldown passed, let's allow trying to re-connect
    isSupabaseOffline = false;
  }

  if (!supabaseClient) {
    const supabaseUrl = process.env.SUPABASE_URL || 'https://lzjjwsvalvfkgwtzuime.supabase.co';
    const supabaseKey = process.env.SUPABASE_KEY || 'sb_publishable_KxzN2RLPv5Q7nVqDRqPw-w_mi317li6';
    
    if (!supabaseUrl || !supabaseKey) {
      console.warn("[Supabase] SUPABASE_URL or SUPABASE_KEY is missing. Supabase integration is disabled.");
      isSupabaseOffline = true;
      lastSupabaseCheckTime = Date.now();
      return null;
    }
    
    try {
      supabaseClient = createClient(supabaseUrl, supabaseKey);
      console.log("[Supabase] Client initialized successfully.");
    } catch (err) {
      console.error("[Supabase] Failed to initialize client:", err);
      isSupabaseOffline = true;
      lastSupabaseCheckTime = Date.now();
    }
  }
  return supabaseClient;
}

// Map a row from either SQLite or Supabase back to standard booking frontend format
function mapRowToBooking(row: any) {
  let guestInfo = { 
    name: row.guest_name || "", 
    email: row.guest_email || "", 
    phone: row.guest_phone || "" 
  };
  let passengers = [];
  try {
    if (row.passengers_json) {
      passengers = typeof row.passengers_json === 'string' ? JSON.parse(row.passengers_json) : row.passengers_json;
    }
  } catch (_) {}

  return {
    id: row.id,
    orderId: row.order_number,
    order_number: row.order_number,
    pnr_number: row.pnr_number,
    bookingRef: row.pnr_number,
    attractionId: row.attraction_id || "",
    attractionName: row.attraction_name || "",
    attractionImageUrl: row.attraction_image_url || "",
    city: row.city || "",
    bookingDate: row.booking_date || "",
    ticketsCount: row.tickets_count || 1,
    totalPrice: row.total_price || 0,
    status: row.status || "confirmed",
    childCount: row.child_count || 0,
    guestInfo,
    passengers,
    timeslot: row.timeslot || "",
    createdAt: row.created_at || "",
    rating: row.rating,
    paymentCurrency: row.payment_currency || "",
    paymentPrice: row.payment_price !== null && row.payment_price !== undefined ? row.payment_price : undefined,
    paymentSymbol: row.payment_symbol || ""
  };
}

// Fetch bookings from Supabase
async function fetchFromSupabase() {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    console.log("[Supabase] Fetching bookings from Supabase...");
    const { data, error } = await supabase
      .from('bookings')
      .select('*');

    if (error) {
      if (error.code === 'PGRST205') {
        console.log("[Supabase Status] Bookings table does not exist in Supabase yet. Run the SQL schema to create it.");
      } else {
        const errMsg = error.message || "";
        if (errMsg.includes("fetch failed") || error.code === "FETCH_ERROR" || !error.code) {
          console.warn("[Supabase] Service is unreachable (fetch failed). Switching to offline SQLite mode.");
          isSupabaseOffline = true;
          lastSupabaseCheckTime = Date.now();
        } else {
          console.log("[Supabase Status] Sync skipped due to code:", error.code, "-", error.message);
        }
      }
      return null;
    }

    return data;
  } catch (err: any) {
    const errMsg = err.message || "";
    if (errMsg.includes("fetch failed") || errMsg.includes("ENOTFOUND") || errMsg.includes("unreachable")) {
      console.warn("[Supabase] Service is unreachable (fetch failed). Switching to offline SQLite mode.");
    } else {
      console.log("[Supabase Status] Unexpected issue during fetch:", errMsg);
    }
    isSupabaseOffline = true;
    lastSupabaseCheckTime = Date.now();
    return null;
  }
}

// Save/Update booking in Supabase
async function saveToSupabase(booking: any) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    console.log("[Supabase Status] Client not available or offline. Skipping sync.");
    return false;
  }

  const payload = {
    id: booking.id,
    order_number: booking.order_number || booking.orderId || "",
    pnr_number: booking.pnr_number || booking.bookingRef || "",
    attraction_id: booking.attractionId || "",
    attraction_name: booking.attractionName || "",
    attraction_image_url: booking.attractionImageUrl || "",
    city: booking.city || "",
    booking_date: booking.bookingDate || "",
    tickets_count: Number(booking.ticketsCount || booking.travelers || 1),
    total_price: Number(booking.totalPrice || booking.collectedAmount || 0),
    status: booking.status || "confirmed",
    child_count: Number(booking.childCount || booking.children || 0),
    guest_name: booking.guestInfo?.name || booking.customerName || "",
    guest_email: booking.guestInfo?.email || booking.customerEmail || "",
    guest_phone: booking.guestInfo?.phone || booking.customerPhone || "",
    passengers_json: JSON.stringify(booking.passengers || booking.guestInfo?.passengers || []),
    created_at: booking.createdAt || "",
    rating: booking.rating !== undefined && booking.rating !== null ? Number(booking.rating) : null,
    timeslot: booking.timeslot || "",
    payment_currency: booking.paymentCurrency || "",
    payment_price: booking.paymentPrice !== undefined && booking.paymentPrice !== null ? Number(booking.paymentPrice) : null,
    payment_symbol: booking.paymentSymbol || ""
  };

  try {
    console.log(`[Supabase] Syncing booking ${payload.id} to Supabase...`);
    // Try to upsert so it works for both insert and update
    const actualResult = await supabase
      .from('bookings')
      .upsert(payload, { onConflict: 'id' });

    if (actualResult.error) {
      if (actualResult.error.code === 'PGRST205') {
        console.log("[Supabase Status] Bookings table does not exist in Supabase yet.");
      } else {
        const errMsg = actualResult.error.message || "";
        if (errMsg.includes("fetch failed") || actualResult.error.code === "FETCH_ERROR" || !actualResult.error.code) {
          console.warn("[Supabase] Service is unreachable (fetch failed). Switching to offline SQLite mode.");
          isSupabaseOffline = true;
          lastSupabaseCheckTime = Date.now();
        } else {
          console.log("[Supabase Status] Upsert skipped. Code:", actualResult.error.code, "-", errMsg);
        }
      }
      return false;
    }

    console.log(`[Supabase] Successfully synced booking ${payload.id} to Supabase bookings table.`);
    return true;
  } catch (err: any) {
    const errMsg = err.message || "";
    if (errMsg.includes("fetch failed") || errMsg.includes("ENOTFOUND") || errMsg.includes("unreachable")) {
      console.warn("[Supabase] Service is unreachable (fetch failed). Switching to offline SQLite mode.");
    } else {
      console.log("[Supabase Status] Unexpected issue during upsert:", errMsg);
    }
    isSupabaseOffline = true;
    lastSupabaseCheckTime = Date.now();
    return false;
  }
}


try {
  // Check if we have the old schema by testing if 'attraction_name' column exists
  const tableInfo = db.pragma("table_info(bookings)") as any[];
  const hasAttractionName = tableInfo.some(col => col.name === 'attraction_name');
  if (tableInfo.length > 0 && !hasAttractionName) {
    console.log("[Database] Old bookings table detected. Dropping and recreating with full schema...");
    db.exec("DROP TABLE IF EXISTS bookings;");
  }

  // Check and add timeslot column if missing
  const hasTimeslot = tableInfo.some(col => col.name === 'timeslot');
  if (tableInfo.length > 0 && !hasTimeslot) {
    console.log("[Database] Adding timeslot column to bookings table...");
    try {
      db.exec("ALTER TABLE bookings ADD COLUMN timeslot TEXT;");
    } catch (err) {
      console.error("Failed to alter table bookings:", err);
    }
  }

  // Check and add payment_currency column if missing
  const hasPaymentCurrency = tableInfo.some(col => col.name === 'payment_currency');
  if (tableInfo.length > 0 && !hasPaymentCurrency) {
    console.log("[Database] Adding payment_currency column to bookings table...");
    try {
      db.exec("ALTER TABLE bookings ADD COLUMN payment_currency TEXT;");
    } catch (err) {
      console.error("Failed to alter table bookings:", err);
    }
  }

  // Check and add payment_price column if missing
  const hasPaymentPrice = tableInfo.some(col => col.name === 'payment_price');
  if (tableInfo.length > 0 && !hasPaymentPrice) {
    console.log("[Database] Adding payment_price column to bookings table...");
    try {
      db.exec("ALTER TABLE bookings ADD COLUMN payment_price REAL;");
    } catch (err) {
      console.error("Failed to alter table bookings:", err);
    }
  }

  // Check and add payment_symbol column if missing
  const hasPaymentSymbol = tableInfo.some(col => col.name === 'payment_symbol');
  if (tableInfo.length > 0 && !hasPaymentSymbol) {
    console.log("[Database] Adding payment_symbol column to bookings table...");
    try {
      db.exec("ALTER TABLE bookings ADD COLUMN payment_symbol TEXT;");
    } catch (err) {
      console.error("Failed to alter table bookings:", err);
    }
  }
} catch (e) {
  console.warn("[Database] Check table failed or table does not exist yet.", e);
}

db.exec(`
  CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    order_number VARCHAR(17) UNIQUE NOT NULL,
    pnr_number VARCHAR(11) UNIQUE NOT NULL,
    attraction_id TEXT,
    attraction_name TEXT,
    attraction_image_url TEXT,
    city TEXT,
    booking_date TEXT,
    tickets_count INTEGER,
    total_price REAL,
    status TEXT,
    child_count INTEGER,
    guest_name TEXT,
    guest_email TEXT,
    guest_phone TEXT,
    passengers_json TEXT,
    created_at TEXT,
    rating INTEGER,
    timeslot TEXT,
    payment_currency TEXT,
    payment_price REAL,
    payment_symbol TEXT
  );
  CREATE UNIQUE INDEX IF NOT EXISTS idx_order_number ON bookings(order_number);
  CREATE UNIQUE INDEX IF NOT EXISTS idx_pnr_number ON bookings(pnr_number);

  CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    booking_id TEXT UNIQUE NOT NULL,
    attraction_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE UNIQUE INDEX IF NOT EXISTS idx_reviews_booking_id ON reviews(booking_id);

  CREATE TABLE IF NOT EXISTS backend_users (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    email TEXT,
    password_hash TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT,
    status TEXT NOT NULL,
    last_login TEXT,
    created_at TEXT NOT NULL,
    two_factor_enabled INTEGER DEFAULT 0,
    two_factor_secret TEXT
  );

  CREATE TABLE IF NOT EXISTS backend_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS backend_logs (
    id TEXT PRIMARY KEY,
    timestamp TEXT NOT NULL,
    username TEXT NOT NULL,
    action TEXT NOT NULL,
    ip TEXT,
    details TEXT
  );
`);

// Seed initial backend users if not present
try {
  const count = db.prepare("SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name='backend_users'").get() as { count: number };
  if (count && count.count > 0) {
    const userCount = db.prepare("SELECT COUNT(*) as count FROM backend_users").get() as { count: number };
    if (userCount.count === 0) {
      const usersToSeed = [
        {
          id: "be-user-1",
          full_name: "Super Administrator",
          username: "superadmin",
          email: "superadmin@tiqsey.com",
          password: "SuperPassword123!",
          role: "super_admin",
          department: "IT & Systems",
          status: "Active"
        },
        {
          id: "be-user-2",
          full_name: "Admin User",
          username: "admin",
          email: "admin@tiqsey.com",
          password: "AdminPassword123!",
          role: "admin",
          department: "Operations",
          status: "Active"
        },
        {
          id: "be-user-3",
          full_name: "Manager User",
          username: "manager",
          email: "manager@tiqsey.com",
          password: "ManagerPassword123!",
          role: "manager",
          department: "Marketing",
          status: "Active"
        },
        {
          id: "be-user-4",
          full_name: "Employee User",
          username: "employee",
          email: "employee@tiqsey.com",
          password: "EmployeePassword123!",
          role: "employee",
          department: "Support",
          status: "Active"
        }
      ];

      const insertStmt = db.prepare(`
        INSERT INTO backend_users (id, full_name, username, email, password_hash, password_salt, role, department, status, created_at, two_factor_enabled)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
      `);

      usersToSeed.forEach(user => {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(user.password, salt, 1000, 64, 'sha512').toString('hex');
        insertStmt.run(user.id, user.full_name, user.username, user.email, hash, salt, user.role, user.department, user.status, new Date().toISOString());
      });
      console.log("[Database] Successfully seeded initial backend user accounts!");
    }
  }
} catch (err) {
  console.error("[Database] Error seeding backend users:", err);
}

function generateOrderNumber(): string {
  // OD + 15 digits
  let num = 'OD';
  for (let i = 0; i < 15; i++) {
    num += Math.floor(Math.random() * 10).toString();
  }
  return num;
}

function generatePnrNumber(): string {
  // BK + 9 uppercase alphanumeric (excluding O, I, 0, 1)
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let num = 'BK';
  for (let i = 0; i < 9; i++) {
    num += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return num;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use JSON middleware
  app.use(express.json());

  // API routes
  app.post("/api/bookings/generate-ids", (req, res) => {
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const orderNumber = generateOrderNumber();
      const pnrNumber = generatePnrNumber();

      try {
        const stmt = db.prepare('INSERT INTO bookings (id, order_number, pnr_number) VALUES (?, ?, ?)');
        stmt.run(`temp-${orderNumber}`, orderNumber, pnrNumber);
        
        return res.json({ success: true, orderNumber, pnrNumber });
      } catch (err: any) {
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
          attempts++;
          continue;
        }
        console.error('[Database Error] ID generation unique constraint attempt failed:', err);
        return res.status(500).json({ error: 'Database error while generating IDs' });
      }
    }

    res.status(500).json({ error: 'Failed to generate unique IDs after multiple attempts' });
  });

  // Get all bookings from backend database
  app.get("/api/bookings", async (req, res) => {
    try {
      console.log("[Database] Fetching all bookings...");
      
      // Fetch from SQLite first
      const localRows = db.prepare('SELECT * FROM bookings').all() as any[];
      const localBookings = localRows.map(mapRowToBooking);

      // Fetch from Supabase (graceful fallback)
      const remoteRows = await fetchFromSupabase();
      
      if (remoteRows && Array.isArray(remoteRows)) {
        console.log(`[Supabase] Successfully fetched ${remoteRows.length} bookings from remote database.`);
        const remoteBookings = remoteRows.map(mapRowToBooking);
        
        // Merge bookings (using a map keyed by ID, remote overrides local if exists)
        const mergedMap = new Map<string, any>();
        
        // First add all local
        localBookings.forEach(b => {
          if (b.id && !b.id.startsWith('temp-')) {
            mergedMap.set(b.id, b);
          }
        });
        
        // Then add/overwrite with remote (since it's the external source of truth)
        remoteBookings.forEach(b => {
          if (b.id) {
            mergedMap.set(b.id, b);
            
            // Also, if this remote booking is not in SQLite, we cache/insert it locally
            const existsInLocal = localRows.some(r => r.id === b.id);
            if (!existsInLocal) {
              try {
                const stmt = db.prepare(`
                  INSERT INTO bookings (
                    id, order_number, pnr_number, attraction_id, attraction_name, 
                    attraction_image_url, city, booking_date, tickets_count, total_price, 
                    status, child_count, guest_name, guest_email, guest_phone, 
                    passengers_json, created_at, rating, timeslot,
                    payment_currency, payment_price, payment_symbol
                  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `);
                stmt.run(
                  b.id, b.order_number, b.pnr_number, b.attractionId, b.attractionName,
                  b.attractionImageUrl, b.city, b.bookingDate, b.ticketsCount, b.totalPrice,
                  b.status, b.childCount, b.guestInfo.name, b.guestInfo.email, b.guestInfo.phone,
                  JSON.stringify(b.passengers), b.createdAt, b.rating !== undefined && b.rating !== null ? b.rating : null,
                  b.timeslot || "",
                  b.paymentCurrency || "",
                  b.paymentPrice !== undefined ? b.paymentPrice : null,
                  b.paymentSymbol || ""
                );
                console.log(`[Sync] Cached remote booking ${b.id} to SQLite database.`);
              } catch (e) {
                // Ignore insert error if unique constraint or duplicate
              }
            }
          }
        });
        
        const bookings = Array.from(mergedMap.values());
        return res.json({ success: true, bookings });
      }

      // If Supabase fetch was skipped or failed, fall back to SQLite bookings
      res.json({ success: true, bookings: localBookings });
    } catch (err: any) {
      console.error("[Database Error] Failed to fetch bookings from SQLite:", err);
      res.status(500).json({ error: "Failed to fetch bookings from database", details: err.message });
    }
  });

  // Save/Update booking details in backend database
  app.post("/api/bookings", async (req, res) => {
    try {
      const booking = req.body;
      if (!booking || !booking.id) {
        return res.status(400).json({ error: "Invalid booking data: missing booking ID" });
      }

      console.log(`[Database] Saving/updating booking in DB: ${booking.id} (${booking.order_number || booking.orderId})`);

      const id = booking.id;
      const order_number = booking.order_number || booking.orderId || "";
      const pnr_number = booking.pnr_number || booking.bookingRef || "";
      const attraction_id = booking.attractionId || "";
      const attraction_name = booking.attractionName || "";
      const attraction_image_url = booking.attractionImageUrl || "";
      const city = booking.city || "";
      const booking_date = booking.bookingDate || "";
      const tickets_count = booking.ticketsCount || booking.travelers || 1;
      const total_price = booking.totalPrice || booking.collectedAmount || 0;
      const status = booking.status || "confirmed";
      const child_count = booking.childCount || booking.children || 0;
      
      const guest_name = booking.guestInfo?.name || booking.customerName || "";
      const guest_email = booking.guestInfo?.email || booking.customerEmail || "";
      const guest_phone = booking.guestInfo?.phone || booking.customerPhone || "";
      const passengers_json = JSON.stringify(booking.passengers || booking.guestInfo?.passengers || []);
      
      const created_at = booking.createdAt || "";
      const rating = booking.rating !== undefined ? booking.rating : null;
      const timeslot = booking.timeslot || "";
      const payment_currency = booking.paymentCurrency || "";
      const payment_price = booking.paymentPrice !== undefined ? booking.paymentPrice : null;
      const payment_symbol = booking.paymentSymbol || "";

      // Check if there is an existing row for this order_number or id
      const existing = db.prepare('SELECT id FROM bookings WHERE id = ? OR order_number = ?').get(id, order_number);

      if (existing) {
        const stmt = db.prepare(`
          UPDATE bookings SET 
            id = ?,
            pnr_number = ?,
            attraction_id = ?,
            attraction_name = ?,
            attraction_image_url = ?,
            city = ?,
            booking_date = ?,
            tickets_count = ?,
            total_price = ?,
            status = ?,
            child_count = ?,
            guest_name = ?,
            guest_email = ?,
            guest_phone = ?,
            passengers_json = ?,
            created_at = ?,
            rating = ?,
            timeslot = ?,
            payment_currency = ?,
            payment_price = ?,
            payment_symbol = ?
          WHERE id = ? OR order_number = ?
        `);
        stmt.run(
          id,
          pnr_number,
          attraction_id,
          attraction_name,
          attraction_image_url,
          city,
          booking_date,
          tickets_count,
          total_price,
          status,
          child_count,
          guest_name,
          guest_email,
          guest_phone,
          passengers_json,
          created_at,
          rating,
          timeslot,
          payment_currency,
          payment_price,
          payment_symbol,
          id,
          order_number
        );
      } else {
        const stmt = db.prepare(`
          INSERT INTO bookings (
            id, order_number, pnr_number, attraction_id, attraction_name, 
            attraction_image_url, city, booking_date, tickets_count, total_price, 
            status, child_count, guest_name, guest_email, guest_phone, 
            passengers_json, created_at, rating, timeslot,
            payment_currency, payment_price, payment_symbol
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run(
          id,
          order_number,
          pnr_number,
          attraction_id,
          attraction_name,
          attraction_image_url,
          city,
          booking_date,
          tickets_count,
          total_price,
          status,
          child_count,
          guest_name,
          guest_email,
          guest_phone,
          passengers_json,
          created_at,
          rating,
          timeslot,
          payment_currency,
          payment_price,
          payment_symbol
        );
      }

      console.log(`[Database] Booking saved/updated locally: ${id}`);

      // Gracefully attempt to sync to Supabase (non-blocking but awaited for reliable logging)
      const supabaseSuccess = await saveToSupabase(booking);
      if (supabaseSuccess) {
        console.log(`[Database] Booking synced successfully to Supabase for ID: ${id}`);
      } else {
        console.warn(`[Database] Supabase sync failed or skipped for ID: ${id}. Kept safely in SQLite.`);
      }

      res.json({ success: true, supabaseSynced: supabaseSuccess });
    } catch (err: any) {
      console.error("[Database Error] Error saving/updating booking:", err);
      res.status(500).json({ error: "Failed to save booking to database", details: err.message });
    }
  });

  // Get all reviews for a specific attraction
  app.get("/api/reviews/attraction/:attractionId", (req, res) => {
    try {
      const { attractionId } = req.params;
      console.log(`[Database] Fetching reviews for attraction: ${attractionId}`);
      const rows = db.prepare('SELECT * FROM reviews WHERE attraction_id = ? ORDER BY created_at DESC').all(attractionId) as any[];
      res.json({ success: true, reviews: rows });
    } catch (err: any) {
      console.error("[Database Error] Failed to fetch reviews:", err);
      res.status(500).json({ error: "Failed to fetch reviews", details: err.message });
    }
  });

  // Get a single review for a specific booking
  app.get("/api/reviews/booking/:bookingId", (req, res) => {
    try {
      const { bookingId } = req.params;
      console.log(`[Database] Fetching review for booking: ${bookingId}`);
      const row = db.prepare('SELECT * FROM reviews WHERE booking_id = ?').get(bookingId);
      res.json({ success: true, review: row || null });
    } catch (err: any) {
      console.error("[Database Error] Failed to fetch booking review:", err);
      res.status(500).json({ error: "Failed to fetch booking review", details: err.message });
    }
  });

  // Submit or update a review
  app.post("/api/reviews", (req, res) => {
    try {
      const { id, bookingId, attractionId, userId, userName, userEmail, rating, comment, createdAt } = req.body;
      if (!bookingId || !attractionId || rating === undefined || comment === undefined) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      console.log(`[Database] Saving review for booking ${bookingId}`);

      const existing = db.prepare('SELECT id FROM reviews WHERE booking_id = ?').get(bookingId);
      if (existing) {
        const stmt = db.prepare(`
          UPDATE reviews SET
            rating = ?,
            comment = ?,
            created_at = ?
          WHERE booking_id = ?
        `);
        stmt.run(rating, comment, createdAt, bookingId);
      } else {
        const stmt = db.prepare(`
          INSERT INTO reviews (id, booking_id, attraction_id, user_id, user_name, user_email, rating, comment, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run(id || `rev-${Date.now()}`, bookingId, attractionId, userId || 'anonymous', userName || 'Guest', userEmail || '', rating, comment, createdAt);
      }

      // Also update rating in the bookings table
      const bookingStmt = db.prepare('UPDATE bookings SET rating = ? WHERE id = ?');
      bookingStmt.run(rating, bookingId);

      res.json({ success: true });
    } catch (err: any) {
      console.error("[Database Error] Failed to save review:", err);
      res.status(500).json({ error: "Failed to save review", details: err.message });
    }
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
      res.json({ success: true, token: "dummy-jwt-token" });
    } else {
      res.status(400).json({ error: "Invalid credentials" });
    }
  });

  app.post("/api/auth/register", (req, res) => {
    const { name, email, password } = req.body;
    if (name && email && password) {
      res.json({ success: true, token: "dummy-jwt-token" });
    } else {
      res.status(400).json({ error: "All fields are required" });
    }
  });

  // Login Rate Limiter In-Memory Store
  const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

  // Token session validator helper
  function getBackendUserByToken(token: string) {
    if (!token) return null;
    try {
      const session = db.prepare("SELECT * FROM backend_sessions WHERE id = ?").get(token) as any;
      if (!session) return null;

      // Check session expiration
      if (new Date() > new Date(session.expires_at)) {
        // Destroy expired session
        db.prepare("DELETE FROM backend_sessions WHERE id = ?").run(token);
        return null;
      }

      // Slide expiration (automatically extend active sessions by 30 mins)
      const newExpiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
      db.prepare("UPDATE backend_sessions SET expires_at = ? WHERE id = ?").run(newExpiresAt, token);

      const user = db.prepare("SELECT * FROM backend_users WHERE id = ?").get(session.user_id) as any;
      if (!user || user.status !== "Active") {
        return null;
      }

      return {
        id: user.id,
        full_name: user.full_name,
        username: user.username,
        email: user.email,
        role: user.role,
        department: user.department,
        status: user.status,
        last_login: user.last_login,
        created_at: user.created_at,
        two_factor_enabled: user.two_factor_enabled === 1
      };
    } catch (_) {
      return null;
    }
  }

  // Backend Authentication and Login Endpoint with Rate Limiting
  app.post("/api/backend/login", (req, res) => {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    // Rate Limiting: max 5 attempts in 15 minutes per username + IP
    const limitKey = `${username}_${ip}`;
    const attemptRecord = loginAttempts.get(limitKey);
    const now = Date.now();
    
    if (attemptRecord) {
      if (now - attemptRecord.lastAttempt > 15 * 60 * 1000) {
        loginAttempts.delete(limitKey);
      } else if (attemptRecord.count >= 5) {
        // Log brute-force rate-limiting
        try {
          db.prepare(`
            INSERT INTO backend_logs (id, timestamp, username, action, ip, details)
            VALUES (?, ?, ?, 'login_rate_limited', ?, 'Too many failed attempts. Suspended for 15 minutes.')
          `).run(`log-${Date.now()}-${Math.random()}`, new Date().toISOString(), username, ip);
        } catch (_) {}

        return res.status(429).json({ 
          error: "Too many login attempts. This account/IP has been temporarily locked. Please try again in 15 minutes." 
        });
      }
    }

    try {
      const user = db.prepare("SELECT * FROM backend_users WHERE username = ? OR email = ?").get(username, username) as any;
      if (!user) {
        // Track failed attempt
        const attempt = loginAttempts.get(limitKey) || { count: 0, lastAttempt: now };
        attempt.count++;
        attempt.lastAttempt = now;
        loginAttempts.set(limitKey, attempt);

        db.prepare(`
          INSERT INTO backend_logs (id, timestamp, username, action, ip, details)
          VALUES (?, ?, ?, 'login_failed', ?, 'User not found')
        `).run(`log-${Date.now()}-${Math.random()}`, new Date().toISOString(), username, ip);

        return res.status(401).json({ error: "Invalid username or password" });
      }

      // Check account status
      if (user.status !== "Active") {
        db.prepare(`
          INSERT INTO backend_logs (id, timestamp, username, action, ip, details)
          VALUES (?, ?, ?, 'login_failed', ?, ?)
        `).run(`log-${Date.now()}-${Math.random()}`, new Date().toISOString(), username, ip, `Login blocked: status is ${user.status}`);

        return res.status(403).json({ error: `Your account status is ${user.status}. Access is denied.` });
      }

      // Secure PBKDF2 Password Hashing verification
      const calculatedHash = crypto.pbkdf2Sync(password, user.password_salt, 1000, 64, 'sha512').toString('hex');
      if (calculatedHash !== user.password_hash) {
        // Track failed attempt
        const attempt = loginAttempts.get(limitKey) || { count: 0, lastAttempt: now };
        attempt.count++;
        attempt.lastAttempt = now;
        loginAttempts.set(limitKey, attempt);

        db.prepare(`
          INSERT INTO backend_logs (id, timestamp, username, action, ip, details)
          VALUES (?, ?, ?, 'login_failed', ?, 'Incorrect password')
        `).run(`log-${Date.now()}-${Math.random()}`, new Date().toISOString(), username, ip);

        return res.status(401).json({ error: "Invalid username or password" });
      }

      // Successful login - clear rate-limit tracking
      loginAttempts.delete(limitKey);

      // Create a secure 32-byte session token
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30-minute idle expiry

      db.prepare(`
        INSERT INTO backend_sessions (id, user_id, created_at, expires_at)
        VALUES (?, ?, ?, ?)
      `).run(token, user.id, new Date().toISOString(), expiresAt);

      // Log last login details
      const lastLoginTime = new Date().toISOString();
      db.prepare("UPDATE backend_users SET last_login = ? WHERE id = ?").run(lastLoginTime, user.id);

      db.prepare(`
        INSERT INTO backend_logs (id, timestamp, username, action, ip, details)
        VALUES (?, ?, ?, 'login_success', ?, 'Successfully logged in')
      `).run(`log-${Date.now()}-${Math.random()}`, lastLoginTime, username, ip);

      return res.json({
        success: true,
        token,
        user: {
          id: user.id,
          full_name: user.full_name,
          username: user.username,
          email: user.email,
          role: user.role,
          department: user.department,
          status: user.status,
          last_login: lastLoginTime,
          created_at: user.created_at,
          two_factor_enabled: user.two_factor_enabled === 1
        }
      });
    } catch (err: any) {
      console.error("Backend login error:", err);
      return res.status(500).json({ error: "Server error during authentication" });
    }
  });

  // Get active backend staff user profile
  app.get("/api/backend/me", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthenticated" });
    }
    const token = authHeader.split(" ")[1];
    const user = getBackendUserByToken(token);
    if (!user) {
      return res.status(401).json({ error: "Session expired or invalid" });
    }
    res.json({ success: true, user });
  });

  // Logout backend staff
  app.post("/api/backend/logout", (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const session = db.prepare("SELECT * FROM backend_sessions WHERE id = ?").get(token) as any;
        if (session) {
          const user = db.prepare("SELECT username FROM backend_users WHERE id = ?").get(session.user_id) as any;
          const username = user ? user.username : 'unknown';
          const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
          
          db.prepare(`
            INSERT INTO backend_logs (id, timestamp, username, action, ip, details)
            VALUES (?, ?, ?, 'logout', ?, 'User logged out and session destroyed')
          `).run(`log-${Date.now()}-${Math.random()}`, new Date().toISOString(), username, ip);
        }
        db.prepare("DELETE FROM backend_sessions WHERE id = ?").run(token);
      } catch (_) {}
    }
    res.json({ success: true });
  });

  // Get backend users list (Super Admin/Admin only)
  app.get("/api/backend/users", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthenticated" });
    }
    const token = authHeader.split(" ")[1];
    const currentUser = getBackendUserByToken(token);
    if (!currentUser) {
      return res.status(401).json({ error: "Session expired" });
    }

    if (currentUser.role !== 'super_admin' && currentUser.role !== 'admin') {
      return res.status(403).json({ error: "Access denied: insufficient permissions" });
    }

    try {
      const users = db.prepare(`
        SELECT id, full_name, username, email, role, department, status, last_login, created_at, two_factor_enabled 
        FROM backend_users 
        ORDER BY created_at DESC
      `).all() as any[];
      
      const mappedUsers = users.map(u => ({
        ...u,
        two_factor_enabled: u.two_factor_enabled === 1
      }));

      res.json({ success: true, users: mappedUsers });
    } catch (err: any) {
      res.status(500).json({ error: "Database error", details: err.message });
    }
  });

  // Create or Update backend user (Super Admin / Admin only)
  app.post("/api/backend/users", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthenticated" });
    }
    const token = authHeader.split(" ")[1];
    const currentUser = getBackendUserByToken(token);
    if (!currentUser) {
      return res.status(401).json({ error: "Session expired" });
    }

    if (currentUser.role !== 'super_admin' && currentUser.role !== 'admin') {
      return res.status(403).json({ error: "Access denied" });
    }

    const { id, full_name, username, email, password, role, department, status } = req.body;

    if (!full_name || !username || !role || !status) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';

    try {
      if (id) {
        // Update user
        // If password is provided, update password. Admins can reset passwords this way!
        if (password) {
          const salt = crypto.randomBytes(16).toString('hex');
          const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
          
          db.prepare(`
            UPDATE backend_users 
            SET full_name = ?, username = ?, email = ?, password_hash = ?, password_salt = ?, role = ?, department = ?, status = ?
            WHERE id = ?
          `).run(full_name, username, email, hash, salt, role, department, status, id);
        } else {
          db.prepare(`
            UPDATE backend_users 
            SET full_name = ?, username = ?, email = ?, role = ?, department = ?, status = ?
            WHERE id = ?
          `).run(full_name, username, email, role, department, status, id);
        }

        db.prepare(`
          INSERT INTO backend_logs (id, timestamp, username, action, ip, details)
          VALUES (?, ?, ?, 'user_updated', ?, ?)
        `).run(`log-${Date.now()}-${Math.random()}`, new Date().toISOString(), currentUser.username, ip, `Updated backend user: ${username} (${role})`);

        res.json({ success: true, message: "User updated successfully" });
      } else {
        // Create user (Only Super Admin can create, or Admin if creating non-SuperAdmin)
        if (currentUser.role !== 'super_admin' && role === 'super_admin') {
          return res.status(403).json({ error: "Only Super Admins can create another Super Admin account." });
        }

        // Check unique username
        const existing = db.prepare("SELECT id FROM backend_users WHERE username = ?").get(username);
        if (existing) {
          return res.status(400).json({ error: "Username already exists. Please choose a different one." });
        }

        if (!password) {
          return res.status(400).json({ error: "Password is required for new users." });
        }

        const newId = `be-user-${Date.now()}`;
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

        db.prepare(`
          INSERT INTO backend_users (id, full_name, username, email, password_hash, password_salt, role, department, status, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(newId, full_name, username, email, hash, salt, role, department, status, new Date().toISOString());

        db.prepare(`
          INSERT INTO backend_logs (id, timestamp, username, action, ip, details)
          VALUES (?, ?, ?, 'user_created', ?, ?)
        `).run(`log-${Date.now()}-${Math.random()}`, new Date().toISOString(), currentUser.username, ip, `Created backend user: ${username} (${role})`);

        res.json({ success: true, message: "User created successfully" });
      }
    } catch (err: any) {
      console.error("Failed to save backend user:", err);
      res.status(500).json({ error: "Failed to save user", details: err.message });
    }
  });

  // Delete backend user (Super Admin only)
  app.delete("/api/backend/users/:id", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthenticated" });
    }
    const token = authHeader.split(" ")[1];
    const currentUser = getBackendUserByToken(token);
    if (!currentUser) {
      return res.status(401).json({ error: "Session expired" });
    }

    if (currentUser.role !== 'super_admin') {
      return res.status(403).json({ error: "Only Super Admins can delete backend staff accounts." });
    }

    const { id } = req.params;
    if (id === currentUser.id) {
      return res.status(400).json({ error: "You cannot delete your own account!" });
    }

    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';

    try {
      const userToDelete = db.prepare("SELECT username FROM backend_users WHERE id = ?").get(id) as any;
      if (!userToDelete) {
        return res.status(404).json({ error: "User not found" });
      }

      db.prepare("DELETE FROM backend_users WHERE id = ?").run(id);

      db.prepare(`
        INSERT INTO backend_logs (id, timestamp, username, action, ip, details)
        VALUES (?, ?, ?, 'user_deleted', ?, ?)
      `).run(`log-${Date.now()}-${Math.random()}`, new Date().toISOString(), currentUser.username, ip, `Deleted backend user: ${userToDelete.username}`);

      res.json({ success: true, message: "User deleted successfully" });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to delete user", details: err.message });
    }
  });

  // Toggle Two-Factor Authentication (2FA)
  app.post("/api/backend/users/:id/toggle-2fa", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthenticated" });
    }
    const token = authHeader.split(" ")[1];
    const currentUser = getBackendUserByToken(token);
    if (!currentUser) {
      return res.status(401).json({ error: "Session expired" });
    }

    const { id } = req.params;
    const { enabled } = req.body;

    // Users can toggle their own, or Admin/SuperAdmin can toggle
    if (currentUser.id !== id && currentUser.role !== 'super_admin' && currentUser.role !== 'admin') {
      return res.status(403).json({ error: "Access denied" });
    }

    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';

    try {
      const user = db.prepare("SELECT username, role FROM backend_users WHERE id = ?").get(id) as any;
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const val = enabled ? 1 : 0;
      db.prepare("UPDATE backend_users SET two_factor_enabled = ? WHERE id = ?").run(val, id);

      db.prepare(`
        INSERT INTO backend_logs (id, timestamp, username, action, ip, details)
        VALUES (?, ?, ?, '2fa_toggled', ?, ?)
      `).run(`log-${Date.now()}-${Math.random()}`, new Date().toISOString(), currentUser.username, ip, `Toggled 2FA for ${user.username} to ${enabled ? 'Enabled' : 'Disabled'}`);

      res.json({ success: true, message: `Two-Factor Authentication has been ${enabled ? 'enabled' : 'disabled'} successfully.` });
    } catch (err: any) {
      res.status(500).json({ error: "Database error", details: err.message });
    }
  });

  // Get Backend logs (Super Admin/Admin only)
  app.get("/api/backend/logs", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthenticated" });
    }
    const token = authHeader.split(" ")[1];
    const currentUser = getBackendUserByToken(token);
    if (!currentUser) {
      return res.status(401).json({ error: "Session expired" });
    }

    if (currentUser.role !== 'super_admin' && currentUser.role !== 'admin') {
      return res.status(403).json({ error: "Access denied" });
    }

    try {
      const logs = db.prepare("SELECT * FROM backend_logs ORDER BY timestamp DESC LIMIT 200").all() as any[];
      res.json({ success: true, logs });
    } catch (err: any) {
      res.status(500).json({ error: "Database error", details: err.message });
    }
  });

  // Secure SQL execution (Super Admin/Admin only)
  app.post("/api/backend/sql/execute", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthenticated" });
    }
    const token = authHeader.split(" ")[1];
    const currentUser = getBackendUserByToken(token);
    if (!currentUser) {
      return res.status(401).json({ error: "Session expired" });
    }

    if (currentUser.role !== 'super_admin' && currentUser.role !== 'admin') {
      return res.status(403).json({ error: "Access denied" });
    }

    const { sql } = req.body;
    if (!sql || typeof sql !== 'string' || !sql.trim()) {
      return res.status(400).json({ error: "SQL statement is required" });
    }

    const trimmedSql = sql.trim();
    // Match queries that fetch data (SELECT, PRAGMA, EXPLAIN, WITH)
    const isQuery = /^\s*(SELECT|PRAGMA|EXPLAIN|SHOW|DESCRIBE|WITH)\b/i.test(trimmedSql);
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';

    try {
      const startTime = process.hrtime();
      let result: any;
      let affectedRows = 0;
      let lastInsertRowid: any = null;

      if (isQuery) {
        result = db.prepare(trimmedSql).all();
      } else {
        const info = db.prepare(trimmedSql).run();
        affectedRows = info.changes;
        lastInsertRowid = info.lastInsertRowid;
        result = [{ message: "Statement executed successfully", changes: info.changes, lastInsertRowid: info.lastInsertRowid }];
      }

      const diff = process.hrtime(startTime);
      const executionTimeMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);

      // Log this execution in the audit logs for accountability
      db.prepare(`
        INSERT INTO backend_logs (id, timestamp, username, action, ip, details)
        VALUES (?, ?, ?, 'sql_executed', ?, ?)
      `).run(
        `log-${Date.now()}-${Math.random()}`,
        new Date().toISOString(),
        currentUser.username,
        ip,
        `Executed SQL query (took ${executionTimeMs}ms): ${trimmedSql.substring(0, 150)}${trimmedSql.length > 150 ? '...' : ''}`
      );

      res.json({
        success: true,
        isQuery,
        result,
        executionTimeMs,
        affectedRows,
        lastInsertRowid
      });
    } catch (err: any) {
      // Log failed execution attempts too
      db.prepare(`
        INSERT INTO backend_logs (id, timestamp, username, action, ip, details)
        VALUES (?, ?, ?, 'sql_failed', ?, ?)
      `).run(
        `log-${Date.now()}-${Math.random()}`,
        new Date().toISOString(),
        currentUser.username,
        ip,
        `SQL Query failed: ${err.message}. Statement: ${trimmedSql.substring(0, 150)}`
      );

      res.status(400).json({
        error: err.message || "Failed to execute SQL query"
      });
    }
  });

  // Get schema and tables (Super Admin/Admin only)
  app.get("/api/backend/sql/tables", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthenticated" });
    }
    const token = authHeader.split(" ")[1];
    const currentUser = getBackendUserByToken(token);
    if (!currentUser) {
      return res.status(401).json({ error: "Session expired" });
    }

    if (currentUser.role !== 'super_admin' && currentUser.role !== 'admin') {
      return res.status(403).json({ error: "Access denied" });
    }

    try {
      // Get all tables
      const tables = db.prepare(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name NOT LIKE 'sqlite_%'
        ORDER BY name
      `).all() as any[];

      const schema: any[] = [];

      for (const table of tables) {
        // Get columns
        const columns = db.prepare(`PRAGMA table_info(${table.name})`).all() as any[];
        // Get row count
        const countObj = db.prepare(`SELECT count(*) as count FROM ${table.name}`).get() as any;
        schema.push({
          name: table.name,
          rowCount: countObj ? countObj.count : 0,
          columns: columns.map(c => ({
            cid: c.cid,
            name: c.name,
            type: c.type,
            notnull: c.notnull === 1,
            pk: c.pk === 1,
            defaultValue: c.dflt_value
          }))
        });
      }

      res.json({ success: true, schema });
    } catch (err: any) {
      res.status(500).json({ error: "Database error", details: err.message });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/message", (req, res) => {
    res.json({ message: "Hello from the backend!" });
  });

  app.post("/api/gemini/generate", async (req, res) => {
    const { action, prompt, tone, length, currentContent } = req.body;
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({ 
        error: "Gemini API Key is not configured. Please add GEMINI_API_KEY in the Settings > Secrets panel." 
      });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      let systemInstruction = "You are an expert content writer and editor. Generate high-quality, engaging, SEO-optimized blog posts using Markdown styling.";
      let fullPrompt = "";

      if (action === "improve") {
        systemInstruction += " You must edit, polish, and improve the user's provided draft based on their instruction. Maintain Markdown formatting, fix grammar, enhance tone and structure, and make it read wonderfully.";
        fullPrompt = `Improve the following blog post content.\n\nInstruction: ${prompt || "Polish the text, make it flow better, and fix any issues."}\n\nTone to apply: ${tone || "engaging"}\n\nHere is the current content to improve:\n---\n${currentContent}\n---`;
      } else if (action === "continue") {
        systemInstruction += " You must continue writing the blog post seamlessly starting exactly from where the provided text leaves off. Do not repeat the existing text, just provide the next logical sections in clean Markdown.";
        fullPrompt = `Continue writing this blog post. Keep the same style, tone, and formatting. Here is the current draft so far:\n---\n${currentContent}\n---\n\nInstruction for how to continue: ${prompt || "Write the next section"}`;
      } else {
        systemInstruction += " Create a brand-new, complete, and comprehensive blog post based on the user's prompt. Use rich markdown elements (like headings, bold text, bulleted lists, quotes, tables, and code snippets) to make it highly engaging and professional.";
        
        let lengthGuide = "medium length (approx. 600-800 words, split across 3-4 sections with headings)";
        if (length === "short") {
          lengthGuide = "short length (approx. 250-400 words, concise, 2 sections)";
        } else if (length === "long") {
          lengthGuide = "long and detailed length (approx. 1000-1500 words, highly comprehensive, multiple sub-sections, deep dive)";
        }

        fullPrompt = `Write a beautiful blog post about:\n"${prompt}"\n\nTone: ${tone || "creative"}\nTarget Length: ${lengthGuide}\nFormatting: Always output in valid Markdown, starting with an eye-catching H1 heading.`;
      }

      // Helper function for delaying execution (for backoff)
      const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

      // Try multiple models and apply exponential backoff on transient errors
      const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-pro-preview", "gemini-3.1-flash-lite"];
      let text = "";
      let lastError: any = null;
      let usedModel = "";

      for (const modelName of modelsToTry) {
        let retries = 2; // initial + 2 retries = 3 attempts total per model
        let backoffMs = 800;

        while (retries >= 0) {
          try {
            console.log(`[Gemini API] Attempting generation with ${modelName} (${retries} retries left)...`);
            const response = await ai.models.generateContent({
              model: modelName,
              contents: fullPrompt,
              config: {
                systemInstruction: systemInstruction,
                temperature: 0.8,
              }
            });

            if (response && response.text) {
              text = response.text;
              usedModel = modelName;
              break;
            }
            throw new Error("Empty response received from Gemini API.");
          } catch (err: any) {
            lastError = err;
            const errMsg = err.message || "";
            const isTransient = 
              errMsg.includes("503") || 
              errMsg.includes("UNAVAILABLE") || 
              errMsg.includes("high demand") || 
              errMsg.includes("rate limit") || 
              errMsg.includes("429") ||
              err.status === 503 ||
              err.status === 429;

            if (isTransient && retries > 0) {
              console.warn(`[Gemini API] Transient error with model ${modelName}: ${errMsg}. Retrying in ${backoffMs}ms...`);
              await sleep(backoffMs);
              backoffMs *= 2;
              retries--;
            } else {
              console.error(`[Gemini API] Failed attempt with model ${modelName}: ${errMsg}.`);
              break; // break out of retry loop to try the next model
            }
          }
        }

        if (text) {
          break; // successfully generated, stop trying other models
        }
      }

      if (!text) {
        const friendlyMessage = "The AI model is currently experiencing high demand. We attempted multiple backup systems, but all of them are busy. Please try your request again in a few seconds.";
        console.error("All AI models and retries failed.", lastError);
        return res.status(503).json({ 
          error: friendlyMessage,
          details: lastError?.message || lastError || "Unknown error"
        });
      }

      console.log(`[Gemini API] Successfully generated content using ${usedModel}`);
      res.json({ success: true, text });
    } catch (err: any) {
      console.error("Gemini Generation Error:", err);
      res.status(500).json({ error: err.message || "An error occurred during content generation." });
    }
  });


  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // app.get('*', ...) is for Express v4, for Express v5 we'd use '*' or '*all' 
    // In package.json express is ^4.21.2
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
