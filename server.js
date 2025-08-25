import express from "express";
import mysql from "mysql2";
import { WebSocketServer } from "ws";
import dotenv from "dotenv";
import admin from "firebase-admin";

dotenv.config();

// Initialize Firebase Admin SDK
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { readFileSync } from "fs";

//load the service account JSON securely
const serviceAccount = JSON.parse(
  readFileSync("./serviceAccountKey.json", "utf-8")
);

initializeApp({
  credential: cert(serviceAccount),
});

const auth = getAuth();

// create MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL connected!");
});

const app = express();
app.use(express.json());

// webSocket Server for real-time updates
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("Client connected");
  ws.on("close", () => console.log("Client disconnected"));
});

// function to broadcast event updates
function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// middleware to verify Firebase authentication
async function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send("Unauthorized");

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.uid = decodedToken.uid;
    next();
  } catch (error) {
    res.status(403).send("Invalid token");
  }
}

// create event & broadcast update
app.post("/create-event", (req, res) => {
  const { user_id, event_name, date } = req.body;

  db.query(
    "INSERT INTO events (user_id, event_name, date) VALUES (?, ?, ?)",
    [user_id, event_name, date],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      // emit new event to connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              type: "NEW_EVENT",
              event: { user_id, event_name, date },
            })
          );
        }
      });

      res.status(201).json({ success: true });
    }
  );
});

// retrieve all events for a user
app.get("/events", (req, res) => {
  db.query("SELECT * FROM events", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    console.log("🔥 Events retrieved:", results); // Debugging
    res.json(results);
  });
});

// starts Express server
app.listen(3000, () => console.log("Server running on port 3000"));
