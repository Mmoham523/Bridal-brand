import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqCategories = [
  {
    title: 'Sizing & Fit',
    items: [
      { q: 'How do I know my size?', a: 'We recommend booking a consultation for accurate measurements. Our sizes follow UK bridal standards.' },
      { q: 'Can diracs be altered?', a: 'Yes, all our diracs can be altered. We recommend having alterations done 4-6 weeks before your wedding.' },
    ]
  },
  {
    title: 'Orders & Shipping',
    items: [
      { q: 'How long does delivery take?', a: 'Standard delivery is 5-7 business days. Custom orders take 12-16 weeks.' },
      { q: 'Do you ship internationally?', a: 'Yes, we ship worldwide. Contact us for international shipping rates.' },
    ]
  },
  {
    title: 'Returns & Exchanges',
    items: [
      { q: 'What is your return policy?', a: 'Unworn items can be returned within 14 days. Custom orders are non-refundable.' },
      { q: 'Can I exchange my dirac?', a: 'Yes, exchanges are available within 14 days for unworn items in original packaging.' },
    ]
  },
];

export default function FAQs() {
  return (
    <>
      <section className="bg-secondary/30 py-12 md:py-16">
        <div className="section-container text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="heading-xl mb-3">Frequently Asked Questions</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="body-lg max-w-2xl mx-auto mb-6">Find answers to common questions about our products and services.</motion.p>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="section-container max-w-3xl">
          {faqCategories.map((cat) => (
            <div key={cat.title} className="mb-12">
              <h2 className="heading-sm mb-6">{cat.title}</h2>
              <Accordion type="single" collapsible>
                {cat.items.map((item, i) => (
                  <AccordionItem key={i} value={`${cat.title}-${i}`}>
                    <AccordionTrigger>{item.q}</AccordionTrigger>
                    <AccordionContent><p className="text-muted-foreground">{item.a}</p></AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
