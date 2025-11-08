// server.js
require("dotenv").config({ path: "./.env.local" });
const express = require("express");
const cors = require("cors");
const path = require("path");

const generateQuestionHandler = require("./api/generateQuestion");
const evaluateAnswerHandler = require("./api/evaluateAnswer");
const generateSummaryHandler = require("./api/generateSummary");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API routes
app.post("/api/generateQuestion", generateQuestionHandler);
app.post("/api/evaluateAnswer", evaluateAnswerHandler);
app.post("/api/generateSummary", generateSummaryHandler);

// Serving static files from React app build folder
app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
