import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom'; // import Link สำหรับ navigation
import { Infographic, DisplayCategory, ALL_TAGS_OPTION } from '../src/types';
import InfographicCard from '../components/InfographicCard';
import PageBanner from '../components/PageBanner';
import { IconMagnifyingGlass } from '../components/icons';
import { PAGE_DESCRIPTIONS } from '../src/constants';

interface SharedInfographicLayoutProps {
  infographics: Infographic[];
  pageType: 'home' | 'articles' | 'technology' | 'infographics';
  filterByCategory?: DisplayCategory;
  showBackButton?: boolean;
  itemsPerPage?: number;
}

const SharedInfographicLayout: React.FC<SharedInfographicLayoutProps> = ({
  infographics,
  pageType,
  filterByCategory,
  showBackButton = false,
  itemsPerPage
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>(ALL_TAGS_OPTION);
  const [currentPage, setCurrentPage] = useState(1);

  const pageInfo = PAGE_DESCRIPTIONS[pageType];

  const filteredInfographics = useMemo(() => {
    return infographics
      .filter(info => filterByCategory ? info.displayCategory === filterByCategory : true)
      .filter(info =>
        info.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        info.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        info.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(info =>
        selectedTag === ALL_TAGS_OPTION ? true : info.tags.includes(selectedTag)
      );
  }, [infographics, searchTerm, selectedTag, filterByCategory]);

  const allAvailableTags = useMemo(() => {
    const relevantInfographics = filterByCategory
      ? infographics.filter(info => info.displayCategory === filterByCategory)
      : infographics;
    const tagsFromContent = Array.from(new Set(relevantInfographics.flatMap(info => info.tags)));
    return [ALL_TAGS_OPTION, ...tagsFromContent.filter(tag => tag !== ALL_TAGS_OPTION)];
  }, [infographics, filterByCategory]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTag, filterByCategory, infographics, itemsPerPage]);

  const totalPages = useMemo(() => {
    if (!itemsPerPage || filteredInfographics.length === 0) return 1;
    return Math.ceil(filteredInfographics.length / itemsPerPage);
  }, [filteredInfographics, itemsPerPage]);

  const paginatedInfographics = useMemo(() => {
    if (!itemsPerPage) return filteredInfographics;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredInfographics.slice(startIndex, endIndex);
  }, [filteredInfographics, currentPage, itemsPerPage]);

  // สำหรับ sidebar เราสามารถใช้ infographics ทั้งหมด (หรือเปลี่ยนเป็น filteredInfographics ได้)
  const sidebarItems = infographics.slice(0, 20);

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-[15%] p-4 border-r border-gray-200 bg-gray-50 md:h-screen md:sticky md:top-0 overflow-y-auto">
        <img
          src="https://dldiedktrkbwpqznxdwk.supabase.co/storage/v1/object/public/images//326481288_1393570211463146_8610728916042085217_n.jpg"
          alt="Sidebar Header Image"
          className="w-full h-auto object-cover rounded-md mb-4"
        />
        <h2 className="text-lg font-semibold mb-4 text-brand-green-dark">เรื่องแนะนำ</h2>
        {sidebarItems.length > 0 ? (
          <ul className="space-y-2">
            {sidebarItems.map(info => (
              <li key={info.id} className="text-sm"> {/* ลบคลาส truncate ออก */}
                <Link to={`/item/${info.id}`} className="text-brand-gray-text hover:text-brand-green hover:underline" title={info.title}>
                  {info.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">ไม่มีเรื่องแนะนำในขณะนี้</p>
        )}
        <div className="mt-8">
          <Link
            to="/all-stories"
            className="block text-center w-full px-3 py-2 bg-brand-green text-white rounded-md hover:bg-brand-green-dark transition text-sm font-medium"
          >
            ดูเรื่องทั้งหมด
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="w-full md:w-[85%]">
        <PageBanner title={pageInfo.title} subtitle={pageInfo.subtitle} showBackButton={showBackButton} />
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="mb-6 p-6 bg-white rounded-lg shadow">
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IconMagnifyingGlass className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="ค้นหาเนื้อหา..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green sm:text-sm"
                aria-label="Search content"
              />
            </div>
          
            {/* Horizontal Tag Filter Bar */}
            <div>
              <h3 className="text-lg font-semibold text-brand-gray-darktext mb-3">เลือกหมวดหมู่:</h3>
              <div className="flex flex-wrap gap-2">
                {allAvailableTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150 ease-in-out
                      ${selectedTag === tag
                        ? 'bg-brand-green text-white shadow-md'
                        : 'bg-gray-100 text-brand-gray-text hover:bg-gray-200 hover:text-brand-green-dark'
                      }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <main className="w-full">
            {filteredInfographics.length > 0 ? (
              <>
                <div className={`grid grid-cols-1 sm:grid-cols-2 ${pageType === 'home' ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-6`}>
                  {paginatedInfographics.map(info => (
                    <InfographicCard key={info.id} infographic={info} />
                  ))}
                </div>
                {itemsPerPage && totalPages > 1 && (
                  <div className="mt-8 flex justify-center items-center space-x-4">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ก่อนหน้า
                    </button>
                    <span className="text-sm text-gray-700">
                      หน้า {currentPage} จาก {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ถัดไป
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow p-8">
                <p className="text-xl text-brand-gray-text">ไม่พบเนื้อหาที่ตรงกับเงื่อนไข</p>
                {(searchTerm || selectedTag !== ALL_TAGS_OPTION) && (
                  <button
                    onClick={() => { setSearchTerm(''); setSelectedTag(ALL_TAGS_OPTION); }}
                    className="mt-6 px-5 py-2.5 bg-brand-green text-white rounded-md hover:bg-brand-green-dark transition text-sm font-medium"
                  >
                    ล้างตัวกรองทั้งหมด
                  </button>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SharedInfographicLayout;
