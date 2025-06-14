import React, { useState, useMemo } from 'react';
import { Infographic, DisplayCategory, ALL_TAGS_OPTION } from '../src/types';
import InfographicCard from '../components/InfographicCard';
import PageBanner from '../components/PageBanner';
// import TagSidebar from '../components/TagSidebar'; // Removed
import { IconMagnifyingGlass } from '../components/icons';
import { PAGE_DESCRIPTIONS } from '../src/constants';

interface SharedInfographicLayoutProps {
  infographics: Infographic[];
  pageType: 'home' | 'articles' | 'technology' | 'infographics';
  filterByCategory?: DisplayCategory;
  showBackButton?: boolean;
}

const SharedInfographicLayout: React.FC<SharedInfographicLayoutProps> = ({
  infographics,
  pageType,
  filterByCategory,
  showBackButton = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>(ALL_TAGS_OPTION);

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
    // Ensure "ทั้งหมด" is always the first option and unique tags follow
    return [ALL_TAGS_OPTION, ...tagsFromContent.filter(tag => tag !== ALL_TAGS_OPTION)];
  }, [infographics, filterByCategory]);

  return (
    <>
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
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${
              pageType === 'home' ? 'lg:grid-cols-5' : 'lg:grid-cols-4'
            } gap-6`}
            >
              {filteredInfographics.map(info => (
                <InfographicCard
                  key={info.id}
                  infographic={info}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow p-8">
              <p className="text-xl text-brand-gray-text">ไม่พบเนื้อหาที่ตรงกับเงื่อนไข</p>
              { (searchTerm || selectedTag !== ALL_TAGS_OPTION) &&
                <button
                  onClick={() => { setSearchTerm(''); setSelectedTag(ALL_TAGS_OPTION); }}
                  className="mt-6 px-5 py-2.5 bg-brand-green text-white rounded-md hover:bg-brand-green-dark transition text-sm font-medium"
                >
                  ล้างตัวกรองทั้งหมด
                </button>
              }
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default SharedInfographicLayout;
