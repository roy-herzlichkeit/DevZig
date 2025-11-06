import React from 'react'
import {notFound} from "next/navigation";
import Image from "next/image";
import BookEvent from "@/components/BookEvent";
import {getSimiliarEventsBySlug} from "@/lib/actions/event.actions";
import EventCard from "@/components/EventCard";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailItem = ({icon, alt, label}: {icon: string; alt: string; label: string}) => (
    <div className={`flex-row-gap-2 items-center`}>
        <Image src={icon} alt={alt} width={17} height={17}/>
        <p>{label}</p>
    </div>
);

const EventAgenda = ({agendaItems}: {agendaItems: string[]}) => (
    <div className="agenda">
        <h2>Agenda</h2>
        <ul>
            {agendaItems.map((item) => (
                <li key={item}>{item}</li>
            ))}
        </ul>
    </div>
);

const EventTags = ({tags}: {tags: string[]}) => (
    <div className="flex flex-row gap-1.5 flex-wrap">
        {tags.map((tag) => (
            <div className="pill" key={tag}>
                {tag}
            </div>
        ))}
    </div>
)


const EventDetailsPage = async ({ params } : { params : Promise<{slug : string}> }) => {
    // Safely resolve params and extract slug
    let slug: string;
    try {
        const p = await params;
        slug = p?.slug;
        if (!slug) return notFound();
    } catch {
        return notFound();
    }

    // Fetch event details with guards
    let description = '';
    let image = '';
    let agenda: string[] = [];
    let overview = '';
    let date = '';
    let time = '';
    let location = '';
    let mode = '';
    let audience = '';
    let tags: string[] = [];
    let organizer = '';

    try {
        const req = await fetch(`${BASE_URL}/api/events/${slug}`, { cache: 'no-store' });
        if (!req.ok) {
            if (req.status === 404) return notFound();
            throw new Error(`Failed to fetch event (${req.status})`);
        }
        const body = await req.json().catch(() => null);
        if (!body || typeof body !== 'object' || !('event' in body) || typeof (body as any).event !== 'object') {
            throw new Error('Invalid response shape');
        }
        const ev: any = (body as any).event;
        // Validate required string fields
        const requiredFields = ['description','image','overview','date','time','location','mode','audience','organizer'] as const;
        for (const key of requiredFields) {
            if (typeof ev[key] !== 'string' || !ev[key]) {
                return notFound();
            }
        }
        description = ev.description;
        image = ev.image;
        overview = ev.overview;
        date = ev.date;
        time = ev.time;
        location = ev.location;
        mode = ev.mode;
        audience = ev.audience;
        organizer = ev.organizer;
        agenda = Array.isArray(ev.agenda) ? ev.agenda : [];
        tags = Array.isArray(ev.tags) ? ev.tags : [];
    } catch (e) {
        // Let Next.js error boundary handle unexpected errors without crashing the whole app
        return notFound();
    }

    const bookings = 10;

    const similarEvents = await getSimiliarEventsBySlug(slug);
    return (
        <section id="event">
            <div className="header">
                <h1>Event Description</h1>
                <p className={"mt-1"}>{description}</p>
            </div>
            <div className="details">
                <div className="content">
                    <Image src={image} alt={"Event Banner"} width={800} height={800} className={"banner"} />
                    <section className="flex-col-gap-2">
                        <h2>Overview</h2>
                        <p>{overview}</p>
                    </section>
                    <section className="flex-col-gap-2">
                        <h2>Event Details</h2>
                        <EventDetailItem icon={"/icons/calendar.svg"} alt={"date"} label={date}/>
                        <EventDetailItem icon={"/icons/clock.svg"} alt={"time"} label={time}/>
                        <EventDetailItem icon={"/icons/pin.svg"} alt={"location"} label={location}/>
                        <EventDetailItem icon={"/icons/mode.svg"} alt={"mode"} label={mode}/>
                        <EventDetailItem icon={"/icons/audience.svg"} alt={"audience"} label={audience}/>
                    </section>
                    <EventAgenda agendaItems={Array.isArray(agenda) ? agenda : []}/>
                    <section className="flex-col-gap-2">
                        <h2>
                            About the Organiser
                        </h2>
                        <p>
                            {organizer}
                        </p>
                    </section>
                    {Array.isArray(tags) && tags.length > 0 && (
                        <EventTags tags={tags} />
                    )}
                </div>
                <aside className="booking">
                    <div className="signup-card">
                        <h2>Book your spot</h2>
                        {bookings > 0 ? (
                            <p className="text-sm">
                                Join {bookings} people who have already booked their spot.
                            </p>
                        ) : (
                            <p className="text-sm">
                                Be the first to book your spot.
                            </p>
                        )}
                        <BookEvent/>
                    </div>
                </aside>
            </div>
            <div className="flex w-full flex-col gap-4 pt-20">
                <h2>Similar Events</h2>
                <div className="events">
                    {similarEvents.length > 0 && similarEvents.map((similarEvent) => (
                        <EventCard key={similarEvent.slug} {...similarEvent}/>
                    ))}
                </div>
            </div>
        </section>
    )
}
export default EventDetailsPage
