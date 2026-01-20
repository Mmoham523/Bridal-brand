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
            {(() => {
              const content = message.content;
              const parts: (string | JSX.Element)[] = [];
              let lastIndex = 0;
              
              // Match markdown-style links: [text](/path) - more specific regex
              const markdownLinkRegex = /\[([^\]]+)\]\((\/[a-zA-Z0-9-]+)\)/g;
              let match;
              
              while ((match = markdownLinkRegex.exec(content)) !== null) {
                // Add text before the link
                if (match.index > lastIndex) {
                  const beforeText = content.substring(lastIndex, match.index);
                  if (beforeText) {
                    parts.push(beforeText);
                  }
                }
                
                // Add the link
                const linkText = match[1];
                const linkPath = match[2];
                parts.push(
                  <Link
                    key={`link-${match.index}`}
                    to={linkPath}
                    className="text-primary hover:text-primary-hover font-medium"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = linkPath;
                    }}
                  >
                    {linkText}
                  </Link>
                );
                
                lastIndex = markdownLinkRegex.lastIndex;
              }
              
              // Add remaining text after the last link
              if (lastIndex < content.length) {
                const remainingText = content.substring(lastIndex);
                if (remainingText) {
                  // Check if there are plain path links in remaining text
                  const plainPathRegex = /(\/[a-zA-Z0-9-]+)/g;
                  let pathMatch;
                  let textLastIndex = 0;
                  const textParts: (string | JSX.Element)[] = [];
                  
                  while ((pathMatch = plainPathRegex.exec(remainingText)) !== null) {
                    // Add text before the path
                    if (pathMatch.index > textLastIndex) {
                      textParts.push(remainingText.substring(textLastIndex, pathMatch.index));
                    }
                    
                    // Add the link
                    const linkPath = pathMatch[1];
                    const linkTexts: { [key: string]: string } = {
                      '/consultation': 'Book here',
                      '/contact': 'Contact page',
                      '/shop': 'Shop page',
                      '/gallery': 'Gallery page',
                    };
                    const linkText = linkTexts[linkPath] || linkPath;
                    
                    textParts.push(
                      <Link
                        key={`path-${pathMatch.index}`}
                        to={linkPath}
                        className="text-primary hover:text-primary-hover font-medium"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = linkPath;
                        }}
                      >
                        {linkText}
                      </Link>
                    );
                    
                    textLastIndex = plainPathRegex.lastIndex;
                  }
                  
                  // Add remaining text
                  if (textLastIndex < remainingText.length) {
                    textParts.push(remainingText.substring(textLastIndex));
                  }
                  
                  if (textParts.length > 0) {
                    parts.push(...textParts);
                  } else {
                    parts.push(remainingText);
                  }
                }
              }
              
              // If no links were found at all, return the original content
              if (parts.length === 0) {
                return content;
              }
              
              return parts;
            })()}
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
