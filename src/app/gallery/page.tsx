'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Gallery() {
  const [images, setImages] = useState<string[]>([]);
  const [modalImg, setModalImg] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/gallery-list')
      .then(res => res.json())
      .then(data => setImages(data.images || []));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-[2px] [column-gap:2px] [row-gap:2px] p-0">
        {images.map((src) => (
          <div key={src} className="break-inside-avoid overflow-hidden shadow-none mb-[2px] cursor-pointer" onClick={() => setModalImg(src)}>
            <Image
              src={src}
              alt="Gallery image"
              width={900}
              height={600}
              className="w-full h-auto object-cover align-top transition-transform duration-200 hover:scale-105 rounded-none"
              style={{ display: "block", margin: 0, padding: 0 }}
              quality={60}
              sizes="(max-width: 768px) 100vw, 25vw"
              loading="lazy"
            />
          </div>
        ))}
      </div>
      {modalImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80" onClick={() => setModalImg(null)}>
          <div className="max-w-3xl w-full p-4" onClick={e => e.stopPropagation()}>
            <Image
              src={modalImg}
              alt="Gallery large"
              width={900}
              height={600}
              className="w-full h-auto shadow-lg rounded-none"
              quality={70}
              sizes="100vw"
              loading="eager"
            />
            <button className="absolute top-6 right-6 text-white text-3xl font-bold" onClick={() => setModalImg(null)}>&times;</button>
          </div>
        </div>
      )}
    </div>
  );
} 