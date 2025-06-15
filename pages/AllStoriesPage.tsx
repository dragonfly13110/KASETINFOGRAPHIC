import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Infographic } from '../src/types';
import { IconArrowLeft } from '../components/icons'; // ตรวจสอบว่า path ถูกต้อง

interface AllStoriesPageProps {
  infographics: Infographic[]; // รับข้อมูล Infographic ทั้งหมด
}

const AllStoriesPage: React.FC<AllStoriesPageProps> = ({ infographics }) => {
  const navigate = useNavigate();

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
          รวมรายการเนื้อหาทั้งหมดที่มีในระบบ ({infographics.length} เรื่อง)
        </p>
      </div>

      {infographics.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
          {infographics.map(info => (
            <div key={info.id} className="p-3 bg-white rounded-md shadow hover:shadow-md transition-shadow duration-150 ease-in-out">
              <Link
                to={`/item/${info.id}`}
                className="text-brand-blue hover:text-brand-blue-dark font-medium text-sm leading-relaxed block"
                title={info.title}
              >
                {info.title}
              </Link>
              {/* สามารถเพิ่มข้อมูลอื่นๆ เช่น summary สั้นๆ หรือวันที่ หากต้องการ */}
              {/* <p className="text-xs text-gray-500 mt-1 truncate">{info.summary}</p> */}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-brand-gray-text">ไม่พบเนื้อหาใดๆ ในระบบ</p>
        </div>
      )}
    </div>
  );
};

export default AllStoriesPage;
