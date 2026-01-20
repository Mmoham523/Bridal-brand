import { Handler } from '@netlify/functions';

// Simple in-memory cache (resets on function cold start)
// In production, consider using Redis or similar for persistent caching
const cache = new Map<string, { data: any; expires: number }>();

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface AcuityAvailabilityResponse {
  time: string;
  calendarID: number;
  calendar: string;
  appointmentTypeID: number;
  appointmentType: string;
}

function getCacheKey(appointmentTypeId: number, date: string): string {
  return `availability_${appointmentTypeId}_${date}`;
}

function getCached(key: string): any | null {
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: any): void {
  cache.set(key, {
    data,
    expires: Date.now() + CACHE_TTL,
  });
}

export const handler: Handler = async (event) => {
  // Handle CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'GET') {
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

    const params = new URLSearchParams(event.queryStringParameters || {});
    const appointmentTypeId = params.get('appointmentTypeId');
    const date = params.get('date');
    const endDate = params.get('endDate') || date;

    if (!appointmentTypeId || !date) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'appointmentTypeId and date are required' }),
      };
    }

    // Check cache
    const cacheKey = getCacheKey(Number(appointmentTypeId), date);
    const cached = getCached(cacheKey);
    if (cached) {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'X-Cache': 'HIT',
        },
        body: JSON.stringify(cached),
      };
    }

    // Build Acuity API URL
    const acuityUrl = new URL('https://acuityscheduling.com/api/v1/availability/times');
    acuityUrl.searchParams.append('appointmentTypeID', appointmentTypeId);
    acuityUrl.searchParams.append('date', date);
    if (endDate && endDate !== date) {
      acuityUrl.searchParams.append('endDate', endDate);
    }
    acuityUrl.searchParams.append('timezone', 'Europe/London');

    // Call Acuity API
    const auth = Buffer.from(`${userId}:${apiKey}`).toString('base64');
    const response = await fetch(acuityUrl.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Acuity API error:', response.status, errorText);
      
      // Handle rate limiting
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
          error: 'Unable to fetch availability. Please try again later.',
        }),
      };
    }

    const data: AcuityAvailabilityResponse[] = await response.json();

    // Format response
    const formatted = formatAvailabilityResponse(data, date, endDate);

    // Cache the result
    setCache(cacheKey, formatted);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'X-Cache': 'MISS',
      },
      body: JSON.stringify(formatted),
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

function formatAvailabilityResponse(
  data: AcuityAvailabilityResponse[],
  startDate: string,
  endDate: string
): { slots: Array<{ date: string; slots: Array<{ time: string; displayTime: string }> }> } {
  // Group slots by date
  const grouped: { [date: string]: Array<{ time: string; displayTime: string }> } = {};

  data.forEach((slot) => {
    const date = new Date(slot.time);
    const dateKey = date.toISOString().split('T')[0];
    
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }

    const displayTime = formatTimeSlot(date);
    grouped[dateKey].push({
      time: slot.time,
      displayTime,
    });
  });

  // Convert to array format
  const result = Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, slots]) => ({
      date,
      slots: slots.sort((a, b) => a.time.localeCompare(b.time)),
    }));

  return { slots: result };
}

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
