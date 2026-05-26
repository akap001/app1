const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const FEATURES_FILE = path.join(__dirname, 'features.json');

// Middleware
app.use(cors());
app.use(express.json());

// Initialize features file if it doesn't exist
if (!fs.existsSync(FEATURES_FILE)) {
  fs.writeFileSync(FEATURES_FILE, JSON.stringify([]));
}

// Helper function to read features
const readFeatures = () => {
  try {
    const data = fs.readFileSync(FEATURES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading features:', error);
    return [];
  }
};

// Helper function to write features
const writeFeatures = (features) => {
  try {
    fs.writeFileSync(FEATURES_FILE, JSON.stringify(features, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing features:', error);
    return false;
  }
};

// AI Description Generator (simulated)
const generateAIDescription = (featureName) => {
  const descriptions = {
    'dark mode': 'A sleek dark theme that reduces eye strain and provides a modern look for nighttime browsing and extended usage sessions.',
    'user profiles': 'Personalized user accounts allowing users to store preferences, activity history, and customize their experience within the application.',
    'real-time notifications': 'Instant push notifications that keep users informed of important updates, messages, and events as they happen.',
    'search functionality': 'A powerful search engine that helps users quickly find content, features, and information across the platform.',
    'export data': 'Ability to download and export user data in multiple formats for backup, analysis, or migration purposes.',
    'two factor authentication': 'Enhanced security layer requiring users to verify their identity through a second method beyond password entry.',
    'mobile app': 'Native or cross-platform mobile application extending functionality to iOS and Android devices.',
    'collaboration tools': 'Features enabling users to work together in real-time, share resources, and communicate seamlessly.',
    'analytics dashboard': 'Comprehensive statistics and insights showing user activity, performance metrics, and usage patterns.',
    'api integration': 'Developer-friendly API allowing third-party applications to integrate with and extend platform capabilities.',
  };

  const lowerName = featureName.toLowerCase();
  
  // Check for exact or partial match
  for (const [key, desc] of Object.entries(descriptions)) {
    if (lowerName.includes(key) || key.includes(lowerName)) {
      return desc;
    }
  }

  // Generate generic description if no match
  return `${featureName} is a powerful feature that enhances user experience and adds valuable functionality to the platform. It's designed with user needs in mind and provides seamless integration with existing features.`;
};

// API Routes

// GET /api/features - Get all features
app.get('/api/features', (req, res) => {
  try {
    const features = readFeatures();
    res.json({ success: true, features });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/features/search/:name - Search for a feature
app.get('/api/features/search/:name', (req, res) => {
  try {
    const features = readFeatures();
    const searchName = req.params.name.toLowerCase();
    const feature = features.find(f => f.name.toLowerCase() === searchName);

    if (feature) {
      res.json({ success: true, exists: true, feature });
    } else {
      res.json({ success: true, exists: false });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/features/create - Create a new feature
app.post('/api/features/create', (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, error: 'Feature name is required' });
    }

    const features = readFeatures();
    const normalizedName = name.trim();

    // Check if feature already exists
    const exists = features.some(f => f.name.toLowerCase() === normalizedName.toLowerCase());
    if (exists) {
      return res.status(409).json({ 
        success: false, 
        error: 'Feature already exists',
        message: `Feature "${normalizedName}" already exists in the system.`
      });
    }

    // Generate AI description if not provided
    const finalDescription = description && description.trim() 
      ? description.trim() 
      : generateAIDescription(normalizedName);

    const newFeature = {
      id: Date.now(),
      name: normalizedName,
      description: finalDescription,
      createdAt: new Date().toISOString(),
      aiGenerated: !description || description.trim() === ''
    };

    features.push(newFeature);
    writeFeatures(features);

    res.status(201).json({ 
      success: true, 
      feature: newFeature,
      message: 'Feature created successfully!'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/features/:id - Delete a feature
app.delete('/api/features/:id', (req, res) => {
  try {
    const { id } = req.params;
    const features = readFeatures();
    const initialLength = features.length;

    const updatedFeatures = features.filter(f => f.id !== parseInt(id));

    if (updatedFeatures.length === initialLength) {
      return res.status(404).json({ success: false, error: 'Feature not found' });
    }

    writeFeatures(updatedFeatures);
    res.json({ success: true, message: 'Feature deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}`);
  console.log(`📝 Features file: ${FEATURES_FILE}\n`);
});

module.exports = app;