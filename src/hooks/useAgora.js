import AgoraRTC, {
  CameraVideoTrackInitConfig,
  MicrophoneAudioTrackInitConfig
} from "agora-rtc-sdk-ng";
import { useEffect, useState } from "react";

// const client = AgoraRTC.createClient({ codec: "h264", mode: "rtc" });

export default function useAgora(client, extension) {
  const appid = "2e5346b36d1f40b1bbc62472116d96de";

  let USER_ID = Math.floor(Math.random() * 100000001)
  // const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("");
  const [currentSpeaker, setCurrentSpeaker] = useState("");
  const [remoteUsersMap, setRemoteUsersMap] = useState(null);
  const [remoteUsersSet, setRemoteUsersSet] = useState([]);



  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);

  const [joinState, setJoinState] = useState(false);

  const [remoteUsers, setRemoteUsers] = useState([]);
  const [muteVideoState, setMuteVideoState] = useState(true)
  const [muteAudioState, setMuteAudioState] = useState(true)
  // eslint-disable-next-line
  const [processor, setProcessor] = useState(null)
  // eslint-disable-next-line
  const [virtualBackgroundEnabled, setVirtualBackgroundEnabled] = useState(false)


  // Initialization
  async function getProcessorInstance() {
    if (!processor && localVideoTrack) {
      // Create a VirtualBackgroundProcessor instance
      let processorConst = extension.createProcessor();

      try {
        // Initialize the extension and pass in the URL of the Wasm file
        await processorConst.init();
        // Inject the extension into the video processing pipeline in the SDK
        localVideoTrack.pipe(processorConst).pipe(localVideoTrack.processorDestination);
        setProcessor(processorConst)
        console.log("init background process", processorConst);
        return processorConst
      } catch (e) {
        console.log("background process Fail to load WASM resource!"); return null;
      }

    } else {
      return processor
    }
  }

  // // Set a solid color as the background
  // // eslint-disable-next-line
  async function setBackgroundColor() {

    if (localVideoTrack && !virtualBackgroundEnabled) {

      let processorConst = await getProcessorInstance();
      try {
        processorConst.setOptions({ type: 'color', color: '#000000' });
        await processorConst.enable();

      } finally {
        setVirtualBackgroundEnabled(true)
      }
    } else {

      let processorConst = await getProcessorInstance();
      try {
        await processorConst.disable();

      } finally {
        setVirtualBackgroundEnabled(false)
      }

    }
  }

  // Blur the user's actual background
  async function setBackgroundBlurring() {
    if (localVideoTrack && !virtualBackgroundEnabled) {

      let processorConst = await getProcessorInstance();
      try {
        processorConst.setOptions({ type: 'blur', blurDegree: 2 });
        await processorConst.enable();

      } finally {
        setVirtualBackgroundEnabled(true)
      }
    } else {

      let processorConst = await getProcessorInstance();
      try {
        await processorConst.disable();

      } finally {
        setVirtualBackgroundEnabled(false)
      }

    }
  }


  // Set an image as the background
  async function setBackgroundImage() {

    // var image = new Image();
    // image.onload = function () {
    // }
    // image.crossOrigin = "anonymous";
    // image.src = "https://miro.medium.com/max/1200/1*q4rL_nejz22KlgfYjfIOMg.png"

    // // const imgElement = document.createElement('img');
    // // imgElement.src = 'https://miro.medium.com/max/1200/1*q4rL_nejz22KlgfYjfIOMg.png';
    // image.width = 1000
    // image.height = 1000

    // const canvas = document.createElement("canvas");
    // const ctx = canvas.getContext("2d");

    // const image = new Image();
    // image.src = "https://images.pexels.com/photos/12043242/pexels-photo-12043242.jpeg";
    // image.crossOrigin = "Anonymous";

    // image.onload = () => {
    //   ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    // };



    // const canvas = document.getElementById("canvas");
    // const ctx = canvas.getContext("2d");

    // const image = new Image();
    // image.src = "https://images.pexels.com/photos/12043242/pexels-photo-12043242.jpeg";
    // image.addEventListener("load", () => {
    //   ctx.drawImage(image, 0, 0, 233, 320);

    //   const imageData = ctx.getImageData(10, 20, 80, 230);
    //   ctx.putImageData(imageData, 260, 0);
    //   ctx.putImageData(imageData, 380, 50);
    //   ctx.putImageData(imageData, 500, 100);
    // });


    // if (localVideoTrack && !virtualBackgroundEnabled) {

    //   let processorConst = await getProcessorInstance();
    //   try {
    //     processorConst.setOptions({
    //       type: 'img', source: ctx
    //     });
    //     await processorConst.enable();
    //   } catch (error) {
    //     console.error("setBackgroundImage===>", error)
    //   }
    //   finally {
    //     setVirtualBackgroundEnabled(true)
    //   }
    // } else {

    //   let processorConst = await getProcessorInstance();
    //   try {
    //     await processorConst.disable();

    //   } finally {
    //     setVirtualBackgroundEnabled(false)
    //   }

    // }




  }


  async function muteVideo(forceMute = false, setDisableVideo) {
    if (localVideoTrack != null) {
      if (!forceMute) {
        console.log("muteVideo: ", localVideoTrack)
        localVideoTrack.setEnabled(muteVideoState)
        setDisableVideo(false)

        setMuteVideoState(!muteVideoState)
      } else {
        localVideoTrack.setEnabled(false)
        setDisableVideo(false)
        setMuteVideoState(true)


      }


    }
  }



  async function forceAudio(forceMute = false) {
    if (localAudioTrack != null) {
      console.log("forceAudio: ", forceMute)
      localAudioTrack.setEnabled(forceMute)
      setMuteAudioState(forceMute)

    }
  }


  async function forceVideo(forceMute) {
    if (localVideoTrack != null && forceMute) {
      console.log("forceVideo: ", forceMute)
      localVideoTrack.setEnabled(!forceMute)
      setTimeout(() => {
        localVideoTrack.setEnabled(forceMute)
        // localVideoTrack.setEnabled(!forceMute)
        setMuteVideoState(!forceMute)
      }, 200)

    }
  }



  async function muteAudio(forceMute = false, setDisableAudio) {
    if (localAudioTrack != null) {
      if (!forceMute) {
        console.log("MuteAudioState: ", muteAudioState)
        localAudioTrack.setEnabled(muteAudioState)
        setDisableAudio(false)
        setMuteAudioState(!muteAudioState)
      } else {
        localAudioTrack.setEnabled(false)
        setDisableAudio(false)
        setMuteAudioState(true)
      }
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
    getProcessorInstance()

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
      console.log("agora----highlightingaSpeaker user===>", user)
      console.log("agora----highlightingaSpeaker remoteUsers===>", remoteUsers)

      // const remoteUidDataProcess = []
      // for (var i = 0; i < user.length; i++) {
      //   user.sort(function (a, b) { return b.level - a.level; });
      // }

      user.sort((a, b) => b.level - a.level)
      // const remoteUidDataProcess = []
      if (user?.length > 1) {
        setCurrentSpeaker(user[0]?.uid)
      }
      // console.log("user---------->highlightingaSpeaker", user)
      // user.forEach((volume) => {
      //   console.log(`UID ${volume.uid} Level ${volume.level}`);

      //   if (volume.level > 5) {
      //     setCurrentSpeaker(volume.uid)
      //   }
      //   if (username != volume.uid) {
      //     remoteUidDataProcess.push(volume.uid)
      //   }

      // })


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
    // eslint-disable-next-line
  }, []);
  // useEffect(() => {
  //   if (username !== currentSpeaker) {
  //     setRemoteUsersSet([...new Set([currentSpeaker, ...remoteUsersSet])])
  //   }
  //   // eslint-disable-next-line
  // }, [currentSpeaker])


  useEffect(() => {
    console.log("remoteUsersSet=====>userEffect", remoteUsersSet)

  }, [remoteUsersSet])


  useEffect(() => {
    const remoteUserProcess = remoteUsersMap != null ? remoteUsersMap : new Map();
    const remoteUidDataProcess = []
    // eslint-disable-next-line
    remoteUsers.map((userData) => {
      // console.log("userData====>uid", userData?.uid)
      // console.log("userData====>", userData?.uid)
      remoteUserProcess.set(userData?.uid, userData);
      remoteUidDataProcess.push(userData?.uid)
    })
    setRemoteUsersMap(remoteUserProcess)
    console.log("remoteUsersSet=====>", remoteUidDataProcess)

    setRemoteUsersSet([...new Set([...remoteUidDataProcess])])
    // eslint-disable-next-line
  }, [remoteUsers])


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
    currentSpeaker,
    setBackgroundBlurring,
    setBackgroundColor,
    remoteUsersMap,
    remoteUsersSet,
    setBackgroundImage,
    forceAudio,
    forceVideo
  };
}
