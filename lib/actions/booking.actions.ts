'use server';

import connectToDatabase from "@/lib/mongodb";
import {Booking} from "@/database/booking.model";

export const createBooking = async ({eventId, slug, email}: {eventId: string, slug: string, email: string}) => {
    try {
        await connectToDatabase();
        const createdBooking = await Booking.create({eventId, email});
        return {success: true, booking: createdBooking};
    } catch (e) {
        console.error(`Failed to create booking for eventId: ${eventId}, slug: ${slug}, email: ${email}`, e);
        return {success: false, error: e instanceof Error ? e.message : 'Failed to create booking'};
    }
}