const Question = require("../models/Question");
const Session = require("../models/Session");

// @desc Add additional questions to an existing session
// @route POST /api/questions/add
// @access Private

exports.addQuestionsToSessions = async (req, res) => {
  try {
    const { sessionId, questions } = req.body;
    if (
      !sessionId ||
      !questions ||
      !Array.isArray(questions) ||
      questions.length === 0
    ) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Update session's to include new questions IDs
    const docs = questions.map((q) => ({
      session: session._id,
      question: q.question || "",
      answer: q.answer || "",
    }));

    // Insert questions and attach to session
    const createdQuestions = await Question.insertMany(docs);
    session.questions = session.questions.concat(
      createdQuestions.map((q) => q._id)
    );
    await session.save();

    return res.status(201).json({ createdQuestions });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

// @desc Pin or unpin a question
// @route POST /api/questions/:id/pin
// @access Private
exports.togglePinQuestions = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id);
    if (!question)
      return res.status(404).json({ message: "Question not found" });

    question.isPinned = !question.isPinned;
    await question.save();

    return res.json(question);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};

//@desc update a note for a question
//@route POST /api/questions/:id/note
//@access Private
exports.updateQuestionNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    if (typeof note !== "string") {
      return res
        .status(400)
        .json({ message: "Note is required and must be a string" });
    }

    const question = await Question.findById(id);
    if (!question)
      return res.status(404).json({ message: "Question not found" });

    question.note = note || "";
    await question.save();

    return res.json(question);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};
