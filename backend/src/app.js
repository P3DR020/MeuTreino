const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const workoutRoutes = require("./routes/workoutRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use("/auth", authRoutes);
app.use('/workouts', workoutRoutes);

// Rota de teste
app.get("/", (req, res) => {
  res.json({ message: "API Workout App funcionando!" });
});

module.exports = app;
