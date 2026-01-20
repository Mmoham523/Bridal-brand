import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Minimize2, Send, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { Message as MessageType } from '@/types/chat';
import { BookingState, BookingInfo, TimeSlot } from '@/types/booking';
import faqsData from '@/data/faqs.json';
import { mockFetchAvailability, mockCreateBooking } from '@/api/mock-acuity';

interface AIFaqChatbotProps {
  companyName?: string;
  position?: 'bottom-right' | 'bottom-left';
}

const ACUITY_APPOINTMENT_TYPES = {
  'in-person': 87576849,
  'virtual': 87844286,
};

const INITIAL_GREETING: MessageType = {
  id: 'greeting',
  role: 'assistant',
  content: "Hello! I'm here to help answer your questions about Hiyam Bridal. What would you like to know?",
  timestamp: new Date(),
};

export function AIFaqChatbot({ 
  companyName = 'Hiyam Bridal',
  position = 'bottom-right'
}: AIFaqChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([INITIAL_GREETING]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingState, setBookingState] = useState<BookingState>(null);
  const [bookingInfo, setBookingInfo] = useState<BookingInfo>({});
  const [availableSlots, setAvailableSlots] = useState<Array<{ date: string; slots: Array<{ time: string; displayTime: string }> }>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, isOpen, isMinimized]);

  // Detect booking intent
  const detectBookingIntent = (query: string): boolean => {
    const lowerQuery = query.toLowerCase();
    const bookingKeywords = [
      'book', 'booking', 'appointment', 'consultation', 'schedule',
      'available', 'availability', 'this week', 'next week', 'when can',
      'i want to book', 'i need to book', 'can i book', 'book me'
    ];
    return bookingKeywords.some(keyword => lowerQuery.includes(keyword));
  };

  // Detect consultation type selection
  const detectConsultationType = (query: string): 'in-person' | 'virtual' | null => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('virtual') || lowerQuery.includes('online') || lowerQuery.includes('video') || lowerQuery.includes('remote')) {
      return 'virtual';
    }
    
    if (lowerQuery.includes('in-person') || lowerQuery.includes('in person') || lowerQuery.includes('in store') || lowerQuery.includes('boutique') || lowerQuery.includes('store')) {
      return 'in-person';
    }
    
    return null;
  };

  // Parse natural language for dates
  const parseDate = (query: string): { startDate: string; endDate: string } => {
    const lowerQuery = query.toLowerCase();
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Default: next 7 days
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() + 1); // Start from tomorrow
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);

    if (lowerQuery.includes('this week')) {
      const dayOfWeek = today.getDay();
      const daysUntilMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek) % 7 || 7;
      const monday = new Date(today);
      monday.setDate(today.getDate() + daysUntilMonday);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      return {
        startDate: monday.toISOString().split('T')[0],
        endDate: sunday.toISOString().split('T')[0],
      };
    }

    if (lowerQuery.includes('next week')) {
      const dayOfWeek = today.getDay();
      const daysUntilNextMonday = dayOfWeek === 0 ? 8 : (15 - dayOfWeek) % 7 || 7;
      const nextMonday = new Date(today);
      nextMonday.setDate(today.getDate() + daysUntilNextMonday);
      const nextSunday = new Date(nextMonday);
      nextSunday.setDate(nextMonday.getDate() + 6);
      return {
        startDate: nextMonday.toISOString().split('T')[0],
        endDate: nextSunday.toISOString().split('T')[0],
      };
    }

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };
  };

  // Extract name and email from natural language
  const extractBookingInfo = (query: string): Partial<BookingInfo> => {
    const info: Partial<BookingInfo> = {};
    
    // Extract email first (remove it from query for name extraction)
    // Improved email regex to catch more patterns
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi;
    const emailMatch = query.match(emailRegex);
    if (emailMatch && emailMatch.length > 0) {
      info.email = emailMatch[0].toLowerCase().trim();
      console.log('📧 Extracted email:', info.email);
      // Remove email from query to help with name extraction
      query = query.replace(emailRegex, '').trim();
    }

    // Extract name - improved patterns to handle various formats
    // Remove common phrases first
    let nameText = query
      .replace(/^(i'?m|i am|my name is|this is|it'?s|name:|full name:|my name|name)\s*/i, '')
      .trim();

    // Split into words and filter out empty strings
    const words = nameText.split(/\s+/).filter(w => w.length > 0 && !w.match(/^[.,;:!?]+$/));
    
    if (words.length === 0) {
      console.log('📝 No name text found');
      return info; // No text to extract from
    }

    console.log('📝 Processing name words:', words);

    // Pattern 1: Two or more words where first two start with capital letters
    // This handles "Mustafa Mohamed" perfectly
    if (words.length >= 2) {
      const firstWord = words[0];
      const secondWord = words[1];
      
      // Check if both words start with capital letters (name pattern)
      // Allow for names that might be all caps or mixed case
      const isCapitalized = (word: string) => {
        return /^[A-Z]/.test(word) && /^[A-Za-z]+$/.test(word);
      };
      
      if (isCapitalized(firstWord) && isCapitalized(secondWord)) {
        info.firstName = firstWord;
        info.lastName = words.slice(1).join(' ');
        console.log('✅ Extracted full name:', info.firstName, info.lastName);
        return info;
      }
    }

    // Pattern 2: Single word that looks like a name (capitalized, reasonable length)
    if (words.length === 1) {
      const word = words[0];
      if (/^[A-Z][a-z]+$/.test(word) && word.length >= 2) {
        info.firstName = word;
        console.log('✅ Extracted first name:', info.firstName);
        // Last name will be asked for separately
      }
    }

    return info;
  };

  // Fetch availability from Acuity
  const fetchAvailability = async (appointmentTypeId: number, startDate: string, endDate: string) => {
    try {
      // Check if we're in development mode (no Netlify functions available)
      const isLocalDev = import.meta.env.DEV && !window.location.hostname.includes('netlify');
      
      if (isLocalDev) {
        // Use mock API for local development
        console.log('🔧 Using mock API for local development');
        const data = await mockFetchAvailability(appointmentTypeId, startDate, endDate);
        return data.slots || [];
      }

      // Production: Use Netlify functions
      const params = new URLSearchParams({
        appointmentTypeId: appointmentTypeId.toString(),
        date: startDate,
        endDate: endDate,
      });

      const response = await fetch(`/.netlify/functions/acuity-availability?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.slots || [];
    } catch (error) {
      console.error('Error fetching availability:', error);
      throw error;
    }
  };

  // Create booking in Acuity
  const createBooking = async (
    appointmentTypeId: number,
    datetime: string,
    firstName: string,
    lastName: string,
    email: string,
    phone?: string
  ) => {
    try {
      // Check if we're in development mode (no Netlify functions available)
      const isLocalDev = import.meta.env.DEV && !window.location.hostname.includes('netlify');
      
      if (isLocalDev) {
        // Use mock API for local development
        console.log('🔧 Using mock API for local development');
        return await mockCreateBooking(appointmentTypeId, datetime, firstName, lastName, email, phone);
      }

      // Production: Use Netlify functions
      const response = await fetch('/.netlify/functions/acuity-book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointmentTypeId,
          datetime,
          firstName,
          lastName,
          email,
          phone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Booking failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  };

  // Search through FAQs to find the best match
  const findFAQAnswer = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    const queryWords = lowerQuery.split(/\s+/).filter(w => w.length > 2);
    
    const allFAQs: Array<{ question: string; answer: string; score: number }> = [];
    
    faqsData.faqs.forEach(faq => {
      const lowerQuestion = faq.question.toLowerCase();
      const lowerAnswer = faq.answer.toLowerCase();
      const lowerCategory = faq.category.toLowerCase();
      
      let score = 0;
      
      if (lowerQuestion === lowerQuery) {
        score = 100;
      } else if (lowerQuestion.includes(lowerQuery) || lowerQuery.includes(lowerQuestion.split('?')[0])) {
        score += 50;
      } else {
        queryWords.forEach(word => {
          if (lowerQuestion.includes(word)) score += 10;
          if (lowerAnswer.includes(word)) score += 5;
          if (lowerCategory.includes(word)) score += 3;
        });
        
        const keywords: { [key: string]: string[] } = {
          'delivery': ['delivery', 'shipping', 'ship', 'deliver', 'arrive', 'when', 'how long'],
          'size': ['size', 'sizing', 'fit', 'measurement', 'measurements'],
          'return': ['return', 'refund', 'exchange'],
          'consultation': ['consultation', 'book', 'booking', 'appointment', 'visit'],
          'contact': ['contact', 'email', 'phone', 'reach', 'location', 'where'],
          'price': ['price', 'cost', 'pricing', 'how much', 'expensive'],
          'alter': ['alter', 'alteration', 'alterations', 'adjust', 'modify'],
        };
        
        Object.entries(keywords).forEach(([category, terms]) => {
          if (terms.some(term => lowerQuery.includes(term))) {
            if (lowerCategory.includes(category) || lowerQuestion.includes(category)) {
              score += 15;
            }
          }
        });
      }
      
      if (score > 0) {
        allFAQs.push({ question: faq.question, answer: faq.answer, score });
      }
    });
    
    allFAQs.sort((a, b) => b.score - a.score);
    
    if (allFAQs.length > 0 && allFAQs[0].score > 5) {
      return allFAQs[0].answer;
    }
    
    return "I'm not sure I have the exact answer to that question. Here are some topics I can help with:\n\n• Sizing and fit\n• Orders and shipping\n• Returns and exchanges\n• Consultations\n• General inquiries\n\nFeel free to ask me about any of these, or contact us directly through our Contact page for more specific questions.";
  };

  // Handle consultation type selection
  const handleConsultationTypeSelect = async (type: 'in-person' | 'virtual') => {
    setBookingInfo(prev => ({ ...prev, appointmentType: type }));
    setBookingState('checking');
    
    // Default to next 7 days if no date specified
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() + 1); // Start from tomorrow
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);
    
    const appointmentTypeId = ACUITY_APPOINTMENT_TYPES[type];
    const typeName = type === 'virtual' ? 'virtual' : 'in-person';

    const assistantMessage: MessageType = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `Perfect! I'll check our ${typeName} consultation availability for you. One moment please...`,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);

    try {
      const slots = await fetchAvailability(
        appointmentTypeId, 
        startDate.toISOString().split('T')[0], 
        endDate.toISOString().split('T')[0]
      );
      setAvailableSlots(slots);

      if (slots.length === 0) {
        const noSlotsMessage: MessageType = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `I'm sorry, but I don't see any available ${typeName} consultation slots for the next week. Would you like me to check a different date range or try the other consultation type?`,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, noSlotsMessage]);
        setBookingState(null);
      } else {
        const slotsMessage: MessageType = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Here are the available ${typeName} consultation slots. Please select one:`,
          type: 'slots',
          bookingData: { slots },
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, slotsMessage]);
        setBookingState('selecting');
      }
    } catch (error: any) {
      const errorMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble checking availability right now. Please try again in a moment or contact us directly.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      setBookingState(null);
    }
  };

  // Handle slot selection
  const handleSlotSelect = async (slot: { time: string; displayTime: string }) => {
    const slotAsTimeSlot = slot as TimeSlot;
    
    // Update booking info with selected slot
    setBookingInfo(prev => {
      const updated = { ...prev, selectedSlot: slotAsTimeSlot };
      
      // Check what we need after updating
      setBookingState('collecting');
      
      // Always ask for name first, then email
      if (!updated.firstName || !updated.lastName) {
        setTimeout(() => {
          const assistantMessage: MessageType = {
            id: Date.now().toString(),
            role: 'assistant',
            content: `Great choice! I've selected ${slot.displayTime} for you. To complete the booking, I need your full name please.`,
            timestamp: new Date(),
          };
          setMessages(messageList => [...messageList, assistantMessage]);
        }, 100);
      } else if (!updated.email) {
        setTimeout(() => {
          const assistantMessage: MessageType = {
            id: Date.now().toString(),
            role: 'assistant',
            content: `Thank you, ${updated.firstName}! Now I need your email address to complete the booking.`,
            timestamp: new Date(),
          };
          setMessages(messageList => [...messageList, assistantMessage]);
        }, 100);
      } else {
        // We have everything, proceed to booking
        setTimeout(() => {
          confirmBooking(slot, updated);
        }, 100);
      }
      
      return updated;
    });
  };

  // Confirm and create booking
  const confirmBooking = async (slot: { time: string; displayTime: string }, info?: BookingInfo) => {
    // Use provided info or fall back to bookingInfo state
    const bookingData = info || bookingInfo;
    
    if (!bookingData.firstName || !bookingData.lastName || !bookingData.email) {
      console.error('Missing booking data:', bookingData);
      const errorMessage: MessageType = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I'm missing some information. Please provide your full name and email address.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    setIsLoading(true);
    setBookingState('confirming');

    try {
      const appointmentTypeId = bookingData.appointmentType === 'virtual' 
        ? ACUITY_APPOINTMENT_TYPES.virtual 
        : ACUITY_APPOINTMENT_TYPES['in-person'];

      const result = await createBooking(
        appointmentTypeId,
        slot.time,
        bookingData.firstName,
        bookingData.lastName,
        bookingData.email,
        bookingData.phone
      );

      const successMessage: MessageType = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Perfect! Your consultation is booked for ${slot.displayTime}. You'll receive a confirmation email at ${bookingData.email} shortly. We're looking forward to seeing you!`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, successMessage]);
      setBookingState('completed');
      setBookingInfo({});
      setAvailableSlots([]);
    } catch (error: any) {
      const errorMessage: MessageType = {
        id: Date.now().toString(),
        role: 'assistant',
        content: error.message || 'I encountered an issue booking your appointment. Please try again or contact us directly.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      setBookingState('selecting');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: MessageType = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      // Check if we're in booking flow
      if (bookingState === 'collecting') {
        // Extract booking info from message
        const extracted = extractBookingInfo(content);
        
        // Preserve selectedSlot when updating
        const updatedInfo: BookingInfo = { 
          ...bookingInfo, 
          ...extracted,
          selectedSlot: bookingInfo.selectedSlot || extracted.selectedSlot
        };
        
        // Update state immediately
        setBookingInfo(updatedInfo);

        // Sequential flow: name first, then email
        const hasName = updatedInfo.firstName && updatedInfo.lastName;
        const hasEmail = updatedInfo.email;
        const selectedSlot = updatedInfo.selectedSlot;

        // Debug logging
        console.log('🔍 Booking state check:', { 
          hasName, 
          hasEmail, 
          hasSlot: !!selectedSlot,
          firstName: updatedInfo.firstName,
          lastName: updatedInfo.lastName,
          email: updatedInfo.email,
          slotTime: selectedSlot?.time
        });

        // If we have both name and email, proceed to booking
        if (hasName && hasEmail) {
          if (selectedSlot) {
            console.log('✅ All info collected, proceeding to booking...', {
              slot: selectedSlot,
              info: updatedInfo
            });
            // Use the updated info for booking
            try {
              await confirmBooking(selectedSlot, updatedInfo);
            } catch (error) {
              console.error('❌ Booking error:', error);
              const errorMessage: MessageType = {
                id: Date.now().toString(),
                role: 'assistant',
                content: 'I encountered an error while booking. Please try again or contact us directly.',
                timestamp: new Date(),
              };
              setMessages(prev => [...prev, errorMessage]);
            }
            setIsLoading(false);
            return;
          } else {
            console.log('⚠️ Missing selected slot');
            // Slot was lost somehow, ask user to select again
            const assistantMessage: MessageType = {
              id: Date.now().toString(),
              role: 'assistant',
              content: "I have your information, but I need you to select a time slot again. Please choose from the available slots above.",
              timestamp: new Date(),
            };
            setMessages(prev => [...prev, assistantMessage]);
            setIsLoading(false);
            return;
          }
        }

        // If we don't have name yet, ask for it
        if (!hasName) {
          const assistantMessage: MessageType = {
            id: Date.now().toString(),
            role: 'assistant',
            content: "I still need your full name to complete the booking. Please provide your first and last name.",
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, assistantMessage]);
          setIsLoading(false);
          return;
        }

        // If we have name but not email, ask for email
        if (hasName && !hasEmail) {
          const assistantMessage: MessageType = {
            id: Date.now().toString(),
            role: 'assistant',
            content: `Thank you, ${updatedInfo.firstName}! Now I need your email address to complete the booking.`,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, assistantMessage]);
          setIsLoading(false);
          return;
        }

        // Fallback (shouldn't reach here)
        const assistantMessage: MessageType = {
          id: Date.now().toString(),
          role: 'assistant',
          content: "I'm having trouble processing your information. Could you please provide your full name and email address?",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
        return;
      }

      // Check if we're selecting consultation type
      if (bookingState === 'selecting-type') {
        const detectedType = detectConsultationType(content);
        
        if (detectedType) {
          setBookingInfo(prev => ({ ...prev, appointmentType: detectedType }));
          setBookingState('checking');
          
          const { startDate, endDate } = parseDate(content);
          const appointmentTypeId = ACUITY_APPOINTMENT_TYPES[detectedType];
          const typeName = detectedType === 'virtual' ? 'virtual' : 'in-person';

          const assistantMessage: MessageType = {
            id: Date.now().toString(),
            role: 'assistant',
            content: `Perfect! I'll check our ${typeName} consultation availability for you. One moment please...`,
            timestamp: new Date(),
          };

          setMessages(prev => [...prev, assistantMessage]);

          try {
            const slots = await fetchAvailability(appointmentTypeId, startDate, endDate);
            setAvailableSlots(slots);

            if (slots.length === 0) {
              const noSlotsMessage: MessageType = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `I'm sorry, but I don't see any available ${typeName} consultation slots for that time period. Would you like me to check a different date range or try the other consultation type?`,
                timestamp: new Date(),
              };
              setMessages(prev => [...prev, noSlotsMessage]);
              setBookingState(null);
            } else {
              const slotsMessage: MessageType = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `Here are the available ${typeName} consultation slots. Please select one:`,
                type: 'slots',
                bookingData: { slots },
                timestamp: new Date(),
              };
              setMessages(prev => [...prev, slotsMessage]);
              setBookingState('selecting');
            }
          } catch (error: any) {
            const errorMessage: MessageType = {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: "I'm having trouble checking availability right now. Please try again in a moment or contact us directly.",
              timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
            setBookingState(null);
          }

          setIsLoading(false);
          return;
        } else {
          // User didn't select a clear type, ask again
          const assistantMessage: MessageType = {
            id: Date.now().toString(),
            role: 'assistant',
            content: "Please select whether you'd like an in-person or virtual consultation. You can click the buttons above or type 'in-person' or 'virtual'.",
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, assistantMessage]);
          setIsLoading(false);
          return;
        }
      }

      // Check for booking intent
      if (detectBookingIntent(content)) {
        setBookingState('selecting-type');

        const assistantMessage: MessageType = {
          id: Date.now().toString(),
          role: 'assistant',
          content: "I'd be happy to help you book a consultation! First, please let me know which type you prefer:",
          type: 'consultation-type',
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
        return;
      }

      // Regular FAQ handling
      const answer = findFAQAnswer(content.trim());

      const assistantMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: answer,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setError('I\'m having trouble processing your question. Please try again.');
      
      const errorMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I\'m experiencing technical difficulties. Please contact us at our Contact page or try again in a moment.',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const quickQuestions = [
    'How do I know my size?',
    'How long does delivery take?',
    'Can diracs be altered?',
    'I want to book a consultation',
  ];

  const positionClasses = position === 'bottom-right' 
    ? 'bottom-4 right-4 md:bottom-6 md:right-6' 
    : 'bottom-4 left-4 md:bottom-6 md:left-6';

  return (
    <>
      {/* Chat Bubble Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className={`fixed ${positionClasses} z-[9999] w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary-hover transition-colors flex items-center justify-center`}
            aria-label="Open chat"
          >
            <MessageSquare className="w-6 h-6 md:w-7 md:h-7" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              height: isMinimized ? 'auto' : '500px'
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`fixed ${positionClasses} z-[9999] w-[calc(100vw-2rem)] md:w-[350px] ${
              isMinimized ? 'h-auto' : 'h-[500px] md:h-[500px]'
            } flex flex-col bg-card border border-border rounded-lg shadow-2xl overflow-hidden`}
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <span className="font-medium text-sm md:text-base">{companyName} Assistant</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-primary-hover rounded transition-colors"
                  aria-label={isMinimized ? 'Expand chat' : 'Minimize chat'}
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsMinimized(false);
                  }}
                  className="p-1 hover:bg-primary-hover rounded transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 bg-background">
                  {messages.map((message) => (
                    <ChatMessage 
                      key={message.id} 
                      message={message}
                      onSlotSelect={handleSlotSelect}
                      onConsultationTypeSelect={handleConsultationTypeSelect}
                    />
                  ))}
                  {isLoading && <TypingIndicator />}
                  {error && (
                    <div className="text-sm text-destructive bg-destructive/10 p-2 rounded mb-2">
                      {error}
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Questions */}
                {messages.length === 1 && (
                  <div className="px-4 py-2 bg-muted/50 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
                    <div className="flex flex-wrap gap-2">
                      {quickQuestions.map((question, idx) => (
                        <button
                          key={idx}
                          onClick={() => sendMessage(question)}
                          className="text-xs px-3 py-1 bg-background border border-border rounded-full hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                          disabled={isLoading}
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Area */}
                <form onSubmit={handleSubmit} className="p-4 bg-card border-t border-border">
                  <div className="flex gap-2">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={bookingState === 'collecting' ? "Enter your name and email..." : "Type your question..."}
                      disabled={isLoading}
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit(e);
                        }
                      }}
                    />
                    <Button
                      type="submit"
                      disabled={!inputValue.trim() || isLoading}
                      className="bg-primary text-primary-foreground hover:bg-primary-hover"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    FAQ Assistant
                  </p>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
