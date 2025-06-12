'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isHomePage = pathname === '/';

  useEffect(() => {
    if (!isHomePage) return;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    handleScroll(); // set initial state
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const navClass = isHomePage
    ? isScrolled
      ? 'bg-black shadow-md'
      : 'bg-transparent'
    : 'bg-black shadow-md';

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${navClass}`}
    >
      <div className="px-6 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/images/logo.png"
            alt="TheEducationForAll Logo"
            width={42}
            height={42}
            className="w-[42px] h-[42px]"
          />
          <span className="text-xl font-bold text-white">TheEducationForAll</span>
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-white hover:text-gray-200 transition text-base font-normal">Home</Link>
          <Link href="/about" className="text-white hover:text-gray-200 transition text-base font-normal">About Us</Link>
          <Link href="/gallery" className="text-white hover:text-gray-200 transition text-base font-normal">Gallery</Link>
          <Link href="/contact" className="text-white hover:text-gray-200 transition text-base font-normal">Contact Us</Link>
          <Link href="/donate" className="bg-white text-black px-4 py-1.5 border-2 border-white transition-colors shadow-none rounded-md ml-4 hover:bg-gray-100 text-sm font-semibold">Donate Now</Link>
        </div>
        <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(true)} aria-label="Open menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col items-center justify-start pt-24 px-8">
          <button
            className="absolute top-6 right-6 text-white text-3xl focus:outline-none"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            &times;
          </button>
          <Link href="/" className="w-full text-white text-lg font-semibold py-3 border-b border-white/10 text-center" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link href="/about" className="w-full text-white text-lg font-semibold py-3 border-b border-white/10 text-center" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
          <Link href="/gallery" className="w-full text-white text-lg font-semibold py-3 border-b border-white/10 text-center" onClick={() => setIsMobileMenuOpen(false)}>Gallery</Link>
          <Link href="/contact" className="w-full text-white text-lg font-semibold py-3 border-b border-white/10 text-center" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</Link>
          <Link href="/donate" className="w-full text-black bg-white text-lg font-semibold py-3 mt-4 rounded-md text-center" onClick={() => setIsMobileMenuOpen(false)}>Donate Now</Link>
        </div>
      )}
    </nav>
  );
} 