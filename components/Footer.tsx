import React from 'react';
import { FaFacebook } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-green-light text-brand-gray-darktext py-10 mt-12 border-t border-brand-green">
      <div className="w-full px-4 text-center">
        <p className="text-sm mb-3">
          💡 โครงการนี้เป็นพื้นที่ทดลองรวบรวมและนำเสนอความรู้เกษตรในรูปแบบที่เข้าใจง่าย เพื่อสร้างแรงบันดาลใจและพัฒนาแนวทางการเข้าถึงข้อมูลสำหรับเกษตรกร
        </p>
        <p className="text-sm mb-1">
          © {new Date().getFullYear()} คลังความรู้เกษตร Infographic. All rights reserved. พัฒนาโดย <strong>ทีมเกษตรตำบล</strong> – คนใช้แรงงาน ❤️
        </p>
        <div className="flex justify-center items-center gap-2 text-sm text-brand-green-dark hover:text-blue-700 transition-colors duration-200">
          <a
            href="https://www.facebook.com/RebelliousKasetTambon"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 underline"
          >
            <FaFacebook className="text-lg" />
            เกษตรตำบล Facebook
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
