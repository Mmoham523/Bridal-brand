import { motion } from 'framer-motion';
import { Ruler } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function SizeGuide() {
  return (
    <>
      {/* Hero */}
      <section className="bg-secondary/30 py-12 md:py-16">
        <div className="section-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-4"
          >
            <div className="p-4 bg-primary/10 rounded-full">
              <Ruler className="h-12 w-12 text-primary" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="heading-xl mb-3"
          >
            Size Guide
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="body-lg max-w-2xl mx-auto mb-6"
          >
            Find your perfect fit with our comprehensive bridal sizing guide
          </motion.p>
        </div>
      </section>

      {/* Size Guide Content */}
      <section className="py-8 md:py-12">
        <div className="section-container max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="space-y-8"
          >
            {/* UK Bridal Sizing */}
            <div className="bg-card rounded-lg p-8 shadow-card">
              <h2 className="heading-md mb-6">UK Bridal Sizing</h2>
              <p className="body-md text-muted-foreground mb-6">
                Our bridal diracs follow UK bridal sizing standards. Bridal sizes typically run smaller than regular high-street sizes. 
                We recommend booking a consultation for the most accurate measurements.
              </p>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium">UK Bridal Size</th>
                      <th className="text-left py-3 px-4 font-medium">Bust (inches)</th>
                      <th className="text-left py-3 px-4 font-medium">Waist (inches)</th>
                      <th className="text-left py-3 px-4 font-medium">Hips (inches)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { size: '6', bust: '32', waist: '24', hips: '34' },
                      { size: '8', bust: '33', waist: '25', hips: '35' },
                      { size: '10', bust: '35', waist: '27', hips: '37' },
                      { size: '12', bust: '37', waist: '29', hips: '39' },
                      { size: '14', bust: '39', waist: '31', hips: '41' },
                      { size: '16', bust: '41', waist: '33', hips: '43' },
                    ].map((row) => (
                      <tr key={row.size} className="border-b border-border hover:bg-secondary/30">
                        <td className="py-3 px-4 font-medium">{row.size}</td>
                        <td className="py-3 px-4 text-muted-foreground">{row.bust}"</td>
                        <td className="py-3 px-4 text-muted-foreground">{row.waist}"</td>
                        <td className="py-3 px-4 text-muted-foreground">{row.hips}"</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Measurement Tips */}
            <div className="bg-card rounded-lg p-8 shadow-card">
              <h2 className="heading-md mb-6">How to Measure</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="heading-sm mb-2">Bust</h3>
                  <p className="body-md text-muted-foreground">
                    Measure around the fullest part of your bust, keeping the tape measure level and parallel to the ground. 
                    Wear the undergarments you plan to wear on your wedding day.
                  </p>
                </div>
                <div>
                  <h3 className="heading-sm mb-2">Waist</h3>
                  <p className="body-md text-muted-foreground">
                    Measure around the narrowest part of your waist, typically just above your belly button. 
                    Keep the tape measure comfortably snug but not tight.
                  </p>
                </div>
                <div>
                  <h3 className="heading-sm mb-2">Hips</h3>
                  <p className="body-md text-muted-foreground">
                    Measure around the fullest part of your hips, approximately 7-9 inches below your waist. 
                    Keep the tape measure level.
                  </p>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-primary/5 rounded-lg p-8 border border-primary/20">
              <h2 className="heading-md mb-4 text-primary">Important Notes</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Bridal sizes typically run 1-2 sizes smaller than regular clothing sizes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>All measurements should be taken in inches while wearing appropriate undergarments</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>We recommend having someone help you take measurements for accuracy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Most of our diracs can be altered to achieve the perfect fit</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>For the most accurate sizing, we strongly recommend booking a consultation</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
