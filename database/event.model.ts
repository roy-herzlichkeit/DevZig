// database/event.model.ts
// Event schema and model with strong typing, slug generation, and date/time normalization.

import { Schema, model, models, type Model, type Document } from 'mongoose';

// Public attributes accepted when creating an Event
export interface EventAttrs {
  title: string;
  slug?: string; // auto-generated from title
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string; // normalized to YYYY-MM-DD
  time: string; // normalized to HH:mm (24h)
  mode: string; // e.g., online, offline, hybrid
  audience: string;
  agenda: string[]; // non-empty strings
  organizer: string;
  tags: string[]; // non-empty strings
}

// Document representation in MongoDB
export interface EventDoc extends Document, Omit<EventAttrs, 'slug'> {
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

// Model type
export interface EventModel extends Model<EventDoc> {}

// Small, dependency-free slugify that preserves unicode letters and digits
function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, '-') // non-letters/digits => dash
    .replace(/^-+|-+$/g, '') // trim leading/trailing dashes
    .replace(/-{2,}/g, '-'); // collapse repeats
}

function normalizeISODate(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) throw new Error('Invalid date format; expected ISO-compatible date');
  // Keep only the calendar date portion (YYYY-MM-DD)
  return d.toISOString().slice(0, 10);
}

function normalizeTime24h(timeStr: string): string {
  const s = timeStr.trim().toLowerCase();
  // 24h: H:MM or HH:MM
  const m24 = s.match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
  if (m24) {
    const hh = m24[1].padStart(2, '0');
    const mm = m24[2];
    return `${hh}:${mm}`;
  }
  // 12h: H:MM(am|pm)
  const m12 = s.match(/^(1[0-2]|0?\d):([0-5]\d)\s*(am|pm)$/);
  if (m12) {
    let hh = Number(m12[1]);
    const mm = m12[2];
    const mer = m12[3];
    if (mer === 'pm' && hh !== 12) hh += 1;
    if (mer === 'am' && hh === 12) hh = 0;
    return `${hh.toString().padStart(2, '0')}:${mm}`;
  }
  throw new Error('Invalid time format; expected HH:mm (24h) or h:mm am/pm');
}

const EventSchema = new Schema<EventDoc, EventModel>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true, trim: true },
    overview: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    mode: { type: String, required: true, trim: true },
    audience: { type: String, required: true, trim: true },
    agenda: {
      type: [String],
      required: true,
      validate: {
        validator: (arr: string[]) => Array.isArray(arr) && arr.length > 0 && arr.every((s) => typeof s === 'string' && s.trim().length > 0),
        message: 'agenda must be a non-empty array of non-empty strings',
      },
    },
    organizer: { type: String, required: true, trim: true },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: (arr: string[]) => Array.isArray(arr) && arr.length > 0 && arr.every((s) => typeof s === 'string' && s.trim().length > 0),
        message: 'tags must be a non-empty array of non-empty strings',
      },
    },
  },
  { timestamps: true, versionKey: false, strict: true }
);

// Explicit unique index for clarity in addition to the field-level unique flag
EventSchema.index({ slug: 1 }, { unique: true });

// Pre-save: generate slug (only if title changed), normalize date/time, and enforce non-empty strings
EventSchema.pre('save', function preSave(next) {
  try {
    const doc = this as EventDoc;

    // Ensure essential string fields are non-empty after trim
    const requiredStrings: Array<keyof Pick<EventDoc, 'title' | 'description' | 'overview' | 'image' | 'venue' | 'location' | 'date' | 'time' | 'mode' | 'audience' | 'organizer'>> = [
      'title',
      'description',
      'overview',
      'image',
      'venue',
      'location',
      'date',
      'time',
      'mode',
      'audience',
      'organizer',
    ];
    for (const key of requiredStrings) {
      const value = String(doc[key]).trim();
      if (value.length === 0) throw new Error(`${key} must be a non-empty string`);
      // Normalize some fields
      if (key === 'mode') (doc as EventDoc).mode = value.toLowerCase();
      else if (key in doc) (doc as unknown as Record<string, string>)[key] = value;
    }

    // Normalize date (YYYY-MM-DD) and time (HH:mm 24h)
    doc.date = normalizeISODate(doc.date);
    doc.time = normalizeTime24h(doc.time);

    // Only regenerate slug if title changed or slug missing
    if (doc.isModified('title') || !doc.slug) {
      doc.slug = slugify(doc.title);
    }

    next();
  } catch (err) {
    next(err as Error);
  }
});

export const Event: EventModel = (models.Event as EventModel) || model<EventDoc, EventModel>('Event', EventSchema);

export default Event;
