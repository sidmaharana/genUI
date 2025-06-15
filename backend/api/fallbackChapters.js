// api/fallbackChapters.js
function generateFallbackChapters(language, title, difficulty) {
  return [
    {
      title: 'Introduction',
      description: 'Setting up your environment and basics of the project',
      content: `Start by understanding the basics of ${language}. Set up your environment for development.`,
      codeExample: `console.log("Hello, ${language}!");`,
      quiz: [
        {
          question: `What is ${language} mainly used for?`,
          options: ['Web', 'Mobile', 'System Programming', 'All of the above'],
          correct: 3
        }
      ],
      completed: false
    }
  ];
}

module.exports = { generateFallbackChapters };
