import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Infographic } from '../src/types';

interface InfographicCardProps {
  infographic: Infographic;
  isHomePage?: boolean;
}

const InfographicCard: React.FC<InfographicCardProps> = ({ infographic }) => {

  const thumbnailUrl = useMemo(() => {
    const fallbackUrl = 'https://picsum.photos/400/300?grayscale';
    if (!infographic.imageUrl) {
      return fallbackUrl;
    }

    // Use Cloudinary transformations for thumbnails
    if (infographic.imageUrl.includes('res.cloudinary.com/')) {
      const parts = infographic.imageUrl.split('/upload/');
      if (parts.length > 1) {
        // c_fill: ตัดภาพให้เต็มขนาดที่กำหนด
        // g_north: ยึดส่วนบนของภาพไว้เมื่อทำการตัด
        // w_300, h_338: กำหนดขนาดเป็นสัดส่วนแนวตั้ง 8:9 (เตี้ยกว่า 4:5 แต่ไม่จัตุรัส)
        // w_400, h_450: เพิ่มขนาดเพื่อความคมชัดบนจอความละเอียดสูง (ยังคงสัดส่วน 8:9)
        // q_auto:good, f_auto: ปรับคุณภาพให้ดีขึ้น และใช้ format อัตโนมัติ
        const transformations = 'c_fill,g_north,w_640,h_720,q_auto:good,f_auto';
        return `${parts[0]}/upload/${transformations}/${parts[1]}`;
      }
    }
    
    return infographic.imageUrl; // Return original URL if not Cloudinary or format is unexpected
  }, [infographic.imageUrl]);

  return (
    <Link
      to={`/item/${infographic.id}`}
      className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 flex flex-col overflow-hidden h-full"
      aria-label={`อ่านเพิ่มเติมเกี่ยวกับ ${infographic.title}`}
    >
      {/* ใช้ aspect-ratio เพื่อบังคับสัดส่วน 8:9 (แนวตั้ง) ให้กับ container ของรูป */}
      <div className="relative overflow-hidden rounded-t-lg aspect-[8/9]">
        <img
          className="object-cover object-top w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-105"
          src={thumbnailUrl}
          alt={infographic.title}
          onError={(e) => (e.currentTarget.src = 'https://picsum.photos/400/300?grayscale')}
          loading="lazy"
        />
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-md font-semibold text-brand-gray-darktext mb-2 group-hover:text-brand-green transition-colors duration-200 line-clamp-2" title={infographic.title}>
          {infographic.title}
        </h3>
        {infographic.summary && (
          <p className="text-sm text-brand-gray-text line-clamp-3">
            {infographic.summary}
          </p>
        )}
      </div>
    </Link>
  );
};

export default InfographicCard;