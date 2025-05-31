
import React from 'react';
import { Infographic, DisplayCategory } from '../src/types';
import SharedInfographicLayout from './SharedInfographicLayout';

interface ArticlesPageProps {
  infographics: Infographic[];
}

const ArticlesPage: React.FC<ArticlesPageProps> = ({ infographics }) => {
  return (
    <SharedInfographicLayout 
      infographics={infographics} 
      pageType="articles"
      filterByCategory={DisplayCategory.ARTICLE}
      showBackButton={true}
    />
  );
};

export default ArticlesPage;
    