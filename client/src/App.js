import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import AIBox from './components/AIBox';
import FeatureList from './components/FeatureList';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [notification, setNotification] = useState({ type: '', message: '' });

  // Fetch features on mount
  useEffect(() => {
    fetchFeatures();
  }, []);

  // Auto-clear notifications
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ type: '', message: '' });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchFeatures = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/features`);
      setFeatures(response.data.features || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching features:', err);
      setError('Failed to load features. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFeature = async (featureName, description) => {
    if (!featureName.trim()) {
      setNotification({ type: 'error', message: 'Please enter a feature name' });
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/features/create`, {
        name: featureName,
        description: description || ''
      });

      if (response.data.success) {
        setFeatures([response.data.feature, ...features]);
        setNotification({
          type: 'success',
          message: `✨ Feature "${featureName}" created successfully!`
        });
        return true;
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setNotification({
          type: 'error',
          message: `⚠️ Feature "${featureName}" already exists!`
        });
      } else {
        setNotification({
          type: 'error',
          message: 'Failed to create feature. Please try again.'
        });
      }
    }
    return false;
  };

  const handleDeleteFeature = async (featureId, featureName) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/features/${featureId}`);
      
      if (response.data.success) {
        setFeatures(features.filter(f => f.id !== featureId));
        setNotification({
          type: 'success',
          message: `🗑️ Feature "${featureName}" deleted successfully`
        });
      }
    } catch (err) {
      console.error('Error deleting feature:', err);
      setNotification({
        type: 'error',
        message: 'Failed to delete feature. Please try again.'
      });
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">✨ Copilot Feature Manager</h1>
          <p className="app-subtitle">Create and manage features with AI assistance</p>
        </div>
      </header>

      <main className="app-main">
        {notification.message && (
          <div className={`notification notification-${notification.type}`}>
            {notification.message}
          </div>
        )}

        <section className="ai-section">
          <AIBox onCreateFeature={handleCreateFeature} />
        </section>

        <section className="features-section">
          {loading ? (
            <div className="loading">Loading features...</div>
          ) : error ? (
            <div className="error-message">⚠️ {error}</div>
          ) : (
            <FeatureList 
              features={features} 
              onDeleteFeature={handleDeleteFeature}
            />
          )}
        </section>
      </main>

      <footer className="app-footer">
        <p>Built with ❤️ using React, Express, and GitHub Copilot</p>
      </footer>
    </div>
  );
}

export default App;