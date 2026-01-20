export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatWidgetProps {
  companyName?: string;
  primaryColor?: string;
  position?: 'bottom-right' | 'bottom-left';
}
