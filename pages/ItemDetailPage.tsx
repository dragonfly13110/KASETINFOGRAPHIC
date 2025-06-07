import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
// 1. แก้ไข Path การ Import
import { Infographic } from '../src/types';         // <--- แก้ไข Path
import { IconArrowLeft } from '../components/icons'; // <--- แก้ไข Path (ถ้า icons อยู่ใน src/components)
import { supabase } from '../src/supabaseClient';  // <--- แก้ไข Path

// 2. นิยาม Interface ItemDetailPageProps ที่นี่
interface ItemDetailPageProps {
  isAdmin: boolean;
  onItemUpdate: (updatedItem: Infographic) => void;
  reFetchInfographics: () => void;
}

const ItemDetailPage: React.FC<ItemDetailPageProps> = ({ isAdmin, onItemUpdate, reFetchInfographics }) => {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();

  const [item, setItem] = useState<Infographic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [editedSummary, setEditedSummary] = useState('');
  // สำหรับ Tags เราจะรับเป็น comma-separated string
  const [editedTags, setEditedTags] = useState('');
  // เพิ่ม state สำหรับ Image URL
  const [editedImageUrl, setEditedImageUrl] = useState('');

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
        const fetchedItem = data as Infographic;
        setItem(fetchedItem);
        setEditedTitle(fetchedItem.title || '');
        setEditedContent(fetchedItem.content || '');
        setEditedSummary(fetchedItem.summary || '');
        setEditedTags(fetchedItem.tags ? fetchedItem.tags.join(', ') : '');
        // ตั้งค่า Image URL สำหรับแก้ไข
        setEditedImageUrl(fetchedItem.imageUrl || '');
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
    console.log('Title to be saved:', editedTitle);
    console.log('Content to be saved:', editedContent);
    console.log('Summary to be saved:', editedSummary);
    console.log('Tags to be saved:', editedTags);

    try {
      // แปลง editedTags เป็น Array โดยแยกด้วย comma และตัดช่องว่างออก
      const tagsArray = editedTags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
      // update title, content, summary และ tags
      const updates = { 
        title: editedTitle, 
        content: editedContent, 
        summary: editedSummary,
        tags: tagsArray,
        imageUrl: editedImageUrl   // เพิ่มการอัปเดต imageUrl ด้วย
      };
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
        onItemUpdate(updateData as Infographic);
        // เรียก re-fetch เพื่อดึงข้อมูลล่าสุด
        reFetchInfographics();
      } else {
        alert('ไม่สามารถอัปเดตข้อมูลได้ หรือไม่พบข้อมูลหลังอัปเดต');
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
    <>
      <Helmet>
        {/* Optional: Improve page title for SEO and browser tab */}
        <title>{item.title ? `${item.title} - ชื่อเว็บไซต์ของคุณ` : 'ชื่อเว็บไซต์ของคุณ'}</title>
        <meta property="og:title" content={item.title || 'ดูเนื้อหา'} />
        <meta property="og:description" content={item.summary || 'รายละเอียดเนื้อหา'} />
        {/* ★ แก้ไข: ตรวจสอบ item.imageUrl และใส่ URL รูปภาพ Default ของเว็บคุณหาก item.imageUrl ไม่มีค่า */}
        <meta property="og:image" content={item.imageUrl || 'YOUR_DEFAULT_SITE_IMAGE_URL_HERE'} />
        <meta property="og:url" content={window.location.href} /> {/* ★ แก้ไข: ใช้ URL ปัจจุบันของหน้าเว็บ */}
        <meta property="og:type" content="article" /> {/* ★ เพิ่ม: ระบุประเภทเนื้อหา */}
      </Helmet>
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
            {isAdmin && isEditMode ? (
              <>
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Title:</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-md p-3" 
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Tags (comma-separated):</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-md p-3" 
                    value={editedTags}
                    onChange={(e) => setEditedTags(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Summary:</label>
                  <textarea
                    className="w-full h-24 border border-gray-300 rounded-md p-3"
                    value={editedSummary}
                    onChange={(e) => setEditedSummary(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Content:</label>
                  <textarea
                    className="w-full h-64 border border-gray-300 rounded-md p-3"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Image URL:</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-md p-3" 
                    value={editedImageUrl}
                    onChange={(e) => setEditedImageUrl(e.target.value)}
                  />
                </div>
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
                      // รีเซ็ตค่า edit fields จากค่าเดิม
                      setEditedTitle(item.title || '');
                      setEditedContent(item.content || '');
                      setEditedSummary(item.summary || '');
                      setEditedTags(item.tags ? item.tags.join(', ') : '');
                      setEditedImageUrl(item.imageUrl || ''); // รีเซ็ต editedImageUrl
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    ยกเลิก
                  </button>
                </div>
              </>
            ) : (
              <>
                {!isEditMode && item.title && (
                  <h1 className="text-3xl font-bold text-brand-gray-darktext mb-4">{item.title}</h1>
                )}
                {item.summary && (
                  <p className="text-lg text-brand-gray-darktext mb-4">{item.summary}</p>
                )}
                <div
                  className="text-brand-gray-text leading-relaxed space-y-4 break-words"
                  onClick={handleContentClick}
                  dangerouslySetInnerHTML={{
                    __html: (() => {
                      let processedContent = item.content?.replace(/\n/g, '<br />') || '';
                      const imageUrlRegex = /(?<!(?:src|href)=["'])(https?:\/\/[^\s<>"']+\.(?:png|jpg|jpeg|gif|webp))\b/gi;
                      processedContent = processedContent.replace(
                        imageUrlRegex,
                        (url: string) =>
                          `<img src="${url}" alt="Embedded image" class="clickable-content-image" style="max-width: 100%; max-height: 75vh; height: auto; object-fit: contain; display: block; margin: 0.5em auto; cursor: pointer;" />`
                      );
                      return processedContent;
                    })(),
                  }}
                />
              </>
            )}

            {isAdmin && !isEditMode && (
              <button
                onClick={() => {
                  setEditedTitle(item.title || '');
                  setEditedContent(item.content || '');
                  setEditedSummary(item.summary || '');
                  setEditedTags(item.tags ? item.tags.join(', ') : '');
                  setEditedImageUrl(item.imageUrl || '');
                  setIsEditMode(true);
                }}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                แก้ไขเนื้อหา, Summary, Title และ Tags
              </button>
            )}

            {item.tags && item.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-brand-gray-darktext mb-3">แท็กที่เกี่ยวข้อง:</h3>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag: string) => (
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
    </>
  );
};

export default ItemDetailPage;