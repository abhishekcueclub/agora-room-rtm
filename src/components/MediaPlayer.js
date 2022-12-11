import React, { useEffect, useRef } from "react";

export default function MediaPlayer(props) {
  const container = useRef(null);

  let videoTrack = props.videoTrack;
  let audioTrack = props.audioTrack;

  useEffect(() => {
    if (!container.current) return;

    if (videoTrack) {
      videoTrack.play(container.current);
      return () => {
        videoTrack.stop();
      };
    }
  }, [container, videoTrack]);

  useEffect(() => {
    if (audioTrack && !props?.isSelf) {
      audioTrack.play();
      return () => {
        audioTrack.stop();
      };
    }
    // eslint-disable-next-line
  }, [audioTrack]);

  return (
    <div
      ref={container}
      className="video-player"
      style={{ width: "320px", height: "200px", borderRadius: 5, borderWidth: 3 }}
    >
      {/* {JSON.stringify(videoTrack.play)} */}
    </div>
  );
}
