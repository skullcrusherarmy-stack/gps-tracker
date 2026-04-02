const express = require("express");
const app = express();

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use(express.json());
app.use(express.static("public"));

const gpsSchema = new mongoose.Schema({
  lat: Number,
  lng: Number,
  time: Date
});

const GPS = mongoose.model("GPS", gpsSchema);

app.post("/gps", async (req, res) => {
  const data = new GPS({
    lat: req.body.lat,
    lng: req.body.lng,
    time: new Date()
  });

  await data.save();
  res.send("Saved");
});

app.get("/gps", async (req, res) => {
  const data = await GPS.find().sort({ time: 1 });
  res.json(data);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running");
});