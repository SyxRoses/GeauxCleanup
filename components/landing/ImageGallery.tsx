import React from 'react';

export const ImageGallery: React.FC = () => {
  const images = [
    {
      src: "/images/gallery-living-room.png",
      alt: "Sparkling clean living room",
      size: "large"
    },
    {
      src: "/images/gallery-vacuum.png",
      alt: "Professional vacuuming",
      size: "small"
    },
    {
      src: "/images/gallery-supplies.png",
      alt: "Eco-friendly cleaning supplies",
      size: "small"
    },
    {
      src: "/images/gallery-detail.png",
      alt: "Detailed wiping",
      size: "medium"
    },
    {
      src: "/images/gallery-kitchen.png",
      alt: "Clean kitchen counter",
      size: "medium"
    }
  ];

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">See the difference</h2>
          <p className="text-gray-500">Real results from our dedicated team of professionals.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[600px]">
          {/* Large Hero Item */}
          <div className="col-span-1 md:col-span-2 row-span-2 relative rounded-3xl overflow-hidden group aspect-[4/3] md:aspect-auto">
            <img src={images[0].src} alt={images[0].alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
              <span className="text-white font-medium">{images[0].alt}</span>
            </div>
          </div>

          {/* Top Right Items */}
          <div className="col-span-1 md:col-span-1 row-span-1 relative rounded-3xl overflow-hidden group aspect-[4/3] md:aspect-auto">
            <img src={images[1].src} alt={images[1].alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
          <div className="col-span-1 md:col-span-1 row-span-1 relative rounded-3xl overflow-hidden group aspect-[4/3] md:aspect-auto">
            <img src={images[2].src} alt={images[2].alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>

          {/* Bottom Right Items */}
          <div className="col-span-1 md:col-span-1 row-span-1 relative rounded-3xl overflow-hidden group aspect-[4/3] md:aspect-auto">
            <img src={images[3].src} alt={images[3].alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
          <div className="col-span-1 md:col-span-1 row-span-1 relative rounded-3xl overflow-hidden group aspect-[4/3] md:aspect-auto">
            <img src={images[4].src} alt={images[4].alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
        </div>
      </div>
    </div>
  );
};