"use server";

import {Event} from "@/database/event.model";
import connectToDatabase from "@/lib/mongodb";

export const getSimiliarEventsBySlug = async (slug: string) => {
    try {
        await connectToDatabase();
        const event = await Event.findOne({slug: slug});
        if (event)
            return await Event.find({_id: {$ne: event._id}, tags: {$in: event.tags}}).lean().limit(3);
        else
            return [];
    } catch(e) {
        return [];
    }
};