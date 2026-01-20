import { Handler } from '@netlify/functions';

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
}

// FAQ data for testing (no API key needed)
const FAQS: FAQ[] = [
  {
    id: "sizing-1",
    category: "Sizing & Fit",
    question: "How do I know my size?",
    answer: "We recommend booking a consultation for accurate measurements. Our sizes follow UK bridal standards. Our expert team will take your measurements and help you find the perfect fit."
  },
  {
    id: "sizing-2",
    category: "Sizing & Fit",
    question: "Can diracs be altered?",
    answer: "Yes, all our diracs can be altered. We recommend having alterations done 4-6 weeks before your wedding to ensure the perfect fit. Our skilled tailors will work with you to make any necessary adjustments."
  },
  {
    id: "shipping-1",
    category: "Orders & Shipping",
    question: "How long does delivery take?",
    answer: "Standard delivery is 5-7 business days. Custom orders take 12-16 weeks from the time of order confirmation. We'll keep you updated throughout the process."
  },
  {
    id: "shipping-2",
    category: "Orders & Shipping",
    question: "Do you ship internationally?",
    answer: "Yes, we ship worldwide. Contact us for international shipping rates and delivery times. We'll ensure your dirac arrives safely and on time."
  },
  {
    id: "returns-1",
    category: "Returns & Exchanges",
    question: "What is your return policy?",
    answer: "Unworn items can be returned within 14 days of delivery in their original packaging. Custom orders are non-refundable as they are made specifically for you."
  },
  {
    id: "returns-2",
    category: "Returns & Exchanges",
    question: "Can I exchange my dirac?",
    answer: "Yes, exchanges are available within 14 days for unworn items in original packaging. Please contact us to arrange an exchange for a different size or style."
  },
  {
    id: "consultation-1",
    category: "Consultations",
    question: "How do I book a consultation?",
    answer: "You can book a consultation through our Consultation page. We offer both in-person and virtual consultations. Simply fill out the form and select your preferred consultation type."
  },
  {
    id: "consultation-2",
    category: "Consultations",
    question: "What should I bring to my consultation?",
    answer: "We recommend bringing: wedding shoes or heels of similar height, appropriate undergarments (strapless bra, shapewear if desired), inspiration photos or Pinterest boards, and trusted friends or family members (no limit)."
  },
  {
    id: "general-1",
    category: "General",
    question: "What are your business hours?",
    answer: "Our boutique hours vary. Please contact us through our Contact page or book a consultation to schedule a visit. We're here to help make your special day perfect."
  },
  {
    id: "general-2",
    category: "General",
    question: "Where are you located?",
    answer: "Please visit our Contact page for our location and contact details. We'd love to welcome you to our boutique or assist you virtually."
  },
  {
    id: "general-3",
    category: "General",
    question: "How can I contact you?",
    answer: "You can reach us through our Contact page. We respond to all inquiries within 24-48 hours. For urgent matters, please call us directly."
  },
  {
    id: "pricing-1",
    category: "Pricing",
    question: "What is the price range for your diracs?",
    answer: "Our diracs range in price depending on the style and customization. We offer both ready-to-wear and custom options. Please book a consultation to discuss pricing and find the perfect dirac within your budget."
  }
];

// Simple keyword matching function
function findBestMatch(userMessage: string, faqs: FAQ[]): FAQ | null {
  const lowerMessage = userMessage.toLowerCase();
  const words = lowerMessage.split(/\s+/).filter(w => w.length > 2);
  
  // Score each FAQ based on keyword matches
  const scored = faqs.map(faq => {
    const lowerQuestion = faq.question.toLowerCase();
    const lowerAnswer = faq.answer.toLowerCase();
    const lowerCategory = faq.category.toLowerCase();
    
    let score = 0;
    
    // Check for exact question matches (highest priority)
    if (lowerMessage.includes(lowerQuestion) || lowerQuestion.includes(lowerMessage)) {
      score += 100;
    }
    
    // Check for keyword matches in question
    words.forEach(word => {
      if (lowerQuestion.includes(word)) score += 10;
      if (lowerAnswer.includes(word)) score += 5;
      if (lowerCategory.includes(word)) score += 3;
    });
    
    // Special keyword matching
    const keywords: { [key: string]: string[] } = {
      'size': ['size', 'sizing', 'fit', 'measurement', 'measurements'],
      'delivery': ['delivery', 'shipping', 'ship', 'deliver', 'arrive', 'when'],
      'return': ['return', 'refund', 'exchange', 'exchange'],
      'consultation': ['consultation', 'book', 'booking', 'appointment', 'visit'],
      'contact': ['contact', 'email', 'phone', 'reach', 'location', 'where'],
      'price': ['price', 'cost', 'pricing', 'how much', 'expensive'],
      'alter': ['alter', 'alteration', 'alterations', 'adjust', 'modify'],
    };
    
    Object.entries(keywords).forEach(([category, terms]) => {
      if (terms.some(term => lowerMessage.includes(term))) {
        if (lowerCategory.includes(category) || lowerQuestion.includes(category)) {
          score += 15;
        }
      }
    });
    
    return { faq, score };
  });
  
  // Sort by score and return the best match
  scored.sort((a, b) => b.score - a.score);
  
  // Only return if score is above threshold
  return scored[0]?.score > 5 ? scored[0].faq : null;
}

function generateResponse(userMessage: string, matchedFaq: FAQ | null): string {
  if (matchedFaq) {
    return matchedFaq.answer;
  }
  
  // Fallback responses based on common questions
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return "Hello! I'm here to help answer your questions about Hiyam Bridal. What would you like to know?";
  }
  
  if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
    return "You're very welcome! If you have any other questions, feel free to ask. We're here to help make your special day perfect!";
  }
  
  return "I'm sorry, I couldn't find a specific answer to that question. Please visit our FAQs page or contact us directly through our Contact page for more detailed assistance. We're here to help!";
}

export const handler: Handler = async (event) => {
  // Handle CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { message } = JSON.parse(event.body || '{}');

    if (!message || typeof message !== 'string' || !message.trim()) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Message is required' }),
      };
    }

    // Use inlined FAQ data for testing (no API key needed)
    const matchedFaq = findBestMatch(message.trim(), FAQS);
    const response = generateResponse(message.trim(), matchedFaq);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        response: response,
      }),
    };
  } catch (error) {
    console.error('Function error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'An unexpected error occurred. Please try again later.',
      }),
    };
  }
};
