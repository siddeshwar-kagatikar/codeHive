const LOCAL_SERVER_URL = 'http://localhost:9000';
const API_BASE_URL = "https://api.videosdk.live";

// Function to get a token
export const getToken = async () => {
    try {
        const response = await fetch(`${LOCAL_SERVER_URL}/get-token`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch token: ${response.status} ${response.statusText}`);
        }

        const { token } = await response.json();
        return token;
    } catch (err) {
        console.error('Error in getToken:', err.message);
        throw err; // Re-throw the error for the calling function to handle
    }
};

// Function to get a meeting ID
export const createMeeting = async (token) => {
    try {
        const VIDEOSDK_API_ENDPOINT = `${LOCAL_SERVER_URL}/create-meeting`;
        const response = await fetch(VIDEOSDK_API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }), // Ensure token is passed correctly
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch meeting ID: ${response.status} ${response.statusText}`);
        }

        const { meetingId } = await response.json();
        return meetingId;
    } catch (err) {
        console.error('Error in getMeetingId:', err.message);
        throw err; // Re-throw the error for the calling function to handle
    }
};

// export const createMeeting = async ({ token }) => {
//     const url = `${API_BASE_URL}/v2/rooms`;
//     const options = {
//       method: "POST",
//       headers: { Authorization: token, "Content-Type": "application/json" },
//     };
  
//     const response = await fetch(url, options)
//     const data = await response.json()
  
//     if (data.roomId) {
//       return { meetingId: data.roomId, err: null }
//     } else {
//       return { meetingId: null, err: data.error }
//     }
  
//   };
  
