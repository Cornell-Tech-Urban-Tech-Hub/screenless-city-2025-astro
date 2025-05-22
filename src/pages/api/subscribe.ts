import type { APIRoute } from 'astro';
import Airtable from 'airtable';

const base = new Airtable({
  apiKey: import.meta.env.AIRTABLE_API_KEY
}).base(import.meta.env.AIRTABLE_BASE_ID);

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { email, consent } = data;

    // Validate input
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return new Response(
        JSON.stringify({
          error: 'Valid email is required'
        }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    if (!consent || typeof consent !== 'boolean') {
      return new Response(
        JSON.stringify({
          error: 'Consent is required'
        }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Create record in Airtable
    await base('Subscribers').create([
      {
        fields: {
          Email: email,
          Consent: consent
        }
      }
    ]);

    return new Response(
      JSON.stringify({
        message: 'Successfully subscribed'
      }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Subscription error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to subscribe. Please try again later.'
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
} 