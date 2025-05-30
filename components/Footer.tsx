
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-green-light text-brand-gray-darktext py-8 mt-12">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm mb-2">
          💡 เนื้อหาในหน้านี้เป็นเพียงตัวอย่างเพื่อใช้ในงานสาธิตการแสดงผลและหน้าจอการเพิ่มและแก้ไขเนื้อหาเป็นเพียงส่วนหนึ่งของระบบเท่านั้น
        </p>
        <p className="text-sm">
          © {new Date().getFullYear()} คลังความรู้เกษตร Infographic. All rights reserved (Conceptual).
        </p>
        <p className="text-xs mt-1">สนับสนุนการสร้างสรรค์โดยทีมผู้พัฒนา</p>
      </div>
    </footer>
  );
};

export default Footer;
    