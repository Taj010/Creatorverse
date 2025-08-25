import ContentCreatorCard from './ContentCreatorCard';
import type { ContentCreator } from '../types/ContentCreator';
import './ContentCreatorGrid.css';

interface ContentCreatorGridProps {
  creators: ContentCreator[];
}

const ContentCreatorGrid = ({ creators }: ContentCreatorGridProps) => (
  <div className="content-creator-grid">
    {creators.map((creator, index) => (
      <ContentCreatorCard key={index} creator={creator} />
    ))}
  </div>
);

export default ContentCreatorGrid;
