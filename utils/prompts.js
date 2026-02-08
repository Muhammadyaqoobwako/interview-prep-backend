const questionAnswerPrompt = (
  role,
  experience,
  topicsToFocus,
  numberofQuestions,
) =>
  `You are an AI trained to generate technical interview questions and answers.
    
    
    Task:
    - Role: ${role},
    - Candidate Experience: ${experience} years,
    - Focus Topics: ${topicsToFocus}
    - Write ${numberofQuestions} interview questions.
    - For each question, generate a detailed but beginner-friendly answer.
    - If the answer needs code example, add a small code block inside.
    - Keep formatting very clean.
    - Return a pure JSON array like:
    [
        {
            "question": "Question here?",
            "answer": "Answer here..."
        },
        ...

    ] 
    Important: Do not add any extra text. Only return a valid JSON array.
    `;

const conceptExplainPrompt = (question) => `
    You are an AI trained to generate explanations for a given interview question.

    Task:
    - Explain the following interview question and its concept in depth as if you're teaching a beginner developer.
    - Question: "${question}"
    - After the explanation, provide a short and clear title that summarizes the concept for the article or page header.
    - If the explanation includes a code example, provide a small code block.
    - Keep formatting very clean.
    - Return the result as a valid JSON object in the following format:
    {   
        "title": "short title here?",
        "explanation": "Explanation here..."
    }
        Important: Do not add any extra text outside the JSON format. Only return valid JSON.
    `;
module.exports = { questionAnswerPrompt, conceptExplainPrompt };
