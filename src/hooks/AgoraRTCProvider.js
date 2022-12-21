import AgoraRTC, {
    CameraVideoTrackInitConfig,
    MicrophoneAudioTrackInitConfig
} from "agora-rtc-sdk-ng";
import React, { useContext, useEffect, useState } from "react";

import VirtualBackgroundExtension from "agora-extension-virtual-background";

export const AgoraRTCContext = React.createContext(null);
export const appid = "61a0d4c67a4342c49298fdd84f9f0f03";
export const client = AgoraRTC.createClient({ codec: "h264", mode: "live" });
export const clientScreenShare = AgoraRTC.createClient({ codec: "h264", mode: "live" });


// Register the extension
export const extension = new VirtualBackgroundExtension();
AgoraRTC.registerExtensions([extension]);

const AgoraRTCProvider = ({ children }) => {


    // let USER_ID = Math.floor(Math.random() * 100000001)
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
    const [isUserAudience,setIsUserAudience] = useState(true);
    const [isSharingEnabled,setIsSharingEnabled] = useState(false);
    const [localscreenTrack , setLocalScreenTack] = useState(null);
    const [tok , setTok] = useState('');

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
        console.log("forceVideo: ", forceMute)
        console.log("forceVideo: localVideoTrack", localVideoTrack)

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
        setIsUserAudience(name && name.startsWith('cue') ? false : true)
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
        console.log("Join --- client", client)
        setTok(token);
        if (!client) return;

        console.log("Join --- 1")
        const [microphoneTrack, cameraTrack] = await createLocalTracks();

        await client.join(appid, channel, token, username_detail);
        await client.setClientRole(isUserAudience ? 'audience':'host');
        if(!isUserAudience){
            await client.publish([microphoneTrack, cameraTrack]);
        }
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

    async function handleScreenShareClick (status, callback) {
        clientScreenShare.setClientRole("host");
        //const tok = "";
        const _uid = await clientScreenShare.join(appid, 'demo_channel_a', tok, 'screen');
        if(status == false) {
            // Create a screen track for screen sharing.
            //[ILocalVideoTrack, ILocalAudioTrack] | ILocalVideoTrack>
            const screenTrack  = await AgoraRTC.createScreenVideoTrack();
            console.log('screenTrack', screenTrack)
            setLocalScreenTack(screenTrack);
            // Stop playing the local video track.
            //localVideoTrack.stop();
            // Unpublish the local video track.
            //await client.unpublish(localVideoTrack);
            // Publish the screen track.
            await clientScreenShare.publish(screenTrack);
            // Play the screen track on local container.
            //screenTrack.play(container);
            setIsSharingEnabled(true);
        } else {
            // Stop playing the screen track.
            localscreenTrack.stop();
            // Unpublish the screen track.
            await clientScreenShare.unpublish(localscreenTrack);
            // Publish the local video track.
            //await client.publish(localVideoTrack);
            // Play the local video on the local container.
            //VideoTrack.play(container);
            // Update the button text.
            //document.getElementById(`inItScreen`).innerHTML = "Share Screen";
            // Update the screen sharing state.
            //isSharingEnabled = false;
            setIsSharingEnabled(false);
        }
        callback(!status);
    }
    useEffect(() => {
        if (!client || !clientScreenShare) return;
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

        //code for screenshare from new client 
        const handleUserPublishedTwo = async (user, mediaType) => {
            await client.subscribe(user, mediaType);
            console.log("agora----handleUserPublished user===>", user)

            // toggle rerender while state of remoteUsers changed.
            setRemoteUsers((remoteUsers) => Array.from(client.remoteUsers));
        };

        const handleUserUnpublishedTwo = (user) => {
            console.log("agora----handleUserUnpublished user===>", user)

            setRemoteUsers((remoteUsers) => Array.from(client.remoteUsers));
        };

        const handleUserJoinedTwo = (user) => {
            console.log("agora----handleUserJoined user===>", user)
            // setUserId(user)

            setRemoteUsers((remoteUsers) => Array.from(client.remoteUsers));
        };

        const handleUserLeftTwo = (user) => {
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
        clientScreenShare.on("user-published", handleUserPublishedTwo);
        clientScreenShare.on("user-unpublished", handleUserUnpublishedTwo);
        clientScreenShare.on("user-joined", handleUserJoinedTwo);
        clientScreenShare.on("user-left", handleUserLeftTwo);

        client.on("user-joined", handleUserJoined);
        client.on("user-left", handleUserLeft);
        client.enableAudioVolumeIndicator();
        client.on("volume-indicator", highlightingaSpeaker);

        return () => {
            clientScreenShare.on("user-published", handleUserPublishedTwo);
            clientScreenShare.on("user-unpublished", handleUserUnpublishedTwo);
            clientScreenShare.off("user-joined", handleUserJoinedTwo);
            clientScreenShare.off("user-left", handleUserLeftTwo);
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


    return (
        <AgoraRTCContext.Provider
            value={{
                localAudioTrack,
                localVideoTrack,
                joinState,
                leave,
                join,
                handleScreenShareClick,
                isSharingEnabled,
                setIsSharingEnabled,
                remoteUsers,
                muteVideo,
                muteAudio,
                muteVideoState,
                muteAudioState,
                // userId,
                username,
                isUserAudience,
                localscreenTrack,
                updateUsername,
                currentSpeaker,
                setBackgroundBlurring,
                setBackgroundColor,
                remoteUsersMap,
                remoteUsersSet,
                setBackgroundImage,
                forceAudio,
                forceVideo
            }}
        >
            {children}
        </AgoraRTCContext.Provider>
    );

}


const useAgoraRTC = () => {
    const agoraObject = useContext(AgoraRTCContext);
    if (agoraObject == null) {
        throw new Error("useAgoraRTC() called outside of a AgoraRTCProvider?");
    }
    return agoraObject;
};

export { AgoraRTCProvider, useAgoraRTC };
