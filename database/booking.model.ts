// database/booking.model.ts
// Booking schema and model with strong typing and referential validation to Event.

import { Schema, model, models, type Model, type Document, type Types } from 'mongoose';
import { Event } from './event.model';

export interface BookingAttrs {
  eventId: Types.ObjectId; // reference to Event
  email: string; // validated
}

export interface BookingDoc extends Document, BookingAttrs {
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingModel extends Model<BookingDoc> {}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BookingSchema = new Schema<BookingDoc, BookingModel>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (v: string) => EMAIL_REGEX.test(v),
        message: 'Invalid email format',
      },
    },
  },
  { timestamps: true, versionKey: false, strict: true }
);

// Ensure referenced Event exists before saving a booking
BookingSchema.pre('save', async function preSave(next) {
  try {
    const doc = this as BookingDoc;

    // Validate email again at hook-time in case of programmatic bypass
    if (!EMAIL_REGEX.test(doc.email)) throw new Error('Invalid email format');

    const exists = await Event.exists({ _id: doc.eventId });
    if (!exists) throw new Error('Referenced event does not exist');

    next();
  } catch (err) {
    next(err as Error);
  }
});

export const Booking: BookingModel = (models.Booking as BookingModel) || model<BookingDoc, BookingModel>('Booking', BookingSchema);

export default Booking;
