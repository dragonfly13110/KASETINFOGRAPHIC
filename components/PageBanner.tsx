
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconArrowLeft } from './icons';

interface PageBannerProps {
  title: string;
  subtitle: string;
  showBackButton?: boolean;
}

const PageBanner: React.FC<PageBannerProps> = ({ title, subtitle, showBackButton }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-brand-green-light py-8 px-4 sm:px-6 lg:px-8 mb-8">
      <div className="container mx-auto">
        {showBackButton && (
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-brand-green hover:text-brand-green-dark font-medium mb-4 transition-colors"
          >
            <IconArrowLeft className="mr-2 h-5 w-5" />
            กลับ
          </button>
        )}
        <h1 className="text-3xl font-bold text-brand-green-dark mb-2">{title}</h1>
        <p className="text-lg text-brand-gray-text">{subtitle}</p>
      </div>
    </div>
  );
};

export default PageBanner;
    