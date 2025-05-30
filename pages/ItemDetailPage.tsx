import React, { useState } from 'react';
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (!item) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center" style={{ minHeight: 'calc(100vh - 10rem)'}}>
        <div className="bg-white p-8 rounded-lg shadow-xl inline-block">
          <h1 className="text-3xl font-bold text-brand-gray-darktext mb-4">ไม่พบเนื้อหา</h1>
          <p className="text-brand-gray-text text-lg mt-2 mb-6">ขออภัย ไม่พบเนื้อหาที่คุณกำลังค้นหา (ID: {itemId})</p>
          <button
            onClick={() => navigate('/')}
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
      <article className="bg-white rounded-lg shadow-xl overflow-hidden inline-block flex flex-col">
        {item.imageUrl && (
          <img
            className="w-auto h-auto object-contain max-h-[70vh] cursor-pointer"
            src={item.imageUrl}
            alt={item.title}
            onClick={openModal}
            onError={(e) => (e.currentTarget.src = 'https://picsum.photos/800/600?grayscale')}
          />
        )}
        <div className="p-6 md:p-10 max-w-full flex-1 overflow-y-auto">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-brand-green hover:text-brand-green-dark font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-green rounded-md px-3 py-1 mb-4"
            aria-label="Go back to previous page"
          >
            <IconArrowLeft className="mr-2 h-5 w-5" />
            กลับ
          </button>
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <img
              className="w-auto h-auto max-w-full max-h-[90vh] object-contain"
              src={item.imageUrl}
              alt={item.title}
              onError={(e) => (e.currentTarget.src = 'https://picsum.photos/800/600?grayscale')}
            />
            <button
              className="absolute top-4 right-4 text-white bg-brand-green hover:bg-brand-green-dark rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
              onClick={closeModal}
              aria-label="Close modal"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetailPage;