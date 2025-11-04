import React from 'react'
import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";
import {events} from "@/lib/constants";

const Page = () => {
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
                    {events.map((event) => (
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
