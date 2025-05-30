import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Infographic, DisplayCategory } from '../types';
import { IconPlusCircle, IconUserCircle, IconLockClosed } from '../components/icons';

interface AdminPageProps {
  onAddInfographic: (newInfo: Omit<Infographic, 'id' | 'date' | 'created_at'>) => Promise<void>;
}

const AdminPage: React.FC<AdminPageProps> = ({ onAddInfographic }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [displayCategory, setDisplayCategory] = useState<DisplayCategory>(DisplayCategory.INFOGRAPHIC);
  const [tags, setTags] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkSession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: inputEmail,
        password: inputPassword,
      });
      if (error) {
        setAuthError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      } else {
        setIsAuthenticated(true);
        setAuthError('');
      }
    } catch (error) {
      setAuthError('เกิดข้อผิดพลาดในการล็อกอิน');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl || !content || !summary) {
      alert('กรุณากรอกข้อมูลให้ครบทุกช่องที่มีเครื่องหมาย *');
      return;
    }
    setIsSubmitting(true);
    try {
      await onAddInfographic({
        title,
        imageUrl,
        content,
        summary,
        displayCategory,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      });
      setTitle('');
      setImageUrl('');
      setContent('');
      setSummary('');
      setDisplayCategory(DisplayCategory.INFOGRAPHIC);
      setTags('');
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (error) {
      console.error('Failed to add infographic:', error);
      alert('เกิดข้อผิดพลาดในการเพิ่มเนื้อหา กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center items-center" style={{ minHeight: 'calc(100vh - 10rem)' }}>
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-xl">
          <h1 className="text-2xl font-bold text-brand-green-dark mb-6 text-center">เข้าสู่ระบบผู้ดูแล</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-brand-gray-darktext">
                อีเมล
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IconUserCircle className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  required
                  className="focus:ring-brand-green focus:border-brand-green block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                  placeholder="email@example.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-brand-gray-darktext">
                รหัสผ่าน
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IconLockClosed className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  required
                  className="focus:ring-brand-green focus:border-brand-green block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                  placeholder="password"
                />
              </div>
            </div>
            {authError && <p className="text-red-500 text-sm text-center">{authError}</p>}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-green hover:bg-brand-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-dark"
              >
                เข้าสู่ระบบ
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-brand-green-dark mb-8 text-center">เพิ่มเนื้อหาใหม่</h1>
        {isSubmitted && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 border border-green-300 rounded-md">
            เนื้อหาใหม่ถูกเพิ่มเรียบร้อยแล้ว!
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-brand-gray-darktext">
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
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-brand-gray-darktext">
              URL รูปภาพ (Image URL) <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-green focus:border-brand-green sm:text-sm"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-brand-gray-darktext">
              สรุปย่อ (Summary for card) <span className="text-red-500">*</span>
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
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-brand-gray-darktext">
              เนื้อหา (Content) <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-green focus:border-brand-green sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="displayCategory" className="block text-sm font-medium text-brand-gray-darktext">
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
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-brand-gray-darktext">
              แท็ก (Tags, คั่นด้วยจุลภาค ",")
            </label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-green focus:border-brand-green sm:text-sm"
              placeholder="เช่น พืชไร่, เทคโนโลยี, เกษตรอินทรีย์"
            />
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="mr-4 px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green"
              disabled={isSubmitting}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-green hover:bg-brand-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-dark disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
              ) : (
                <IconPlusCircle className="mr-2 h-5 w-5" />
              )}
              {isSubmitting ? 'กำลังเพิ่ม...' : 'เพิ่มเนื้อหา'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPage;