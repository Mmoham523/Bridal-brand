import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Instagram } from 'lucide-react';
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
            <p className="flex items-center justify-center gap-2 mb-2"><Mail className="h-4 w-4 text-primary" /> hiyambridal@gmail.com</p>
            <p className="text-sm text-muted-foreground mb-6">We typically respond within 24-48 hours.</p>
            <div className="flex justify-center gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-secondary rounded-full"><Instagram className="h-5 w-5" /></a>
              <a href="https://www.tiktok.com/@hiyam.bridal" target="_blank" rel="noopener noreferrer" className="p-3 bg-secondary rounded-full" aria-label="TikTok">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
