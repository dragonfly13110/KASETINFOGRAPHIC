import React, { useState, useEffect } from 'react';
import { FaFacebook, FaEye } from 'react-icons/fa'; // เพิ่ม FaEye

const Footer: React.FC = () => {
  const [pageViews, setPageViews] = useState<number | null>(null);

  useEffect(() => {
    // ตัวนับการเข้าชมหน้านี้แบบง่ายๆ (Client-Side)
    // ตัวนับนี้จะนับเฉพาะในเบราว์เซอร์ของผู้ใช้คนนั้นๆ และจะเพิ่มขึ้นทุกครั้งที่โหลดหน้าที่มี Footer
    // ไม่ใช่ตัวนับผู้เข้าชมที่ไม่ซ้ำกันของทั้งเว็บไซต์
    const countKey = 'kasetSitePageViews';
    let currentCount = parseInt(localStorage.getItem(countKey) || '0', 10);
    currentCount += 1;
    localStorage.setItem(countKey, currentCount.toString());
    setPageViews(currentCount);
  }, []);

  return (
    <footer className="bg-brand-green-light text-brand-gray-darktext py-10 mt-12 border-t border-brand-green">
      <div className="w-full px-4 text-center">
        <p className="text-sm mb-3">
          💡 โครงการนี้เป็นพื้นที่ทดลองรวบรวมและนำเสนอความรู้เกษตรในรูปแบบที่เข้าใจง่าย เพื่อสร้างแรงบันดาลใจและพัฒนาแนวทางการเข้าถึงข้อมูลสำหรับเกษตรกร
        </p>
        <p className="text-sm mb-1">
          © {new Date().getFullYear()} คลังความรู้เกษตร Infographic. All rights reserved. พัฒนาโดย <strong>ทีมเกษตรตำบล</strong> – คนใช้แรงงาน ❤️
        </p>
        <div className="flex justify-center items-center gap-4 text-sm mt-3"> {/* เพิ่ม gap และ mt */}
          <a
            href="https://www.facebook.com/RebelliousKasetTambon"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-brand-green-dark hover:text-blue-700 transition-colors duration-200 underline"
          >
            <FaFacebook className="text-lg" />
            เกษตรตำบล Facebook
          </a>
          {pageViews !== null && (
            <div className="inline-flex items-center gap-1 text-brand-gray-text">
              <FaEye className="text-lg" />
              <span>เข้าชมแล้ว: {pageViews.toLocaleString()} ครั้ง</span>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};
export default Footer;
