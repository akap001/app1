import React, { useState } from 'react';
import './AIBox.css';

function AIBox({ onCreateFeature }) {
  const [featureName, setFeatureName] = useState('');
  const [description, setDescription] = useState('');
  const [showDescription, setShowDescription] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!featureName.trim()) {
      return;
    }

    setLoading(true);
    try {
      const success = await onCreateFeature(featureName, description);
      if (success) {
        setFeatureName('');
        setDescription('');
        setShowDescription(false);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-box-container">
      <div className="ai-box-header">
        <h2 className="ai-box-title">🤖 AI Feature Creator</h2>
        <p className="ai-box-subtitle">Enter a feature name and let AI generate a description, or provide your own</p>
      </div>

      <form className="ai-box-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="featureName" className="form-label">
            Feature Name <span className="required">*</span>
          </label>
          <input
            id="featureName"
            type="text"
            className="form-input"
            placeholder="e.g., Dark Mode, Real-time Notifications, User Profiles"
            value={featureName}
            onChange={(e) => setFeatureName(e.target.value)}
            disabled={loading}
            maxLength="100"
          />
        </div>

        <div className="form-group">
          <div className="description-toggle">
            <label htmlFor="showDescription" className="toggle-label">
              <input
                id="showDescription"
                type="checkbox"
                checked={showDescription}
                onChange={(e) => setShowDescription(e.target.checked)}
                disabled={loading}
              />
              <span className="toggle-text">Add custom description</span>
            </label>
          </div>

          {showDescription && (
            <div className="description-input-wrapper">
              <label htmlFor="description" className="form-label">
                Description <span className="optional">(optional)</span>
              </label>
              <textarea
                id="description"
                className="form-textarea"
                placeholder="Enter a custom description. Leave blank for AI-generated description."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                rows="3"
                maxLength="500"
              />
              <div className="char-count">{description.length}/500</div>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="submit-btn"
            disabled={!featureName.trim() || loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Creating...
              </>
            ) : (
              <>
                <span className="icon">✨</span>
                Create Feature
              </>
            )}
          </button>

          {featureName.trim() && (
            <p className="hint-text">Press Enter or click Create to submit</p>
          )}
        </div>
      </form>

      <div className="ai-box-info">
        <div className="info-item">
          <span className="info-icon">💡</span>
          <p>If you don't provide a description, AI will generate one automatically</p>
        </div>
        <div className="info-item">
          <span className="info-icon">🔄</span>
          <p>Duplicate features are prevented - you'll be notified if it already exists</p>
        </div>
      </div>
    </div>
  );
}

export default AIBox;