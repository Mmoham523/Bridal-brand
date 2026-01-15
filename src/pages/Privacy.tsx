import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Privacy() {
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
              <Shield className="h-12 w-12 text-primary" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="heading-xl mb-3"
          >
            Privacy Policy
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
              <h2 className="heading-md mb-4">1. Introduction</h2>
              <p className="body-md text-muted-foreground mb-4">
                Hiyam Bridal ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains 
                how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
              </p>
            </div>

            <div>
              <h2 className="heading-md mb-4">2. Information We Collect</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="heading-sm mb-2">Personal Information</h3>
                  <p className="body-md text-muted-foreground">
                    We may collect personal information that you voluntarily provide to us when you:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2 ml-4">
                    <li>Register for an account</li>
                    <li>Make a purchase</li>
                    <li>Book a consultation</li>
                    <li>Subscribe to our newsletter</li>
                    <li>Contact us via email or phone</li>
                  </ul>
                  <p className="body-md text-muted-foreground mt-3">
                    This may include: name, email address, phone number, postal address, payment information, and wedding date.
                  </p>
                </div>
                <div>
                  <h3 className="heading-sm mb-2">Automatically Collected Information</h3>
                  <p className="body-md text-muted-foreground">
                    When you visit our website, we automatically collect certain information about your device, including 
                    your IP address, browser type, operating system, access times, and the pages you have viewed.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="heading-md mb-4">3. How We Use Your Information</h2>
              <p className="body-md text-muted-foreground mb-3">We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Process and fulfill your orders</li>
                <li>Schedule and manage consultations</li>
                <li>Communicate with you about your orders and inquiries</li>
                <li>Send you marketing communications (with your consent)</li>
                <li>Improve our website and services</li>
                <li>Detect and prevent fraud</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>

            <div>
              <h2 className="heading-md mb-4">4. Information Sharing</h2>
              <p className="body-md text-muted-foreground mb-3">
                We do not sell your personal information. We may share your information with:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Service providers who assist us in operating our website and conducting business</li>
                <li>Payment processors to complete transactions</li>
                <li>Shipping companies to deliver your orders</li>
                <li>Legal authorities when required by law</li>
              </ul>
            </div>

            <div>
              <h2 className="heading-md mb-4">5. Data Security</h2>
              <p className="body-md text-muted-foreground">
                We implement appropriate technical and organizational security measures to protect your personal information. 
                However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </div>

            <div>
              <h2 className="heading-md mb-4">6. Your Rights</h2>
              <p className="body-md text-muted-foreground mb-3">Under UK GDPR, you have the right to:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Access your personal data</li>
                <li>Rectify inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Request restriction of processing</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </div>

            <div>
              <h2 className="heading-md mb-4">7. Cookies</h2>
              <p className="body-md text-muted-foreground">
                We use cookies and similar tracking technologies to track activity on our website and hold certain information. 
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </div>

            <div>
              <h2 className="heading-md mb-4">8. Third-Party Links</h2>
              <p className="body-md text-muted-foreground">
                Our website may contain links to third-party websites. We are not responsible for the privacy practices of 
                these external sites. We encourage you to review their privacy policies.
              </p>
            </div>

            <div>
              <h2 className="heading-md mb-4">9. Children's Privacy</h2>
              <p className="body-md text-muted-foreground">
                Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal 
                information from children. If you are a parent or guardian and believe your child has provided us with 
                personal information, please contact us.
              </p>
            </div>

            <div>
              <h2 className="heading-md mb-4">10. Changes to This Policy</h2>
              <p className="body-md text-muted-foreground">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
                Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </div>

            <div>
              <h2 className="heading-md mb-4">11. Contact Us</h2>
              <p className="body-md text-muted-foreground">
                If you have questions about this Privacy Policy or wish to exercise your rights, please contact us at:
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
