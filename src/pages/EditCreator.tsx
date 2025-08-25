import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { ContentCreator } from '../types/ContentCreator';
import { supabase } from '../client.ts';
import { DEFAULT_IMAGE_URL } from '../constants/defaults';
import './Pages.css';

interface EditCreatorProps {
  onCreatorUpdated?: () => void;
}

const EditCreator = ({ onCreatorUpdated }: EditCreatorProps) => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const [creator, setCreator] = useState<ContentCreator | null>(null);
  const [formData, setFormData] = useState<ContentCreator | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch creator data on component mount
  useEffect(() => {
    const fetchCreator = async () => {
      if (!name) {
        setError('No creator name provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching creator for edit:', name);
        
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
          setFormData(data);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setSaving(true);
    setError(null);

    try {
      console.log('Updating creator:', formData);
      
      const { data, error } = await supabase
        .from('creators')
        .update({
          name: formData.name,
          url: formData.url,
          description: formData.description,
          imageURL: formData.imageURL
        })
        .eq('name', decodeURIComponent(name || ''))
        .select()
        .single();

      if (error) {
        console.error('Error updating creator:', error);
        setError(error.message);
        return;
      }

      console.log('Creator updated successfully:', data);
      
      // Refresh the creators list on the home page
      if (onCreatorUpdated) {
        onCreatorUpdated();
      }
      
      navigate(`/creator/${encodeURIComponent(formData.name)}`);
    } catch (error) {
      console.error('Error updating creator:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: value
      };
    });
  };

  const handleCancel = () => {
    if (creator) {
      navigate(`/creator/${encodeURIComponent(creator.name)}`);
    } else {
      navigate('/');
    }
  };

  const handleDelete = async () => {
    if (!creator || !name) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${creator.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeleting(true);
    setError(null);

    try {
      console.log('Deleting creator:', creator.name);
      
      const { error } = await supabase
        .from('creators')
        .delete()
        .eq('name', decodeURIComponent(name));

      if (error) {
        console.error('Error deleting creator:', error);
        setError(error.message);
        return;
      }

      console.log('Creator deleted successfully');
      
      // Refresh the creators list on the home page
      if (onCreatorUpdated) {
        onCreatorUpdated();
      }
      
      // Navigate back to home page
      navigate('/');
    } catch (error) {
      console.error('Error deleting creator:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="page-header">
          <button onClick={handleCancel} className="back-button">
            ← Cancel
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

  if (error || !creator || !formData) {
    return (
      <div className="page">
        <div className="page-header">
          <button onClick={handleCancel} className="back-button">
            ← Cancel
          </button>
          <h1>Error</h1>
        </div>
        <div className="empty-state">
          <div className="empty-icon">⚠️</div>
          <h2>Creator Not Found</h2>
          <p>{error || 'The requested creator could not be found.'}</p>
          <button onClick={handleCancel} className="save-button">
            Back to Creators
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <button onClick={handleCancel} className="back-button">
          ← Cancel
        </button>
        <h1>Edit Creator</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="creator-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="url">URL</label>
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
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="form-textarea"
            rows={4}
          />
        </div>
        
                 <div className="form-group">
           <label htmlFor="imageURL">Image URL (optional)</label>
           <input
             type="url"
             id="imageURL"
             name="imageURL"
             value={formData.imageURL || ''}
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
           <button type="submit" className="save-button" disabled={saving}>
             {saving ? 'Saving...' : 'Save Changes'}
           </button>
         </div>
         
         <div className="delete-section">
           <h3>Danger Zone</h3>
           <p>Once you delete a creator, there is no going back. Please be certain.</p>
           <button 
             type="button" 
             onClick={handleDelete} 
             className="delete-button" 
             disabled={deleting}
           >
             {deleting ? 'Deleting...' : 'Delete Creator'}
           </button>
         </div>
      </form>
    </div>
  );
};

export default EditCreator;
