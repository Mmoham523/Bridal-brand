import { format } from 'date-fns';
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
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
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
