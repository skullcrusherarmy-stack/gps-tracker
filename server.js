const express = require("express");
const mongoose = require("mongoose");

const app = express();

// ---------------- DEBUG (optional but helpful) ----------------
console.log("Starting server...");
console.log("Mongo URL:", process.env.MONGO_URL);

// ---------------- MONGODB CONNECTION ----------------
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Error:", err));

// ---------------- MIDDLEWARE ----------------
app.use(express.json());
app.use(express.static("public"));

// ---------------- SCHEMA ----------------
const gpsSchema = new mongoose.Schema({
  lat: Number,
  lng: Number,
  time: Date
});

const GPS = mongoose.model("GPS", gpsSchema);

// ---------------- ROUTES ----------------

// Save GPS data
app.post("/gps", async (req, res) => {
  try {
    const data = new GPS({
      lat: req.body.lat,
      lng: req.body.lng,
      time: new Date()
    });

    await data.save();

    console.log("Saved:", data);
    res.send("Saved");
  } catch (err) {
    console.log("Error saving:", err);
    res.status(500).send("Error");
  }
});

// Get all GPS data
app.get("/gps", async (req, res) => {
  try {
    const data = await GPS.find().sort({ time: 1 });
    res.json(data);
  } catch (err) {
    console.log("Error fetching:", err);
    res.status(500).send("Error");
  }
});

// ---------------- PORT (VERY IMPORTANT FOR RAILWAY) ----------------
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});