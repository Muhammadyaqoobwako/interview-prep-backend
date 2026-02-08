const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const authRoutes = require("./routes/authRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const questionRoutes = require("./routes/questionRoutes");
const { protect } = require("./middlewares/authMiddleware");
const {
  generateInterviewQuestions,
  generateConceptExplanation,
} = require("./controllers/aiController");

const app = express();

//middleware to handle cors errors
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-type", "Authorization"],
  }),
);

connectDB();

//Middleware
app.use(express.json());

//Health check endpoint for Gemini API
app.get("/api/health/gemini", async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({ error: "GEMINI_API_KEY not set" });
    }

    const model = "gemini-1.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;

    console.log("Testing Gemini API with URL:", url);
    console.log("API Key (first 20 chars):", apiKey.substring(0, 20));

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: "Say OK" }],
          },
        ],
      }),
    });

    console.log("Response Status:", response.status);
    const responseText = await response.text();
    console.log("Response Body:", responseText);

    if (!response.ok) {
      return res.status(response.status).json({
        status: "error",
        statusCode: response.status,
        message: responseText,
        url: url,
        hint: "If 404, your API key may not have access to this model. Try creating a new key from https://aistudio.google.com/app/apikey",
      });
    }

    const data = JSON.parse(responseText);
    res.status(200).json({
      status: "ok",
      message: "Gemini API is working",
      response: data,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
      details: error.toString(),
    });
  }
});

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/questions", questionRoutes);

app.post("/api/ai/generate-questions", protect, generateInterviewQuestions);
app.post("/api/ai/generate-explanation", protect, generateConceptExplanation);

//Server uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
