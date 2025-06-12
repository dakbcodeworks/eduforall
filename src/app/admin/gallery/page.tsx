import Image from 'next/image'

export default function GalleryManagement() {
  // Mock data for gallery images
  const images = [
    {
      id: 1,
      title: "Nature Scene 1",
      url: "https://picsum.photos/400/300?random=1",
      category: "Nature",
      uploadDate: "2024-03-15"
    },
    {
      id: 2,
      title: "City View",
      url: "https://picsum.photos/400/300?random=2",
      category: "Urban",
      uploadDate: "2024-03-14"
    },
    {
      id: 3,
      title: "Mountain Landscape",
      url: "https://picsum.photos/400/300?random=3",
      category: "Nature",
      uploadDate: "2024-03-13"
    },
    {
      id: 4,
      title: "Beach Sunset",
      url: "https://picsum.photos/400/300?random=4",
      category: "Nature",
      uploadDate: "2024-03-12"
    }
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gallery Management</h1>
        <div className="flex gap-4">
          <select className="border rounded px-4 py-2">
            <option value="">All Categories</option>
            <option value="nature">Nature</option>
            <option value="urban">Urban</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            Upload Images
          </button>
        </div>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((image) => (
          <div key={image.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="relative h-48">
              <Image
                src={image.url}
                alt={image.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">{image.title}</h3>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{image.category}</span>
                <span>{image.uploadDate}</span>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                <button className="text-red-600 hover:text-red-900">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 