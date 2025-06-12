'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ContactPage() {
  const [galleryImage, setGalleryImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    // Fetching an image for the right column, similar to donate page
    fetch('/api/gallery-list')
      .then(res => res.json())
      .then(data => {
        if (data.images && data.images.length > 0) {
          const random = Math.floor(Math.random() * data.images.length);
          setGalleryImage(data.images[random]);
        }
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Your message has been sent successfully!');
        setFormData({
          fullName: '',
          phoneNumber: '',
          subject: '',
          message: '',
        });
      } else {
        alert('Failed to send message. Please try again later.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row h-auto md:h-screen">
      {/* Left: Contact Form Block (2/3) */}
      <div className="w-full md:w-2/3 flex items-center justify-center bg-white py-10 md:py-0">
        <div className="w-full max-w-xl flex flex-col items-center justify-center px-4 md:px-0">
          <div className="flex flex-col md:flex-row items-start w-full mb-8 gap-4 md:gap-0">
            <div className="hidden md:block w-1.5 h-full bg-black rounded-full mr-8" style={{ minHeight: '90px' }} />
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold mb-2 text-black leading-tight">Get in Touch with Us</h1>
              <p className="text-base md:text-lg mb-2 max-w-lg text-black">We&apos;d love to hear from you! Fill out the form below or reach out to us directly.</p>
            </div>
          </div>
          <div className="w-full flex flex-col items-center">
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-black" />
              <span className="uppercase text-[10px] font-bold tracking-widest text-black">Your Message Matters</span>
            </div>
            <div className="w-full bg-white border border-black rounded-2xl shadow-2xl p-4 md:p-8 flex flex-col gap-6 items-center">
              <h2 className="text-base md:text-lg font-bold mb-2 tracking-tight text-black">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="w-full space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm text-black placeholder-gray-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm text-black placeholder-gray-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm text-black placeholder-gray-500"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="volunteer">Volunteer Opportunities</option>
                    <option value="partnership">Partnership Opportunities</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm text-black placeholder-gray-500"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-lg text-base md:text-lg font-bold hover:bg-gray-800 transition"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Right: Gallery Image (1/3) */}
      <div className="w-full md:w-1/3 h-56 md:h-full flex items-center justify-center">
        {galleryImage && (
          <Image src={galleryImage} alt="Contact Us Image" width={1200} height={1200} className="object-cover w-full h-full rounded-none" />
        )}
      </div>
    </div>
  );
} 