import React from 'react';

interface ThumbnailProps {
  src: string;
  alt: string;
}

const Thumbnail: React.FC<ThumbnailProps> = ({ src, alt }) => {
  return (
    <img
      src={src}
      alt={alt}
      className="h-48 w-36 object-cover rounded-md" // ปรับ h-48 (สูง) กับ w-36 (กว้าง) ตามต้องการ
    />
  );
};

export default Thumbnail;