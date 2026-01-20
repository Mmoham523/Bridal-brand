export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'booking' | 'slots' | 'consultation-type';
  bookingData?: {
    slots?: Array<{ date: string; slots: Array<{ time: string; displayTime: string }> }>;
    selectedSlot?: { time: string; displayTime: string };
  };
}

export interface ChatWidgetProps {
  companyName?: string;
  primaryColor?: string;
  position?: 'bottom-right' | 'bottom-left';
}
