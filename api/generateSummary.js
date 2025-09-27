// api/generateSummary.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports = async (req, res) => {
  try {
    const { candidateData } = req.body;
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are an expert hiring manager. You have just finished an interview with a candidate. Based on their answers and scores, write a 2-3 sentence summary of their performance. Return ONLY a valid JSON object in the format: {"summary": "<your summary>"}. Do not include any other text or markdown formatting. The candidate's interview data is: ${JSON.stringify(candidateData)}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text();
    
    try {
      const parsedResult = JSON.parse(jsonText);
      res.status(200).json(parsedResult); // Sends back { "summary": "..." }
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", jsonText);
      // Fallback in case of parsing error
      res.status(200).json({ summary: "The AI summary could not be generated correctly." });
    }

  } catch (error) {
    console.error("Error generating summary with Gemini:", error);
    res.status(500).json({ message: "Failed to generate summary" });
  }
};