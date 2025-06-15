import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Infographic, ALL_TAGS_OPTION } from '../src/types';
import { IconArrowLeft, IconMagnifyingGlass } from '../components/icons';

interface AllStoriesPageProps {
  infographics: Infographic[]; // รับข้อมูล Infographic ทั้งหมด
}

const AllStoriesPage: React.FC<AllStoriesPageProps> = ({ infographics }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>(ALL_TAGS_OPTION);

  const filteredInfographics = useMemo(() => {
    return infographics
      .filter(info =>
        info.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        info.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        info.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(info =>
        selectedTag === ALL_TAGS_OPTION ? true : info.tags.includes(selectedTag)
      );
  }, [infographics, searchTerm, selectedTag]);

  const allAvailableTags = useMemo(() => {
    const tagsFromContent = Array.from(new Set(infographics.flatMap(info => info.tags)));
    return [ALL_TAGS_OPTION, ...tagsFromContent.filter(tag => tag !== ALL_TAGS_OPTION)];
  }, [infographics]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedTag(ALL_TAGS_OPTION);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 pb-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-brand-green-dark">เรื่องทั้งหมด</h1>
          <button
            onClick={() => navigate(-1)} // กลับไปหน้าก่อนหน้า
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green"
          >
            <IconArrowLeft className="mr-2 h-5 w-5" />
            กลับ
          </button>
        </div>
        <p className="text-md text-brand-gray-text mt-2">
          ค้นหาจากเนื้อหาทั้งหมด ({infographics.length} เรื่อง)
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow">
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <IconMagnifyingGlass className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="ค้นหาจากชื่อเรื่อง, สรุปย่อ, หรือเนื้อหา..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green sm:text-sm"
            aria-label="Search all stories"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-brand-gray-darktext mb-3">เลือกหมวดหมู่แท็ก:</h3>
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

      {filteredInfographics.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
          {filteredInfographics.map(info => (
            <div key={info.id} className="p-3 bg-white rounded-md shadow hover:shadow-md transition-shadow duration-150 ease-in-out">
              <Link
                to={`/item/${info.id}`}
                className="text-brand-blue hover:text-brand-green font-medium text-sm leading-relaxed block"
                title={info.title}
              >
                {info.title}
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow p-8">
          <p className="text-xl text-brand-gray-text">ไม่พบเนื้อหาที่ตรงกับเงื่อนไขการค้นหาของคุณ</p>
          {(searchTerm || selectedTag !== ALL_TAGS_OPTION) && (
            <button
              onClick={handleClearFilters}
              className="mt-6 px-5 py-2.5 bg-brand-green text-white rounded-md hover:bg-brand-green-dark transition text-sm font-medium"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AllStoriesPage;
