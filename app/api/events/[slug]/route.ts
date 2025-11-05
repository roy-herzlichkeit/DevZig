// app/api/events/[slug]/route.ts
// GET endpoint to fetch a single event by its unique slug.

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import {Event, EventDoc} from '@/database';

interface RouteParams {
  params: { slug: string };
}

/**
 * GET /api/events/[slug]
 * Fetch event details by slug from the database.
 */
export async function GET(_request: NextRequest, context: RouteParams): Promise<NextResponse> {
  try {
    // Extract slug from route params
    const { slug } = await context.params;

    // Validate slug presence and format (non-empty, URL-safe)
    if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
      return NextResponse.json({ error: 'Missing or invalid slug parameter' }, { status: 400 });
    }

    const cleanSlug = slug.trim().toLowerCase();

    // Ensure database connection
    await connectToDatabase();

    // Query for the event with a lean() call for better performance (plain JS object)
    const event = await Event.findOne({ slug: cleanSlug }).lean().exec();

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Return event data as JSON
    return NextResponse.json({ event }, { status: 200 });
  } catch (err) {
    // Log server-side errors for debugging (consider using a proper logger in production)
    console.error('[GET /api/events/[slug]] Unexpected error:', err);

    // Return a generic error message to the client
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
