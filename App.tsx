import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import KnowledgeLinks from './components/KnowledgeLinks'; // นำเข้าคอมโพเนนต์ KnowledgeLinks
import HomePage from './pages/HomePage';
import ArticlesPage from './pages/ArticlesPage';
import TechnologyPage from './pages/TechnologyPage';
import AdminPage from './pages/AdminPage';
import InfographicsPage from './pages/InfographicsPage';
import ItemDetailPage from './pages/ItemDetailPage';
import AllStoriesPage from './pages/AllStoriesPage'; // 1. Import AllStoriesPage
import { useInfographics } from './src/hooks/useInfographics';

const App: React.FC = () => {
  const {
    infographics,
    loading,
    error,
    fetchInfographics,
    addInfographic,
    updateInfographicInState,
  } = useInfographics();

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
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage infographics={infographics} />} />
            <Route path="/infographics" element={<InfographicsPage infographics={infographics} />} />
            <Route path="/articles" element={<ArticlesPage infographics={infographics} />} />
            <Route path="/technology" element={<TechnologyPage infographics={infographics} />} />
            <Route
              path="/item/:itemId"
              element={
                <ItemDetailPage
                  infographics={infographics} // Pass all infographics
                  isAdmin={true}
                  onItemUpdate={updateInfographicInState}
                  reFetchInfographics={fetchInfographics}
                />
              }
            />
            <Route path="/admin" element={<AdminPage onAddInfographic={addInfographic} />} />
            <Route
              path="/all-stories"
              element={<AllStoriesPage infographics={infographics} />} // 2. Add Route for AllStoriesPage
            />
          </Routes>
        </main>
        <KnowledgeLinks /> {/* เพิ่ม KnowledgeLinks ก่อน Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
