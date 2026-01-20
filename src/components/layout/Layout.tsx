import { ReactNode, useRef } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { AIFaqChatbot, AIFaqChatbotHandle } from '@/components/chat/AIFaqChatbot';
import { ChatbotWelcomeBanner } from '@/components/chat/ChatbotWelcomeBanner';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const chatbotRef = useRef<AIFaqChatbotHandle>(null);

  const handleOpenChat = () => {
    chatbotRef.current?.openChat();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <AIFaqChatbot 
        ref={chatbotRef}
        companyName="Hiyam Bridal" 
        position="bottom-right" 
      />
      <ChatbotWelcomeBanner 
        onOpenChat={handleOpenChat}
        position="bottom-right"
      />
    </div>
  );
}
