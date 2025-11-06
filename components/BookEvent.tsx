"use client"
import {useState} from "react";
import {createBooking} from "@/lib/actions/booking.actions";

const BookEvent = ({eventId, slug}: {eventId: string; slug: string}) => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { success, error } = await createBooking({eventId, slug, email});
        if (success) {
            setSubmitted(true);
            console.log('Booking successful', success);
        } else {
            console.error('Booking failed', error);
        }
    }
    return (
        <div id={"book-event"}>
            { submitted ? (
                <p>Thank you for booking your spot!</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Email Address</label>
                    <input type="email" placeholder={"Enter your email address"} id="email" value={email} onChange={(e) => setEmail(e.target.value)} className={'p-2 px-3 rounded-md border border-gray-300'}/>
                    <button type={"submit"} className={"button-submit"}>
                        Submit
                    </button>
                </form>
            )}
        </div>
    )
}
export default BookEvent
