import { AdditionalAction, ModeratorToOne, OneToMany, OneToModerator, RoomMediaType, RoomType, UserRole } from "./AgoraConstant";
import React, { useContext, useEffect, useRef, useState } from "react";

// alert.show("Oh look, an alert!");
// alert.error("You just broke something!");
// alert.success("It's ok now!");
import AgoraRTM from "agora-rtm-sdk";
// import { appid } from "./AgoraRTCProvider";
import randomColor from "randomcolor";
// import { useAgoraRTC } from "./AgoraRTCProvider";
import { useAlert } from "react-alert";

const AgoraRTMContext = React.createContext(null);


export const chatClient = AgoraRTM.createInstance("2e5346b36d1f40b1bbc62472116d96de");
let channelName = "demo_channel";

const AgoraRTMProvider = ({ children }) => {
    const alert = useAlert();

    const [username, setUsername] = useState("");

    let [messages, setMessages] = useState([]);
    // eslint-disable-next-line
    let [members, setMembers] = useState([]);

    let [currentMessage, setCurrentMessage] = useState();
    let [buzzerPressedBy, setBuzzerIsPressedBy] = useState("");

    let [buzzersList, setBuzzersList] = useState([]);

    // eslint-disable-next-line
    let color = useRef(randomColor({ luminosity: "dark" })).current;
    let channel = useRef(chatClient.createChannel(channelName)).current;


    let [poked, setPoked] = useState(null);
    let [forceEnableVideo, setForceEnableVideo] = useState(false);


    let [forceRemoveUser, setForceRemoveUser] = useState(false);
    let [disableAudio, setDisableAudio] = useState(false);
    let [disableVideo, setDisableVideo] = useState(false);
    let [spotlightedUser, setSpotlightedUser] = useState("");
    let [pinUser, setPinUser] = useState("");
    let [isShareShareStatus, setShareShareStatus] = useState(false);
    // eslint-disable-next-line
    let [enableHandRaised, setEnableHandRaised] = useState(false);
    // eslint-disable-next-line
    let [isHandRaised, setHandRaised] = useState(false);
    // eslint-disable-next-line
    let [handRaisedUser, setHandRaisedUsers] = useState([]);
    let [newHandRaised, setNewHandRaised] = useState("");
    let [removehandRaised, setRemoveHandRaised] = useState("");
    let [userRole, setUserRole] = useState("");
    let [invitedOnStage, setInvitedOnStage] = useState("");

    let [roomType, setRoomType] = useState(RoomType.PRIVATE);
    let [roomMediaType, setRoomMediaType] = useState(RoomMediaType.AUDIO);
    let [recordingStatus, setRecordingStatus] = useState(false);



    let [cameraEnabledForUser, setCameraEnabledForUser] = useState(null);




    useEffect(() => {
        console.log("RTM username " + username)

    }, [username])

    const initRm = async (userId) => {
        await chatClient.login({
            uid: userId.toString()
        });
        setUsername(userId)

        channel
            .getMembers()
            .then((res) => {
                setMembers(res);
            })
            .catch((err) => console.log(err));

        // if (!members.includes(USER_ID.toString())) {
        await channel.join();
        // }

        await chatClient.setLocalUserAttributes({
            name: userId.toString(),
            color
        });
    };

    useEffect(() => {
        channel.on("ChannelMessage", (data, uid) => {
            console.log("agora----ChannelMessage user===>", uid)

            handleMessageReceived(data, uid);
        });

        channel.on("AttributesUpdated", (attr) => {
            console.log("agora----AttributesUpdated user===>", attr)
            console.log("==>AttributesUpdated", JSON.stringify(attr))
        });

        chatClient.on("MessageFromPeer", async (message, memberId) => {
            const messageObj = JSON.parse(message?.text)
            processOneToOneMessage(messageObj, memberId)
        });
        // eslint-disable-next-line
    }, []);

    async function handleMessageReceived(data, uid) {
        // eslint-disable-next-line
        let user = await chatClient.getUserAttributes(uid);
        const messageObj = JSON.parse(data?.text)
        processOneToManyMessage(messageObj, uid)
    }

    async function sendChannelMessage(text) {

        const message = JSON.stringify({ text: text, action: OneToMany.TEXT })
        sendMessageChannel(message, function (result, error) {
            if (result != null) {
                console.log("==>send ", JSON.stringify(text))
                const data = {
                    author: "me",
                    type: 'text',
                    data: { text: text },
                }
                setCurrentMessage(data);
            }
        })
    }

    async function enableHandRaisedAction() {
        const message = JSON.stringify({ action: enableHandRaised ? OneToMany.DISABLE_HAND_RAISED : OneToMany.ENABLE_HAND_RAISED })
        sendMessageChannel(message, function (result, error) {
            if (result != null) {
                setEnableHandRaised(!enableHandRaised)
            }
        })
    }




    async function recordingStatusAction() {
        const message = JSON.stringify({ action: OneToMany.RECORDING_STATUS, status: !recordingStatus })

        // Make API Calls
        sendMessageChannel(message, function (result, error) {
            if (result != null) {
                setRecordingStatus(!recordingStatus);
            }
        })
    }

    async function pressedBuzzer(text) {
        const message = JSON.stringify({ action: AdditionalAction.PRESS_BUZZER })

        sendMessageChannel(message, function (result, error) {
            if (result != null) {
                setBuzzerIsPressedBy(text);
            }
        })
    }
    async function clearPressedBuzzer() {
        const message = JSON.stringify({ action: AdditionalAction.CLEAR_BUZZER })
        sendMessageChannel(message, function (result, error) {
            if (result != null) {
                setBuzzerIsPressedBy("");
            }
        })
    }

    async function sendChannelMessageToPeer(peerId) {
        console.log("sendChannelMessageToPeer to" + peerId)

        const message = JSON.stringify({ action: AdditionalAction.POKE_USER })
        sendMessageToPeer(message, peerId, function (result, error) {
            if (result != null) {
                console.log("==>sendMessageToPeer ", message)
            }
        })
    }



    useEffect(() => {
        if (buzzerPressedBy?.length > 0) {
            setBuzzersList([...buzzersList, buzzerPressedBy]);
        } else {
            setBuzzersList([]);
        }
        // eslint-disable-next-line
    }, [buzzerPressedBy]);

    async function forceRemoveUserAction(peerId) {
        console.log("forceRemoveUser to" + peerId)
        const message = JSON.stringify({ action: ModeratorToOne.REMOVED_FROM_ROOM })

        sendMessageToPeer(message, peerId, function (result, error) {
            if (result != null) {
                setForceRemoveUser(false)
                console.log("==>forceRemoveUser ", message)
            }
        })
    }



    async function mutePeerAudio(peerId) {
        console.log("mutePeerAudio to" + peerId)

        const message = JSON.stringify({ action: ModeratorToOne.FORCE_MUTED_USER_AUDIO })

        sendMessageToPeer(message, peerId, function (result, error) {
            if (result != null) {
                console.log("==>sendMessageToPeer ", message)
            }
        })
    }


    async function mutePeerVideo(peerId) {
        console.log("mutePeerVideo to" + peerId)
        const message = JSON.stringify({ action: ModeratorToOne.FORCE_MUTED_USER_VIDEO })

        sendMessageToPeer(message, peerId, function (result, error) {
            if (result != null) {
                console.log("==>sendMessageToPeer ", message)
            }
        })
    }


    async function sendMessageChannel(message, callback) {
        channel
            .sendMessage({ text: message })
            .then(async () => {
                callback(message, null)
            })
            .catch((err) => {
                console.error(err);
                callback(null, err)
            });
    }


    async function updateRoomMediaTypeAction(roomMediaTypeValue) {
        const message = JSON.stringify({ text: "", action: OneToMany.CONVERT_VIDEO_ROOM, additionalData: { roomMediaTypeValue: roomMediaTypeValue } })
        sendMessageChannel(message, function (result, error) {
            if (result != null) {
                setRoomMediaType(roomMediaTypeValue)
                // callback(result, null)
                console.log("==>updateRoomTypeAction ")
            } else {
                // callback(null, error)
            }
        })
    }

    async function updateRoomTypeAction(roomTypeValue) {
        const message = JSON.stringify({ text: "", action: OneToMany.UPDATE_ROOM_TYPE, additionalData: { roomType: roomTypeValue } })
        sendMessageChannel(message, function (result, error) {
            if (result != null) {
                setRoomType(roomTypeValue)
                // callback(result, null)
                console.log("==>updateRoomTypeAction ")
            } else {
                // callback(null, error)
            }
        })
    }


    async function shareShareAction(status, callback) {
        const message = JSON.stringify({ text: "", action: OneToMany.SCREEN_SHARED, status: status })
        sendMessageChannel(message, function (result, error) {
            if (result != null) {
                setShareShareStatus(true);
                callback(result, null)
                console.log("==>shareShareAction ", JSON.stringify(result))
            } else {
                setShareShareStatus(false);
                callback(null, error)
            }
        })
    }


    async function spotlightUserAction(userId, username) {

        const message = JSON.stringify({ text: userId === spotlightedUser ? "" : userId, action: OneToMany.SPOTLIGHTED_USER })
        sendMessageChannel(message, function (result, error) {
            if (result != null) {
                console.log("==>spotlightUserAction ", JSON.stringify(userId))
                if (userId === spotlightedUser) {
                    removePeerSpotlight(spotlightedUser)
                }
                setSpotlightedUser(userId === spotlightedUser ? "" : userId)
            }
        })
    }


    async function sendMessageToPeer(message, peerId, callback) {
        chatClient
            .sendMessageToPeer({ text: message, offline: false }, peerId)
            .then(async () => {
                callback({
                    message,
                    peerId
                }, null)
            })
            .catch((err) => {
                console.log(err);
                callback(null, err)

            });
    }

    async function removePeerSpotlight(peerId) {
        console.log("removePeerSpotlight to" + peerId)
        const message = JSON.stringify({ action: OneToMany.REMOVED_SPOTLIGHTED_USER })
        sendMessageToPeer(message, peerId, function (result, error) {
            if (result != null) {
                console.log("==>sendMessageToPeer ", message)
            }
        })


    }

    function pinUserAction(userId) {
        if (userId.length === 0) {
            removePeerSpotlight(userId)
        }
        setPinUser(userId)
    }

    useEffect(() => {
        if (currentMessage) setMessages([...messages, currentMessage]);
        // eslint-disable-next-line
    }, [currentMessage]);


    async function acceptedRejectHandRaised(peerId, status) {
        const message = JSON.stringify({ action: status ? ModeratorToOne.HAND_RAISE_ACCEPTED : ModeratorToOne.HAND_RAISE_REJECTED, senderId: username, peerId: peerId })

        // const message = JSON.stringify({ action: AdditionalAction.POKE_USER })
        sendMessageToPeer(message, peerId, function (result, error) {
            if (result != null) {
                console.log("==>sendMessageToPeer ", message)

                sendMessageChannel(message, function (result, error) {
                    if (result != null) {
                        console.log("==>sendMessageToPeer ", message)
                        setRemoveHandRaised(peerId)
                    }
                })
            }
        })
    }



    async function sendCameraEnabledDisabled(status) {
        const message = JSON.stringify({ action: OneToMany.ENABLE_CAMERA, senderId: username, peerId: username, status: status })

        sendMessageChannel(message, function (result, error) {
            if (result != null) {
                console.log("==>sendCameraEnabledDisabled ", JSON.stringify(result))
            }
        })
    }

    // async function inviteOnStageAction(peerId) {
    //     const message = JSON.stringify({ text: "", role, peerId: peerId })
    // sendMessageChannel(message, function (result, error) {
    //     if (result != null) {
    //         console.log("==>inviteOnStageAction ")

    //     } else {
    //         console.log("==>inviteOnStageAction ")
    //     }
    // })
    // }

    // inviteOnStageAction(username, invitedOnStage, false)
    async function inviteOnStageAction(peerId, role) {
        const message = JSON.stringify({
            action: ModeratorToOne.INVITED_ON_STAGE,
            senderId: username,
            peerId: peerId,
            additionalData: {
                role: role
            }
        })
        // const message = JSON.stringify({ action: AdditionalAction.POKE_USER })
        sendMessageToPeer(message, peerId, function (result, error) {
            if (result != null) {
                console.log("==>inviteOnStageAction ", message)
            }
        })
    }

    async function acceptRejectInviteOnStageAction(peerId, role, status) {
        const message = JSON.stringify({
            action: status ? OneToModerator.INVITED_ON_STAGE_ACCEPT : OneToModerator.INVITED_ON_STAGE_REJECT,
            senderId: username,
            peerId: peerId,
            additionalData: {
                role: role
            }
        })

        sendMessageChannel(message, function (result, error) {
            if (result != null) {
                console.log("==>inviteOnStageAction ")

            } else {
                console.log("==>inviteOnStageAction ")
            }
        })
    }

    async function raiseHand() {
        const message = JSON.stringify({ text: "", action: OneToMany.HAND_RAISED, senderId: username, status: !isHandRaised })
        sendMessageChannel(message, function (result, error) {
            if (result != null) {
                if (!isHandRaised) {
                    setHandRaised(true)
                    setNewHandRaised(username)
                } else {
                    setRemoveHandRaised(username)
                    setHandRaised(false)
                }
            } else {
                console.log("==>raiseHand ")
            }
        })
    }



    function processOneToOneMessage(agoraRTMObject, memberId) {
        console.log("processOneToOneMessage===>", agoraRTMObject)



        if (agoraRTMObject.action === ModeratorToOne.REMOVED_FROM_ROOM) {
            alert.success("You have been removed from room by mod");
            // setRemoveHandRaised(agoraRTMObject.peerId)
            // setHandRaised(false)
            setForceRemoveUser(true)
        } else if (agoraRTMObject.action === ModeratorToOne.INVITED_ON_STAGE && agoraRTMObject.additionalData.role === UserRole.LISTENER) {
            setUserRole(UserRole.LISTENER)
            alert.success("You are a listener");
            setRemoveHandRaised(agoraRTMObject.peerId)
            setHandRaised(false)
            setUserRole(UserRole.LISTENER)

        } else if (agoraRTMObject.action === ModeratorToOne.INVITED_ON_STAGE && agoraRTMObject.additionalData.role !== UserRole.LISTENER) {
            setInvitedOnStage(agoraRTMObject.additionalData.role)
            alert.success(`You are a ${agoraRTMObject.additionalData.role}`);
            setRemoveHandRaised(agoraRTMObject.peerId)
            setHandRaised(false)

        } else if (agoraRTMObject.action === ModeratorToOne.HAND_RAISE_ACCEPTED) {
            setUserRole(UserRole.SPEAKER)
            alert.success("hand raise accepted");
            setRemoveHandRaised(agoraRTMObject.peerId)
            setHandRaised(false)

        } else if (agoraRTMObject.action === ModeratorToOne.HAND_RAISE_REJECTED) {

            alert.success("hand raise rejected");
            setRemoveHandRaised(agoraRTMObject.peerId)
            setHandRaised(false)
        } else if (agoraRTMObject.action === OneToModerator.HAND_RAISED) {
            alert.success("hand raised request");
        }
        else if (agoraRTMObject.action === AdditionalAction.POKE_USER) {
            setPoked(memberId)
        }
        else if (agoraRTMObject.action === ModeratorToOne.FORCE_MUTED_USER_AUDIO) {
            alert.success("your audio is disabled");
            setDisableAudio(true)
        } else if (agoraRTMObject.action === ModeratorToOne.INVITED_ON_STAGE) {

        } else if (agoraRTMObject.action === ModeratorToOne.FORCE_MUTED_USER_VIDEO) {
            alert.success("your video is disabled");
            setDisableVideo(true)
        } else if (agoraRTMObject.action === ModeratorToOne.HAND_RAISE_ACCEPTED) {

        } else if (agoraRTMObject.action === ModeratorToOne.HAND_RAISE_REJECTED) {

        } else if (agoraRTMObject.action === ModeratorToOne.REMOVED_FROM_ROOM) {

        } else if (agoraRTMObject.action === ModeratorToOne.MOVED_TO_AUDIANCE) {

        }
    }


    function processOneToManyMessage(agoraRTMObject, uid) {
        console.log(username + "  >processOneToManyMessage===", agoraRTMObject)




        if (agoraRTMObject.action === OneToMany.ENABLE_CAMERA) {
            // setRoomMediaType(agoraRTMObject?.additionalData.roomMediaTypeValue)
            setCameraEnabledForUser(agoraRTMObject.peerId)
        } else
            if (agoraRTMObject.action === OneToMany.RECORDING_STATUS) {
                // setRoomMediaType(agoraRTMObject?.additionalData.roomMediaTypeValue)
                setRecordingStatus(agoraRTMObject.status)
            } else if (agoraRTMObject.action === OneToMany.CONVERT_VIDEO_ROOM) {
                setRoomMediaType(agoraRTMObject?.additionalData.roomMediaTypeValue)
            } else if (agoraRTMObject.action === OneToMany.UPDATE_ROOM_TYPE) {
                setRoomType(agoraRTMObject?.additionalData.roomType)
            } else if (agoraRTMObject.action === OneToModerator.INVITED_ON_STAGE_REJECT) {
                alert.success(agoraRTMObject?.additionalData?.role + " invite is rejected by " + agoraRTMObject.peerId);
                setUserRole(UserRole.LISTENER)

            } else if (agoraRTMObject.action === OneToModerator.INVITED_ON_STAGE_ACCEPT) {
                alert.success(agoraRTMObject?.additionalData?.role + " invite is accepted by " + agoraRTMObject.peerId);
                setUserRole(UserRole.LISTENER)

            } else if (agoraRTMObject.action === ModeratorToOne.HAND_RAISE_ACCEPTED) {
                setRemoveHandRaised(agoraRTMObject.peerId)
            } else if (agoraRTMObject.action === ModeratorToOne.HAND_RAISE_REJECTED) {
                // if (agoraRTMObject.peerId === username) {
                //     // setRole("")

                //     alert.success("hand raise rejected");
                // }
                setRemoveHandRaised(agoraRTMObject.peerId)
            } else if (agoraRTMObject.action === OneToMany.HAND_RAISED) {
                console.log("remain handRaisedUser processOneToManyMessage===>", handRaisedUser)

                if (agoraRTMObject?.status) {
                    setNewHandRaised(agoraRTMObject?.senderId)

                } else {
                    setRemoveHandRaised(agoraRTMObject?.senderId)
                }

            }
            else if (agoraRTMObject.action === OneToMany.DISABLE_HAND_RAISED) {
                setEnableHandRaised(false)
            } else if (agoraRTMObject.action === OneToMany.ENABLE_HAND_RAISED) {
                setEnableHandRaised(true)
            } else if (agoraRTMObject.action === AdditionalAction.PRESS_BUZZER) {
                setBuzzerIsPressedBy(uid)
            } else if (agoraRTMObject.action === AdditionalAction.CLEAR_BUZZER) {
                setBuzzersList([])
            }
            else if (agoraRTMObject.action === OneToMany.SPOTLIGHTED_USER) {
                alert.success("SPOTLIGHTED_USER");
                setSpotlightedUser(agoraRTMObject?.text)
                setForceEnableVideo(false)
            } else if (agoraRTMObject.action === OneToMany.TEXT) {
                const dataMessage = {
                    author: "them",
                    type: 'text',
                    data: {
                        text: uid + ": " + agoraRTMObject?.text
                    },
                }
                setCurrentMessage(dataMessage);
            } else if (agoraRTMObject.action === OneToMany.REMOVED_SPOTLIGHTED_USER) {
                setForceEnableVideo(true)
            } else if (agoraRTMObject.action === OneToMany.MAKE_ROOM_PUBLIC) {
                alert.success("your audio is disabled");
            } else if (agoraRTMObject.action === OneToMany.MAKE_ROOM_PRIVATE) {

            } else if (agoraRTMObject.action === OneToMany.RECORDING_STARTED) {
                alert.success("your video is disabled");
            } else if (agoraRTMObject.action === OneToMany.RECORDING_STOPED) {

            } else if (agoraRTMObject.action === OneToMany.REACTION_SEND) {

            } else if (agoraRTMObject.action === OneToMany.STREAM_STATUS) {

            } else if (agoraRTMObject.action === OneToMany.SCREEN_SHARED) {
                setShareShareStatus(agoraRTMObject?.status)
            }
    }

    // let [newHandRaised, setNewHandRaised] = useState("");
    // let [removehandRasied, setRemoveHandRaised] = useState("");

    useEffect(() => {
        if (removehandRaised.length > 0) {

            const userList = handRaisedUser?.filter((user) => {
                return user !== removehandRaised
            })
            console.log("remain user processOneToManyMessage===>", userList)
            setHandRaisedUsers(userList)
            setRemoveHandRaised("")
        }
        console.log("remain removehandRaised processOneToManyMessage===>", handRaisedUser)
        // eslint-disable-next-line
    }, [removehandRaised])

    useEffect(() => {
        if (newHandRaised.length > 0) {
            setHandRaisedUsers([...handRaisedUser, newHandRaised])
            setNewHandRaised("")

        }
        console.log("remain newHandRaised processOneToManyMessage===>", handRaisedUser)
        // eslint-disable-next-line
    }, [newHandRaised])

    // let [roomType, setRoomType] = useState(RoomType.PRIVATE);



    return (
        <AgoraRTMContext.Provider
            value={{
                messages,
                sendChannelMessage,
                color,
                initRm,
                pressedBuzzer,
                clearPressedBuzzer,
                buzzersList,
                poked,
                setPoked,
                sendChannelMessageToPeer,
                disableAudio,
                setDisableAudio,
                disableVideo,
                setDisableVideo,
                spotlightedUser,
                spotlightUserAction,
                mutePeerVideo,
                mutePeerAudio,
                pinUser,
                pinUserAction,
                forceEnableVideo,
                shareShareAction,
                isShareShareStatus,
                isHandRaised,
                enableHandRaised,
                enableHandRaisedAction,
                raiseHand,
                handRaisedUser,
                acceptedRejectHandRaised,
                userRole,
                inviteOnStageAction,
                invitedOnStage,
                acceptRejectInviteOnStageAction,
                updateRoomTypeAction,
                roomType,
                updateRoomMediaTypeAction,
                roomMediaType,
                forceRemoveUserAction,
                forceRemoveUser,
                recordingStatusAction,
                recordingStatus,
                cameraEnabledForUser,
                sendCameraEnabledDisabled,
                setCameraEnabledForUser
            }}
        >
            {children}
        </AgoraRTMContext.Provider>
    );

}


const useAgoraRTM = () => {
    const agoraObject = useContext(AgoraRTMContext);
    if (agoraObject === null) {
        throw new Error("useAgoraRTM() called outside of a AgoraRTMProvider?");
    }
    return agoraObject;
};

export { AgoraRTMProvider, useAgoraRTM };
