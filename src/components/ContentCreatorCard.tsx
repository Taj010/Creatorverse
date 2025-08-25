import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { ContentCreator } from '../types/ContentCreator';
import './ContentCreatorCard.css';

interface ContentCreatorCardProps {
  creator: ContentCreator;
}

const ContentCreatorCard: React.FC<ContentCreatorCardProps> = ({ creator }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/creator/${encodeURIComponent(creator.name)}`);
  };

  const handleVisitClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking the visit button
  };

  return (
    <div className="content-creator-card" onClick={handleCardClick}>
      <div className="card-header">
        {creator.imageURL && (
          <img 
            src={creator.imageURL} 
            alt={`${creator.name} profile`}
            className="creator-image"
          />
        )}
        <div className="creator-info">
          <h3 className="creator-name">{creator.name}</h3>
          <a 
            href={creator.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="creator-url"
          >
            {creator.url}
          </a>
        </div>
      </div>
      <div className="card-body">
        <p className="creator-description">{creator.description}</p>
        <div className="card-actions">
          <a 
            href={creator.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="creator-link"
            onClick={handleVisitClick}
          >
            Visit Creator
          </a>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/creator/${encodeURIComponent(creator.name)}/edit`);
            }}
            className="edit-link"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentCreatorCard;
