import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import * as dotenv from 'dotenv';
import { GoogleGenAI } from "@google/genai";
import Database from 'better-sqlite3';

dotenv.config();

// Initialize SQLite database
const db = new Database('bookings.db');

try {
  // Check if we have the old schema by testing if 'attraction_name' column exists
  const tableInfo = db.pragma("table_info(bookings)") as any[];
  const hasAttractionName = tableInfo.some(col => col.name === 'attraction_name');
  if (tableInfo.length > 0 && !hasAttractionName) {
    console.log("[Database] Old bookings table detected. Dropping and recreating with full schema...");
    db.exec("DROP TABLE IF EXISTS bookings;");
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
    rating INTEGER
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
`);

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
  app.get("/api/bookings", (req, res) => {
    try {
      console.log("[Database] Fetching all bookings...");
      const rows = db.prepare('SELECT * FROM bookings').all() as any[];
      
      const bookings = rows.map(row => {
        let guestInfo = { name: row.guest_name || "", email: row.guest_email || "", phone: row.guest_phone || "" };
        let passengers = [];
        try {
          if (row.passengers_json) {
            passengers = JSON.parse(row.passengers_json);
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
          createdAt: row.created_at || "",
          rating: row.rating
        };
      });

      res.json({ success: true, bookings });
    } catch (err: any) {
      console.error("[Database Error] Failed to fetch bookings from SQLite:", err);
      res.status(500).json({ error: "Failed to fetch bookings from database", details: err.message });
    }
  });

  // Save/Update booking details in backend database
  app.post("/api/bookings", (req, res) => {
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
            rating = ?
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
          id,
          order_number
        );
      } else {
        const stmt = db.prepare(`
          INSERT INTO bookings (
            id, order_number, pnr_number, attraction_id, attraction_name, 
            attraction_image_url, city, booking_date, tickets_count, total_price, 
            status, child_count, guest_name, guest_email, guest_phone, 
            passengers_json, created_at, rating
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
          rating
        );
      }

      console.log(`[Database] Booking saved/updated successfully: ${id}`);
      res.json({ success: true });
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
