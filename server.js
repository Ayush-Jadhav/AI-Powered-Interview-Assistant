// server.js
require('dotenv').config({ path: './.env.local' });
const express = require('express');
const cors = require('cors');
const path = require('path');

const generateQuestionHandler = require('./api/generateQuestion');
const evaluateAnswerHandler = require('./api/evaluateAnswer');
const generateSummaryHandler = require('./api/generateSummary');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API routes
app.post('/api/generateQuestion', generateQuestionHandler);
app.post('/api/evaluateAnswer', evaluateAnswerHandler);
app.post('/api/generateSummary', generateSummaryHandler);

// --- PRODUCTION CODE ---
// Serve the static files from the React app build folder
app.use(express.static(path.join(__dirname, 'build')));

// For any request that doesn't match an API route, send back the React app's index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
// --- END OF PRODUCTION CODE ---

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});