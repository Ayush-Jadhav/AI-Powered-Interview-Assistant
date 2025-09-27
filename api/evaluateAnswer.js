// api/evaluateAnswer.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports = async (req, res) => {
  try {
    const { question, answer } = req.body;
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `You are an expert interviewer. Evaluate the following answer for the given question. Provide a score from 0 to 10, where 0 is completely wrong and 10 is perfect. Return ONLY a valid JSON object in the format: {"score": <number>, "feedback": "<a brief one-sentence explanation for the score>"}. Do not include any other text or markdown formatting. The user's input is: Question: "${question}" | Answer: "${answer}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text();
    
    try {
      const parsedResult = JSON.parse(jsonText);
      res.status(200).json(parsedResult);
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", jsonText);
      res.status(200).json({ score: 5, feedback: "Could not automatically parse the AI's feedback." });
    }

  } catch (error) {
    console.error("Error evaluating answer with Gemini:", error);
    res.status(500).json({ message: "Failed to evaluate answer" });
  }
};