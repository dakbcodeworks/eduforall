'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { FiHome, FiImage, FiSettings, FiLogOut, FiUpload, FiTrash2, FiCheck, FiX, FiRefreshCw, FiMessageSquare } from 'react-icons/fi';
import Image from 'next/image';

const ADMIN_PASSWORD = 'Feb@2020';

// Helper function to get optimized Cloudinary URL
const getOptimizedImageUrl = (url: string) => {
  if (!url.includes('cloudinary.com')) return url;
  return url.replace('/upload/', '/upload/w_200,q_30,f_auto/');
};

// Custom type for a contact query
interface ContactQuery {
  _id: string;
  fullName: string;
  phoneNumber: string;
  subject: string;
  message: string;
  timestamp: string;
}

// Custom hook for gallery management
function useGalleryManager() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [deleteProgress, setDeleteProgress] = useState(0);
  const [deleteStatus, setDeleteStatus] = useState<'idle' | 'confirming' | 'deleting' | 'complete' | 'error'>('idle');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'preparing' | 'uploading' | 'complete' | 'error'>('idle');

  // Fetch gallery images with cache busting
  const fetchGallery = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/gallery-list?t=${Date.now()}`);
      if (!response.ok) throw new Error('Failed to fetch gallery');
      const data = await response.json();
      setImages(data.images);
    } catch (err) {
      console.error('Error fetching gallery:', err);
      setError('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch and periodic refresh
  useEffect(() => {
    fetchGallery();
    // Refresh every 30 seconds
    const interval = setInterval(fetchGallery, 30000);
    return () => clearInterval(interval);
  }, [fetchGallery]);

  // Handle file upload
  const handleUpload = async (files: FileList) => {
    try {
      setUploadProgress(0);
      setError(null);
      setUploadStatus('preparing');

      // Simulate progress for preparation
      for (let i = 0; i <= 20; i++) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      setUploadStatus('uploading');
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('/api/gallery-upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      if (data.success) {
        setUploadStatus('complete');
        setUploadProgress(100);
        // Wait a moment to show completion
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Immediately fetch fresh data
        await fetchGallery();
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
      setUploadStatus('error');
    } finally {
      // Reset status after a delay
      setTimeout(() => {
        setUploadStatus('idle');
        setUploadProgress(0);
      }, 2000);
    }
  };

  // Handle image deletion
  const handleDelete = async () => {
    if (!selected.length) return;

    try {
      setError(null);
      setDeleteStatus('deleting');
      setDeleteProgress(0);

      console.log('Attempting to delete images:', selected);

      const response = await fetch('/api/gallery-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ images: selected }),
      });

      const data = await response.json();
      console.log('Delete response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Delete failed');
      }

      if (data.success) {
        setDeleteStatus('complete');
        setDeleteProgress(100);
        // Wait a moment to show completion
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Immediately fetch fresh data
        await fetchGallery();
        setSelected([]);
      } else {
        throw new Error(data.error || 'Delete failed');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError(err instanceof Error ? err.message : 'Delete failed');
      setDeleteStatus('error');
    } finally {
      // Reset status after a delay
      setTimeout(() => {
        setDeleteStatus('idle');
        setDeleteProgress(0);
      }, 2000);
    }
  };

  return {
    images,
    loading,
    error,
    uploadProgress,
    uploadStatus,
    selected,
    deleteProgress,
    deleteStatus,
    previewImage,
    setSelected,
    setPreviewImage,
    handleUpload,
    handleDelete,
    fetchGallery,
  };
}

// Custom hook for contact queries management
function useContactQueriesManager() {
  const [queries, setQueries] = useState<ContactQuery[]>([]);
  const [loadingQueries, setLoadingQueries] = useState(true);
  const [queriesError, setQueriesError] = useState<string | null>(null);

  const fetchQueries = useCallback(async () => {
    try {
      setLoadingQueries(true);
      setQueriesError(null);
      const response = await fetch('/api/contact/queries');
      if (!response.ok) throw new Error('Failed to fetch queries');
      const data = await response.json();
      console.log('Fetched queries data:', data);
      setQueries(data);
    } catch (err) {
      console.error('Error fetching queries:', err);
      setQueriesError('Failed to load queries');
    } finally {
      setLoadingQueries(false);
    }
  }, []);

  const handleDeleteQuery = async (id: string) => {
    if (!confirm('Are you sure you want to delete this query?')) return;

    try {
      const response = await fetch(`/api/contact/queries/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete query');
      await fetchQueries(); // Refresh the list
    } catch (err) {
      console.error('Error deleting query:', err);
      alert('Failed to delete query');
    }
  };

  useEffect(() => {
    fetchQueries();
    // Refresh every 30 seconds
    const interval = setInterval(fetchQueries, 30000);
    return () => clearInterval(interval);
  }, [fetchQueries]);

  return {
    queries,
    loadingQueries,
    queriesError,
    handleDeleteQuery,
    fetchQueries,
  };
}

export default function AdminPage() {
  const [input, setInput] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [upiName, setUpiName] = useState('');
  const [qrCode, setQrCode] = useState<string | null>(null);

  const {
    images,
    loading,
    error,
    uploadProgress,
    uploadStatus,
    selected,
    deleteProgress,
    deleteStatus,
    previewImage,
    setSelected,
    setPreviewImage,
    handleUpload,
    handleDelete,
    fetchGallery,
  } = useGalleryManager();

  const {
    queries,
    loadingQueries,
    queriesError,
    handleDeleteQuery,
  } = useContactQueriesManager();

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('admin-auth') === 'true') {
      setAuthenticated(true);
    }
    // Load settings from Cloudinary
    fetch('/api/get-settings')
      .then(res => res.json())
      .then(data => {
        if (data.upiId) setUpiId(data.upiId);
        if (data.upiName) setUpiName(data.upiName);
        if (data.qrCode) setQrCode(data.qrCode);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === ADMIN_PASSWORD) {
      setAuthenticated(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('admin-auth', 'true');
      }
    } else {
      alert('Incorrect password');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin-auth');
    setAuthenticated(false);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-2">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-black">Admin Portal</h1>
              <p className="text-gray-800 mt-1">Enter your credentials to continue</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-xs font-medium text-black mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-black focus:ring-2 focus:ring-black focus:border-transparent transition text-black bg-white"
                  placeholder="Enter admin password"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-10 md:pb-0">
      {/* Top Navigation - Desktop */}
      <nav className="hidden md:flex items-center justify-between bg-black border-b border-black px-4 py-2">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded transition text-xs font-semibold border ${activeTab === 'dashboard' ? 'bg-white text-black border-black' : 'bg-black text-white border-white hover:bg-white hover:text-black'}`}
          >
            <FiHome className="w-4 h-4 inline-block mr-1" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-3 py-1.5 rounded transition text-xs font-semibold border ${activeTab === 'gallery' ? 'bg-white text-black border-black' : 'bg-black text-white border-white hover:bg-white hover:text-black'}`}
          >
            <FiImage className="w-4 h-4 inline-block mr-1" />
            Gallery
          </button>
          <button
            onClick={() => setActiveTab('queries')}
            className={`px-3 py-1.5 rounded transition text-xs font-semibold border ${activeTab === 'queries' ? 'bg-white text-black border-black' : 'bg-black text-white border-white hover:bg-white hover:text-black'}`}
          >
            <FiMessageSquare className="w-4 h-4 inline-block mr-1" />
            Queries
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded transition text-xs font-semibold border ${activeTab === 'settings' ? 'bg-white text-black border-black' : 'bg-black text-white border-white hover:bg-white hover:text-black'}`}
          >
            <FiSettings className="w-4 h-4 inline-block mr-1" />
            Settings
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="text-white hover:text-gray-200 transition"
        >
          <FiLogOut className="w-5 h-5" />
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-4 py-2 space-y-1">
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition ${
                activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FiHome className="w-5 h-5 mr-3" />
              Dashboard
            </button>
            <button
              onClick={() => {
                setActiveTab('gallery');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition ${
                activeTab === 'gallery' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FiImage className="w-5 h-5 mr-3" />
              Gallery
            </button>
            <button
              onClick={() => {
                setActiveTab('queries');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition ${
                activeTab === 'queries' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FiMessageSquare className="w-5 h-5 mr-3" />
              Queries
            </button>
            <button
              onClick={() => {
                setActiveTab('settings');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition ${
                activeTab === 'settings' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FiSettings className="w-5 h-5 mr-3" />
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition"
            >
              <FiLogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="p-4 md:p-8">
        {activeTab === 'dashboard' && (
          <DashboardOverview 
            galleryCount={images.length} 
            isLoading={loading}
          />
        )}
        {activeTab === 'gallery' && (
          <GalleryManager 
            images={images}
            isLoading={loading}
            error={error}
            uploadProgress={uploadProgress}
            uploadStatus={uploadStatus}
            selected={selected}
            deleteProgress={deleteProgress}
            deleteStatus={deleteStatus}
            previewImage={previewImage}
            setSelected={setSelected}
            setPreviewImage={setPreviewImage}
            handleUpload={handleUpload}
            handleDelete={handleDelete}
            fetchGallery={fetchGallery}
          />
        )}
        {activeTab === 'queries' && (
          <ContactQueriesManager 
            queries={queries}
            loadingQueries={loadingQueries}
            queriesError={queriesError}
            handleDeleteQuery={handleDeleteQuery}
          />
        )}
        {activeTab === 'settings' && (
          <SettingsPanel 
            upiId={upiId}
            setUpiId={setUpiId}
            upiName={upiName}
            setUpiName={setUpiName}
            qrCode={qrCode}
            setQrCode={setQrCode}
            handleLogout={handleLogout}
          />
        )}
      </main>

      {/* Bottom Navigation - Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="grid grid-cols-4 h-16">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center justify-center ${
              activeTab === 'dashboard' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <FiHome className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex flex-col items-center justify-center ${
              activeTab === 'gallery' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <FiImage className="w-6 h-6" />
            <span className="text-xs mt-1">Gallery</span>
          </button>
          <button
            onClick={() => setActiveTab('queries')}
            className={`flex flex-col items-center justify-center ${
              activeTab === 'queries' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <FiMessageSquare className="w-6 h-6" />
            <span className="text-xs mt-1">Queries</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center justify-center ${
              activeTab === 'settings' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <FiSettings className="w-6 h-6" />
            <span className="text-xs mt-1">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

function GalleryManager({ 
  images,
  isLoading,
  error,
  uploadProgress,
  uploadStatus,
  selected,
  deleteProgress,
  deleteStatus,
  previewImage,
  setSelected,
  setPreviewImage,
  handleUpload,
  handleDelete,
  fetchGallery,
}: { 
  images: string[];
  isLoading: boolean;
  error: string | null;
  uploadProgress: number;
  uploadStatus: 'idle' | 'preparing' | 'uploading' | 'complete' | 'error';
  selected: string[];
  deleteProgress: number;
  deleteStatus: 'idle' | 'confirming' | 'deleting' | 'complete' | 'error';
  previewImage: string | null;
  setSelected: (value: string[]) => void;
  setPreviewImage: (value: string | null) => void;
  handleUpload: (files: FileList) => Promise<void>;
  handleDelete: () => Promise<void>;
  fetchGallery: () => Promise<void>;
}) {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(e.target.files);
    }
  };

  const handleUploadClick = async () => {
    if (selectedFiles) {
      try {
        await handleUpload(selectedFiles);
        setSelectedFiles(null);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
  };

  const handleDeleteClick = async () => {
    if (selected.length === 0) return;
    
    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete ${selected.length} image${selected.length > 1 ? 's' : ''}?\nThis action cannot be undone.`
    );
    
    if (confirmed) {
      await handleDelete();
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFiles(e.dataTransfer.files);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const getUploadButtonText = () => {
    switch (uploadStatus) {
      case 'preparing':
        return 'Preparing files...';
      case 'uploading':
        return 'Uploading...';
      case 'complete':
        return 'Upload complete!';
      case 'error':
        return 'Upload failed';
      default:
        return `Upload ${selectedFiles?.length || 0} Image${selectedFiles?.length === 1 ? '' : 's'}`;
    }
  };

  const getUploadButtonIcon = () => {
    switch (uploadStatus) {
      case 'preparing':
      case 'uploading':
        return <FiRefreshCw className="w-5 h-5 mr-2 animate-spin" />;
      case 'complete':
        return <FiCheck className="w-5 h-5 mr-2" />;
      case 'error':
        return <FiX className="w-5 h-5 mr-2" />;
      default:
        return <FiUpload className="w-5 h-5 mr-2" />;
    }
  };

  const getDeleteButtonText = () => {
    switch (deleteStatus) {
      case 'deleting':
        return 'Deleting...';
      case 'complete':
        return 'Deleted successfully!';
      case 'error':
        return 'Delete failed';
      default:
        return `Delete ${selected.length} Image${selected.length === 1 ? '' : 's'}`;
    }
  };

  const getDeleteButtonIcon = () => {
    switch (deleteStatus) {
      case 'deleting':
        return <FiRefreshCw className="w-5 h-5 mr-2 animate-spin" />;
      case 'complete':
        return <FiCheck className="w-5 h-5 mr-2" />;
      case 'error':
        return <FiX className="w-5 h-5 mr-2" />;
      default:
        return <FiTrash2 className="w-5 h-5 mr-2" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-black">Gallery Management</h2>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-black">{images.length} images</span>
          {isLoading && <span className="text-sm text-gray-500">Loading...</span>}
          <button
            onClick={() => fetchGallery()}
            className="text-sm text-black hover:text-gray-600 flex items-center"
          >
            <FiRefreshCw className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => fetchGallery()}
            className="text-red-600 hover:text-red-700"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6 border border-black">
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
            dragActive 
              ? 'border-black bg-gray-50' 
              : 'border-gray-300 hover:border-black'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <div className="space-y-4">
            <div className="flex flex-col items-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors duration-200 ${
                uploadStatus === 'complete' ? 'bg-green-100' :
                uploadStatus === 'error' ? 'bg-red-100' :
                uploadStatus === 'uploading' || uploadStatus === 'preparing' ? 'bg-blue-100' :
                'bg-gray-100'
              }`}>
                {uploadStatus === 'complete' ? <FiCheck className="w-8 h-8 text-green-600" /> :
                 uploadStatus === 'error' ? <FiX className="w-8 h-8 text-red-600" /> :
                 uploadStatus === 'uploading' || uploadStatus === 'preparing' ? <FiRefreshCw className="w-8 h-8 text-blue-600 animate-spin" /> :
                 <FiUpload className="w-8 h-8 text-gray-400" />
                }
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                {selectedFiles ? 'Files Selected' : 'Upload Images'}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {selectedFiles 
                  ? `${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''} selected`
                  : 'Drag and drop your images here, or click to browse'}
              </p>
            </div>

            {selectedFiles ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {Array.from(selectedFiles).map((file, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={handleUploadClick}
                    disabled={uploadStatus === 'uploading' || uploadStatus === 'preparing'}
                    className={`inline-flex items-center px-6 py-3 rounded-lg transition ${
                      uploadStatus === 'complete' ? 'bg-green-600 text-white hover:bg-green-700' :
                      uploadStatus === 'error' ? 'bg-red-600 text-white hover:bg-red-700' :
                      'bg-black text-white hover:bg-white hover:text-black border border-black'
                    } disabled:opacity-50`}
                  >
                    {getUploadButtonIcon()}
                    {getUploadButtonText()}
                  </button>
                  {uploadStatus === 'idle' && (
                    <button
                      onClick={() => setSelectedFiles(null)}
                      className="inline-flex items-center px-6 py-3 text-gray-600 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                  )}
                </div>
                {uploadProgress > 0 && (
                  <div className="w-full max-w-md mx-auto">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>
                        {uploadStatus === 'preparing' ? 'Preparing files...' :
                         uploadStatus === 'uploading' ? 'Uploading...' :
                         uploadStatus === 'complete' ? 'Upload complete!' :
                         uploadStatus === 'error' ? 'Upload failed' :
                         'Ready to upload'}
                      </span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          uploadStatus === 'complete' ? 'bg-green-600' :
                          uploadStatus === 'error' ? 'bg-red-600' :
                          'bg-black'
                        }`}
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleButtonClick}
                className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-white hover:text-black border border-black transition"
              >
                <FiUpload className="w-5 h-5 mr-2" />
                Select Files
              </button>
            )}
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Gallery Images</h3>
            {selected.length > 0 && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">{selected.length} selected</span>
                <button
                  onClick={handleDeleteClick}
                  disabled={deleteStatus === 'deleting'}
                  className={`inline-flex items-center px-4 py-2 rounded-lg transition ${
                    deleteStatus === 'complete' ? 'bg-green-600 text-white hover:bg-green-700' :
                    deleteStatus === 'error' ? 'bg-red-600 text-white hover:bg-red-700' :
                    'bg-red-600 text-white hover:bg-red-700'
                  } disabled:opacity-50`}
                >
                  {getDeleteButtonIcon()}
                  {getDeleteButtonText()}
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map(img => (
              <div
                key={img}
                className={`relative group rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  selected.includes(img) 
                    ? 'border-red-600 ring-2 ring-red-600 ring-opacity-50' 
                    : 'border-transparent hover:border-gray-300'
                }`}
              >
                <div
                  className="relative w-full pt-[100%] cursor-pointer"
                  onClick={() => {
                    const newSelected = selected.includes(img)
                      ? selected.filter(i => i !== img)
                      : [...selected, img];
                    setSelected(newSelected);
                  }}
                >
                  <Image
                    src={getOptimizedImageUrl(img)}
                    alt="Gallery"
                    className="absolute inset-0 w-full h-full object-cover"
                    fill
                    quality={70}
                    sizes="(max-width: 768px) 100vw, 20vw"
                    loading="lazy"
                  />
                  
                  {/* Selection Checkbox */}
                  <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                    selected.includes(img)
                      ? 'bg-red-600'
                      : 'bg-white bg-opacity-50 group-hover:bg-opacity-100'
                  }`}>
                    {selected.includes(img) ? (
                      <FiCheck className="w-4 h-4 text-white" />
                    ) : (
                      <div className="w-4 h-4 border-2 border-gray-400 rounded-sm" />
                    )}
                  </div>

                  {/* Preview Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewImage(img);
                    }}
                    className="absolute bottom-2 right-2 p-2 bg-white bg-opacity-50 hover:bg-opacity-100 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
                  >
                    <FiImage className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {deleteProgress > 0 && (
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-96">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>
                  {deleteStatus === 'deleting' ? 'Deleting images...' :
                   deleteStatus === 'complete' ? 'Deletion complete!' :
                   deleteStatus === 'error' ? 'Deletion failed' :
                   'Ready to delete'}
                </span>
                <span>{deleteProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    deleteStatus === 'complete' ? 'bg-green-600' :
                    deleteStatus === 'error' ? 'bg-red-600' :
                    'bg-red-600'
                  }`}
                  style={{ width: `${deleteProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <FiX className="w-8 h-8" />
            </button>
            <div className="relative w-full pt-[75%]">
              <Image
                src={previewImage}
                alt="Preview"
                className="absolute inset-0 w-full h-full object-contain"
                fill
                quality={70}
                priority
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DashboardOverview({ galleryCount, isLoading }: { galleryCount: number, isLoading: boolean }) {
  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-extrabold text-black tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-black">Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-black rounded-2xl p-8 flex flex-col items-start shadow-none">
          <div className="text-5xl font-black text-black mb-2">
            {isLoading ? (
              <span className="animate-pulse">...</span>
            ) : (
              galleryCount
            )}
          </div>
          <div className="text-lg font-semibold text-black mb-1">Gallery Images</div>
          <div className="text-sm text-black">Total images in your gallery</div>
        </div>
      </div>
    </div>
  );
}

function SettingsPanel({ 
  upiId, 
  setUpiId, 
  upiName, 
  setUpiName, 
  qrCode, 
  setQrCode,
  handleLogout,
}: { 
  upiId: string;
  setUpiId: (value: string) => void;
  upiName: string;
  setUpiName: (value: string) => void;
  qrCode: string | null;
  setQrCode: (value: string | null) => void;
  handleLogout: () => void;
}) {
  const handleQRUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const formData = new FormData();
      formData.append('qr', file);
      
      const res = await fetch('/api/upload-qr', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to upload QR code');
      }

      const data = await res.json();
      if (!data.url) {
        throw new Error('No URL returned from QR code upload');
      }

      setQrCode(data.url);

      const settingsData = {
        upiId: upiId.trim(),
        upiName: upiName.trim(),
        qrCode: data.url
      };

      const saveRes = await fetch('/api/save-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsData),
      });

      if (!saveRes.ok) {
        throw new Error('Failed to save settings with new QR code');
      }

      alert('QR code uploaded successfully!');
    } catch (error) {
      console.error('Failed to upload QR code:', error);
      alert('Failed to upload QR code. Please try again.');
    }
  };

  const handleRemoveQR = async () => {
    try {
      await fetch('/api/remove-qr', { method: 'POST' });
      setQrCode(null);
      await fetch('/api/save-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ upiId, upiName, qrCode: null }),
      });
    } catch (error) {
      console.error('Failed to remove QR code:', error);
    }
  };

  const handleSaveSettings = async () => {
    try {
      if (!upiId) {
        alert('Please enter a UPI ID');
        return;
      }

      const settingsData = {
        upiId: upiId.trim(),
        upiName: upiName.trim(),
        qrCode: qrCode
      };

      const res = await fetch('/api/save-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsData),
      });

      if (!res.ok) {
        throw new Error('Failed to save settings');
      }

      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 border border-black">
      <h2 className="text-2xl font-bold text-black mb-8">Payment Settings</h2>
      <div className="space-y-8">
        <div>
          <label htmlFor="upiId" className="block text-sm font-medium text-black mb-2">
            UPI ID
          </label>
          <input
            type="text"
            id="upiId"
            className="w-full px-4 py-3 border border-black rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black font-medium placeholder-gray-400 transition"
            placeholder="your.upi@bank"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="upiName" className="block text-sm font-medium text-black mb-2">
            Account Name
          </label>
          <input
            type="text"
            id="upiName"
            className="w-full px-4 py-3 border border-black rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black font-medium placeholder-gray-400 transition"
            placeholder="Account Holder Name"
            value={upiName}
            onChange={(e) => setUpiName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            QR Code
          </label>
          <div className="border-2 border-dashed border-black rounded-lg p-6 text-center bg-white">
            {qrCode ? (
              <div className="space-y-4">
                <div className="relative w-48 h-48 mx-auto">
                  <Image 
                    src={qrCode} 
                    alt="UPI QR Code" 
                    fill
                    className="object-contain rounded-lg border border-black" 
                  />
                </div>
                <button
                  onClick={handleRemoveQR}
                  className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-white hover:text-black border border-black transition"
                >
                  <FiTrash2 className="w-4 h-4 mr-2" />
                  Remove QR Code
                </button>
              </div>
            ) : (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleQRUpload}
                  className="hidden"
                  id="qr-upload"
                />
                <label
                  htmlFor="qr-upload"
                  className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-white hover:text-black border border-black transition cursor-pointer"
                >
                  <FiUpload className="w-5 h-5 mr-2" />
                  Upload QR Code
                </label>
                <p className="mt-2 text-sm text-gray-500">
                  Recommended size: 500x500px
                </p>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={handleSaveSettings}
          className="w-full bg-black text-white py-3 rounded-lg hover:bg-white hover:text-black border border-black transition font-medium"
        >
          Save Settings
        </button>
        <div className="mt-8">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-medium"
          >
            <FiLogOut className="inline-block mr-2" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

// Contact Queries Manager Component
function ContactQueriesManager({
  queries,
  loadingQueries,
  queriesError,
  handleDeleteQuery,
}: {
  queries: ContactQuery[];
  loadingQueries: boolean;
  queriesError: string | null;
  handleDeleteQuery: (id: string) => Promise<void>;
}) {
  const [selectedQuery, setSelectedQuery] = useState<ContactQuery | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRowClick = (query: ContactQuery) => {
    setSelectedQuery(query);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedQuery(null);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Queries</h2>
        {loadingQueries ? (
          <p className="text-gray-600">Loading queries...</p>
        ) : queriesError ? (
          <p className="text-red-600">{queriesError}</p>
        ) : queries.length === 0 ? (
          <p className="text-gray-600">No queries found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {queries.map((query) => (
                  <tr key={query._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleRowClick(query)}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(query.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{query.fullName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{query.phoneNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{query.subject}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 truncate max-w-xs">{query.message}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click from firing
                          handleDeleteQuery(query._id);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {isModalOpen && selectedQuery && (
        <QueryDetailsModal query={selectedQuery} onClose={handleCloseModal} />
      )}
    </div>
  );
}

interface QueryDetailsModalProps {
  query: ContactQuery;
  onClose: () => void;
}

const QueryDetailsModal: React.FC<QueryDetailsModalProps> = ({ query, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
        >
          <FiX className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Query Details</h2>
        <div className="space-y-3 text-gray-800">
          <p><strong>Date:</strong> {new Date(query.timestamp).toLocaleString()}</p>
          <p><strong>Name:</strong> {query.fullName}</p>
          <p><strong>Phone:</strong> {query.phoneNumber}</p>
          <p><strong>Subject:</strong> {query.subject}</p>
          <p><strong>Message:</strong></p>
          <p className="bg-gray-100 p-3 rounded-md overflow-y-auto max-h-48 text-black">{query.message}</p>
        </div>
      </div>
    </div>
  );
}; 