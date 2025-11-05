"use client"
import {useState} from "react";

const BookEvent = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    return (
        <div id={"book-event"}>
            { submitted ? (
                <p>Thank you for booking your spot!</p>
            ) : (
                <form action="">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" placeholder={"Enter your email address"} id="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <button type={"submit"} className={"button-submit"}>
                        Submit
                    </button>
                </form>
            )}
        </div>
    )
}
export default BookEvent
