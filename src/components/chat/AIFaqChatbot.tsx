import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Minimize2, Send, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { Message as MessageType } from '@/types/chat';
import faqsData from '@/data/faqs.json';

interface AIFaqChatbotProps {
  companyName?: string;
  position?: 'bottom-right' | 'bottom-left';
}

const FAQ_CONTENT = `
Hiyam Bridal is a bridal boutique specializing in elegant wedding diracs (traditional bridal dresses).

SIZING & FIT:
- We recommend booking a consultation for accurate measurements
- Our sizes follow UK bridal standards
- All diracs can be altered
- Alterations should be done 4-6 weeks before your wedding

ORDERS & SHIPPING:
- Standard delivery: 5-7 business days
- Custom orders: 12-16 weeks
- We ship worldwide
- Contact us for international shipping rates

RETURNS & EXCHANGES:
- Unworn items can be returned within 14 days
- Custom orders are non-refundable
- Exchanges available within 14 days for unworn items in original packaging

CONSULTATIONS:
- We offer both in-person and virtual consultations
- Book through our consultation page
- Bring wedding shoes, appropriate undergarments, inspiration photos, and trusted friends/family

CONTACT:
- Visit our Contact page for inquiries
- We respond within 24-48 hours
`;

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      // Focus input when chat opens
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, isOpen, isMinimized]);

  // Search through FAQs to find the best match
  const findFAQAnswer = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    const queryWords = lowerQuery.split(/\s+/).filter(w => w.length > 2);
    
    // Collect all questions and answers with scores
    const allFAQs: Array<{ question: string; answer: string; score: number }> = [];
    
    // The JSON structure is a flat array: faqsData.faqs is an array of FAQ objects
    faqsData.faqs.forEach(faq => {
      const lowerQuestion = faq.question.toLowerCase();
      const lowerAnswer = faq.answer.toLowerCase();
      const lowerCategory = faq.category.toLowerCase();
      
      // Calculate relevance score
      let score = 0;
      
      // Exact question match gets highest score
      if (lowerQuestion === lowerQuery) {
        score = 100;
      } else if (lowerQuestion.includes(lowerQuery) || lowerQuery.includes(lowerQuestion.split('?')[0])) {
        score += 50;
      } else {
        // Check for keyword matches in question
        queryWords.forEach(word => {
          if (lowerQuestion.includes(word)) {
            score += 10;
          }
          if (lowerAnswer.includes(word)) {
            score += 5;
          }
          if (lowerCategory.includes(word)) {
            score += 3;
          }
        });
        
        // Special keyword matching for common topics
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
    
    // Sort by score and return best match
    allFAQs.sort((a, b) => b.score - a.score);
    
    if (allFAQs.length > 0 && allFAQs[0].score > 5) {
      return allFAQs[0].answer;
    }
    
    // If no match found, provide helpful default response
    return "I'm not sure I have the exact answer to that question. Here are some topics I can help with:\n\n• Sizing and fit\n• Orders and shipping\n• Returns and exchanges\n• Consultations\n• General inquiries\n\nFeel free to ask me about any of these, or contact us directly through our Contact page for more specific questions.";
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

    // Simulate API delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
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
    'How do I book a consultation?',
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
                    <ChatMessage key={message.id} message={message} />
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
                      placeholder="Type your question..."
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
