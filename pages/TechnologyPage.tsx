
import React from 'react';
import { Infographic, DisplayCategory } from '../types';
import SharedInfographicLayout from './SharedInfographicLayout';

interface TechnologyPageProps {
  infographics: Infographic[];
}

const TechnologyPage: React.FC<TechnologyPageProps> = ({ infographics }) => {
  return (
    <SharedInfographicLayout 
      infographics={infographics} 
      pageType="technology"
      filterByCategory={DisplayCategory.TECHNOLOGY}
      showBackButton={true}
    />
  );
};

export default TechnologyPage;
    