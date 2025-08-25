import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { ContentCreator } from '../types/ContentCreator';
import { supabase } from '../client.ts';
import { DEFAULT_IMAGE_URL } from '../constants/defaults';
import './Pages.css';

const ViewCreator = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const [creator, setCreator] = useState<ContentCreator | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCreator = async () => {
      if (!name) {
        setError('No creator name provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching creator:', name);
        
        const { data, error } = await supabase
          .from('creators')
          .select('*')
          .eq('name', decodeURIComponent(name))
          .single();
        
        console.log('Creator fetch response:', { data, error });
        
        if (error) {
          console.error('Error fetching creator:', error);
          setError(error.message);
          return;
        }
        
        if (data) {
          setCreator(data);
        } else {
          setError('Creator not found');
        }
      } catch (error) {
        console.error('Error fetching creator:', error);
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCreator();
  }, [name]);

  const handleBack = () => {
    navigate('/');
  };

  const handleEdit = () => {
    if (creator) {
      navigate(`/creator/${encodeURIComponent(creator.name)}/edit`);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="page-header">
          <button onClick={handleBack} className="back-button">
            ← Back to Creators
          </button>
          <h1>Loading Creator...</h1>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading creator information...</p>
        </div>
      </div>
    );
  }

  if (error || !creator) {
    return (
      <div className="page">
        <div className="page-header">
          <button onClick={handleBack} className="back-button">
            ← Back to Creators
          </button>
          <h1>Error</h1>
        </div>
        <div className="empty-state">
          <div className="empty-icon">⚠️</div>
          <h2>Creator Not Found</h2>
          <p>{error || 'The requested creator could not be found.'}</p>
          <button onClick={handleBack} className="save-button">
            Back to Creators
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <button onClick={handleBack} className="back-button">
          ← Back to Creators
        </button>
        <h1>{creator.name}</h1>
      </div>
      
      <div className="creator-detail">
        <div className="creator-profile">
          <img 
            src={creator.imageURL || DEFAULT_IMAGE_URL} 
            alt={`${creator.name} profile`}
            className="creator-detail-image"
          />
          <div className="creator-info">
            <h2>{creator.name}</h2>
            <p className="creator-description">{creator.description}</p>
            <div className="creator-actions">
              <a 
                href={creator.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="visit-button"
              >
                Visit Creator
              </a>
              <button onClick={handleEdit} className="edit-button">
                Edit Creator
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCreator;
