const express = require('express');
const router = express.Router();

router.post('/mentor', async (req, res) => {
  try {
    const { messages } = req.body;
    const topic = messages && messages[0] && messages[0].content ? messages[0].content : "Concepts";
    
    // Simple mocked AI response since no OpenAI key is configured yet
    const mockedResponse = `Here is an AI explanation for: ${topic}\n\nThink of this in the real world: everything is connected and organized. An array is like a row of lockers, a queue is like waiting in line, and a stack is like a stack of plates. Let's delve into the specifics!`;
    
    res.json({ response: mockedResponse });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/evaluate-code', async (req, res) => {
  try {
    const { code, language, challenge } = req.body;
    
    // Simple mocked evaluation response
    const evaluation = `Analysis of your ${language} code for ${challenge}:\n\n- The code has valid syntax.\n- Great attempt at implementing the required methods.\n- Consider adding edge case handling in the future.`;
    const score = Math.floor(Math.random() * 21) + 80; // Returns 80-100 score
    
    const analysis = {
      overallScore: score,
      correctness: { score: score, feedback: "Good job on correctness." },
      efficiency: { timeComplexity: "O(n)", spaceComplexity: "O(1)", score: 80, feedback: "Nice efficiency." },
      codeQuality: { score: 85, feedback: "Clean code", issues: [] },
      plagiarismCheck: { score: 0, isOriginal: true, feedback: "Original code" },
      improvements: ["Add more comments to your code"],
      personalizedTips: ["Keep up the great work learning " + language]
    };

    res.json({ evaluation, score, analysis });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
