import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', orderNumber: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Message sent!', description: "We'll respond within 24-48 hours." });
    setForm({ name: '', email: '', orderNumber: '', message: '' });
  };

  return (
    <>
      <section className="bg-secondary/30 py-16 md:py-24">
        <div className="section-container text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="heading-xl mb-4">Contact Us</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="body-lg max-w-2xl mx-auto">We'd love to hear from you. Get in touch with any questions.</motion.p>
        </div>
      </section>

      <section className="section-spacing">
        <div className="section-container max-w-2xl">
          <div className="bg-card p-8 md:p-12 rounded-lg shadow-card mb-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-2">Name *</label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
                <div><label className="block text-sm font-medium mb-2">Email *</label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
              </div>
              <div><label className="block text-sm font-medium mb-2">Order Number (optional)</label><Input value={form.orderNumber} onChange={(e) => setForm({ ...form, orderNumber: e.target.value })} /></div>
              <div><label className="block text-sm font-medium mb-2">Message *</label><Textarea rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required /></div>
              <Button type="submit" variant="hero" className="w-full">Send Message</Button>
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
