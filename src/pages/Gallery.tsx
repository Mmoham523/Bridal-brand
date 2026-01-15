import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import burntOrangeOne from '@/assets/products/burnt-orange-one.jpg';
import burntOrangeTwo from '@/assets/products/burnt-orange-two.jpg';
import sageGreenOne from '@/assets/products/sage-green-one.jpg';
import sageGreenTwo from '@/assets/products/sage-green-two.jpg';
import sageGreenThree from '@/assets/products/sage-green-three.jpg';
import product7 from '@/assets/products/product-5.png';
import product9 from '@/assets/products/product-6.png';
import product10 from '@/assets/products/product-7.png';

type Collection = 'all' | 'burnt-orange' | 'sage-green' | 'elegant';

const galleryImages = [
  { id: 1, src: burntOrangeOne, alt: 'Bridal dirac in burnt orange', title: 'Elegant Burnt Orange Dirac', collection: 'burnt-orange' as Collection },
  { id: 2, src: burntOrangeTwo, alt: 'Bridal dirac in burnt orange', title: 'Classic Burnt Orange Design', collection: 'burnt-orange' as Collection },
  { id: 3, src: sageGreenOne, alt: 'Bridal dirac in sage green', title: 'Sophisticated Sage Green Dirac', collection: 'sage-green' as Collection },
  { id: 4, src: sageGreenTwo, alt: 'Bridal dirac in sage green', title: 'Timeless Sage Green Elegance', collection: 'sage-green' as Collection },
  { id: 5, src: sageGreenThree, alt: 'Bridal dirac in sage green', title: 'Modern Sage Green Design', collection: 'sage-green' as Collection },
  { id: 6, src: product7, alt: 'Bridal dirac', title: 'Elegant Dirac Collection', collection: 'elegant' as Collection },
  { id: 7, src: product9, alt: 'Bridal dirac', title: 'Sophisticated Dirac Design', collection: 'elegant' as Collection },
  { id: 8, src: product10, alt: 'Bridal dirac', title: 'Timeless Dirac Elegance', collection: 'elegant' as Collection },
];

const collections = [
  { id: 'all' as Collection, name: 'All Collections' },
  { id: 'burnt-orange' as Collection, name: 'Burnt Orange' },
  { id: 'sage-green' as Collection, name: 'Sage Green' },
  { id: 'elegant' as Collection, name: 'Elegant' },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<Collection>('all');

  const filteredImages = useMemo(() => {
    return galleryImages.filter(image => {
      return selectedCollection === 'all' || image.collection === selectedCollection;
    });
  }, [selectedCollection]);

  const openLightbox = (imageId: number) => {
    setSelectedImage(imageId);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return;
    
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage);
    let newIndex: number;
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % filteredImages.length;
    } else {
      newIndex = currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1;
    }
    
    setSelectedImage(filteredImages[newIndex].id);
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-secondary/30 py-12 md:py-16">
        <div className="section-container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="heading-xl mb-3"
          >
            Our Gallery
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="body-lg max-w-2xl mx-auto mb-6"
          >
            Explore our beautiful collection of bridal diracs, each crafted with exquisite attention to detail and timeless elegance.
          </motion.p>
          
          {/* Simple Filter Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-3 justify-center"
          >
            {collections.map((collection) => (
              <Button
                key={collection.id}
                variant={selectedCollection === collection.id ? 'default' : 'outline'}
                onClick={() => setSelectedCollection(collection.id)}
                className="rounded-full px-5 py-2"
              >
                {collection.name}
              </Button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-6 md:py-8">
        <div className="section-container">
          {filteredImages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-lg text-muted-foreground mb-4">No pieces found matching your search.</p>
              <Button
                variant="outline"
                onClick={() => setSelectedCollection('all')}
                className="rounded-full"
              >
                Clear Filters
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                variants={fadeInUp}
                className="group relative aspect-[3/4] overflow-hidden rounded-lg cursor-pointer bg-secondary"
                onClick={() => openLightbox(image.id)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white font-heading text-sm">{image.title}</p>
                </div>
              </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-6xl w-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeLightbox}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
                aria-label="Close lightbox"
              >
                <X className="h-8 w-8" />
              </button>

              <div className="relative">
                <img
                  src={filteredImages.find(img => img.id === selectedImage)?.src}
                  alt={filteredImages.find(img => img.id === selectedImage)?.alt}
                  className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
                />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
                  <p className="text-white font-heading text-lg">
                    {filteredImages.find(img => img.id === selectedImage)?.title}
                  </p>
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('prev');
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-black/50 hover:bg-black/70 rounded-full p-3"
                aria-label="Previous image"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('next');
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-black/50 hover:bg-black/70 rounded-full p-3"
                aria-label="Next image"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Image Counter */}
              <div className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                {filteredImages.findIndex(img => img.id === selectedImage) + 1} / {filteredImages.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

