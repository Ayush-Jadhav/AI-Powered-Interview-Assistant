// api/generateQuestion.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Uses the simple API key from your .env.local file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports = async (req, res) => {
  try {
    const { difficulty, existingQuestions } = req.body;
    
    // We will use the stable "gemini-1.0-pro" model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are an expert interviewer for a full-stack developer role (React/Node.js). Generate one unique interview question with the difficulty: ${difficulty}. Do not repeat any of these previous questions: ${existingQuestions.join(', ')}. Just provide the question text, with no preamble.`; // The prompt is the same
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const question = response.text();

    res.status(200).json({ question });

  } catch (error) {
    console.error("Error generating question with Gemini:", error);
    res.status(500).json({ message: "Failed to generate question" });
  }
};