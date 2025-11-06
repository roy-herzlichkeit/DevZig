'use server';

import { connectToDatabase } from '@/lib/mongodb';
import { Booking } from '@/database/booking.model';

// Public DTO returned to clients (safe, no Mongo internals)
export type BookingDTO = {
  id: string;
  eventId: string;
  email: string;
  createdAt?: string;
};

function toBookingDTO(doc: any): BookingDTO {
  const id = doc?._id?.toString?.() ?? '';
  const eventId = doc?.eventId?.toString?.() ?? '';
  const email = typeof doc?.email === 'string' ? doc.email : '';
  const createdAt = doc?.createdAt ? new Date(doc.createdAt).toISOString() : undefined;
  return { id, eventId, email, ...(createdAt ? { createdAt } : {}) };
}

export const createBooking = async (
  { eventId, slug, email }: { eventId: string; slug: string; email: string }
): Promise<{ success: true; booking: BookingDTO } | { success: false; error: string; errorCode: string }> => {
  try {
    await connectToDatabase();

    // Only persist fields defined by the schema
    const createdBooking = await Booking.create({ eventId, email });

    // Return sanitized DTO
    return { success: true, booking: toBookingDTO(createdBooking) };
  } catch (e) {
    // Log full error details server-side, but do not leak them to the client
    console.error('booking failed', e);
    return { success: false, error: 'Booking creation failed', errorCode: 'BOOKING_CREATE_FAILED' };
  }
};