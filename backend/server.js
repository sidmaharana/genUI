const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Environment Variables
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

// Serve static React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
}

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Fallback Chapter Generator
function generateFallbackChapters(language, title, difficulty) {
  return [
    {
      title: 'Introduction',
      description: 'Getting started with the project',
      content: `Understand the basics of ${language} and set up your development environment.`,
      codeExample: `console.log("Hello, ${language}!");`,
      quiz: [
        {
          question: `What is ${language} primarily used for?`,
          options: ['Web', 'Game', 'System', 'All of the above'],
          correct: 3
        }
      ],
      completed: false
    }
  ];
}

// 📘 Generate Learning Chapters
app.post('/api/generate-chapters', async (req, res) => {
  const { title, description, language, difficulty } = req.body;

  if (!MISTRAL_API_KEY) {
    return res.status(500).json({ error: 'Mistral API key not configured' });
  }

  const prompt = `Create a structured learning curriculum for a coding project with the following details:

Project Title: ${title}
Description: ${description}
Programming Language: ${language}
Difficulty Level: ${difficulty}

Please generate 4-6 chapters that will guide a student through building this project step by step. Each chapter should include:
1. A clear title
2. A description of what the student will learn
3. Detailed content explanation
4. A practical code example
5. 2-3 quiz questions with multiple choice answers

Format the response as a JSON array of chapter objects with the following structure:
{
  "title": "Chapter Title",
  "description": "What the student will learn",
  "content": "Detailed explanation of concepts",
  "codeExample": "Practical code snippet",
  "quiz": [
    {
      "question": "Question text",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correct": 0
    }
  ],
  "completed": false
}

Make sure the curriculum is progressive and appropriate for a ${difficulty} level.`;

  try {
    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
      {
        model: 'mistral-small-latest',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 4000,
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${MISTRAL_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    const chapters = jsonMatch ? JSON.parse(jsonMatch[0]) : generateFallbackChapters(language, title, difficulty);

    res.json({ chapters });
  } catch (error) {
    console.error('Chapter generation error:', error);
    const fallback = generateFallbackChapters(language, title, difficulty);
    res.json({ chapters: fallback });
  }
});

// 💡 Generate Code Snippet from Prompt
app.post('/api/generate-code', async (req, res) => {
  const { prompt, language } = req.body;

  if (!MISTRAL_API_KEY) {
    return res.status(500).json({ error: 'Mistral API key not configured' });
  }

  const aiPrompt = `Generate a complete, clean ${language} code snippet based on the following prompt:

Prompt: ${prompt}

Only return code without explanation or commentary.`;

  try {
    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
      {
        model: 'mistral-small-latest',
        messages: [{ role: 'user', content: aiPrompt }],
        max_tokens: 1500,
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${MISTRAL_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    const cleanedCode = content.replace(/```[a-z]*\n?([\s\S]*?)```/, '$1').trim();

    res.json({ code: cleanedCode || content });
  } catch (error) {
    console.error('Code generation error:', error.message);
    res.status(500).json({ error: 'Failed to generate code' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
