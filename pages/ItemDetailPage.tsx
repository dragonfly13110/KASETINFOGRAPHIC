
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Infographic } from '../types';
import { IconArrowLeft } from '../components/icons';

interface ItemDetailPageProps {
  infographics: Infographic[];
}

const ItemDetailPage: React.FC<ItemDetailPageProps> = ({ infographics }) => {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const item = infographics.find(info => info.id === itemId);

  if (!item) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center" style={{ minHeight: 'calc(100vh - 10rem)'}}>
        <div className="bg-white p-8 rounded-lg shadow-xl inline-block">
          <h1 className="text-3xl font-bold text-brand-gray-darktext mb-4">ไม่พบเนื้อหา</h1>
          <p className="text-brand-gray-text text-lg mt-2 mb-6">ขออภัย ไม่พบเนื้อหาที่คุณกำลังค้นหา (ID: {itemId})</p>
          <button
            onClick={() => navigate('/')} // Navigate to home if item not found
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-green hover:bg-brand-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green"
          >
            <IconArrowLeft className="mr-2 h-5 w-5" />
            กลับไปหน้าหลัก
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => navigate(-1)}
        className="mb-8 inline-flex items-center text-brand-green hover:text-brand-green-dark font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-green rounded-md px-3 py-1"
        aria-label="Go back to previous page"
      >
        <IconArrowLeft className="mr-2 h-5 w-5" />
        กลับ
      </button>

      <article className="bg-white rounded-lg shadow-xl overflow-hidden">
        {item.imageUrl && (
          <img
            className="w-full h-72 md:h-96 object-cover"
            src={item.imageUrl}
            alt={item.title}
            onError={(e) => (e.currentTarget.src = 'https://picsum.photos/800/600?grayscale')}
          />
        )}
        <div className="p-6 md:p-10">
          <div className="mb-4">
            <span className="inline-block bg-brand-green-light text-brand-green-dark text-sm font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              {item.displayCategory}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-brand-gray-darktext mb-3">{item.title}</h1>
          <p className="text-sm text-gray-500 mb-6">
            เผยแพร่เมื่อ: {item.date}
          </p>

          <div 
            className="text-brand-gray-text leading-relaxed space-y-4" 
            dangerouslySetInnerHTML={{ __html: item.content.replace(/\n/g, '<br />') }} 
          />

          {item.tags && item.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-brand-gray-darktext mb-3">แท็กที่เกี่ยวข้อง:</h3>
              <div className="flex flex-wrap gap-2">
                {item.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
};

export default ItemDetailPage;
