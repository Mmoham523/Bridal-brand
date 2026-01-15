import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function Shop() {
  return (
    <>
      {/* Hero */}
      <section className="bg-secondary/30 py-24 md:py-32">
        <div className="section-container">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-primary/10 rounded-full">
                <Sparkles className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="heading-xl mb-6">Coming Soon</h1>
            <p className="body-lg text-muted-foreground mb-4">
              Our full collection is coming soon. We're carefully curating an exquisite range of bridal diracs, 
              accessories, and separates that celebrate timeless elegance and modern sophistication.
            </p>
            <p className="body-md text-muted-foreground mb-8">
              In the meantime, explore our gallery to see our beautiful diracs, or book a consultation 
              to experience our collection in person.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button variant="hero" asChild className="min-w-[220px]">
                <Link to="/gallery">
                  <ImageIcon className="h-5 w-5 mr-2" />
                  View Gallery
                </Link>
              </Button>
              <Button variant="heroOutline" asChild className="min-w-[220px]">
                <Link to="/consultation">Book Consultation</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
