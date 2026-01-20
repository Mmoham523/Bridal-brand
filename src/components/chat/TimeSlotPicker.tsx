import { TimeSlot } from '@/types/booking';
import { Button } from '@/components/ui/button';
import { Calendar, Clock } from 'lucide-react';

interface TimeSlotPickerProps {
  slots: Array<{ date: string; slots: Array<{ time: string; displayTime: string }> }>;
  selectedSlot?: TimeSlot;
  onSelect: (slot: { time: string; displayTime: string }) => void;
  isLoading?: boolean;
}

export function TimeSlotPicker({ slots, selectedSlot, onSelect, isLoading }: TimeSlotPickerProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4 animate-spin" />
          <span className="text-sm">Checking availability...</span>
        </div>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="py-6 text-center">
        <p className="text-sm text-muted-foreground">
          No available slots found for the selected dates. Please try a different date range.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {slots.map((dateGroup) => (
        <div key={dateGroup.date} className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{formatDateHeader(dateGroup.date)}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {dateGroup.slots.map((slot) => {
              const isSelected = selectedSlot?.time === slot.time;
              return (
                <Button
                  key={slot.time}
                  variant={isSelected ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onSelect(slot)}
                  className={`text-xs ${
                    isSelected
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-primary/10 hover:border-primary'
                  }`}
                >
                  {slot.displayTime.split(' at ')[1] || slot.displayTime}
                </Button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function formatDateHeader(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const isToday = date.toDateString() === today.toDateString();
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  if (isToday) {
    return 'Today';
  }
  if (isTomorrow) {
    return 'Tomorrow';
  }

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
}
