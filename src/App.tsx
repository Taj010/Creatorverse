import { useState, useEffect } from 'react'
import { useRoutes } from 'react-router-dom'
import './App.css'
import { ShowCreators, ViewCreator, EditCreator, AddCreator } from './pages'
import type { ContentCreator } from './types/ContentCreator'
import { supabase } from './client.ts'

function App() {
  const [creators, setCreators] = useState<ContentCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch creators from Supabase
  const fetchCreators = async () => {
    try {
      console.log('Starting to fetch creators...');
      setLoading(true);
      setError(null);
      
      // Check if Supabase is properly configured
      if (!supabase) {
        console.error('Supabase client is not initialized');
        return;
      }
      
      console.log('Supabase client initialized, fetching data...');
      const { data, error } = await supabase
        .from('creators')
        .select('*');
      
      console.log('Supabase response:', { data, error });
      
      if (error) {
        console.error('Error fetching creators:', error);
        setError(error.message);
        return;
      }
      
      if (data) {
        console.log('Setting creators:', data);
        setCreators(data);
      }
    } catch (error) {
      console.error('Error fetching creators:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Fetch creators from Supabase on component mount
  useEffect(() => {
    fetchCreators();
  }, []);

  // Handler functions for CRUD operations
  const handleAddCreator = (newCreator: ContentCreator) => {
    setCreators(prev => [...prev, newCreator]);
  };

  const handleUpdateCreator = (updatedCreator: ContentCreator) => {
    setCreators(prev => prev.map(creator => 
      creator.name === updatedCreator.name ? updatedCreator : creator
    ));
  };

  // Define routes
  const routes = useRoutes([
    {
      path: "/",
      element: error ? (
        <div className="page">
          <div className="page-header">
            <h1>Content Creators</h1>
            <p>Discover amazing creators and their content</p>
          </div>
          <div className="empty-state">
            <div className="empty-icon">⚠️</div>
            <h2>Error Loading Creators</h2>
            <p>{error}</p>
            <p>Please check your Supabase configuration.</p>
          </div>
        </div>
      ) : (
        <ShowCreators creators={creators} loading={loading} />
      )
    },
    {
      path: "/creator/:name",
      element: <ViewCreator />
    },
    {
      path: "/creator/:name/edit",
      element: <EditCreator onCreatorUpdated={fetchCreators} />
    },
    {
      path: "/add",
      element: <AddCreator onCreatorAdded={fetchCreators} />
    }
  ]);

  return (
    <>
      <h1>CreatorVerse</h1>
      <p>Discover amazing content creators</p>
      
      {routes}
      
      {/* Debug info - remove this later */}
      <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0', fontSize: '12px' }}>
        <p>Debug Info:</p>
        <p>Loading: {loading ? 'true' : 'false'}</p>
        <p>Creators count: {creators.length}</p>
        <p>Error: {error || 'None'}</p>
        <p>Check browser console for more details</p>
      </div>
    </>
  )
}

export default App
