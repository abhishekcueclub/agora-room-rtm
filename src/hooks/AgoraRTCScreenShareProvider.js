import AgoraRTC, {
    CameraVideoTrackInitConfig,
    MicrophoneAudioTrackInitConfig
} from "agora-rtc-sdk-ng";
import React, { useContext, useEffect, useState } from "react";

import VirtualBackgroundExtension from "agora-extension-virtual-background";

export const AgoraRTCScreenShareContext = React.createContext(null);
export const appid = "61a0d4c67a4342c49298fdd84f9f0f03";
export const clientScreenShare = AgoraRTC.createClient({ codec: "h264", mode: "live" });


// Register the extension
export const extension = new VirtualBackgroundExtension();
AgoraRTC.registerExtensions([extension]);

const AgoraRTCScreenShareProvider = ({ children }) => {


    // let USER_ID = Math.floor(Math.random() * 100000001)
    // const [userId, setUserId] = useState(null);


    const [remoteUsers, setRemoteUsers] = useState([]);
    const [isSharingEnabled,setIsSharingEnabled] = useState(false);
    const [localscreenTrack , setLocalScreenTrack] = useState(null);
    const [client, setMainClient] = useState(null);
    //const [tok , setTok] = useState('007eJxTYMhYrRO1pDGML/to8YQvr8U+VjPILRP32SdR8KPin/CdO5MVGMxNDFPNDC2NDJOMLEzSTFKSkpLTUpOSDS3NkpJTjI0tmNcvSW4IZGQ4m9DAysgAgSA+H0NKam5+fHJGYl5eak58IgMDAL6bJA4=');


    async function handleScreenShareClick (status,client,tok, callback) {
        console.log('client 1111111111', client);
        setMainClient(client);
        clientScreenShare.setClientRole("host");
        //const tok = "";
        
        if(status == false) {
            const _uid= await clientScreenShare.join(appid, 'demo_channel_a', tok, 'screen');
            // Create a screen track for screen sharing.
            //[ILocalVideoTrack, ILocalAudioTrack] | ILocalVideoTrack>
            const screenTrack  = await AgoraRTC.createScreenVideoTrack();
            setLocalScreenTrack(screenTrack);
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

            localscreenTrack.close();

            await clientScreenShare.leave();
            // Unpublish the screen track.
            //await clientScreenShare.unpublish(localscreenTrack);
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
        if (!clientScreenShare || !client) return;
        console.log('client 44444444', client);

        //code for screenshare from new client 
        const handleUserPublishedTwo = async (user, mediaType) => {
            console.log('client 22222222222', client);

            await client.subscribe(user, mediaType);
            console.log("agora----handleUserPublished user from screenShare===>", user)

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

        clientScreenShare.on("user-published", handleUserPublishedTwo);
        clientScreenShare.on("user-unpublished", handleUserUnpublishedTwo);
        //clientScreenShare.on("user-joined", handleUserJoinedTwo);
        //clientScreenShare.on("user-left", handleUserLeftTwo);
        return () => {
            clientScreenShare.on("user-published", handleUserPublishedTwo);
            clientScreenShare.on("user-unpublished", handleUserUnpublishedTwo);
            //clientScreenShare.off("user-joined", handleUserJoinedTwo);
            //clientScreenShare.off("user-left", handleUserLeftTwo);
        };
    }, []);

    return (
        <AgoraRTCScreenShareContext.Provider
            value={{
                handleScreenShareClick,
                isSharingEnabled,
                setIsSharingEnabled,
                localscreenTrack,
            }}
        >
            {children}
        </AgoraRTCScreenShareContext.Provider>
    );

}


const useAgoraScreenShare = () => {
    const agoraObject1 = useContext(AgoraRTCScreenShareContext);
    if (agoraObject1 == null) {
        throw new Error("useAgoraRTC() called outside of a AgoraRTCProvider?");
    }
    return agoraObject1;
};

export { AgoraRTCScreenShareProvider, useAgoraScreenShare };
