const { GoogleGenerativeAI } = require("@google/generative-ai");
const {
  conceptExplainPrompt,
  questionAnswerPrompt,
} = require("../utils/prompts");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";

// Direct REST API call - with fallback models
const callGeminiAPI = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  // List of models to try in order
  const modelsToTry = [
    geminiModelName,
    "gemini-1.5-pro",
    "gemini-1.5-flash",
    "gemini-pro",
  ];

  const uniqueModels = [...new Set(modelsToTry)];

  for (const model of uniqueModels) {
    try {
      console.log(`Trying model: ${model} via SDK...`);
      const genModel = genAI.getGenerativeModel({ model });
      const result = await genModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log(`✓ SUCCESS with model: ${model}`);
      console.log("Extracted text (first 200 chars):", text.substring(0, 200));
      return text;
    } catch (error) {
      console.log(`✗ Model ${model} failed:`, error.message);
      if (model === uniqueModels[uniqueModels.length - 1]) {
        throw new Error(`All models failed. Last error: ${error.message}`);
      }
      console.log(`Trying next model...`);
    }
  }
};

const extractJsonArray = (text) => {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start === -1 || end === -1 || end <= start) return null;
  return text.slice(start, end + 1);
};

const extractJsonObject = (text) => {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  return text.slice(start, end + 1);
};

//@desc Genrate interview questions and answers using Gemini
//@route POST /api/ai/genrate-questions
//access Private
const generateInterviewQuestions = async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: "Missing GEMINI_API_KEY" });
    }

    const { role, experience, topicsToFocus, numberofQuestions } = req.body;

    if (!role || !experience || !topicsToFocus || !numberofQuestions) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    console.log("Generating questions for:", {
      role,
      experience,
      topicsToFocus,
      numberofQuestions,
    });

    const prompt = questionAnswerPrompt(
      role,
      experience,
      topicsToFocus,
      numberofQuestions,
    );

    console.log("Calling Gemini API...");
    let rawText = await callGeminiAPI(prompt);

    console.log("✓ Received response from Gemini");
    console.log("Raw text length:", rawText.length);
    console.log("First 300 chars:", rawText.substring(0, 300));

    // Clean it: Remove ```json and ``` from beginning and end
    const cleanedText = rawText
      .replace(/^```json\s*/, "")
      .replace(/```$/, "")
      .trim();

    console.log("Cleaned text length:", cleanedText.length);
    console.log("First 300 chars of cleaned:", cleanedText.substring(0, 300));

    let data;
    try {
      console.log("Attempting to parse JSON...");
      data = JSON.parse(cleanedText);
      console.log(
        "✓ Successfully parsed JSON, count:",
        Array.isArray(data) ? data.length : "not array",
      );
    } catch (parseError) {
      console.error("JSON parse failed, attempting extraction...");
      const extracted = extractJsonArray(cleanedText);
      if (!extracted) {
        console.error("Could not extract JSON array from text");
        throw parseError;
      }
      console.log("Extracted JSON, attempting parse...");
      data = JSON.parse(extracted);
      console.log("✓ Successfully parsed extracted JSON");
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Error in generateInterviewQuestions:");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    return res
      .status(500)
      .json({ message: "Failed to generate questions", error: error.message });
  }
};

//@desc Genrate explain a interview question
//@route POST/api/ai/genrate-explanation
//access Private
const generateConceptExplanation = async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: "Missing GEMINI_API_KEY" });
    }

    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = conceptExplainPrompt(question);

    let rawText = await callGeminiAPI(prompt);

    // Clean it: Remove ```json and ``` from beginning and end
    const cleanedText = rawText
      .replace(/^```json\s*/, "")
      .replace(/```$/, "")
      .trim();

    let data;
    try {
      data = JSON.parse(cleanedText);
    } catch (parseError) {
      const extracted = extractJsonObject(cleanedText);
      if (!extracted) {
        throw parseError;
      }
      data = JSON.parse(extracted);
    }

    res.status(200).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to genrate questions", error: error.message });
  }
};

module.exports = { generateInterviewQuestions, generateConceptExplanation };
