import React, { useState } from 'react';
import './FeatureCard.css';

function FeatureCard({ feature, onDelete }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(feature.id, feature.name);
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="feature-card">
      <div className="card-header">
        <h3 className="feature-name">{feature.name}</h3>
        {feature.aiGenerated && <span className="ai-badge">✨ AI Generated</span>}
      </div>

      <p className="feature-description">{feature.description}</p>

      <div className="card-footer">
        <span className="created-date">📅 {formatDate(feature.createdAt)}</span>
        
        <div className="button-group">
          {!showDeleteConfirm ? (
            <button
              className="delete-btn"
              onClick={handleDeleteClick}
              disabled={isDeleting}
              title="Delete this feature"
            >
              🗑️ Delete
            </button>
          ) : (
            <>
              <button
                className="confirm-btn delete-confirm"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Confirm'}
              </button>
              <button
                className="confirm-btn cancel"
                onClick={handleCancelDelete}
                disabled={isDeleting}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default FeatureCard;