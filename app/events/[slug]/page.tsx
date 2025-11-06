// import {notFound} from "next/navigation";
// import Image from "next/image";
// import BookEvent from "@/components/BookEvent";
// import {getSimiliarEventsBySlug} from "@/lib/actions/event.actions";
// import EventCard from "@/components/EventCard";
// import {cacheLife} from "next/cache";

import EventDetails from "@/components/EventDetails"
import { Suspense } from "react"

const EventDetailsPage = async ({ params } : { params : Promise<{slug : string}> }) => {
    
    const slug = params.then((param) => param.slug)
    
    return (
        <main>
            <Suspense fallback={
                <div>
                    Loading...
                </div>
            }>
                <EventDetails params={slug}/>
            </Suspense>
        </main>
    )
}
export default EventDetailsPage
