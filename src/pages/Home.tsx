import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Gem, Ruler } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product/ProductCard';
import productsData from '@/data/products.json';
import heroImage from '@/assets/hero-bridal.jpg';
import burntOrangeOne from '@/assets/products/burnt-orange-one.jpg';
import burntOrangeTwo from '@/assets/products/burnt-orange-two.jpg';
import sageGreenOne from '@/assets/products/sage-green-one.jpg';
import sageGreenTwo from '@/assets/products/sage-green-two.jpg';
import sageGreenThree from '@/assets/products/sage-green-three.jpg';

const productImages = [burntOrangeOne, burntOrangeTwo, sageGreenOne, sageGreenTwo, sageGreenThree];

const featuredProducts = productsData.products
  .filter(p => p.featured)
  .slice(0, 6)
  .map((product, index) => ({
    ...product,
    images: [productImages[index] || product.images[0]]
  }));

const trustBadges = [
  { icon: Heart, label: 'Handmade', description: 'Crafted with love' },
  { icon: Gem, label: 'Premium Fabrics', description: 'Finest materials' },
  { icon: Ruler, label: 'Tailored Fit', description: 'Perfect for you' },
];

const howItWorks = [
  { step: '01', title: 'Book', description: 'Schedule your bridal consultation online or in-store' },
  { step: '02', title: 'Fit', description: 'Our expert stylists take your measurements and guide your selection' },
  { step: '03', title: 'Receive', description: 'Your perfectly tailored gown arrives ready for your special day' },
];

const testimonials = [
  {
    name: 'Bride 2025',
    quote: 'The team at Hiyam Bridal made me feel like a princess. My dress fit perfectly and I received so many compliments.',
  },
  {
    name: 'Bride 2025',
    quote: 'From consultation to delivery, the experience was absolutely seamless. I could not have asked for a more beautiful gown.',
  },
  {
    name: 'Bride 2025',
    quote: 'The attention to detail and craftsmanship is exceptional. My veil was exactly what I envisioned for my wedding day.',
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } }
};

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <motion.img
            src={heroImage}
            alt="Hiyam Bridal boutique interior with elegant wedding gowns"
            className="w-full h-full object-cover"
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        </div>
        
        <div className="section-container relative z-10 py-16 md:py-24">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-2xl text-center md:text-left"
          >
            <motion.h1 
              variants={fadeInUp} 
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-primary-foreground leading-tight tracking-wider"
              style={{ textShadow: '0 4px 20px rgba(0, 0, 0, 0.8), 0 2px 8px rgba(0, 0, 0, 0.6)' }}
            >
              BRIDAL DIRACS
            </motion.h1>
            <motion.p 
              variants={fadeInUp} 
              className="text-lg md:text-xl mb-12 max-w-lg mx-auto md:mx-0 text-primary-foreground leading-relaxed"
              style={{ textShadow: '0 2px 12px rgba(0, 0, 0, 0.7), 0 1px 4px rgba(0, 0, 0, 0.5)' }}
            >
              Shop timeless pieces or book a bridal sizing consultation. Every dirac crafted to celebrate your unique love story.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Button 
                variant="hero" 
                asChild
                className="shadow-lg hover:shadow-xl"
              >
                <Link to="/consultation">Book Consultation</Link>
              </Button>
              <Button 
                variant="heroOutline" 
                asChild
              >
                <Link to="/shop">Shop the Collection</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mini Gallery */}
      <section className="py-12 md:py-16">
        <div className="section-container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-8"
          >
            <h2 className="heading-lg mb-3">Our Collection</h2>
            <p className="body-md text-muted-foreground max-w-2xl mx-auto">
              Discover our exquisite bridal diracs, each crafted with timeless elegance
            </p>
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {productImages.slice(0, 4).map((image, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group relative aspect-[3/4] overflow-hidden rounded-lg cursor-pointer bg-secondary"
              >
                <img
                  src={image}
                  alt={`Bridal dirac ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center"
          >
            <Button variant="outline" asChild className="rounded-full">
              <Link to="/gallery">View Full Gallery</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-y border-border bg-background">
        <div className="section-container py-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {trustBadges.map((badge) => (
              <motion.div
                key={badge.label}
                variants={fadeInUp}
                className="flex items-center justify-center gap-4 text-center md:text-left"
              >
                <badge.icon className="h-8 w-8 text-primary flex-shrink-0" strokeWidth={1.5} />
                <div>
                  <p className="font-heading text-lg font-medium">{badge.label}</p>
                  <p className="text-sm text-muted-foreground">{badge.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Collection - Commented out for now, will use later */}
      {/* <section className="section-spacing">
        <div className="section-container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="heading-lg mb-4">Featured Collection</h2>
            <p className="body-md max-w-2xl mx-auto">
              Discover our most beloved pieces, each one designed with timeless elegance in mind.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
          >
            {featuredProducts.map((product) => (
              <motion.div key={product.id} variants={fadeInUp}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mt-12"
          >
            <Button variant="outline" size="lg" asChild>
              <Link to="/shop">View All Collection</Link>
            </Button>
          </motion.div>
        </div>
      </section> */}

      {/* How It Works */}
      <section className="py-8 md:py-12 bg-background">
        <div className="section-container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="heading-lg mb-4">How It Works</h2>
            <p className="body-md max-w-2xl mx-auto">
              Your journey to the perfect bridal look, made simple and memorable.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            {howItWorks.map((item, index) => (
              <motion.div
                key={item.step}
                variants={fadeInUp}
                className="text-center relative"
              >
                <span className="font-heading text-6xl text-primary font-light">
                  {item.step}
                </span>
                <h3 className="heading-sm mt-4 mb-3">{item.title}</h3>
                <p className="body-md">{item.description}</p>
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px bg-border -translate-x-1/2" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-8 md:py-12">
        <div className="section-container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="heading-lg mb-4">What Our Brides Say</h2>
            <p className="body-md max-w-2xl mx-auto">
              Real stories from brides who found their perfect dress with us.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.name}
                variants={fadeInUp}
                className="bg-card rounded-lg p-8 shadow-card hover-lift"
              >
                <blockquote className="text-foreground leading-relaxed mb-6">
                  "{testimonial.quote}"
                </blockquote>
                <p className="font-heading text-lg font-medium text-primary">
                  {testimonial.name}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 md:py-12 bg-primary/90 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary" />
        <div className="section-container text-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2 variants={fadeInUp} className="heading-lg mb-4 text-primary-foreground">
              Ready to Find Your Dream Dress?
            </motion.h2>
            <motion.p variants={fadeInUp} className="body-md max-w-2xl mx-auto mb-8 text-primary-foreground/90">
              Book a consultation with our expert stylists and begin your bridal journey.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Button 
                variant="secondary" 
                asChild 
                className="px-8 py-6 text-base font-medium tracking-wide shadow-lg"
              >
                <Link to="/consultation">Book Your Consultation</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
