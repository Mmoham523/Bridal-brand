import { Button } from '@/components/ui/button';
import { MapPin, Video } from 'lucide-react';

interface ConsultationTypePickerProps {
  onSelect: (type: 'in-person' | 'virtual') => void;
}

export function ConsultationTypePicker({ onSelect }: ConsultationTypePickerProps) {
  return (
    <div className="space-y-3 mt-3">
      <Button
        variant="outline"
        className="w-full justify-start p-4 h-auto hover:bg-primary/10 hover:border-primary"
        onClick={() => onSelect('in-person')}
      >
        <div className="flex items-center gap-3 w-full">
          <MapPin className="h-5 w-5 text-primary" />
          <div className="text-left flex-1">
            <div className="font-medium">In-Person Consultation</div>
            <div className="text-xs text-muted-foreground">90 minutes at our boutique</div>
          </div>
        </div>
      </Button>
      
      <Button
        variant="outline"
        className="w-full justify-start p-4 h-auto hover:bg-primary/10 hover:border-primary"
        onClick={() => onSelect('virtual')}
      >
        <div className="flex items-center gap-3 w-full">
          <Video className="h-5 w-5 text-primary" />
          <div className="text-left flex-1">
            <div className="font-medium">Virtual Consultation</div>
            <div className="text-xs text-muted-foreground">45 minutes via video call</div>
          </div>
        </div>
      </Button>
    </div>
  );
}
