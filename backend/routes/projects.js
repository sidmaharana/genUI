// routes/projects.js
const express = require('express');
const admin = require('firebase-admin');
const axios = require('axios');
const router = express.Router();

const db = admin.firestore();

// Middleware to verify Firebase token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Generate learning path using Mistral AI
const generateLearningPath = async (projectIdea) => {
  try {
    const response = await axios.post('https://api.mistral.ai/v1/chat/completions', {
      model: 'mistral-7b-instruct',
      messages: [
        {
          role: 'user',
          content: `Create a structured learning path for the project: "${projectIdea}". 
Break it into 5-7 chapters with:
1. Chapter title
2. Brief description
3. Key concepts to learn
4. Practice exercises
5. Code examples

Format as JSON with this structure:
{
  "chapters": [
    {
      "id": 1,
      "title": "Chapter Title",
      "description": "Brief description",
      "concepts": ["concept1", "concept2"],
      "exercises": ["exercise1", "exercise2"],
      "codeExample": "// code example here"
    }
  ]
}`
        }
      ],
      max_tokens: 2000,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return JSON.parse(response.data.choices[0].message.content);
  } catch (error) {
    console.error('Mistral AI error:', error);
    return {
      chapters: [
        {
          id: 1,
          title: "Project Setup",
          description: "Initialize your project environment",
          concepts: ["Environment setup", "Project structure"],
          exercises: ["Create project folder", "Initialize package.json"],
          codeExample: "// npm init -y\n// mkdir src"
        },
        {
          id: 2,
          title: "Core Implementation",
          description: "Build the main functionality",
          concepts: ["Core logic", "Data structures"],
          exercises: ["Implement main features", "Test functionality"],
          codeExample: "// Your core implementation code here"
        }
      ]
    };
  }
};

// Create new project
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, description, technology } = req.body;
    const userId = req.user.uid;

    const learningPath = await generateLearningPath(`${title}: ${description} using ${technology}`);

    const project = {
      id: Date.now().toString(),
      title,
      description,
      technology,
      userId,
      learningPath,
      progress: {
        currentChapter: 1,
        completedChapters: [],
        totalChapters: learningPath.chapters.length
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('projects').doc(project.id).set(project);

    await db.collection('users').doc(userId).update({
      projects: admin.firestore.FieldValue.arrayUnion(project.id)
    });

    res.json({ success: true, project });
  } catch (error) {
    console.error('Project creation error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Get user's projects
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const projectsSnapshot = await db.collection('projects')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const projects = projectsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(projects);
  } catch (error) {
    console.error('Projects fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get specific project
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.uid;

    const projectDoc = await db.collection('projects').doc(projectId).get();

    if (!projectDoc.exists) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = projectDoc.data();

    if (project.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ id: projectDoc.id, ...project });
  } catch (error) {
    console.error('Project fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Update project progress
router.put('/:id/progress', verifyToken, async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.uid;
    const { chapterId, completed } = req.body;

    const projectRef = db.collection('projects').doc(projectId);
    const projectDoc = await projectRef.get();

    if (!projectDoc.exists || projectDoc.data().userId !== userId) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = projectDoc.data();
    const completedChapters = project.progress.completedChapters || [];

    if (completed && !completedChapters.includes(chapterId)) {
      completedChapters.push(chapterId);

      await db.collection('users').doc(userId).update({
        completedChapters: admin.firestore.FieldValue.increment(1),
        totalPoints: admin.firestore.FieldValue.increment(10)
      });
    }

    await projectRef.update({
      'progress.completedChapters': completedChapters,
      'progress.currentChapter': Math.max(...completedChapters, project.progress.currentChapter),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Progress update error:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// Submit code for feedback
router.post('/:id/submit-code', verifyToken, async (req, res) => {
  try {
    const { code, chapterId } = req.body;

    const feedback = {
      score: Math.floor(Math.random() * 30) + 70,
      suggestions: [
        "Consider adding more comments to your code",
        "Good use of variable naming conventions",
        "Try to break down complex functions into smaller ones"
      ],
      improvements: [
        "Add error handling",
        "Optimize performance",
        "Follow coding best practices"
      ]
    };

    res.json({ success: true, feedback });
  } catch (error) {
    console.error('Code submission error:', error);
    res.status(500).json({ error: 'Failed to process code submission' });
  }
});

module.exports = router;
