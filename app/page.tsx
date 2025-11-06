import React from 'react'
import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";
import {cacheLife} from "next/cache";
// import { events } from '@/lib/constants';

// Minimal event type used by this page
export type IEvent = {
    title: string;
    image: string;
    slug: string;
    date: string;
    location: string;
    time: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Page = async () => {
    'use cache';
    cacheLife('hours');

    // Safely fetch events with error handling while preserving caching directives above
    let events: IEvent[] = [];
    try {
        if (!BASE_URL) {
            throw new Error('Missing NEXT_PUBLIC_BASE_URL');
        }
        const res = await fetch(`${BASE_URL}/api/events`);
        if (!res.ok) {
            console.error('GET /api/events failed', { status: res.status, statusText: res.statusText });
        } else {
            const data = await res.json().catch(() => null as any);
            if (data && Array.isArray((data as any).events)) {
                events = (data as any).events as IEvent[];
            } else {
                console.error('GET /api/events: unexpected JSON shape');
            }
        }
    } catch (err) {
        console.error('GET /api/events threw', err);
    }

    return (
        <section>
            <h1 className="text-center">
                The ultimate platform for <br/> developers to Connect and Grow.
            </h1>
            <p className="text-center mt-5">
                Hackathons, Seminars and Conferences, All in one place.
            </p>
            <ExploreBtn/>
            <div className="mt-20 space-y-7">
                <h3>
                    Featured Events
                </h3>
                <ul className="events">
                    {events && events.length > 0 && events.map((event: IEvent) => (
                        <li key={event.title} style={{listStyle: 'none'}}>
                            <EventCard {...event}/>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}
export default Page
