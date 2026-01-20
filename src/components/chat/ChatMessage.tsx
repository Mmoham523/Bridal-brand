import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Message } from '@/types/chat';
import { TimeSlotPicker } from './TimeSlotPicker';
import { ConsultationTypePicker } from './ConsultationTypePicker';
import { TimeSlot } from '@/types/booking';

interface ChatMessageProps {
  message: Message;
  onSlotSelect?: (slot: { time: string; displayTime: string }) => void;
  onConsultationTypeSelect?: (type: 'in-person' | 'virtual') => void;
}

export function ChatMessage({ message, onSlotSelect, onConsultationTypeSelect }: ChatMessageProps) {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-primary text-primary-foreground rounded-tr-sm'
            : 'bg-card border border-border rounded-tl-sm'
        }`}
      >
        {message.content && (
          <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content.split(/(\/[a-zA-Z0-9-]+)/g).map((part, index) => {
              // Check if part looks like a route path
              if (part.startsWith('/') && part.length > 1) {
                return (
                  <Link
                    key={index}
                    to={part}
                    className="text-primary underline hover:text-primary-hover font-medium"
                    onClick={() => {
                      // Close chat when navigating
                      if (window.location.pathname !== part) {
                        window.location.href = part;
                      }
                    }}
                  >
                    {part}
                  </Link>
                );
              }
              return <span key={index}>{part}</span>;
            })}
          </div>
        )}
        
        {message.type === 'consultation-type' && onConsultationTypeSelect && (
          <div className="mt-3">
            <ConsultationTypePicker onSelect={onConsultationTypeSelect} />
          </div>
        )}
        
        {message.type === 'slots' && message.bookingData?.slots && onSlotSelect && (
          <div className="mt-3">
            <TimeSlotPicker
              slots={message.bookingData.slots}
              selectedSlot={message.bookingData.selectedSlot as TimeSlot | undefined}
              onSelect={onSlotSelect}
            />
          </div>
        )}
        
        <span
          className={`text-xs mt-1 block ${
            isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
          }`}
        >
          {format(message.timestamp, 'HH:mm')}
        </span>
      </div>
    </div>
  );
}
