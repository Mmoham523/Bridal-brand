import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', orderNumber: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as any).toString(),
      });

      if (response.ok) {
        toast({ 
          title: 'Message sent!', 
          description: "We'll respond within 24-48 hours.",
          variant: 'default'
        });
        setForm({ name: '', email: '', orderNumber: '', message: '' });
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to send message. Please try again or email us directly.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="bg-background py-12 md:py-16">
        <div className="section-container text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="heading-xl mb-3">Contact Us</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="body-lg max-w-2xl mx-auto mb-6">We'd love to hear from you. Get in touch with any questions.</motion.p>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="section-container max-w-2xl">
          <div className="bg-card p-8 md:p-12 rounded-lg shadow-card mb-12">
            <form 
              name="contact" 
              method="POST" 
              data-netlify="true" 
              data-netlify-honeypot="bot-field"
              onSubmit={handleSubmit} 
              className="space-y-6"
            >
              {/* Hidden Netlify fields */}
              <input type="hidden" name="form-name" value="contact" />
              <input type="hidden" name="bot-field" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">Name *</label>
                  <Input 
                    id="name"
                    name="name"
                    value={form.name} 
                    onChange={(e) => setForm({ ...form, name: e.target.value })} 
                    required 
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">Email *</label>
                  <Input 
                    id="email"
                    name="email"
                    type="email" 
                    value={form.email} 
                    onChange={(e) => setForm({ ...form, email: e.target.value })} 
                    required 
                  />
                </div>
              </div>
              <div>
                <label htmlFor="orderNumber" className="block text-sm font-medium mb-2">Order Number (optional)</label>
                <Input 
                  id="orderNumber"
                  name="orderNumber"
                  value={form.orderNumber} 
                  onChange={(e) => setForm({ ...form, orderNumber: e.target.value })} 
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">Message *</label>
                <Textarea 
                  id="message"
                  name="message"
                  rows={5} 
                  value={form.message} 
                  onChange={(e) => setForm({ ...form, message: e.target.value })} 
                  required 
                />
              </div>
              <Button 
                type="submit" 
                variant="hero" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>

          <div className="text-center">
            <p className="mb-2">hiyambridal@gmail.com</p>
            <p className="text-sm text-muted-foreground">We typically respond within 24-48 hours.</p>
          </div>
        </div>
      </section>
    </>
  );
}
