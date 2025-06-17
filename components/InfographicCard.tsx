
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
    ? "w-full aspect-square overflow-hidden cursor-pointer" // Changed to square aspect ratio for homepage
    : "w-full h-96 overflow-hidden cursor-pointer"; // Fixed height for images on other pages, adjust as needed

  let finalImageUrl = infographic.imageUrl || 'https://picsum.photos/600/400?grayscale';

  if (isHomePage && infographic.imageUrl) {
    // Only apply quality adjustment for Cloudinary URLs on the homepage
    if (infographic.imageUrl.includes('res.cloudinary.com/') && infographic.imageUrl.includes('/upload/')) {
      try {
        const parts = infographic.imageUrl.split('/upload/');
        const baseUrl = parts[0] + '/upload/';
        const pathAfterUpload = parts[1];
        const segments = pathAfterUpload.split('/');
        let newPathAfterUpload;

        if (segments.length > 0) {
          let firstSegment = segments[0];
          const desiredTransformations = "q_auto,f_auto";

          if (/^v\d+$/.test(firstSegment)) {
            // URL: /upload/v12345/image.jpg -> /upload/q_auto,f_auto/v12345/image.jpg
            newPathAfterUpload = `${desiredTransformations}/${pathAfterUpload}`;
          } else if (firstSegment.includes('_') || firstSegment.includes(',')) {
            // URL has existing transformations e.g., /upload/w_100,c_fill/image.jpg
            // We want to add/replace q_auto and f_auto
            let existingParamsArray = firstSegment.split(',');
            
            // Filter out any existing q_... and f_... parameters
            existingParamsArray = existingParamsArray.filter(param => 
              !param.startsWith('q_') && !param.startsWith('f_')
            );
            
            // Prepend desired transformations and then the filtered existing ones
            const newParamsArray = [desiredTransformations, ...existingParamsArray.filter(p => p.trim() !== '')];
            firstSegment = newParamsArray.join(',');
            
            newPathAfterUpload = [firstSegment, ...segments.slice(1)].join('/');
          } else {
            // URL: /upload/image.jpg -> /upload/q_auto,f_auto/image.jpg
            newPathAfterUpload = `${desiredTransformations}/${pathAfterUpload}`;
          }
          finalImageUrl = baseUrl + newPathAfterUpload;
        } else {
          // pathAfterUpload is empty, unlikely for a valid image URL
          finalImageUrl = infographic.imageUrl; // No change
        }
      } catch (e) {
        console.warn("Failed to modify Cloudinary image URL for quality adjustment on homepage:", e);
        finalImageUrl = infographic.imageUrl; // Fallback to original Cloudinary URL
      }
    }
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col ${cardMinHeightClass}`}>
      <div
        className={imageWrapperClass}
        onClick={() => navigate(`/item/${infographic.id}`)} // Navigate when the image container is clicked
      >
        <img
          className="w-full h-full object-cover object-top" // Image will cover the wrapper and align to top
          src={finalImageUrl}
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
