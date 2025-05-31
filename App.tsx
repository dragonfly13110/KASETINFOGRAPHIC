import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import KnowledgeLinks from './components/KnowledgeLinks'; // นำเข้าคอมโพเนนต์ KnowledgeLinks
import HomePage from './pages/HomePage';
import ArticlesPage from './pages/ArticlesPage';
import TechnologyPage from './pages/TechnologyPage';
import AdminPage from './pages/AdminPage';
import InfographicsPage from './pages/InfographicsPage';
import ItemDetailPage from './pages/ItemDetailPage';
import { Infographic } from './src/types';
import { supabase } from './src/supabaseClient';


const App: React.FC = () => {
  const [infographics, setInfographics] = useState<Infographic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInfographics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: supabaseError } = await supabase
        .from('infographics')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }
      setInfographics(data || []);
    } catch (err: any) {
      console.error('Error fetching infographics:', err);
      let fetchErrorMessage = 'เกิดข้อผิดพลาดในการดึงข้อมูล';
      if (err && err.message) {
        fetchErrorMessage = err.message;
      } else if (typeof err === 'string') {
        fetchErrorMessage = err;
      }
      setError(fetchErrorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInfographics();
  }, [fetchInfographics]);

  const addInfographic = async (newInfo: Omit<Infographic, 'id' | 'date' | 'created_at'>) => {
    try {
      const itemToAdd = {
        ...newInfo,
        date: new Date().toLocaleDateString('th-TH', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      };
      
      console.log('Attempting to insert to Supabase:', itemToAdd);

      const { data, error: supabaseError } = await supabase
        .from('infographics')
        .insert([itemToAdd]) 
        .select() 
        .single(); 

      if (supabaseError) {
        console.error('Supabase returned an error object during insert:', supabaseError);
        throw supabaseError; 
      }

      if (data) {
        setInfographics(prev => [data as Infographic, ...prev]);
      } else {
        console.warn('Supabase insert did not return data and did not throw an explicit error. Refetching all infographics to ensure UI consistency.');
        fetchInfographics(); 
      }
    } catch (err: any) { // This 'err' should be the supabaseError object if thrown from above
      // THE MOST IMPORTANT LOG: Expand this object in your browser's Developer Console!
      console.error('>>> EXPAND THIS OBJECT TO SEE SUPABASE ERROR DETAILS:', err); 

      let userMessage = 'เกิดข้อผิดพลาดในการเพิ่มข้อมูล.';
      if (err && typeof err === 'object' && err.message) {
         userMessage += ` (ข้อความเบื้องต้น: ${err.message})`;
      }
      
      alert(
        `${userMessage}\n\n` +
        "==== สำคัญมาก! ====\n" +
        "กรุณาเปิด Console ของเบราว์เซอร์ (กด F12) และทำตามนี้:\n" +
        "1. มองหาบรรทัดที่ขึ้นต้นด้วย '>>> EXPAND THIS OBJECT TO SEE SUPABASE ERROR DETAILS:'.\n" +
        "2. **คลิกที่รูปลูกศร (▶) หรือสามเหลี่ยมเล็กๆ ด้านซ้ายของคำว่า 'Object' ที่แสดงในบรรทัดนั้น** เพื่อขยายดูรายละเอียดทั้งหมดของ Error.\n" +
        "3. แจ้งรายละเอียดที่ขยายออกมานั้น (เช่น message, details, code, hint) ให้ผู้พัฒนาทราบ"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 text-brand-green-dark">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brand-green"></div>
        <p className="ml-4 text-xl">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-red-50 text-red-700 p-4">
        <h1 className="text-2xl font-bold mb-4">เกิดข้อผิดพลาด</h1>
        <p className="mb-2 whitespace-pre-line">{error}</p>
        <button 
          onClick={fetchInfographics}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          ลองอีกครั้ง
        </button>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage infographics={infographics} />} />
            <Route path="/infographics" element={<InfographicsPage infographics={infographics} />} />
            <Route path="/articles" element={<ArticlesPage infographics={infographics} />} />
            <Route path="/technology" element={<TechnologyPage infographics={infographics} />} />
            <Route path="/item/:itemId" element={<ItemDetailPage infographics={infographics} />} />
            <Route path="/admin" element={<AdminPage onAddInfographic={addInfographic} />} />
          </Routes>
        </main>
        <KnowledgeLinks /> {/* เพิ่ม KnowledgeLinks ก่อน Footer */}
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;
