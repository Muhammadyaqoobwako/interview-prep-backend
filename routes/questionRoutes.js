const express = require("express");
const {
  togglePinQuestions,
  updateQuestionNote,
  addQuestionsToSessions,
} = require("../controllers/questionController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/add", protect, addQuestionsToSessions);
router.post("/:id/pin", protect, togglePinQuestions);
router.post("/:id/note", protect, updateQuestionNote);

module.exports = router;
