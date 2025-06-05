import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// 1. แก้ไข Path การ Import
import { Infographic } from '../src/types';         // <--- แก้ไข Path
import { IconArrowLeft } from '../components/icons'; // <--- แก้ไข Path (ถ้า icons อยู่ใน src/components)
import { supabase } from '../src/supabaseClient';  // <--- แก้ไข Path

// 2. นิยาม Interface ItemDetailPageProps ที่นี่
interface ItemDetailPageProps {
  isAdmin: boolean;
}

const ItemDetailPage: React.FC<ItemDetailPageProps> = ({ isAdmin }) => {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();

  const [item, setItem] = useState<Infographic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  const fetchItem = useCallback(async () => {
    if (!itemId) {
      setError('Item ID is missing.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('infographics')
        .select('*')
        .eq('id', itemId)
        .single();

      if (fetchError) throw fetchError;
      if (data) {
        setItem(data as Infographic); // Cast to Infographic type
        setEditedContent(data.content || '');
      } else {
        setError(`ไม่พบเนื้อหา (ID: ${itemId})`);
      }
    } catch (err) {
      const e = err as any;
      console.error('Error fetching item:', e);
      setError(`เกิดข้อผิดพลาดในการดึงข้อมูล: ${e.message} (Code: ${e.code})`);
    } finally {
      setLoading(false);
    }
  }, [itemId]);

  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  const openImageInModal = (src: string | undefined | null) => {
    if (src) {
      setModalImageSrc(src);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImageSrc(null);
  };

  const handleSaveChanges = async () => {
    if (!item || !itemId) {
      alert('ไม่พบข้อมูล Item หรือ Item ID ที่จะอัปเดต');
      console.warn('handleSaveChanges aborted: item or itemId is null/undefined.', { item, itemId });
      return;
    }
    console.log('Attempting to save changes for itemId:', itemId);
    console.log('Content to be saved:', editedContent);

    try {
      const updates = { content: editedContent };
      console.log('Sending updates to Supabase:', updates);

      const { data: updateData, error: updateError } = await supabase
        .from('infographics')
        .update(updates)
        .eq('id', itemId)
        .select()
        .single();

      if (updateError) {
        console.error('Supabase error updating content (FULL ERROR OBJECT):', JSON.stringify(updateError, null, 2));
        const pgError = updateError as any;
        alert(
          `เกิดข้อผิดพลาดในการบันทึกข้อมูล: ${pgError.message}\n` +
          (pgError.code ? `Code: ${pgError.code}\n` : '') +
          (pgError.details ? `Details: ${pgError.details}\n` : '') +
          (pgError.hint ? `Hint: ${pgError.hint}` : '')
        );
        return;
      }
      if (updateData) {
        alert('บันทึกข้อมูลสำเร็จ!');
        console.log('Data updated successfully:', updateData);
        setIsEditMode(false);
        setItem(updateData as Infographic);
      } else {
        alert('ไม่สามารถอัปเดตข้อมูลได้ หรือไม่พบข้อมูลหลังอัปเดต (No data returned)');
        console.warn('Update seemed to succeed but no data was returned.', { updateData });
      }
    } catch (err) {
      const e = err as Error;
      console.error('Client-side or Network error during handleSaveChanges:', e);
      alert(`ไม่สามารถบันทึกข้อมูลได้ (เกิดข้อผิดพลาดฝั่ง Client หรือ Network): ${e.message}`);
    }
  };

  // 3. นิยาม handleContentClick
  const handleContentClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.tagName === 'IMG' && target.classList.contains('clickable-content-image')) {
      const imgSrc = (target as HTMLImageElement).src;
      if (imgSrc) {
        openImageInModal(imgSrc);
      }
    }
  };


  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center" style={{ minHeight: 'calc(100vh - 10rem)' }}>
        <p className="text-lg">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center" style={{ minHeight: 'calc(100vh - 10rem)' }}>
        <div className="bg-white p-8 rounded-lg shadow-xl inline-block">
          <h1 className="text-3xl font-bold text-brand-gray-darktext mb-4">{error ? 'เกิดข้อผิดพลาด' : 'ไม่พบเนื้อหา'}</h1>
          <p className="text-brand-gray-text text-lg mt-2 mb-6">{error || `ขออภัย ไม่พบเนื้อหาที่คุณกำลังค้นหา (ID: ${itemId})`}</p>
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
            className="w-auto h-auto object-contain max-h-[50vh] cursor-pointer self-center"
            src={item.imageUrl}
            alt={item.title}
            onClick={() => openImageInModal(item.imageUrl)}
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
          <p className="text-sm text-gray-500 mb-6">เผยแพร่เมื่อ: {item.date}</p>

          {isEditMode ? (
            <textarea
              className="w-full h-64 border border-gray-300 rounded-md p-3"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
          ) : (
            <div
              className="text-brand-gray-text leading-relaxed space-y-4 break-words"
              onClick={handleContentClick} // <--- TS2304: Cannot find name 'handleContentClick' (ตอนนี้ควรจะหาเจอแล้ว)
              dangerouslySetInnerHTML={{
                __html: (() => {
                  let processedContent = item.content?.replace(/\n/g, '<br />') || '';
                  const imageUrlRegex = /(?<!(?:src|href)=["'])(https?:\/\/[^\s<>"']+\.(?:png|jpg|jpeg|gif|webp))\b/gi;
                  // 4. กำหนด Type ให้ parameter 'url'
                  processedContent = processedContent.replace(
                    imageUrlRegex,
                    (url: string) => // <--- TS7006: Parameter 'url' implicitly has an 'any' type. (แก้ไข)
                      `<img src="${url}" alt="Embedded image" class="clickable-content-image" style="max-width: 100%; max-height: 75vh; height: auto; object-fit: contain; display: block; margin-top: 0.5em; margin-bottom: 0.5em; margin-left: auto; margin-right: auto; cursor: pointer;" />`
                  );
                  return processedContent;
                })(),
              }}
            />
          )}

          {isAdmin && (
            <div className="mt-4">
              {isEditMode ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveChanges}
                    className="px-4 py-2 bg-brand-green text-white rounded-md hover:bg-brand-green-dark transition-colors"
                  >
                    บันทึก
                  </button>
                  <button
                    onClick={() => {
                      setIsEditMode(false);
                      setEditedContent(item.content || '');
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    ยกเลิก
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setEditedContent(item.content || '');
                    setIsEditMode(true);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  แก้ไขเนื้อหา
                </button>
              )}
            </div>
          )}

          {item.tags && item.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-brand-gray-darktext mb-3">แท็กที่เกี่ยวข้อง:</h3>
              <div className="flex flex-wrap gap-2">
                {/* 5. กำหนด Type ให้ parameter 'tag' */}
                {item.tags.map((tag: string) => ( // <--- TS7006: Parameter 'tag' implicitly has an 'any' type. (แก้ไข)
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

      {isModalOpen && modalImageSrc && (
         <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
           <div className="relative max-w-[90vw] max-h-[90vh] bg-white rounded-lg shadow-xl">
             <img
               className="w-auto h-auto max-w-full max-h-[calc(90vh-4rem)] object-contain"
               src={modalImageSrc}
               alt={modalImageSrc === item.imageUrl ? item.title : "ภาพขยาย"}
               onError={(e) => {
                 const imgElement = e.currentTarget;
                 imgElement.src = 'https://picsum.photos/800/600?grayscale';
                 imgElement.alt = 'ไม่สามารถโหลดรูปภาพได้';
               }}
             />
             <button
               className="absolute top-2 right-2 text-white bg-red-600 hover:bg-red-700 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
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