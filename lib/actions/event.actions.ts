"use server";

import {Event} from "@/database/event.model";
import connectToDatabase from "@/lib/mongodb";

export const getSimiliarEventsBySlug = async (slug: string) => {
    try {
        await connectToDatabase();
        const event = await Event.findOne({slug: slug});
        return await Event.find({_id: {$ne: event._id, tags: {$in: event.tags}}});
    } catch(e) {
        return [];
    }
};