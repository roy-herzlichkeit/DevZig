import {NextResponse, NextRequest} from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Event from "@/database/event.model";
import {v2 as cloudinary} from "cloudinary";

// Helper: robustly parse array fields that may arrive as JSON string, CSV, or newline-separated text
function parseArrayField(value: FormDataEntryValue | null): string[] {
    if (value == null) return [];
    if (typeof value !== 'string') return [];
    const trimmed = value.trim();
    if (!trimmed) return [];
    // Try strict JSON first
    try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
            return parsed;
        }
        // If it's a single string, return as single-element array
        if (typeof parsed === 'string') {
            return parsed ? [parsed] : [];
        }
    } catch (_) {
        // fall through to loose parsing
    }
    // Loose parsing: split by newlines or commas
    const parts = trimmed.split(/\r?\n|,/).map(s => s.trim()).filter(Boolean);
    return parts;
}

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();
        const formData = await req.formData();
        let event;
        try {
            event = Object.fromEntries(formData.entries());
        } catch (e) {
            console.error(e);
            return NextResponse.json({ message: 'Invalid JSON data format', error: e }, { status: 400 });
        }
        const file = formData.get('image') as File;
        if (!file) {
            return NextResponse.json({ message: 'Image file is required.' }, { status: 400 });
        }
        const tags = parseArrayField(formData.get('tags'));
        const agenda = parseArrayField(formData.get('agenda'));
        const imageBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(imageBuffer);
        const uploadedImageUrl = await new Promise<string>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'image',
                    folder: 'devzig'
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else if (!result || !result.secure_url) {
                        reject(new Error('Cloudinary upload failed: no result URL'));
                    } else {
                        resolve(result.secure_url);
                    }
                }
            );
            stream.end(buffer);
        });
        // Ensure we store the uploaded image URL on the event payload
        const eventData = { ...event, image: uploadedImageUrl, tags: tags, agenda: agenda } as Record<string, unknown>;
        const createdEvent = await Event.create(eventData);
        return NextResponse.json({message: 'Event created', event: createdEvent }, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'Cannot reach DB', error: e }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectToDatabase();
        const events = await Event.find().sort({ createdAt: -1 });
        return NextResponse.json({ message: 'Events fetched successfully', events }, { status: 200 });
    } catch(e) {
        return NextResponse.json({ message: 'Event fetching failed', e }, { status: 500 });
    }
}