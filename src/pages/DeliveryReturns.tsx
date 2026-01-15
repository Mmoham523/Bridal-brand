import { motion } from 'framer-motion';
import { Truck, RefreshCw } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function DeliveryReturns() {
  return (
    <>
      {/* Hero */}
      <section className="bg-secondary/30 py-12 md:py-16">
        <div className="section-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center gap-4 mb-4"
          >
            <div className="p-4 bg-primary/10 rounded-full">
              <Truck className="h-8 w-8 text-primary" />
            </div>
            <div className="p-4 bg-primary/10 rounded-full">
              <RefreshCw className="h-8 w-8 text-primary" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="heading-xl mb-3"
          >
            Delivery & Returns
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="body-lg max-w-2xl mx-auto mb-6"
          >
            Everything you need to know about shipping and returns
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 md:py-12">
        <div className="section-container max-w-4xl space-y-8">
          {/* Delivery */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="bg-card rounded-lg p-8 shadow-card"
          >
            <h2 className="heading-md mb-6">Delivery Information</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="heading-sm mb-3">Standard Delivery</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Delivery time: 5-7 business days (UK)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Delivery cost: £10 (free on orders over £500)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>All orders are dispatched via tracked courier service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>You will receive tracking information via email once your order is dispatched</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="heading-sm mb-3">Express Delivery</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Delivery time: 2-3 business days (UK)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Delivery cost: £25</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Available for in-stock items only</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="heading-sm mb-3">Custom Orders</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Production time: 12-16 weeks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Delivery will be arranged once your order is ready</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>We will keep you updated throughout the production process</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="heading-sm mb-3">International Delivery</h3>
                <p className="text-muted-foreground mb-2">
                  We ship worldwide. International delivery times and costs vary by destination. 
                  Please contact us at <a href="mailto:hiyambridal@gmail.com" className="text-primary hover:underline">hiyambridal@gmail.com</a> for a quote.
                </p>
                <p className="text-sm text-muted-foreground">
                  Please note: International customers are responsible for any customs duties and taxes.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Returns */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="bg-card rounded-lg p-8 shadow-card"
          >
            <h2 className="heading-md mb-6">Returns & Exchanges</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="heading-sm mb-3">Return Policy</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Unworn items in original condition can be returned within 14 days of delivery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Items must be in original packaging with tags attached</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Custom orders and made-to-measure items are non-refundable</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Sale items are final sale and cannot be returned</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="heading-sm mb-3">How to Return</h3>
                <ol className="space-y-2 text-muted-foreground list-decimal list-inside">
                  <li>Contact us at <a href="mailto:hiyambridal@gmail.com" className="text-primary hover:underline">hiyambridal@gmail.com</a> to initiate a return</li>
                  <li>Include your order number and reason for return</li>
                  <li>We will provide you with a returns authorization and instructions</li>
                  <li>Package the item securely in its original packaging</li>
                  <li>Return the item using the provided label or tracked service</li>
                </ol>
              </div>

              <div>
                <h3 className="heading-sm mb-3">Refunds</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Refunds will be processed within 5-10 business days of receiving the returned item</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Original shipping costs are non-refundable</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Return shipping costs are the responsibility of the customer unless the item is faulty</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Refunds will be issued to the original payment method</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="heading-sm mb-3">Exchanges</h3>
                <p className="text-muted-foreground mb-2">
                  We offer exchanges for different sizes (subject to availability) within 14 days of delivery. 
                  Please contact us to arrange an exchange.
                </p>
              </div>

              <div className="bg-primary/5 rounded-lg p-6 border border-primary/20">
                <h4 className="heading-sm mb-2 text-primary">Damaged or Faulty Items</h4>
                <p className="text-muted-foreground">
                  If you receive a damaged or faulty item, please contact us immediately. We will arrange a replacement 
                  or full refund, including return shipping costs.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
