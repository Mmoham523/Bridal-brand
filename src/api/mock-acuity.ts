// Mock Acuity API for local development
// This simulates the Netlify functions when testing locally

function formatTimeSlot(date: Date): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const dayName = days[date.getDay()];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  
  const hour12 = hours % 12 || 12;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const minutesStr = minutes.toString().padStart(2, '0');
  
  return `${dayName}, ${month} ${day} at ${hour12}:${minutesStr} ${ampm}`;
}

function generateMockSlots() {
  const slots: Array<{ date: string; slots: Array<{ time: string; displayTime: string }> }> = [];
  const today = new Date();
  
  // Generate slots for next 7 days
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    date.setHours(0, 0, 0, 0);
    
    const dateKey = date.toISOString().split('T')[0];
    const daySlots: Array<{ time: string; displayTime: string }> = [];
    
    // Generate 2-3 time slots per day (10am, 2pm, 4pm)
    const times = [10, 14, 16];
    times.forEach(hour => {
      const slotDate = new Date(date);
      slotDate.setHours(hour, 0, 0, 0);
      
      // Skip weekends for variety (or include them, your choice)
      if (slotDate.getDay() !== 0 && slotDate.getDay() !== 6) {
        daySlots.push({
          time: slotDate.toISOString(),
          displayTime: formatTimeSlot(slotDate),
        });
      }
    });
    
    if (daySlots.length > 0) {
      slots.push({
        date: dateKey,
        slots: daySlots,
      });
    }
  }
  
  return slots;
}

export async function mockFetchAvailability(appointmentTypeId: number, date: string, endDate: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Generate fresh mock slots
  const allSlots = generateMockSlots();
  
  // Filter slots within date range
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  
  const filteredSlots = allSlots.filter(slot => {
    const slotDate = new Date(slot.date);
    return slotDate >= start && slotDate <= end;
  });

  return {
    slots: filteredSlots.length > 0 ? filteredSlots : allSlots.slice(0, 3), // Return at least some slots
  };
}

export async function mockCreateBooking(
  appointmentTypeId: number,
  datetime: string,
  firstName: string,
  lastName: string,
  email: string,
  phone?: string
) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate occasional conflicts (10% chance)
  if (Math.random() < 0.1) {
    throw new Error('This time slot is no longer available. Please select another time.');
  }

  return {
    success: true,
    appointment: {
      id: Math.floor(Math.random() * 1000000),
      datetime: datetime,
      appointmentType: appointmentTypeId === 87576849 ? 'In-Person Bridal Sizing' : 'Virtual Sizing Consultation',
      calendar: 'Main Calendar',
    },
    message: 'Appointment booked successfully! You will receive a confirmation email shortly.',
  };
}
