export type BookingState = null | 'selecting-type' | 'checking' | 'selecting' | 'collecting' | 'confirming' | 'completed';

export interface TimeSlot {
  time: string; // ISO format: "2024-01-15T14:00:00+0000"
  displayTime: string; // User-friendly: "Friday, Jan 15 at 2:00 PM"
  available: boolean;
}

export interface AvailableSlots {
  date: string; // "2024-01-15"
  slots: TimeSlot[];
}

export interface BookingInfo {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  appointmentType?: 'in-person' | 'virtual';
  selectedSlot?: TimeSlot;
}

export interface BookingContext {
  state: BookingState;
  availableSlots: AvailableSlots[];
  bookingInfo: BookingInfo;
  appointmentTypeId?: number;
}
