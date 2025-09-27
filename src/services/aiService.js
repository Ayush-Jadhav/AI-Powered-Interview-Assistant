// src/services/aiService.js

// By using relative paths, the browser will automatically send the request
// to the same server that it loaded the website from.
// This works for local development (with the proxy) and for your
// single-service deployment on Render.

// Generates a question by calling our backend endpoint
export const generateQuestion = async (difficulty, existingQuestions = []) => {
  const response = await fetch(`/api/generateQuestion`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ difficulty, existingQuestions }),
  });
  if (!response.ok) throw new Error('Network response was not ok',response);
  const data = await response.json();
  return data.question;
};

// Evaluates an answer by calling our backend endpoint
export const evaluateAnswer = async (question, answer) => {
  const response = await fetch(`/api/evaluateAnswer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, answer }),
  });
  if (!response.ok) throw new Error('Network response was not ok',response);
  const data = await response.json();
  return data;
};

// Generates a summary by calling our backend endpoint
export const generateFinalSummary = async (candidateData) => {
    const response = await fetch(`/api/generateSummary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateData }),
    });
    if (!response.ok) throw new Error('Network response was not ok',response);
    const data = await response.json();
    return data.summary;
};