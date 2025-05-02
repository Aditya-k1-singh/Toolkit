import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function PhotoGallery() {
  const [, setLocation] = useLocation();

  // Array of gallery images with their sources and descriptions
  const galleryImages = [
    {
      src: "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=600&q=80",
      alt: "Mountain landscape",
      className: "col-span-1 row-span-1"
    },
    {
      src: "https://images.unsplash.com/photo-1494783367193-149034c05e8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=600&q=80",
      alt: "Trekking group",
      className: "col-span-1 row-span-1"
    },
    {
      src: "https://images.unsplash.com/photo-1570641963303-92ce4845ed4c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=600&q=80",
      alt: "Camping",
      className: "col-span-1 row-span-1"
    },
    {
      src: "https://images.unsplash.com/photo-1597843786411-a7fa8ad44e3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=600&q=80",
      alt: "Adventure activities",
      className: "col-span-1 row-span-1"
    },
    {
      src: "https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=600&q=80",
      alt: "Scenic mountain view",
      className: "col-span-2 row-span-1 md:col-span-2"
    },
    {
      src: "https://images.unsplash.com/photo-1527512666523-ff2a58554c17?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=600&q=80",
      alt: "Adventure activities",
      className: "col-span-1 row-span-1"
    },
    {
      src: "https://images.unsplash.com/photo-1534880282318-be66f2dc5b62?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=600&q=80",
      alt: "Trekking group",
      className: "col-span-1 row-span-1"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-800 mb-4">Capture the Adventure</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Glimpses from our past treks across India's most beautiful landscapes
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryImages.map((image, index) => (
            <div key={index} className={`overflow-hidden rounded-lg shadow-md ${image.className}`}>
              <img 
                src={image.src} 
                alt={image.alt} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
              />
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Button 
            className="inline-block bg-primary text-white font-heading font-medium px-6 py-3 rounded-lg hover:bg-primary-dark transition duration-300"
            onClick={() => setLocation("/treks")}
          >
            View Gallery
          </Button>
        </div>
      </div>
    </section>
  );
}
