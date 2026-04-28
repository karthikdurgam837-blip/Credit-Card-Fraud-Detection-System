import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Database from "better-sqlite3";

// --- DATABASE SETUP ---
const db = new Database("fraud_system.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS transactions (
    tx_id TEXT PRIMARY KEY,
    amount REAL,
    merchant TEXT,
    category TEXT,
    location TEXT,
    is_international INTEGER,
    device_type TEXT,
    channel TEXT,
    hour INTEGER,
    is_night INTEGER,
    prob REAL,
    decision TEXT,
    status TEXT DEFAULT 'PENDING',
    timestamp TEXT
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS system_config (
    key TEXT PRIMARY KEY,
    value TEXT
  )
`);

// Initialize default config if not exists
const setConfigDefault = db.prepare("INSERT OR IGNORE INTO system_config (key, value) VALUES (?, ?)");
setConfigDefault.run("threshold", "0.7");
setConfigDefault.run("simulation_speed", "4000");

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper to fetch live threshold
  function getThreshold() {
    const row = db.prepare("SELECT value FROM system_config WHERE key = 'threshold'").get() as any;
    return parseFloat(row?.value || "0.7");
  }

  // Helper to fetch simulation speed
  function getSimulationSpeed() {
    const row = db.prepare("SELECT value FROM system_config WHERE key = 'simulation_speed'").get() as any;
    return parseInt(row?.value || "4000");
  }

  function calculateFraudScore(tx: any) {
    let score = 0;
    if (tx.amount > 5000) score += 0.3;
    if (tx.is_international) score += 0.2;
    if (tx.hour < 5 || tx.hour > 23) score += 0.15;
    if (tx.device_type === "mobile_unknown") score += 0.2;
    if (tx.channel === "api_direct") score += 0.1;
    score += Math.random() * 0.2;
    return Math.min(score, 1.0);
  }

  // Helper to insert a transaction efficiently
  const insertTx = db.prepare(`
    INSERT OR REPLACE INTO transactions 
    (tx_id, amount, merchant, category, location, is_international, device_type, channel, hour, is_night, prob, decision, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Helper to generate a random transaction
  function generateRandomTx() {
    const merchants = ["Amazon", "Strip-Pay", "Local-Café", "Unknown-Merchant", "Overseas-Shop"];
    const locations = ["California, US", "Texas, US", "New York, US", "Florida, US", "Illinois, US"];
    const categories = ["E-Commerce", "Groceries", "Fuel", "Travel", "Retail", "Services"];
    
    const is_fraud_candidate = Math.random() < 0.05;
    const tx = {
      amount: is_fraud_candidate ? Math.floor(Math.random() * 5000) + 500 : Math.floor(Math.random() * 300) + 10,
      merchant: merchants[Math.floor(Math.random() * merchants.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      is_international: Math.random() < 0.1,
      device_type: Math.random() < 0.1 ? "mobile_unknown" : "web_browser",
      channel: Math.random() < 0.1 ? "api_direct" : "web_ui",
      hour: Math.floor(Math.random() * 24),
      is_night: Math.random() < 0.3 ? 1 : 0,
      timestamp: new Date().toISOString()
    };
    
    const prob = calculateFraudScore(tx);
    const threshold = getThreshold();
    const decision = prob >= threshold ? "REVIEW" : (prob > 0.4 ? "MONITOR" : "ALLOW");
    const tx_id = `TX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    insertTx.run(tx_id, tx.amount, tx.merchant, tx.category, tx.location, tx.is_international ? 1 : 0, tx.device_type, tx.channel, tx.hour, tx.is_night, prob, decision, tx.timestamp);
    return tx_id;
  }

  // Start background simulation with dynamic interval
  let simInterval: NodeJS.Timeout;
  function startSimulation() {
    if (simInterval) clearInterval(simInterval);
    const speed = getSimulationSpeed();
    simInterval = setInterval(() => {
      generateRandomTx();
    }, speed);
  }
  
  startSimulation();

  // --- API ROUTES ---

  // 0. System Config
  app.get("/api/config", (req, res) => {
    const rows = db.prepare("SELECT * FROM system_config").all();
    const config = rows.reduce((acc: any, row: any) => {
      acc[row.key] = row.value;
      return acc;
    }, {});
    res.json(config);
  });

  app.post("/api/config", (req, res) => {
    const { threshold, simulation_speed } = req.body;
    if (threshold !== undefined) db.prepare("UPDATE system_config SET value = ? WHERE key = 'threshold'").run(threshold.toString());
    if (simulation_speed !== undefined) {
      db.prepare("UPDATE system_config SET value = ? WHERE key = 'simulation_speed'").run(simulation_speed.toString());
      startSimulation(); // Restart with new speed
    }
    res.json({ success: true });
  });

  // Triage: Resolve an alert
  app.post("/api/transactions/:id/resolve", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    db.prepare("UPDATE transactions SET status = ? WHERE tx_id = ?").run(status, id);
    res.json({ success: true });
  });

  // 1. Scoring API (Batch + Single) - Now saves to DB
  app.post("/api/score", (req, res) => {
    const txs = Array.isArray(req.body) ? req.body : [req.body];
    const threshold = getThreshold();
    const results = txs.map(tx => {
      const prob = calculateFraudScore(tx);
      const decision = prob >= threshold ? "REVIEW" : (prob > 0.4 ? "MONITOR" : "ALLOW");
      const timestamp = tx.timestamp || new Date().toISOString();
      const tx_id = tx.tx_id || `TX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      const txRecord = {
        ...tx,
        tx_id,
        prob,
        decision,
        timestamp
      };

      // Persist to SQLite
      insertTx.run(
        txRecord.tx_id,
        txRecord.amount,
        txRecord.merchant,
        txRecord.category || "Unknown",
        txRecord.location,
        txRecord.is_international ? 1 : 0,
        txRecord.device_type,
        txRecord.channel,
        txRecord.hour,
        txRecord.is_night ? 1 : 0,
        txRecord.prob,
        txRecord.decision,
        txRecord.timestamp
      );

      return txRecord;
    });
    res.json(results);
  });

  // 2. Transaction Stream / History
  app.get("/api/transactions", (req, res) => {
    const limit = parseInt(req.query.count as string) || 50;
    
    // Check if we need to seed some random data if DB is empty or for simulation
    const rowCount = db.prepare("SELECT COUNT(*) as count FROM transactions").get() as { count: number };
    
    if (rowCount.count < 10) {
      // Seed some initial data
      const merchants = ["Amazon", "Strip-Pay", "Local-Café", "Unknown-Merchant", "Overseas-Shop"];
      const locations = ["California, US", "Texas, US", "New York, US", "Florida, US", "Illinois, US"];
      const categories = ["E-Commerce", "Groceries", "Fuel", "Travel", "Retail", "Services"];
      
      for (let i = 0; i < 20; i++) {
        const is_fraud_candidate = Math.random() < 0.05;
        const tx = {
          amount: is_fraud_candidate ? Math.floor(Math.random() * 5000) + 500 : Math.floor(Math.random() * 300) + 10,
          merchant: merchants[Math.floor(Math.random() * merchants.length)],
          category: categories[Math.floor(Math.random() * categories.length)],
          location: locations[Math.floor(Math.random() * locations.length)],
          is_international: Math.random() < 0.1,
          device_type: Math.random() < 0.1 ? "mobile_unknown" : "web_browser",
          channel: Math.random() < 0.1 ? "api_direct" : "web_ui",
          hour: Math.floor(Math.random() * 24),
          is_night: Math.random() < 0.3 ? 1 : 0,
          timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString()
        };
        const prob = calculateFraudScore(tx);
        const decision = prob >= getThreshold() ? "REVIEW" : (prob > 0.4 ? "MONITOR" : "ALLOW");
        const tx_id = `TX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        insertTx.run(tx_id, tx.amount, tx.merchant, tx.category, tx.location, tx.is_international ? 1 : 0, tx.device_type, tx.channel, tx.hour, tx.is_night, prob, decision, tx.timestamp);
      }
    }

    const rows = db.prepare("SELECT * FROM transactions ORDER BY timestamp DESC LIMIT ?").all(limit) as any[];
    
    // Map SQLite types back to JS types (e.g. 1/0 to bool)
    const result = rows.map(r => ({
      ...r,
      is_international: !!r.is_international,
      is_night: !!r.is_night
    }));

    res.json(result);
  });

  // 3. Stats Summary API (Optional, for more efficient chart loading)
  app.get("/api/stats", (req, res) => {
    const totalCount = db.prepare("SELECT COUNT(*) as count FROM transactions").get() as any;
    const fraudCount = db.prepare("SELECT COUNT(*) as count FROM transactions WHERE prob > 0.7").get() as any;
    const totalVolume = db.prepare("SELECT SUM(amount) as sum FROM transactions").get() as any;
    
    res.json({
      totalCount: totalCount.count,
      fraudCount: fraudCount.count,
      totalVolume: totalVolume.sum || 0
    });
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
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
