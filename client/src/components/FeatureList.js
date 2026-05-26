import React from 'react';
import FeatureCard from './FeatureCard';
import './FeatureList.css';

function FeatureList({ features, onDeleteFeature }) {
  if (features.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-content">
          <div className="empty-icon">📋</div>
          <h2>No Features Yet</h2>
          <p>Create your first feature using the AI Box above to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="feature-list-container">
      <div className="list-header">
        <h2 className="list-title">📚 Features List</h2>
        <div className="list-stats">
          <span className="stat">{features.length} feature{features.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
      
      <div className="features-grid">
        {features.map((feature) => (
          <FeatureCard
            key={feature.id}
            feature={feature}
            onDelete={onDeleteFeature}
          />
        ))}
      </div>
    </div>
  );
}

export default FeatureList;