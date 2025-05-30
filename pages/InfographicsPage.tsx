
import React from 'react';
import { Infographic, DisplayCategory } from '../types';
import SharedInfographicLayout from './SharedInfographicLayout';

interface InfographicsPageProps {
  infographics: Infographic[];
}

const InfographicsPage: React.FC<InfographicsPageProps> = ({ infographics }) => {
  return (
    <SharedInfographicLayout
      infographics={infographics}
      pageType="infographics"
      filterByCategory={DisplayCategory.INFOGRAPHIC}
      showBackButton={true}
    />
  );
};

export default InfographicsPage;
