import { useNavigate } from 'react-router-dom';
import ContentCreatorGrid from '../components/ContentCreatorGrid';
import type { ContentCreator } from '../types/ContentCreator';
import './Pages.css';

interface ShowCreatorsProps {
  creators: ContentCreator[];
  loading?: boolean;
}

const ShowCreators = ({ creators, loading = false }: ShowCreatorsProps) => {
  const navigate = useNavigate();

  const handleAddCreator = () => {
    navigate('/add');
  };

  if (loading) {
    return (
      <div className="page">
        <div className="page-header">
          <h1>Content Creators</h1>
          <p>Discover amazing creators and their content</p>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading creators...</p>
        </div>
      </div>
    );
  }

  if (creators.length === 0) {
    return (
      <div className="page">
        <div className="page-header">
          <h1>Content Creators</h1>
          <p>Discover amazing creators and their content</p>
        </div>
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h2>No Content Creators Found</h2>
          <p>There are no content creators in the database yet.</p>
          <p>Be the first to add a creator!</p>
          <button onClick={handleAddCreator} className="add-creator-button">
            + Add Your First Creator
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="header-content">
          <div>
            <h1>Content Creators</h1>
            <p>Discover amazing creators and their content</p>
          </div>
          <button onClick={handleAddCreator} className="add-creator-button">
            + Add Creator
          </button>
        </div>
      </div>
      <ContentCreatorGrid creators={creators} />
    </div>
  );
};

export default ShowCreators;
