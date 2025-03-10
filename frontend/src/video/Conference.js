import React, { useEffect, useState } from 'react';
import { getMeetingId as fetchMeetingId, getToken } from './api';

export default function Conference() {
    const [token, setToken] = useState(null);
    const [meetingId, setMeetingId] = useState(null);

    // Function to fetch token and meeting ID
    const initializeMeeting = async () => {
        try {
            const token = await getToken(); // Fetch the token
            setToken(token);

            const ID = await fetchMeetingId(token); // Fetch the meeting ID
            setMeetingId(ID);
        } catch (err) {
            console.error('Error in initializing meeting:', err.message);
            setMeetingId('Error fetching meeting ID');
        }
    };

    useEffect(() => {
        initializeMeeting(); // Call the function to initialize meeting
    }, []);

    return (
        <div>
            <h1>{meetingId || 'Loading...'}</h1>
        </div>
    );
}
