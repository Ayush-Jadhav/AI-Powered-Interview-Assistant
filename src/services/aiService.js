// src/services/aiService.js

// This line is the key:
// In production, use the live URL from an environment variable.
// In development, use a relative path, which works with your proxy.
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_API_URL 
  : '';

// Generates a question by calling our backend endpoint
export const generateQuestion = async (difficulty, existingQuestions = []) => {
  const response = await fetch(`${API_BASE_URL}/api/generateQuestion`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ difficulty, existingQuestions }),
  });
  const data = await response.json();
  return data.question;
};

// Evaluates an answer by calling our backend endpoint
export const evaluateAnswer = async (question, answer) => {
  const response = await fetch(`${API_BEST_URL}/api/evaluateAnswer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, answer }),
  });
  const data = await response.json();
  return data;
};

// Generates a summary by calling our backend endpoint
export const generateFinalSummary = async (candidateData) => {
    const response = await fetch(`${API_BASE_URL}/api/generateSummary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateData }),
    });
    const data = await response.json();
    return data.summary;
};