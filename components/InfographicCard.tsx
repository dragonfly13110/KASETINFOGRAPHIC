
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Infographic } from '../src/types';

interface InfographicCardProps {
  infographic: Infographic;
  isHomePage?: boolean;
}

const InfographicCard: React.FC<InfographicCardProps> = ({ infographic, isHomePage }) => {
  const navigate = useNavigate(); // Initialize useNavigate
  const cardMinHeightClass = "min-h-[420px]"; // Default card min height, can be adjusted

  // Define classes for the image wrapper based on whether it's the homepage
  const imageWrapperClass = isHomePage
    ? "w-full aspect-[9/16] overflow-hidden cursor-pointer" // 9:16 aspect ratio for homepage
    : "w-full h-96 overflow-hidden cursor-pointer"; // Fixed height for images on other pages, adjust as needed

  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col ${cardMinHeightClass}`}>
      <div
        className={imageWrapperClass}
        onClick={() => navigate(`/item/${infographic.id}`)} // Navigate when the image container is clicked
      >
        <img
          className="w-full h-full object-cover object-top" // Image will cover the wrapper and align to top
          src={infographic.imageUrl || 'https://picsum.photos/600/400?grayscale'}
          alt={infographic.title}
          onError={(e) => (e.currentTarget.src = 'https://picsum.photos/600/400?grayscale')}
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div>
          <span className="inline-block bg-brand-green text-white text-xs font-semibold px-2 py-1 rounded-full uppercase mb-2">
            {infographic.displayCategory}
          </span>
          <h3
            className="text-xl font-semibold text-brand-gray-darktext mb-2 cursor-pointer hover:text-brand-green transition-colors"
            onClick={() => navigate(`/item/${infographic.id}`)} // Navigate when title is clicked
          >
            {infographic.title}
          </h3>
          <p className="text-xs text-gray-500 mb-3">{infographic.date}</p>
          <p className="text-brand-gray-text text-sm mb-4 line-clamp-3 flex-grow">{infographic.summary}</p>
        </div>
        <div className="mt-auto">
          {infographic.tags.length > 0 && (
            <div className="mb-4">
              {infographic.tags.slice(0, 3).map(tag => (
                <span key={tag} className="inline-block bg-gray-200 text-gray-700 text-xs font-medium mr-2 mb-2 px-2.5 py-0.5 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}
          <a
            href={`#/item/${infographic.id}`} // Updated href for direct linking if needed
            onClick={(e) => {
              e.preventDefault();
              navigate(`/item/${infographic.id}`); // Navigate to item detail page
            }}
            className="text-brand-green font-semibold hover:text-brand-green-dark transition-colors duration-200 inline-flex items-center"
            aria-label={`ดูรายละเอียดเกี่ยวกับ ${infographic.title}`}
          >
            ดูรายละเอียด <span className="ml-1">→</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default InfographicCard;
