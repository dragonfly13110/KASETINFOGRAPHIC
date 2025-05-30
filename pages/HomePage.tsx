
import React from 'react';
import { Infographic } from '../types';
import SharedInfographicLayout from './SharedInfographicLayout';

interface HomePageProps {
  infographics: Infographic[];
}

const HomePage: React.FC<HomePageProps> = ({ infographics }) => {
  const latestInfographics = infographics.slice(0, 5); // Show only the latest 5 items
  return <SharedInfographicLayout infographics={latestInfographics} pageType="home" />;
};

export default HomePage;
