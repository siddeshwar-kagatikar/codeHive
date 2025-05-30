import React, { useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { VideoPlayer } from './VideoPlayer';

const APP_ID = '14358986116341b9a57f71d58c652b1a';
const TOKEN = '007eJxTYFjumcqW1fXxf1KCt94ewY9/S0WWXgxexTGF+cabU7ITr0UpMBiaGJtaWFqYGRqaGZsYJlkmmpqnmRummFokm5kaJRkmlrqZZzQEMjIkTd3FyMgAgSA+M0N5ShYDAwAVZR5Q';
const CHANNEL = 'wdj';

const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

export default function VideoRoom({ onLeave }) {
  const [users, setUsers] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);

  const handleUserJoined = async (user, mediaType) => {
    await client.subscribe(user, mediaType);

    if (mediaType === 'video' && user.videoTrack) {
      setUsers((prev) => {
        // Prevent duplicate user entries
        const alreadyExists = prev.find((u) => u.uid === user.uid);
        return alreadyExists ? prev : [...prev, user];
      });
    }
  };

  const handleUserLeft = (user) => {
    setUsers((prev) => prev.filter((u) => u.uid !== user.uid));
  };

  useEffect(() => {
  let isCancelled = false;

  const init = async () => {
    client.on('user-published', handleUserJoined);
    client.on('user-left', handleUserLeft);

    try {
      const uid = await client.join(APP_ID, CHANNEL, TOKEN, null);
      if (isCancelled) return;

      const tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
      if (isCancelled) return;

      const [audioTrack, videoTrack] = tracks;
      setLocalTracks(tracks);

      setUsers((prev) => [
        ...prev,
        { uid, videoTrack, audioTrack },
      ]);

      await client.publish(tracks);
    } catch (err) {
      if (!isCancelled) console.error('Agora error:', err);
    }
  };

  init();

  return () => {
    isCancelled = true;
    localTracks.forEach((track) => {
      track.stop();
      track.close();
    });
    client.off('user-published', handleUserJoined);
    client.off('user-left', handleUserLeft);
    client.unpublish(localTracks).catch(() => {});
    client.leave().catch(() => {});
  };
}, [onLeave]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 200px)',
          gap: '10px',
        }}
      >
        {users.map((user) => (
          <VideoPlayer key={user.uid} user={user} />
        ))}
      </div>
    </div>
  );
}
