import { useState } from "react";

function CustomInputTourBookingFlow({ label }) {
    const [text, setText] = useState("");
    return (
        <ul className="flex flex-col">
            <p>{label}</p>
            <li>
                <input value={text} onChange={(e) => setText(e.target.value)} />
            </li>
        </ul>
    );
}

export default CustomInputTourBookingFlow;