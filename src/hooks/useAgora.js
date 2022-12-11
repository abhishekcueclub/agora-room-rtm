import AgoraRTC, {
  CameraVideoTrackInitConfig,
  MicrophoneAudioTrackInitConfig
} from "agora-rtc-sdk-ng";
import { useEffect, useState } from "react";

export default function useAgora(client) {
  const appid = "2e5346b36d1f40b1bbc62472116d96de";

  // const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("abhishek");
  const [currentSpeaker, setCurrentSpeaker] = useState("");

  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);

  const [joinState, setJoinState] = useState(false);

  const [remoteUsers, setRemoteUsers] = useState([]);
  const [muteVideoState, setMuteVideoState] = useState(true)
  const [muteAudioState, setMuteAudioState] = useState(true)


  async function muteVideo() {
    if (localVideoTrack != null) {
      console.log("muteVideo: ", localVideoTrack)
      localVideoTrack.setEnabled(muteVideoState)
      // muteVideoState
      //   ? client.muteVideo()
      //   : client.unmuteVideo()

      setMuteVideoState(!muteVideoState)

    }
  }


  async function muteAudio() {
    if (localAudioTrack != null) {

      console.log("MuteAudioState: ", muteAudioState)
      localAudioTrack.setEnabled(muteAudioState)

      // muteAudioState
      //   ? client.muteAudio()
      //   : client.unmuteAudio()

      setMuteAudioState(!muteAudioState)
    }
  }


  async function updateUsername(name) {
    setUsername(name)
  }
  async function createLocalTracks() {
    const [
      microphoneTrack,
      cameraTrack
    ] = await AgoraRTC.createMicrophoneAndCameraTracks(
      MicrophoneAudioTrackInitConfig,
      CameraVideoTrackInitConfig
    );
    // microphoneTrack.setEnabled(false)
    // cameraTrack.setEnabled(false)
    // cameraTrack.play('me');

    console.log(cameraTrack);

    setLocalAudioTrack(microphoneTrack);
    setLocalVideoTrack(cameraTrack);

    return [microphoneTrack, cameraTrack];
  }

  async function join(channel, token, initRm, username_detail) {
    if (!client) return;

    console.log("Join --- 1")
    const [microphoneTrack, cameraTrack] = await createLocalTracks();

    await client.join(appid, channel, token, username_detail);
    await client.publish([microphoneTrack, cameraTrack]);
    microphoneTrack.setEnabled(false)
    cameraTrack.setEnabled(false)
    setJoinState(true);
    console.log("Join --- 2")
    initRm(username_detail)

  }

  async function leave() {
    if (localAudioTrack) {
      localAudioTrack.stop();
      localAudioTrack.close();
    }
    if (localVideoTrack) {
      localVideoTrack.stop();
      localVideoTrack.close();
    }
    setRemoteUsers([]);
    setJoinState(false);
    await client.leave();
  }

  useEffect(() => {
    if (!client) return;
    setRemoteUsers(client.remoteUsers);

    const handleUserPublished = async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      console.log("agora----handleUserPublished user===>", user)

      // toggle rerender while state of remoteUsers changed.
      setRemoteUsers((remoteUsers) => Array.from(client.remoteUsers));
    };

    const handleUserUnpublished = (user) => {
      console.log("agora----handleUserUnpublished user===>", user)

      setRemoteUsers((remoteUsers) => Array.from(client.remoteUsers));
    };

    const handleUserJoined = (user) => {
      console.log("agora----handleUserJoined user===>", user)
      // setUserId(user)

      setRemoteUsers((remoteUsers) => Array.from(client.remoteUsers));
    };

    const handleUserLeft = (user) => {
      console.log("agora----handleUserLeft user===>", user)

      setRemoteUsers((remoteUsers) => Array.from(client.remoteUsers));
    };

    const highlightingaSpeaker = (user) => {
      // console.log("agora----highlightingaSpeaker user===>", user)
      user.forEach((volume) => {
        // console.log(`UID ${volume.uid} Level ${volume.level}`);

        if (volume.level > 5) {
          setCurrentSpeaker(volume.uid)
        }
      })
    };

    client.on("user-published", handleUserPublished);
    client.on("user-unpublished", handleUserUnpublished);
    client.on("user-joined", handleUserJoined);
    client.on("user-left", handleUserLeft);
    client.enableAudioVolumeIndicator();
    client.on("volume-indicator", highlightingaSpeaker);

    return () => {
      client.off("user-published", handleUserPublished);
      client.off("user-unpublished", handleUserUnpublished);
      client.off("user-joined", handleUserJoined);
      client.off("user-left", handleUserLeft);
      client.off("volume-indicator", highlightingaSpeaker);
    };
  }, [client]);

  return {
    localAudioTrack,
    localVideoTrack,
    joinState,
    leave,
    join,
    remoteUsers,
    muteVideo,
    muteAudio,
    muteVideoState,
    muteAudioState,
    // userId,
    username,
    updateUsername,
    currentSpeaker
  };
}
