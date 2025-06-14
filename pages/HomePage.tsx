
import React from 'react';
import { Infographic } from '../src/types';
import SharedInfographicLayout from './SharedInfographicLayout';

interface HomePageProps {
  infographics: Infographic[];
}

const HomePage: React.FC<HomePageProps> = ({ infographics }) => {
  // Pass all infographics to SharedInfographicLayout and let it handle pagination
  return <SharedInfographicLayout 
            infographics={infographics} 
            pageType="home" 
            itemsPerPage={20} />; // Show up to 30 items per page on the homepage
};

export default HomePage;
