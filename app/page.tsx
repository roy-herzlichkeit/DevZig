import React from 'react'
import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";

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
    const res = await fetch(`${BASE_URL}/api/events`);
    const { events } = await res.json();
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
