import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Video, MapPin, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const consultationTypes = [
  {
    id: 'in-person',
    title: 'In-Person Bridal Sizing',
    icon: MapPin,
    duration: '90 minutes',
    description: 'Visit our boutique for a comprehensive fitting experience with our expert stylists.',
  },
  {
    id: 'virtual',
    title: 'Virtual Sizing Consultation',
    icon: Video,
    duration: '45 minutes',
    description: 'Connect with our team from the comfort of your home via video call.',
  },
];

const faqItems = [
  {
    question: 'What happens if I need to reschedule?',
    answer: 'We understand plans change! You can reschedule your appointment up to 24 hours before your booking at no extra charge. Simply contact us via email or phone.',
  },
  {
    question: 'What should I bring to my appointment?',
    answer: 'Please bring any inspiration images, your wedding shoes (or similar heel height), and any undergarments you plan to wear. If you have specific style preferences or measurements, bring those too!',
  },
  {
    question: 'Can I bring guests?',
    answer: 'Absolutely! You are welcome to bring guests whose opinions you value. Our boutique has comfortable seating for your party.',
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Consultation() {
  const formRef = useRef<HTMLDivElement>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    weddingDate: '',
    styleLink: '',
    notes: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const ACUITY_URLS = {
    'in-person': 'https://app.acuityscheduling.com/schedule.php?owner=37996403&appointmentType=87576849',
    'virtual': 'https://app.acuityscheduling.com/schedule.php?owner=37996403&appointmentType=87844286',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedType) {
      toast({
        title: "Please select a consultation type",
        description: "Choose between in-person or virtual consultation.",
        variant: "destructive",
      });
      return;
    }

    // Split name into firstName and lastName
    const nameParts = formData.name.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Build Acuity URL with query parameters
    const baseUrl = ACUITY_URLS[selectedType as keyof typeof ACUITY_URLS];
    const params = new URLSearchParams();
    
    // Add pre-fill parameters
    if (firstName) params.append('firstName', firstName);
    if (lastName) params.append('lastName', lastName);
    if (formData.email) params.append('email', formData.email);
    if (formData.phone) params.append('phone', formData.phone);

    // Construct final URL with query parameters
    const separator = baseUrl.includes('?') ? '&' : '?';
    const acuityUrl = `${baseUrl}${separator}${params.toString()}`;

    // Redirect to Acuity Scheduling with pre-filled data
    window.open(acuityUrl, '_blank');
    
    toast({
      title: "Redirecting to booking...",
      description: "You'll be taken to our scheduling system to complete your booking.",
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      weddingDate: '',
      styleLink: '',
      notes: '',
    });
    setSelectedType(null);
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-secondary/30 py-12 md:py-16">
        <div className="section-container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="heading-xl mb-3"
          >
            Book Your Consultation
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="body-lg max-w-2xl mx-auto mb-6"
          >
            Begin your bridal journey with a personalised fitting experience tailored just for you.
          </motion.p>
        </div>
      </section>

      {/* Consultation Types */}
      <section className="py-8 md:py-12">
        <div className="section-container">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="heading-md text-center mb-12"
          >
            Choose Your Experience
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            {consultationTypes.map((type) => (
              <motion.button
                key={type.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                onClick={() => {
                  setSelectedType(type.id);
                  // Scroll to form after a brief delay to allow state update
                  setTimeout(() => {
                    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 100);
                }}
                className={`text-left p-8 rounded-lg border-2 transition-all duration-300 hover-lift ${
                  selectedType === type.id
                    ? 'border-primary bg-secondary shadow-card'
                    : 'border-border bg-card'
                }`}
              >
                <type.icon className="h-8 w-8 text-foreground mb-4" />
                <h3 className="heading-sm mb-2 text-foreground">{type.title}</h3>
                <div className="flex items-center gap-4 text-sm text-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {type.duration}
                  </span>
                </div>
                <p className="body-md text-sm text-foreground">{type.description}</p>
              </motion.button>
            ))}
          </div>

          {/* Booking Form */}
          <motion.div
            ref={formRef}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-card p-8 md:p-12 rounded-lg shadow-card">
              <h3 className="heading-md mb-6">Your Details</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Wedding Date *</label>
                    <Input
                      type="date"
                      name="weddingDate"
                      value={formData.weddingDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Style Inspiration Link</label>
                  <Input
                    type="url"
                    name="styleLink"
                    value={formData.styleLink}
                    onChange={handleInputChange}
                    placeholder="Pinterest board or website URL"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Additional Notes</label>
                  <Textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Tell us about your dream dress, any specific requirements, or questions..."
                  />
                </div>

                <Button type="submit" variant="hero" className="w-full">
                  Request Booking
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </form>
            </div>

            {/* What to Bring */}
            <div className="mt-12 p-8 bg-secondary/30 rounded-lg">
              <h4 className="heading-sm mb-4">What to Bring</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Wedding shoes or heels of similar height
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Appropriate undergarments (strapless bra, shapewear if desired)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Inspiration photos or Pinterest boards
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  Trusted friends or family members (no limit)
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-8 md:py-12 bg-secondary/30">
        <div className="section-container">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="heading-md text-center mb-12"
          >
            Consultation FAQs
          </motion.h2>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-2xl mx-auto"
          >
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>
    </>
  );
}
