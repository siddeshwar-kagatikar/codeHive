import React from 'react'
import { useEffect, useState, useRef } from 'react';
import { Row, Col } from 'react-simple-flex-grid';
import 'react-simple-flex-grid/lib/main.css';
import {
    MeetingProvider,
    MeetingConsumer,
    useMeeting,
    useParticipant,
} from '@videosdk.live/react-sdk';
import { getToken, createMeeting } from './api';

const chunk = (arr) => {
    const newArr = [];
    while(arr.length) {newArr.push(arr.splice(0, 3));}
    return newArr;
};

function ParticipantView({ participantId }) {
    const webcamRef = useRef(null);
    const micRef = useRef(null);
    const screenShareRef = useRef(null);

    const {
        displayName = "Unknown Participant",
        webcamStream,
        micStream,
        screenShareStream,
        webcamOn = false,
        micOn = false,
        screenShareOn = false,
    } = useParticipant(participantId);

    useEffect(() => {
        if (webcamRef.current) {
            if (webcamOn && webcamStream?.track) {
                const mediaStream = new MediaStream();
                mediaStream.addTrack(webcamStream.track);

                webcamRef.current.srcObject = mediaStream;
                webcamRef.current
                    .play()
                    .catch((err) => console.error('Error playing webcam:', err));
            } else {
                webcamRef.current.srcObject = null;
            }
        }
    }, [webcamStream, webcamOn]);

    useEffect(() => {
        if (micRef.current) {
            if (micOn && micStream?.track) {
                const mediaStream = new MediaStream();
                mediaStream.addTrack(micStream.track);

                micRef.current.srcObject = mediaStream;
                micRef.current
                    .play()
                    .catch((err) => console.error('Error playing mic:', err));
            } else {
                micRef.current.srcObject = null;
            }
        }
    }, [micStream, micOn]);

    useEffect(() => {
        if (screenShareRef.current) {
            if (screenShareOn && screenShareStream?.track) {
                const mediaStream = new MediaStream();
                mediaStream.addTrack(screenShareStream.track);

                screenShareRef.current.srcObject = mediaStream;
                screenShareRef.current
                    .play()
                    .catch((err) => console.error('Error playing screen share:', err));
            } else {
                screenShareRef.current.srcObject = null;
            }
        }
    }, [screenShareStream, screenShareOn]);

    return (
        <div key={participantId}>
            <audio ref={micRef} autoPlay />
            {webcamOn && webcamStream ? (
                <div>
                    <h2>{displayName}</h2>
                    <video
                        height={"100%"}
                        width={"100%"}
                        ref={webcamRef}
                        autoPlay
                        playsInline
                    />
                </div>
            ) : null}
            {screenShareOn && screenShareStream ? (
                <div>
                    <h2>{displayName} - Screen Share</h2>
                    <video
                        height={"100%"}
                        width={"100%"}
                        ref={screenShareRef}
                        autoPlay
                        playsInline
                    />
                </div>
            ) : null}
            <br />
            <span>
                Mic: {micOn ? "Yes" : "No"}, Camera: {webcamOn ? "Yes" : "No"}, Screen Share:{" "}
                {screenShareOn ? "Yes" : "No"}
            </span>
        </div>
    );
}



function MeetingGrid({ meetingId }) {
    const [joined, setJoined] = useState(false);
    const { join, leave, toggleMic, toggleWebcam, toggleScreenShare } = useMeeting();
    const { participants } = useMeeting();

    const joinMeeting = () => {
        setJoined(true);
        join();
    };

    return (
        <div>
            <header>Meeting ID: {meetingId}</header>
            {joined ? (
                <div>
                    <button onClick={leave}>Leave</button>
                    <button onClick={toggleMic}>Toggle Mic</button>
                    <button onClick={toggleWebcam}>Toggle Webcam</button>
                    <button onClick={toggleScreenShare}>Toggle Screen Share</button>
                </div>
            ) : (
                <button onClick={joinMeeting}>Join</button>
            )}
            <div>
                {chunk([...participants.keys()]).map((k) => (
                    <Row key={k} gutter={80}>
                        {k.map((l) => (
                            <Col key={l} span={4}>
                                <ParticipantView participantId={l} />
                            </Col>
                        ))}
                    </Row>
                ))}
            </div>
        </div>
    );
}


function JoinScreen({ updateMeetingId, getMeetingAndToken }) {
    return (
        <div>
            <input type="text" placeholder="Enter Meeting ID" onChange={(e) => updateMeetingId(e.target.value)} />
            <button onClick={getMeetingAndToken}>
                Join Meeting
            </button>
            <button onClick={getMeetingAndToken}>
                Create Meeting
            </button>
        </div>
    );
}

export default function Call() {
    const [token, setToken] = useState(null);
    const [meetingId, setMeetingId] = useState(null);

    const getMeetingAndToken = async () => {
        try {
            const token = await getToken();
            setToken(token);
            const meetingId = await createMeeting(token);
            setMeetingId(meetingId);
            console.log(meetingId);
        } catch (err) {
            console.error('Error in initializing meeting:', err.message);
            setMeetingId('Error fetching meeting ID');
        }
    };

    const updateMeetingId = (meetingId) => {
        setMeetingId(meetingId);
    }

  return token && meetingId ? (
    <MeetingProvider
        config={{
            meetingId,
            micEnabled: true,
            webcamEnabled: true,
            name: 'John Doe',
            }}
            token={token}
            >
                <MeetingConsumer>
                    {() => <MeetingGrid meetingId={meetingId} getMeetingAndToken={getMeetingAndToken}/>}
                </MeetingConsumer>
            </MeetingProvider>
        ) : (
            <JoinScreen updateMeetingId={updateMeetingId} getMeetingAndToken={getMeetingAndToken} />
    );
}
