'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

type Settings = {
  upiId: string;
  upiName: string;
  qrCode: string | null;
};

export default function Donate() {
  const [galleryImage, setGalleryImage] = useState<string | null>(null);
  const [settings, setSettings] = useState<Settings>({
    upiId: '',
    upiName: '',
    qrCode: null
  });

  useEffect(() => {
    fetch('/api/get-settings')
      .then(res => res.json())
      .then(data => {
        setSettings({
          upiId: data.upiId || '',
          upiName: data.upiName || '',
          qrCode: data.qrCode || null
        });
      })
      .catch(() => {
        setSettings({
          upiId: '',
          upiName: '',
          qrCode: null
        });
      });

    fetch('/api/gallery-list')
      .then(res => res.json())
      .then(data => {
        if (data.images && data.images.length > 0) {
          const random = Math.floor(Math.random() * data.images.length);
          setGalleryImage(data.images[random]);
        }
      });
  }, []);

  const upiLink = settings.upiId
    ? `upi://pay?pa=${encodeURIComponent(settings.upiId)}${settings.upiName ? `&pn=${encodeURIComponent(settings.upiName)}` : ''}&cu=INR`
    : '';

  return (
    <div className="w-full flex flex-col md:flex-row items-stretch min-h-[calc(100vh-72px)]">

      {/* Left: Donation Block (2/3) */}
      <div className="w-full md:w-2/3 flex items-center justify-center bg-white py-10 md:py-12">
        <div className="w-full max-w-xl flex flex-col items-center justify-center px-4 md:px-0">
          <div className="flex flex-col md:flex-row items-start w-full mb-8 gap-4 md:gap-0">
            <div className="hidden md:block w-1.5 h-full bg-black rounded-full mr-8" style={{ minHeight: '90px' }} />
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold mb-2 text-black leading-tight">Support a Child&apos;s Future</h1>
              <p className="text-base md:text-lg mb-2 max-w-lg text-black">Your donation provides books, meals, and hope. Every rupee goes directly to empowering children through education.</p>
            </div>
          </div>
          <div className="w-full flex flex-col items-center">
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-black" />
              <span className="uppercase text-[10px] font-bold tracking-widest text-black">100% Secure</span>
            </div>
            <div className="w-full bg-white border border-black rounded-2xl shadow-2xl p-4 md:p-8 flex flex-col gap-6 items-center">
              <h2 className="text-base md:text-lg font-bold mb-2 tracking-tight text-black">Donate via UPI</h2>
              {/* QR Code Section */}
              <div className="w-full flex flex-col items-center">
                {settings.qrCode ? (
                  <Image 
                    src={settings.qrCode} 
                    alt="UPI QR Code" 
                    width={220}
                    height={220}
                    className="mx-auto max-w-[180px] md:max-w-[220px] mb-4 border border-gray-300 rounded-lg" 
                  />
                ) : (
                  <div className="w-[220px] h-[220px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4">
                    <p className="text-gray-500 text-sm text-center px-4">QR Code will appear here when uploaded</p>
                  </div>
                )}
              </div>
              {/* UPI ID Section */}
              <div className="w-full text-center">
                {settings.upiId ? (
                  <div className="text-black text-sm md:text-base">
                    <span className="font-semibold">UPI ID:</span> {settings.upiId}
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm md:text-base">
                    UPI ID will appear here when set
                  </div>
                )}
              </div>
              {/* UPI Name Section */}
              <div className="w-full text-center">
                {settings.upiName ? (
                  <div className="text-black text-sm md:text-base">
                    <span className="font-semibold">Name:</span> {settings.upiName}
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm md:text-base">
                    Account name will appear here when set
                  </div>
                )}
              </div>
              {/* Pay Button */}
              {settings.upiId && (
                <a
                  href={upiLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg text-base md:text-lg font-bold hover:bg-gray-800 transition mb-2"
                >
                  Pay with UPI
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Right: Gallery Image (1/3) */}
      <div className="w-full md:w-1/3 relative bg-white overflow-hidden">

        {galleryImage && (
          <Image 
            src={galleryImage} 
            alt="Gallery" 
            fill
            className="object-cover rounded-none" 
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        )}
      </div>
    </div>
  );
} 