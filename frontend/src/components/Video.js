import React, { useState } from 'react';
import VideoRoom from './VideoRoom';

export default function Video() {
  const [joined, setJoined] = useState(false);

  const handleLeave = () => {
    setJoined(false);
  };

  return (
    <div className="video-container" style={{ textAlign: 'center' }}>

      {!joined ? (
        <button
          onClick={() => setJoined(true)}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            marginBottom: '20px',
            backgroundColor: '#2ecc71',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Join Call
        </button>
      ) : (
        <>
          <VideoRoom onLeave={handleLeave} />
          <button
            onClick={handleLeave}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#e74c3c',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Leave Call
          </button>
        </>
      )}
    </div>
  );
}
