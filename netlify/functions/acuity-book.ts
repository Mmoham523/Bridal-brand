import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  // Handle CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const userId = process.env.ACUITY_USER_ID;
    const apiKey = process.env.ACUITY_API_KEY;

    if (!userId || !apiKey) {
      console.error('Acuity credentials not configured');
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Server configuration error' }),
      };
    }

    const body = JSON.parse(event.body || '{}');
    const { appointmentTypeId, datetime, firstName, lastName, email, phone } = body;

    // Validation
    if (!appointmentTypeId || !datetime || !firstName || !lastName || !email) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Missing required fields: appointmentTypeId, datetime, firstName, lastName, email',
        }),
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Invalid email format' }),
      };
    }

    // Prepare Acuity API request
    const appointmentData: any = {
      appointmentTypeID: appointmentTypeId,
      datetime: datetime,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
    };

    if (phone) {
      appointmentData.phone = phone.trim();
    }

    // Call Acuity API
    const auth = Buffer.from(`${userId}:${apiKey}`).toString('base64');
    const response = await fetch('https://acuityscheduling.com/api/v1/appointments', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Acuity API error:', response.status, errorText);
      
      // Handle specific error cases
      if (response.status === 409) {
        // Conflict - slot may have been taken
        return {
          statusCode: 409,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            error: 'This time slot is no longer available. Please select another time.',
          }),
        };
      }

      if (response.status === 429) {
        return {
          statusCode: 429,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            error: 'Too many requests. Please try again in a moment.',
          }),
        };
      }

      return {
        statusCode: response.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Unable to create appointment. Please try again later.',
        }),
      };
    }

    const appointment = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        appointment: {
          id: appointment.id,
          datetime: appointment.datetime,
          appointmentType: appointment.appointmentType,
          calendar: appointment.calendar,
        },
        message: 'Appointment booked successfully! You will receive a confirmation email shortly.',
      }),
    };
  } catch (error) {
    console.error('Function error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'An unexpected error occurred. Please try again later.',
      }),
    };
  }
};
