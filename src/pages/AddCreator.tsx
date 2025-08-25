import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ContentCreator } from '../types/ContentCreator';
import { supabase } from '../client.ts';
import { DEFAULT_IMAGE_URL } from '../constants/defaults';
import './Pages.css';

interface AddCreatorProps {
  onCreatorAdded?: () => void;
}

const AddCreator = ({ onCreatorAdded }: AddCreatorProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<ContentCreator, 'imageURL'> & { imageURL: string }>({
    name: '',
    url: '',
    description: '',
    imageURL: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const newCreator: ContentCreator = {
        ...formData,
        imageURL: formData.imageURL || undefined
      };

      console.log('Adding new creator:', newCreator);
      
      const { data, error } = await supabase
        .from('creators')
        .insert([newCreator])
        .select()
        .single();

      if (error) {
        console.error('Error adding creator:', error);
        setError(error.message);
        return;
      }

      console.log('Creator added successfully:', data);
      
      // Refresh the creators list on the home page
      if (onCreatorAdded) {
        onCreatorAdded();
      }
      
      navigate('/');
    } catch (error) {
      console.error('Error adding creator:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="page">
      <div className="page-header">
        <button onClick={handleCancel} className="back-button">
          ← Cancel
        </button>
        <h1>Add New Creator</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="creator-form">
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="Enter creator name"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="url">URL *</label>
          <input
            type="url"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="https://example.com"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="form-textarea"
            rows={4}
            placeholder="Describe what this creator does..."
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="imageURL">Image URL (optional)</label>
          <input
            type="url"
            id="imageURL"
            name="imageURL"
            value={formData.imageURL}
            onChange={handleChange}
            className="form-input"
            placeholder={DEFAULT_IMAGE_URL}
          />
          <small style={{ color: '#5d4e37', fontStyle: 'italic', marginTop: '4px', display: 'block' }}>
            Leave empty to use the default image
          </small>
        </div>
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
        
        <div className="form-actions">
          <button type="button" onClick={handleCancel} className="cancel-button">
            Cancel
          </button>
          <button type="submit" className="save-button" disabled={loading}>
            {loading ? 'Adding...' : 'Add Creator'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCreator;
