import { Handler } from '@netlify/functions';

// Simple in-memory cache (resets on function cold start)
// In production, consider using Redis or similar for persistent caching
const cache = new Map<string, { data: any; expires: number }>();

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Acuity Scheduling TimeSlot interface
 * Response from /availability/times endpoint
 */
interface TimeSlot {
  time: string; // ISO 8601 formatted timestamp (e.g., "2016-02-04T13:00:00-0800")
}

/**
 * Availability request parameters
 */
interface AvailabilityParams {
  date: string;              // Required: Date string (YYYY-MM-DD or parsable by strtotime)
  appointmentTypeID: number; // Required: Numeric appointment type ID
  calendarID?: number;       // Optional: Specific calendar ID
  addonIDs?: number[];       // Optional: Array of addon IDs
  timezone?: string;         // Optional: IANA timezone (e.g., "America/New_York")
  ignoreAppointmentIDs?: number[]; // Optional: Appointment IDs to ignore for rescheduling
}

/**
 * Get cache key for availability request
 */
function getCacheKey(params: AvailabilityParams): string {
  const key = `availability_${params.appointmentTypeID}_${params.date}_${params.calendarID || 'all'}_${params.timezone || 'default'}`;
  return key;
}

/**
 * Get cached availability data
 */
function getCached(key: string): TimeSlot[] | null {
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

/**
 * Set cache for availability data
 */
function setCache(key: string, data: TimeSlot[]): void {
  cache.set(key, {
    data,
    expires: Date.now() + CACHE_TTL,
  });
}

/**
 * Fetch available time slots from Acuity Scheduling API
 * 
 * @param params - Availability parameters
 * @param userId - Acuity User ID
 * @param apiKey - Acuity API Key
 * @returns Promise<TimeSlot[]> - Array of available time slots
 * @throws Error if API call fails
 */
async function getAvailableTimes(
  params: AvailabilityParams,
  userId: string,
  apiKey: string
): Promise<TimeSlot[]> {
  // Validate required parameters
  if (!params.date || !params.appointmentTypeID) {
    throw new Error('date and appointmentTypeID are required');
  }

  // Build Acuity API URL
  const acuityUrl = new URL('https://acuityscheduling.com/api/v1/availability/times');
  
  // Required parameters
  acuityUrl.searchParams.append('date', params.date);
  acuityUrl.searchParams.append('appointmentTypeID', params.appointmentTypeID.toString());
  
  // Optional parameters
  if (params.calendarID) {
    acuityUrl.searchParams.append('calendarID', params.calendarID.toString());
  }
  
  if (params.addonIDs && params.addonIDs.length > 0) {
    // Acuity expects array parameters as addonIDs[]=1&addonIDs[]=2
    params.addonIDs.forEach(id => {
      acuityUrl.searchParams.append('addonIDs[]', id.toString());
    });
  }
  
  if (params.timezone) {
    acuityUrl.searchParams.append('timezone', params.timezone);
  }
  
  if (params.ignoreAppointmentIDs && params.ignoreAppointmentIDs.length > 0) {
    // Acuity expects array parameters as ignoreAppointmentIDs[]=1&ignoreAppointmentIDs[]=2
    params.ignoreAppointmentIDs.forEach(id => {
      acuityUrl.searchParams.append('ignoreAppointmentIDs[]', id.toString());
    });
  }

  // Create Basic Auth header
  const auth = Buffer.from(`${userId}:${apiKey}`).toString('base64');

  // Make API request
  const response = await fetch(acuityUrl.toString(), {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  // Handle errors
  if (!response.ok) {
    let errorText = '';
    let errorData: any = {};
    
    try {
      errorText = await response.text();
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }
    } catch (e) {
      errorText = 'Unknown error';
      errorData = { message: 'Failed to read error response' };
    }

    // Handle specific error cases
    if (response.status === 400) {
      throw new Error(`Bad Request: ${errorData.message || errorText || 'Missing required parameters'}`);
    }
    
    if (response.status === 401) {
      throw new Error('Authentication failed: Invalid Acuity User ID or API Key');
    }
    
    if (response.status === 429) {
      throw new Error('Too many requests. Please try again in a moment.');
    }

    throw new Error(`Acuity API error (${response.status}): ${errorData.message || errorText || 'Unknown error'}`);
  }

  // Parse and return response
  const data: TimeSlot[] = await response.json();
  
  // Validate response structure
  if (!Array.isArray(data)) {
    throw new Error('Invalid response format: Expected array of time slots');
  }

  return data;
}

/**
 * Format time slot for display
 */
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

/**
 * Format availability response for frontend
 */
function formatAvailabilityResponse(
  data: TimeSlot[],
  startDate: string,
  endDate?: string
): { slots: Array<{ date: string; slots: Array<{ time: string; displayTime: string }> }> } {
  // Group slots by date
  const grouped: { [date: string]: Array<{ time: string; displayTime: string }> } = {};

  data.forEach((slot) => {
    const date = new Date(slot.time);
    const dateKey = date.toISOString().split('T')[0];
    
    // Filter by date range if endDate is provided
    if (endDate) {
      const slotDate = dateKey;
      if (slotDate < startDate || slotDate > endDate) {
        return; // Skip slots outside date range
      }
    }
    
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

/**
 * Netlify Function Handler
 */
export const handler: Handler = async (event) => {
  // Handle CORS preflight
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
    // Get credentials from environment
    const userId = process.env.ACUITY_USER_ID;
    const apiKey = process.env.ACUITY_API_KEY;

    if (!userId || !apiKey) {
      console.error('Acuity credentials not configured', {
        hasUserId: !!userId,
        hasApiKey: !!apiKey,
      });
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Server configuration error',
          details: 'Missing ACUITY_USER_ID or ACUITY_API_KEY environment variables',
        }),
      };
    }

    // Parse query parameters
    const params = new URLSearchParams(event.queryStringParameters || {});
    const date = params.get('date');
    const appointmentTypeId = params.get('appointmentTypeId') || params.get('appointmentTypeID');
    const endDate = params.get('endDate');
    const calendarID = params.get('calendarID');
    const timezone = params.get('timezone') || 'Europe/London';

    // Validate required parameters
    if (!date || !appointmentTypeId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Missing required parameters',
          details: 'date and appointmentTypeId (or appointmentTypeID) are required',
        }),
      };
    }

    // Build availability parameters
    const availabilityParams: AvailabilityParams = {
      date,
      appointmentTypeID: Number(appointmentTypeId),
      timezone,
    };

    if (calendarID) {
      availabilityParams.calendarID = Number(calendarID);
    }

    // Check cache
    const cacheKey = getCacheKey(availabilityParams);
    const cached = getCached(cacheKey);
    if (cached) {
      const formatted = formatAvailabilityResponse(cached, date, endDate || undefined);
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'X-Cache': 'HIT',
        },
        body: JSON.stringify(formatted),
      };
    }

    // Log request (without exposing credentials)
    console.log('Acuity API Request:', {
      appointmentTypeID: availabilityParams.appointmentTypeID,
      date: availabilityParams.date,
      calendarID: availabilityParams.calendarID,
      timezone: availabilityParams.timezone,
      hasUserId: !!userId,
      hasApiKey: !!apiKey,
    });

    // Fetch available times from Acuity
    const timeSlots = await getAvailableTimes(availabilityParams, userId, apiKey);

    // Format response for frontend
    const formatted = formatAvailabilityResponse(timeSlots, date, endDate || undefined);

    // Cache the result
    setCache(cacheKey, timeSlots);

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
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Determine status code based on error type
    let statusCode = 500;
    if (errorMessage.includes('Bad Request') || errorMessage.includes('Missing required')) {
      statusCode = 400;
    } else if (errorMessage.includes('Authentication failed')) {
      statusCode = 401;
    } else if (errorMessage.includes('Too many requests')) {
      statusCode = 429;
    }
    
    return {
      statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: errorMessage,
        details: error instanceof Error ? error.stack : undefined,
      }),
    };
  }
};
