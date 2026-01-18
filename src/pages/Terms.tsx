import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Terms() {
  return (
    <>
      {/* Hero */}
      <section className="bg-background py-12 md:py-16">
        <div className="section-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-4"
          >
            <div className="p-4 bg-primary/10 rounded-full">
              <FileText className="h-12 w-12 text-primary" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="heading-xl mb-3"
          >
            Terms & Conditions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="body-lg max-w-2xl mx-auto mb-6"
          >
            Last updated: {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 md:py-12">
        <div className="section-container max-w-4xl space-y-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="bg-card rounded-lg p-8 shadow-card space-y-6"
          >
            <div>
              <h2 className="heading-md mb-4">1. Agreement to Terms</h2>
              <p className="body-md text-muted-foreground">
                By accessing or using Hiyam Bridal's website and services, you agree to be bound by these Terms and Conditions. 
                If you disagree with any part of these terms, you may not access our services.
              </p>
            </div>

            <div>
              <h2 className="heading-md mb-4">2. Use of Website</h2>
              <p className="body-md text-muted-foreground mb-3">You agree to use our website only for lawful purposes and in a way that:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Does not infringe the rights of others</li>
                <li>Is not harmful, threatening, or offensive</li>
                <li>Does not breach any applicable laws or regulations</li>
                <li>Does not transmit viruses or malicious code</li>
              </ul>
            </div>

            <div>
              <h2 className="heading-md mb-4">3. Products and Services</h2>
              <div className="space-y-3">
                <p className="body-md text-muted-foreground">
                  We strive to accurately display our products, including colors and images. However, we cannot guarantee that 
                  your device's display will be accurate.
                </p>
                <p className="body-md text-muted-foreground">
                  We reserve the right to modify, discontinue, or limit the availability of any product or service at any time 
                  without notice.
                </p>
                <p className="body-md text-muted-foreground">
                  Prices are subject to change without notice. We reserve the right to refuse any order.
                </p>
              </div>
            </div>

            <div>
              <h2 className="heading-md mb-4">4. Orders and Payment</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>All orders are subject to acceptance by us</li>
                <li>Payment must be received before we process your order</li>
                <li>We accept major credit and debit cards</li>
                <li>All prices are in GBP (£) and include VAT where applicable</li>
                <li>Custom orders require a deposit (typically 50%) to commence production</li>
              </ul>
            </div>

            <div>
              <h2 className="heading-md mb-4">5. Custom Orders</h2>
              <div className="space-y-3">
                <p className="body-md text-muted-foreground">
                  Custom and made-to-measure orders are non-refundable once production has begun. 
                  A deposit is required to confirm your order.
                </p>
                <p className="body-md text-muted-foreground">
                  Production times for custom orders are estimates and may vary. We will keep you informed of any delays.
                </p>
              </div>
            </div>

            <div>
              <h2 className="heading-md mb-4">6. Delivery</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Delivery times are estimates and not guaranteed</li>
                <li>We are not responsible for delays caused by shipping companies</li>
                <li>International customers are responsible for customs duties and taxes</li>
                <li>Risk of loss passes to you upon delivery</li>
              </ul>
            </div>

            <div>
              <h2 className="heading-md mb-4">7. Returns and Refunds</h2>
              <p className="body-md text-muted-foreground mb-3">
                Please refer to our Delivery & Returns page for detailed return and refund policies. 
                Custom orders and sale items are excluded from our standard return policy.
              </p>
            </div>

            <div>
              <h2 className="heading-md mb-4">8. Intellectual Property</h2>
              <p className="body-md text-muted-foreground">
                All content on this website, including text, graphics, logos, images, and software, is the property of 
                Hiyam Bridal and is protected by copyright and trademark laws. You may not reproduce, distribute, or 
                create derivative works without our written permission.
              </p>
            </div>

            <div>
              <h2 className="heading-md mb-4">9. Limitation of Liability</h2>
              <p className="body-md text-muted-foreground">
                To the fullest extent permitted by law, Hiyam Bridal shall not be liable for any indirect, incidental, 
                special, consequential, or punitive damages resulting from your use of our website or services.
              </p>
            </div>

            <div>
              <h2 className="heading-md mb-4">10. Indemnification</h2>
              <p className="body-md text-muted-foreground">
                You agree to indemnify and hold harmless Hiyam Bridal from any claims, damages, losses, liabilities, 
                and expenses arising out of your use of our website or violation of these Terms.
              </p>
            </div>

            <div>
              <h2 className="heading-md mb-4">11. Governing Law</h2>
              <p className="body-md text-muted-foreground">
                These Terms and Conditions are governed by and construed in accordance with the laws of England and Wales. 
                Any disputes will be subject to the exclusive jurisdiction of the courts of England and Wales.
              </p>
            </div>

            <div>
              <h2 className="heading-md mb-4">12. Changes to Terms</h2>
              <p className="body-md text-muted-foreground">
                We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately 
                upon posting. Your continued use of our services constitutes acceptance of the modified terms.
              </p>
            </div>

            <div>
              <h2 className="heading-md mb-4">13. Contact Information</h2>
              <p className="body-md text-muted-foreground">
                If you have any questions about these Terms and Conditions, please contact us at:
              </p>
              <p className="body-md text-muted-foreground mt-2">
                Email: <a href="mailto:hiyambridal@gmail.com" className="text-primary hover:underline">hiyambridal@gmail.com</a>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
