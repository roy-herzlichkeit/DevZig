"use client"
import {useState} from "react";
import {createBooking} from "@/lib/actions/booking.actions";
import posthog from "posthog-js";

const BookEvent = ({eventId, slug}: {eventId: string; slug: string}) => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isLoading) return; // prevent double submit
        setFormError(null);

        const trimmedEmail = email.trim();
        if (!trimmedEmail) {
            setFormError('Please enter your email address.');
            return;
        }

        setIsLoading(true);
        try {
            const { success, error } = await createBooking({eventId, slug, email: trimmedEmail});
            if (success) {
                setSubmitted(true);
                posthog.capture('event_booked', {eventId, slug, email: trimmedEmail})
            } else {
                const message = (error && (typeof error === 'string' ? error : (error as any)?.message)) || 'Booking failed. Please try again.';
                posthog.captureException(error);
                setFormError(message);
            }
        } catch (err: any) {
            const message = err?.message || 'An unexpected error occurred. Please try again.';
            setFormError(message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div id={"book-event"}>
            { submitted ? (
                <p>Thank you for booking your spot!</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        placeholder={"Enter your email address"}
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={'p-2 px-3 rounded-md border border-gray-300'}
                        disabled={isLoading}
                        aria-invalid={!!formError}
                        aria-describedby={formError ? 'booking-error' : undefined}
                        required
                    />
                    {formError && (
                        <p id="booking-error" className="text-red-600 text-sm mt-2" aria-live="polite">
                            {formError}
                        </p>
                    )}
                    <button type={"submit"} className={"button-submit"} disabled={isLoading}>
                        {isLoading ? 'Submitting…' : 'Submit'}
                    </button>
                </form>
            )}
        </div>
    )
}
export default BookEvent
