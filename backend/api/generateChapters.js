// api/generateChapters.js
const axios = require('axios');
const { generateFallbackChapters } = require('./fallbackChapters');

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

async function generateChapters(title, description, language, difficulty) {
  const prompt = `Create a structured learning curriculum for a coding project...
  ...appropriate for the ${difficulty} difficulty level.`; // (your full prompt here)

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
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('No valid JSON found');
    }
  } catch (err) {
    console.error('AI error, returning fallback:', err);
    return generateFallbackChapters(language, title, difficulty);
  }
}

module.exports = { generateChapters };
