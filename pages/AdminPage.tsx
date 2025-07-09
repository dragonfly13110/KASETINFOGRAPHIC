import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../src/supabaseClient'; // ตรวจสอบว่า supabase client ถูกตั้งค่าอย่างถูกต้อง
import { Infographic, DisplayCategory } from '../src/types'; // ประเภทข้อมูลที่คุณกำหนด
import { IconPlusCircle, IconUserCircle, IconLockClosed } from '../components/icons'; // ไอคอนของคุณ

// --- Cloudinary Configuration for Multiple Accounts ---
const CLOUDINARY_CLOUD_NAMES = (import.meta.env.VITE_CLOUDINARY_CLOUD_NAMES || '').split(',').map((s: string) => s.trim()).filter(Boolean);
const CLOUDINARY_UPLOAD_PRESETS = (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESETS || '').split(',').map((s: string) => s.trim()).filter(Boolean);

// Helper function to get a random configuration for an upload
const getRandomCloudinaryConfig = () => {
  if (CLOUDINARY_CLOUD_NAMES.length === 0 || CLOUDINARY_UPLOAD_PRESETS.length === 0) {
    const error = "VITE_CLOUDINARY_CLOUD_NAMES หรือ VITE_CLOUDINARY_UPLOAD_PRESETS ไม่ได้ถูกตั้งค่าใน environment variables";
    console.error("Cloudinary Config Error:", error);
    return { config: null, error };
  }
  if (CLOUDINARY_CLOUD_NAMES.length !== CLOUDINARY_UPLOAD_PRESETS.length) {
    const error = "จำนวนของ VITE_CLOUDINARY_CLOUD_NAMES และ VITE_CLOUDINARY_UPLOAD_PRESETS ไม่ตรงกัน";
    
  }
  const randomIndex = Math.floor(Math.random() * CLOUDINARY_CLOUD_NAMES.length);
  return {
    cloudName: CLOUDINARY_CLOUD_NAMES[randomIndex],
    uploadPreset: CLOUDINARY_UPLOAD_PRESETS[randomIndex],
  };
};


const predefinedTags = [
  'ศัตรูพืช (Plant Pests)',
  'โรคพืช (Plant Diseases)',
  'เทคนิคเพาะปลูก (Cultivation Techniques)',
  'ทั่วไป (General)',
  'การผลิตเชื้อ (Pathogen Production / Microbial Production)',
  'วิสาหกิจชุมชน (Community Enterprise)',
  'หยุดเผา (Stop Burning)',
  'แมลง (Insects)',
  'สมุนไพร (Herbs)',
  'ความรู้เกษตร (Agricultural Knowledge)',
  'เพาะปลูก (Cultivation)',
  'ไม้ผล (Fruit Trees)',
];
const OTHER_TAG_OPTION = 'และอื่นๆ';

interface AdminPageProps {
  onAddInfographic: (newInfo: Omit<Infographic, 'id' | 'date' | 'created_at'>) => Promise<void>;
}

const AdminPage: React.FC<AdminPageProps> = ({ onAddInfographic }) => {
  const navigate = useNavigate();

  // --- Authentication State ---
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authPassword, setAuthPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);

  // --- Infographic Form State ---
  const [title, setTitle] = useState<string>('');
  const [externalImageUrl, setExternalImageUrl] = useState<string>(''); // สำหรับวาง URL โดยตรง
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>(''); // URL จาก Supabase Storage
  const [summary, setSummary] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [displayCategory, setDisplayCategory] = useState<DisplayCategory>(DisplayCategory.INFOGRAPHIC);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTagSelection, setCurrentTagSelection] = useState<string>(predefinedTags[0]);
  const [customTag, setCustomTag] = useState<string>('');

  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<string>(''); // สำหรับข้อความสำเร็จหรือข้อผิดพลาดเล็กน้อย
  const [submitMessageType, setSubmitMessageType] = useState<'success' | 'error' | ''>('');


  // Ref สำหรับ file input
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // --- Effects ---
  useEffect(() => {
    // ตรวจสอบ session เริ่มต้น
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkSession();

    // ฟังการเปลี่ยนแปลงสถานะ auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (!session) {
        resetFormFields();
        setAuthEmail('');
        setAuthPassword('');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (submitMessage) {
      const timer = setTimeout(() => {
        setSubmitMessage('');
        setSubmitMessageType('');
      }, 4000); // แสดงข้อความเป็นเวลา 4 วินาที
      return () => clearTimeout(timer);
    }
  }, [submitMessage]);


  // --- Utility Functions ---
  const resetFormFields = () => {
    setTitle('');
    setExternalImageUrl('');
    setUploadedFile(null);
    setUploadedFileUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // รีเซ็ต file input
    }
    setSummary('');
    setContent('');
    setDisplayCategory(DisplayCategory.INFOGRAPHIC);
    setTags([]);
    setCurrentTagSelection(predefinedTags[0]);
    setCustomTag('');
  };

  const showMessage = (message: string, type: 'success' | 'error' | '') => {
    setSubmitMessage(message);
    setSubmitMessageType(type);
  };

  const handleContentPaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const clipboardData = event.clipboardData;
    let textToInsert = '';
    let useHtmlExtractedUrl = false;

    // 1. ตรวจสอบข้อมูล HTML ใน Clipboard
    const htmlData = clipboardData.getData('text/html');
    if (htmlData) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlData;
      const imgElement = tempDiv.querySelector('img');

      if (imgElement && imgElement.src) {
        // 2. ตรวจสอบว่าเป็น URL รูปภาพที่สมบูรณ์ (http/https)
        if (imgElement.src.startsWith('http://') || imgElement.src.startsWith('https://')) {
          textToInsert = imgElement.src;
          useHtmlExtractedUrl = true;
        }
      }
    }

    // 3. ถ้าไม่พบ URL จาก HTML หรือไม่ต้องการใช้ ให้ใช้ Plain Text แทน
    if (!useHtmlExtractedUrl) {
      const plainTextData = clipboardData.getData('text/plain');
      if (plainTextData) {
        textToInsert = plainTextData;
      }
    }

    if (textToInsert) {
      event.preventDefault(); // ป้องกันการวางแบบปกติ
      const textarea = event.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentValue = textarea.value;
      const newValue = currentValue.substring(0, start) + textToInsert + currentValue.substring(end);
      
      setContent(newValue); // อัปเดต State ของ React

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + textToInsert.length;
      }, 0);
    }
    // ถ้า textToInsert ยังคงว่างเปล่า (เช่น Clipboard ว่าง) จะไม่มีการดำเนินการใดๆ และการวางแบบปกติ (ถ้ามี) จะไม่เกิดขึ้นเนื่องจากไม่ได้เรียก preventDefault ในกรณีนอก if
  };

  // --- Event Handlers ---
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: authPassword,
      });
      if (error) {
        setAuthError(error.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      }
      // setIsAuthenticated(true); // Auth listener จะจัดการส่วนนี้
    } catch (err: any) {
      setAuthError(err.message || 'เกิดข้อผิดพลาดในการล็อกอิน โปรดลองอีกครั้ง');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    setAuthError('');
    const { error } = await supabase.auth.signOut();
    if (error) {
        showMessage(`เกิดข้อผิดพลาดในการออกจากระบบ: ${error.message}`, 'error');
    } else {
        navigate('/');
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setUploadedFile(null);
      return;
    }

    setUploadedFile(file);
    setExternalImageUrl(''); // เคลียร์ URL ภายนอกถ้ามีการเลือกไฟล์
    setIsUploadingImage(true);
    setUploadedFileUrl(''); // เคลียร์ URL ที่อัปโหลดสำเร็จก่อนหน้าก่อนการพยายามครั้งใหม่
    showMessage('', 'success'); // Clear previous messages (type is required, but message is empty)

    // Get a random Cloudinary account configuration for this upload
    const cloudinaryConfig = getRandomCloudinaryConfig();
    if (!cloudinaryConfig) {
        showMessage('เกิดข้อผิดพลาด: การตั้งค่า Cloudinary ไม่ถูกต้อง โปรดตรวจสอบไฟล์ .env', 'error');
        setIsUploadingImage(false);
        return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', cloudinaryConfig.uploadPreset);
      // หากจำเป็นต้องใช้ API Key กับ Unsigned Preset (ปกติไม่จำเป็น)
      // formData.append('api_key', CLOUDINARY_API_KEY);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Cloudinary upload failed');
      }

      const data = await response.json();

      if (!data.secure_url) {
        throw new Error('ไม่สามารถรับ Public URL ของรูปภาพที่อัปโหลดได้จาก Cloudinary');
      }

      setUploadedFileUrl(data.secure_url);
      showMessage('อัปโหลดรูปภาพไปยัง Cloudinary สำเร็จ!', 'success');

    } catch (err: any) {
      console.error("Cloudinary Image upload error:", err);
      showMessage(`เกิดข้อผิดพลาดในการอัปโหลดรูปภาพไปยัง Cloudinary: ${err.message}`, 'error');
      setUploadedFile(null);
      setUploadedFileUrl('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveUploadedImage = () => {
    setUploadedFile(null);
    setUploadedFileUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    showMessage('ลบรูปภาพที่เลือกแล้ว', 'success');
  };

  const handleAddTag = () => {
    const tagToAdd = currentTagSelection === OTHER_TAG_OPTION
      ? customTag.trim()
      : currentTagSelection;

    if (tagToAdd && !tags.includes(tagToAdd)) {
      setTags([...tags, tagToAdd]);
    }
    
    // Reset inputs for next tag
    setCustomTag('');
    setCurrentTagSelection(predefinedTags[0]);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };


  const handleSubmitInfographic = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    showMessage('', ''); // Clear previous messages

    if (!title || !summary || !content || !displayCategory) {
      showMessage('กรุณากรอกข้อมูลให้ครบทุกช่องที่มีเครื่องหมาย *', 'error');
      return;
    }

    if (isUploadingImage) {
      showMessage('รูปภาพกำลังอัปโหลด กรุณารอสักครู่', 'error');
      return;
    }

    // Prevent submission if a file was selected but upload failed (no URL)
    if (uploadedFile && !uploadedFileUrl) {
      showMessage('การอัปโหลดรูปภาพล้มเหลว โปรดลองอัปโหลดอีกครั้ง หรือลบรูปภาพที่เลือกออก', 'error');
      return;
    }

    setIsSubmittingForm(true);

    try {
      const finalImageUrl = uploadedFileUrl || externalImageUrl;

      await onAddInfographic({
        title,
        imageUrl: finalImageUrl,
        summary,
        content,
        displayCategory,
        tags: tags,
      });

      showMessage('เพิ่มเนื้อหาใหม่เรียบร้อยแล้ว!', 'success');
      resetFormFields();

    } catch (err: any) {
      console.error("Error adding infographic:", err);
      showMessage(`เกิดข้อผิดพลาดในการเพิ่มเนื้อหา: ${err.message}`, 'error');
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // --- Render Logic ---
  if (!isAuthenticated) {
    // Login Form
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-xl">
          <h1 className="text-2xl font-bold text-brand-green-dark mb-6 text-center">เข้าสู่ระบบผู้ดูแล</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="auth-email" className="block text-sm font-medium text-gray-700">อีเมล</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IconUserCircle className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="auth-email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  required
                  className="focus:ring-brand-green focus:border-brand-green block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                  placeholder="email@example.com"
                  disabled={isAuthLoading}
                />
              </div>
            </div>
            <div>
              <label htmlFor="auth-password" className="block text-sm font-medium text-gray-700">รหัสผ่าน</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IconLockClosed className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="auth-password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  required
                  className="focus:ring-brand-green focus:border-brand-green block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                  placeholder="password"
                  disabled={isAuthLoading}
                />
              </div>
            </div>
            {authError && <p className="text-red-500 text-sm text-center">{authError}</p>}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-green hover:bg-brand-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-dark disabled:opacity-50"
                disabled={isAuthLoading}
              >
                {isAuthLoading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Authenticated View: Content Form
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-brand-green-dark">เพิ่มเนื้อหาใหม่</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green"
          >
            ออกจากระบบ
          </button>
        </div>

        {submitMessage && (
          <div className={`mb-6 p-4 rounded-md text-sm ${
            submitMessageType === 'success' ? 'bg-green-100 text-green-700 border border-green-300' :
            submitMessageType === 'error' ? 'bg-red-100 text-red-700 border border-red-300' :
            'bg-blue-100 text-blue-700 border border-blue-300' // Default/info
          }`}>
            {submitMessage}
          </div>
        )}

        <form onSubmit={handleSubmitInfographic} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              หัวข้อ (Title) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-green focus:border-brand-green sm:text-sm"
            />
          </div>

          {/* External Image URL */}
          <div>
            <label htmlFor="externalImageUrl" className="block text-sm font-medium text-gray-700">
              URL รูปภาพ (กรอก URL โดยตรง)
            </label>
            <input
              type="url"
              id="externalImageUrl"
              value={externalImageUrl}
              onChange={(e) => {
                setExternalImageUrl(e.target.value);
                if (e.target.value && uploadedFile) handleRemoveUploadedImage();
              }}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-green focus:border-brand-green sm:text-sm"
              placeholder="https://example.com/image.jpg"
              disabled={isUploadingImage}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="uploadImage" className="block text-sm font-medium text-gray-700">
              หรืออัปโหลดภาพ (ไปยัง Cloudinary)
            </label>
            <input
              type="file"
              id="uploadImage"
              ref={fileInputRef}
              accept="image/*,.jpeg,.jpg,.png,.gif,.webp" // ระบุประเภทไฟล์ที่อนุญาต
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-green-light file:text-brand-green-dark hover:file:bg-brand-green-lighter disabled:opacity-50"
              disabled={isUploadingImage}
            />
            {isUploadingImage && <p className="text-sm text-blue-600 mt-2">กำลังอัปโหลดรูปภาพ...</p>}
            {uploadedFileUrl && !isUploadingImage && (
              <div className="mt-2">
                <p className="text-sm text-green-600">ภาพที่อัปโหลดแล้ว:</p>
                <img src={uploadedFileUrl} alt="Preview" className="max-h-48 w-auto rounded-md border border-gray-300 my-2 object-contain" />
                <button
                  type="button"
                  onClick={handleRemoveUploadedImage}
                  className="text-xs text-red-600 hover:text-red-800"
                  disabled={isUploadingImage}
                >
                  ลบภาพที่อัปโหลด
                </button>
              </div>
            )}
             {!uploadedFileUrl && uploadedFile && !isUploadingImage && (
                <p className="text-sm text-red-500 mt-2">การอัปโหลดรูปภาพล้มเหลว กรุณาลองอีกครั้ง หรือตรวจสอบ Console</p>
            )}
          </div>

          {/* Summary */}
          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
              สรุปย่อ (Summary) <span className="text-red-500">*</span>
            </label>
            <textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={3}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-green focus:border-brand-green sm:text-sm"
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              เนื้อหา (Content) <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onPaste={handleContentPaste} // เพิ่ม onPaste handler
              rows={6}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-green focus:border-brand-green sm:text-sm"
            />
          </div>

          {/* Display Category */}
          <div>
            <label htmlFor="displayCategory" className="block text-sm font-medium text-gray-700">
              หมวดหมู่หลัก (Display Category) <span className="text-red-500">*</span>
            </label>
            <select
              id="displayCategory"
              value={displayCategory}
              onChange={(e) => setDisplayCategory(e.target.value as DisplayCategory)}
              required
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-green focus:border-brand-green sm:text-sm rounded-md"
            >
              {Object.values(DisplayCategory).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tag-select" className="block text-sm font-medium text-gray-700">
              แท็ก (Tags)
            </label>
            {/* Display selected tags */}
            <div className="flex flex-wrap gap-2 mt-2 mb-2 min-h-[2.5rem]">
              {tags.map(tag => (
                <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-brand-green-light text-brand-green-dark">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 -mr-1 flex-shrink-0 h-4 w-4 rounded-full inline-flex items-center justify-center text-brand-green-dark hover:bg-brand-green-lighter hover:text-brand-green-darker focus:outline-none focus:bg-brand-green-dark focus:text-white transition-colors"
                    aria-label={`Remove ${tag}`}
                  >
                    <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                      <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>

            {/* Input for adding new tags */}
            <div className="flex items-start sm:items-center gap-2 mt-1 flex-col sm:flex-row">
              <div className="w-full sm:w-auto sm:flex-grow">
                <select
                  id="tag-select"
                  value={currentTagSelection}
                  onChange={(e) => setCurrentTagSelection(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-green focus:border-brand-green sm:text-sm rounded-md"
                >
                  {predefinedTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                  <option value={OTHER_TAG_OPTION}>{OTHER_TAG_OPTION}</option>
                </select>
                {currentTagSelection === OTHER_TAG_OPTION && (
                  <div className="mt-2">
                    <input
                      type="text"
                      id="custom-tag"
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-green focus:border-brand-green sm:text-sm"
                      placeholder="พิมพ์แท็กที่ต้องการแล้วกด 'เพิ่มแท็ก'"
                    />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-green hover:bg-brand-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-dark w-full sm:w-auto flex-shrink-0"
              >
                เพิ่มแท็ก
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => {
                resetFormFields();
                navigate('/'); // หรือแค่ resetFormFields(); ถ้าต้องการให้อยู่หน้านี้
              }}
              className="mr-4 px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green disabled:opacity-50"
              disabled={isSubmittingForm || isUploadingImage}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-green hover:bg-brand-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-dark disabled:opacity-50"
              disabled={isSubmittingForm || isUploadingImage}
            >
              {isSubmittingForm ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
              ) : (
                <IconPlusCircle className="mr-2 h-5 w-5" />
              )}
              {isSubmittingForm ? 'กำลังบันทึก...' : isUploadingImage ? 'รออัปโหลดรูป...' : 'เพิ่มเนื้อหา'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPage;