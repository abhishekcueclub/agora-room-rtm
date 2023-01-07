import AgoraRTC, {
    CameraVideoTrackInitConfig,
    MicrophoneAudioTrackInitConfig
} from "agora-rtc-sdk-ng";
import React, { useContext, useEffect, useState } from "react";

import { UserRole } from "./AgoraConstant";
import VirtualBackgroundExtension from "agora-extension-virtual-background";

export const AgoraRTCContext = React.createContext(null);
export const appid = "61a0d4c67a4342c49298fdd84f9f0f03";
export const client = AgoraRTC.createClient({ codec: "h264", mode: "live" });


// Register the extension
export const extension = new VirtualBackgroundExtension();
AgoraRTC.registerExtensions([extension]);

const AgoraRTCProvider = ({ children }) => {


    // let USER_ID = Math.floor(Math.random() * 100000001)
    // const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState("");
    const [isUserAudience, setIsUserAudience] = useState(true);

    const [currentSpeaker, setCurrentSpeaker] = useState("");

    const [remoteUsers, setRemoteUsers] = useState([]);
    const [removeRemoteUsers, setRemoveRemoteUsers] = useState([]);
    const [addRemoteUsers, setAddRemoteUsers] = useState([]);

    // actual userId
    // const [remoteUserIds, setRemoteUserIds] = useState([]);
    // id to index map Data in Map
    const [remoteUserIndexViaIdMap, setRemoteUserIndexViaIdMap] = useState(null);
    // User Data in Map
    const [remoteUsersMap, setRemoteUsersMap] = useState(null);
    // User index
    const [remoteUsersSet, setRemoteUsersSet] = useState([]);

    // // Video Enabled UserList
    // const [videoEnabledUserList, setVideoEnabledUserList] = useState([]);
    // // Video Disable UserList
    // const [videoDisabledUserList, setVideoDisabledUserList] = useState([]);



    const [localVideoTrack, setLocalVideoTrack] = useState(null);
    const [localAudioTrack, setLocalAudioTrack] = useState(null);

    const [joinState, setJoinState] = useState(false);

    const [muteVideoState, setMuteVideoState] = useState(true)
    const [muteAudioState, setMuteAudioState] = useState(true)
    // eslint-disable-next-line
    const [processor, setProcessor] = useState(null)
    // eslint-disable-next-line
    const [virtualBackgroundEnabled, setVirtualBackgroundEnabled] = useState(false)
    // const [isUserAudience, setIsUserAudience] = useState(true);
    const [localscreenTrack, setLocalScreenTack] = useState(null);
    // const [tok, setTok] = useState('');
    const [role, setRole] = useState(UserRole.LISTENER);
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
    async function updateRole(role) {
        console.log('kkkkkk', role)
        setRole(role);
        setIsUserAudience(role === UserRole.MODERATOR || role === UserRole.SPEAKER ? false : true)
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

        console.log("createLocalTracks===> " + cameraTrack);

        setLocalAudioTrack(microphoneTrack);
        setLocalVideoTrack(cameraTrack);

        return [microphoneTrack, cameraTrack];
    }

    async function join(channel, token, initRm, username_detail) {
        console.log("Join --- client", client)
        // setTok(token);
        if (!client) return;

        console.log("Join --- 1")
        const [microphoneTrack, cameraTrack] = await createLocalTracks();

        await client.join(appid, channel, token, username_detail);
        await client.setClientRole(isUserAudience ? 'audience' : 'host');
        if (!isUserAudience) {
            //** camera check */
            var devices = await AgoraRTC.getDevices();
            var cameras = devices.filter(device => device.kind === 'videoinput');
            console.log("cameras===>", cameras)
            microphoneTrack.setEnabled(false)
            if (cameras.length > 0) {
                // const videoTrack = await AgoraRTC.createCameraVideoTrack();
                // console.warn(" camera Found!!!");
                cameraTrack.setEnabled(false)
                await client.publish([microphoneTrack, cameraTrack]);
            } else {
                await client.publish([microphoneTrack]);
                // console.warn("No camera only audio!!!");
            }
        }

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
        setAddRemoteUsers([]);

        // Empty all variable 
        setJoinState(false);
        await client.leave();
    }

    // const [videoEnabledUserList, setVideoEnabledUserList] = useState([]);
    // const [videoDisabledUserList, setVideoDisabledUserList] = useState([]);


    // useEffect(() => {
    //     const remoteUserProcess = remoteUsersMap != null ? remoteUsersMap : new Map();
    //     const remoteUidDataProcess = []
    //     console.log("===>remoteUsers", remoteUsers)
    //     // eslint-disable-next-line

    //     let index = 0
    //     remoteUsers.map((userData) => {
    //         // console.log("userData====>uid", userData?.uid)
    //         // console.log("userData====>", userData?.uid)
    //         // remoteUserProcess.set(userData?.uid, userData);
    //         // remoteUidDataProcess.push(userData?.uid)
    //         remoteUserProcess.set(index, userData);
    //         remoteUidDataProcess.push(index)
    //         index = index + 1
    //     })
    //     // setRemoteUsersMap(remoteUserProcess)
    //     console.log("remoteUsersSet=====>", remoteUidDataProcess)

    //     setRemoteUsersSet([...new Set([...remoteUidDataProcess])])
    // eslint-disable-next-line
    // }, [remoteUsers])


    useEffect(() => {
        if (!client) return;
        setAddRemoteUsers(client.remoteUsers);

        const handleUserPublished = async (user, mediaType) => {
            await client.subscribe(user, mediaType);
            console.log("agora----handleUserPublished user===>", user)

            // toggle rerender while state of remoteUsers changed.
            setAddRemoteUsers((remoteUsers) => Array.from(client.remoteUsers));
        };

        const handleUserUnpublished = (user) => {
            console.log("agora----handleUserUnpublished user===>", user)


            setAddRemoteUsers((remoteUsers) => Array.from(client.remoteUsers));
        };

        /* 
        * User joined processing for ordering 
        */
        const handleUserJoined = (user) => {
            console.log("agora----handleUserJoined user===>", user)
            setAddRemoteUsers((remoteUsers) => Array.from(client.remoteUsers));
        };

        const handleUserLeft = (user) => {
            console.log("agora----handleUserLeft user===>", user)
            setRemoveRemoteUsers((remoteUsers) => Array.from(client.remoteUsers));
        };


        const highlightingaSpeaker = (user) => {
            console.log("agora----highlightingaSpeaker user===>", user)
            // console.log("agora----highlightingaSpeaker remoteUsers===>", addRemoteUsers)
            user.sort((a, b) => b.level - a.level)
            if (user?.length > 1) {
                setCurrentSpeaker(user[0]?.uid)
            }
        };



        client.on("user-published", handleUserPublished);
        client.on("user-unpublished", handleUserUnpublished);

        client.on("user-joined", handleUserJoined);
        client.on("user-left", handleUserLeft);
        client.enableAudioVolumeIndicator();
        client.on("volume-indicator", highlightingaSpeaker);
        client.onPlaybackDeviceChanged = (info) => {
            console.log("speaker changed!", info.state, info.device);
        };

        client.onMicrophoneChanged = (info) => {
            console.log("microphone changed!", info.state, info.device);
        };

        client.onCameraChanged = (info) => {
            console.log("camera changed!", info.state, info.device);
        };
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
        addUser()
        // eslint-disable-next-line
    }, [addRemoteUsers])



    useEffect(() => {

        removeUser()
        // eslint-disable-next-line
    }, [removeRemoteUsers])



    const updateCameraEnabledForUser = (userId, setCameraEnabledForUser) => {
        console.log("updateCameraEnabledForUser=======>" + userId)
        onVideoStateChanged(userId, setCameraEnabledForUser)
    }

    const addUser = () => {
        const remoteUserProcess = remoteUsersMap !== null ? remoteUsersMap : new Map();
        const remoteUserIndexViaIdProcess = remoteUserIndexViaIdMap !== null ? remoteUserIndexViaIdMap : new Map();
        const remoteUidDataProcess = remoteUsersSet
        // eslint-disable-next-line
        let index = remoteUsersSet.length
        console.log("addUser====index", index)
        console.log("addUser====remoteUsersSet", remoteUsersSet.length)
        console.log("addUser====remoteUserProcess", remoteUserProcess)
        console.log("addUser====remoteUserIndexViaIdProcess", remoteUserIndexViaIdProcess)


        if (remoteUsersSet.length != addRemoteUsers?.length) {
            addRemoteUsers.map((userData) => {
                if (!remoteUsersSet?.includes(userData?.uid)) {

                    // console.log("userData====>uid", userData?.uid)
                    // console.log("userData====>", userData?.uid)
                    remoteUserProcess.set(userData?.uid, userData);
                    remoteUidDataProcess.push(userData?.uid)
                    remoteUserIndexViaIdProcess.set(index, userData?.uid);
                    index = index + 1
                }
            })

            console.log("remoteUserIndexViaIdProcess=======>", remoteUserIndexViaIdProcess)
            console.log("remoteUsersSet=====>remoteUserProcess", remoteUserProcess)
            console.log("remoteUsersSet=====>", remoteUidDataProcess)

            setRemoteUserIndexViaIdMap(remoteUserIndexViaIdProcess)
            setRemoteUsersMap(remoteUserProcess)
            setRemoteUsersSet([...new Set([...remoteUidDataProcess])])
            setRemoteUsers(addRemoteUsers)
        }
    }

    const removeUser = () => {

        const remoteUserProcess = remoteUsersMap !== null ? remoteUsersMap : new Map();
        const remoteUserIndexViaIdProcess = remoteUserIndexViaIdMap !== null ? remoteUserIndexViaIdMap : new Map();
        // eslint-disable-next-line

        const getActiveUserids = removeRemoteUsers?.map((userData) => {
            return userData?.uid
        })

        remoteUsersSet.map((userId) => {
            if (!getActiveUserids?.includes(userId)) {
                remoteUserProcess.delete(userId);
                const indexOfRemovedUser = getIndexbyUserid(userId)

                if (indexOfRemovedUser <= getIndexbyUserid(userId)) {

                    console.log("userDataId===>indexOfRemovedUser", indexOfRemovedUser)

                    const userDataId = remoteUsersSet[remoteUsersSet?.length - 1]
                    console.log("userDataId===>", userDataId)
                    remoteUserIndexViaIdProcess.set(indexOfRemovedUser, userDataId);
                }
            }
        })
        setRemoteUsersMap(remoteUserProcess)
        console.log("userDataId===>getActiveUserids", getActiveUserids)
        console.log("userDataId===>remoteUserIndexViaIdProcess", remoteUserIndexViaIdProcess)
        setRemoteUserIndexViaIdMap(remoteUserIndexViaIdProcess)
        setRemoteUsersSet([...new Set([...getActiveUserids])])
        setRemoteUsers(removeRemoteUsers)
    }

    const getIndexbyUserid = (userid) => {
        let idIndexValue = -1
        const idValue = [...Array(remoteUsersSet?.length)].map((_, idIndex) => {
            const id = remoteUserIndexViaIdMap?.get(idIndex)
            if (userid === id) {
                idIndexValue = idIndex
            }

        })
        console.log("idIndexValue==> userid", userid)
        console.log("idIndexValue==> remoteUserIndexViaIdMap", remoteUserIndexViaIdMap)
        console.log("idIndexValue==>", idIndexValue)
        return idIndexValue
    }
    // eslint-disable-next-line
    const sortUserOnJoinRemoveAndVideoStateChange = () => {


        // Get indexOf of video disabled user
        const videoEnabledStateUsersId = []
        const videoEnabledStateUsersIndex = []
        const _ = [...Array(remoteUsersSet?.length)].map((_, idIndex) => {
            const userId = remoteUserIndexViaIdMap?.get(idIndex)
            const user = remoteUsersMap?.get(userId)
            if (!user?._video_muted_) {
                videoEnabledStateUsersId.push(userId)
                videoEnabledStateUsersIndex.push(idIndex)
            }
        })

        // as name suggest
        const reverseVideoEnabledStateUsersId = videoEnabledStateUsersId?.reverse()
        const reverseVideoEnabledStateUsersIndex = videoEnabledStateUsersIndex?.reverse()


        let videoUsedIndex = 0

        const remoteUserIndexViaIdProcess = remoteUserIndexViaIdMap !== null ? remoteUserIndexViaIdMap : new Map();

        console.log("=================> * init Order the enabled Camera Index ", reverseVideoEnabledStateUsersIndex, reverseVideoEnabledStateUsersId)


        const idValue = [...Array(remoteUsersSet?.length)].map((_, idIndex) => {
            // Main List of User
            const userId = remoteUserIndexViaIdMap?.get(idIndex)
            const user = remoteUsersMap?.get(userId)


            // EnabledVideo User List in  reverse order

            if (user?._video_muted_ && idIndex < reverseVideoEnabledStateUsersIndex?.length) {

                console.log("=================> * Order user ", user)
                console.log("=================> * Order the enabled Camera Index ", reverseVideoEnabledStateUsersIndex, reverseVideoEnabledStateUsersId)


                // if (idIndex < videoEnabledStateUsersIndex?.length) {
                const videoDisabledId = user?.uid
                const videoEnabledUserid = reverseVideoEnabledStateUsersId[videoUsedIndex]
                const videoEnabledUseridIndex = reverseVideoEnabledStateUsersIndex[videoUsedIndex]
                videoUsedIndex = videoUsedIndex + 1
                remoteUserIndexViaIdProcess.set(videoEnabledUseridIndex, videoDisabledId)
                remoteUserIndexViaIdProcess.set(idIndex, videoEnabledUserid)

                console.log("=================> * Order the disable Camera Index ", idIndex, videoDisabledId)
                console.log("=================> * Order the enabled Camera Index " + videoEnabledUseridIndex, videoEnabledUserid)
                // }
            }

        })

        setRemoteUserIndexViaIdMap(remoteUserIndexViaIdProcess)





        console.log("sortUserOnJoinRemoveAndVideoStateChange----->", remoteUsersSet)
        // eslint-disable-next-line

    }


    // useEffect(() => {
    //     sortUserOnJoinRemoveAndVideoStateChange()
    //     // eslint-disable-next-line
    // }, [remoteUsers])


    const onVideoStateChanged = (userId, setCameraEnabledForUser) => {
        console.log("updateCameraEnabledForUser=======>" + userId)
        setTimeout(() => {
            sortUserOnJoinRemoveAndVideoStateChange()
            setCameraEnabledForUser(null)

        }, 3000)
    }





    return (
        <AgoraRTCContext.Provider
            value={{
                localAudioTrack,
                localVideoTrack,
                joinState,
                leave,
                join,
                remoteUsers,
                addRemoteUsers,
                muteVideo,
                muteAudio,
                muteVideoState,
                muteAudioState,
                // userId,
                username,
                isUserAudience,
                localscreenTrack,
                updateUsername,
                role,
                updateRole,
                currentSpeaker,
                isUserAudience,
                setIsUserAudience,
                setBackgroundBlurring,
                setBackgroundColor,
                remoteUsersMap,
                remoteUsersSet,
                setBackgroundImage,
                forceAudio,
                forceVideo,
                client,
                remoteUserIndexViaIdMap,
                updateCameraEnabledForUser

            }}
        >
            {children}
        </AgoraRTCContext.Provider>
    );

}


const useAgoraRTC = () => {
    const agoraObject = useContext(AgoraRTCContext);
    if (agoraObject === null) {
        throw new Error("useAgoraRTC() called outside of a AgoraRTCProvider?");
    }
    return agoraObject;
};

export { AgoraRTCProvider, useAgoraRTC };
