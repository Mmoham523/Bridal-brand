import { motion } from 'framer-motion';
import { Heart, Sparkles, Users } from 'lucide-react';
import aboutImage from '@/assets/about.png';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function About() {
  return (
    <>
      <section className="bg-secondary/30 py-12 md:py-16">
        <div className="section-container text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="heading-xl mb-3">
            Our Story
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="body-lg max-w-2xl mx-auto mb-6">
            Crafting timeless bridal wear with love, passion, and dedication to every bride's unique journey.
          </motion.p>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <h2 className="heading-md mb-6">Founded on Love</h2>
              <p className="body-md mb-4">Hiyam Bridal was born from a simple belief: every bride deserves to feel extraordinary on her wedding day. Founded in 2018, we've dressed hundreds of brides in diracs crafted with meticulous attention to detail.</p>
              <p className="body-md">Our boutique in the heart of the city offers an intimate, personalised experience where you're not just a customer—you're family.</p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="rounded-lg overflow-hidden">
              <img 
                src={aboutImage} 
                alt="Hiyam Bridal boutique" 
                className="w-full h-auto object-contain"
                loading="lazy"
                decoding="async"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12 bg-secondary/30">
        <div className="section-container">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="heading-md text-center mb-12">Our Values</motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Heart, title: 'Craftsmanship', desc: 'Every stitch made with love and precision.' },
              { icon: Sparkles, title: 'Comfort', desc: 'Beautiful diracs that feel as good as they look.' },
              { icon: Users, title: 'Elegance', desc: 'Timeless designs that transcend trends.' },
            ].map((value) => (
              <motion.div key={value.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center p-8 bg-card rounded-lg shadow-card">
                <value.icon className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="heading-sm mb-2">{value.title}</h3>
                <p className="body-md">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
