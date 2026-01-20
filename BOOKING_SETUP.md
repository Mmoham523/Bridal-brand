# Acuity Booking Integration Setup Guide

## Overview
The chatbot now supports end-to-end appointment booking through natural conversation. Users can ask to book a consultation, see available time slots, select one, and complete the booking entirely within the chat.

## Environment Variables

Add these to your Netlify environment variables:

1. Go to **Netlify Dashboard** → Your Site → **Site settings** → **Environment variables**
2. Add the following variables:

```
ACUITY_USER_ID=37996403
ACUITY_API_KEY=71b9c7f8bcad0ec685386fae3e0b219b
```

**Important:** Never commit these credentials to your code repository. They should only exist in Netlify's environment variables.

## How It Works

### Booking Flow

1. **User Intent**: User says something like "I want to book a consultation this week"
2. **Availability Check**: Chatbot fetches available slots from Acuity API (cached for 5 minutes)
3. **Slot Selection**: User sees available time slots and clicks one
4. **Information Collection**: Chatbot asks for name and email (if not already provided)
5. **Booking Creation**: Chatbot creates the appointment via Acuity API
6. **Confirmation**: User receives confirmation message

### Features

- **Caching**: Availability results are cached for 5 minutes to reduce API calls
- **Rate Limiting**: Handles Acuity API rate limits gracefully
- **Natural Language**: Understands phrases like "this week", "next week", extracts names/emails
- **Error Handling**: Handles slot conflicts, network errors, and invalid data
- **Conversational**: Maintains context throughout the booking flow

## Testing

### Test the Booking Flow

1. Open the chat widget (bottom-right corner)
2. Say: "I want to book a consultation this week"
3. Wait for available slots to appear
4. Click on a time slot
5. Provide your name and email when asked
6. Confirm the booking

### Test Scenarios

- **No Availability**: Try booking for dates with no slots
- **Slot Conflict**: Try booking a slot that gets taken (should show error)
- **Invalid Email**: Provide invalid email format (should ask for correction)
- **Natural Language**: Try various phrasings like "book me an appointment", "I need to schedule", etc.

## API Endpoints

### Availability Endpoint
`/.netlify/functions/acuity-availability`

**Query Parameters:**
- `appointmentTypeId`: 87576849 (in-person) or 87844286 (virtual)
- `date`: Start date (YYYY-MM-DD)
- `endDate`: End date (YYYY-MM-DD, optional)

**Response:**
```json
{
  "slots": [
    {
      "date": "2024-01-15",
      "slots": [
        {
          "time": "2024-01-15T14:00:00+0000",
          "displayTime": "Monday, Jan 15 at 2:00 PM"
        }
      ]
    }
  ]
}
```

### Booking Endpoint
`/.netlify/functions/acuity-book`

**Request Body:**
```json
{
  "appointmentTypeId": 87576849,
  "datetime": "2024-01-15T14:00:00+0000",
  "firstName": "John",
  "lastName": "Smith",
  "email": "john@example.com",
  "phone": "optional"
}
```

**Response:**
```json
{
  "success": true,
  "appointment": {
    "id": 123456,
    "datetime": "2024-01-15T14:00:00+0000",
    "appointmentType": "In-Person Bridal Sizing",
    "calendar": "Main Calendar"
  },
  "message": "Appointment booked successfully!"
}
```

## Troubleshooting

### "Server configuration error"
- Check that `ACUITY_USER_ID` and `ACUITY_API_KEY` are set in Netlify
- Redeploy your site after adding environment variables

### "Too many requests" error
- The cache should prevent this, but if it occurs, wait a moment and try again
- Acuity allows ~100 requests/minute

### Slots not appearing
- Check that the date range has available appointments in Acuity
- Verify the appointment type IDs are correct
- Check Netlify function logs for API errors

### Booking fails
- Verify all required fields (name, email, datetime) are provided
- Check that the slot hasn't been taken by another user
- Review Netlify function logs for detailed error messages

## Security Notes

- All Acuity API calls go through Netlify functions (never exposed to frontend)
- Credentials are stored securely in Netlify environment variables
- User input is validated before sending to Acuity
- Rate limiting and caching prevent API abuse

## Next Steps

The booking system is now fully functional! Users can:
- Ask questions (FAQ mode)
- Book appointments (Booking mode)
- Get help with both seamlessly

To enhance further, consider:
- Adding support for virtual vs in-person selection
- Allowing booking modifications/cancellations
- Adding calendar view for date selection
- Sending booking reminders
