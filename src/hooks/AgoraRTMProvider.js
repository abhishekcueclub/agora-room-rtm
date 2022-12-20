import { AdditionalAction, ModeratorToOne, OneToMany, OneToModerator } from "./AgoraConstant";
import React, { useContext, useEffect, useRef, useState } from "react";

import AgoraRTM from "agora-rtm-sdk";
// import { appid } from "./AgoraRTCProvider";
import randomColor from "randomcolor";
import { useAgoraRTC } from "./AgoraRTCProvider";
import { useAlert } from "react-alert";

const AgoraRTMContext = React.createContext(null);


export const chatClient = AgoraRTM.createInstance("2e5346b36d1f40b1bbc62472116d96de");
let channelName = "demo_channel";

const AgoraRTMProvider = ({ children }) => {
    const alert = useAlert();

    // alert.show("Oh look, an alert!");
    // alert.error("You just broke something!");
    // alert.success("It's ok now!");
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


    let [disableAudio, setDisableAudio] = useState(false);
    let [disableVideo, setDisableVideo] = useState(false);
    let [spotlightedUser, setSpotlightedUser] = useState("");
    let [pinUser, setPinUser] = useState("");


    const initRm = async (userId) => {
        await chatClient.login({
            uid: userId.toString()
        });

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

        //  else if (messageObj?.action === "poked") {
        //     setPoked(uid)
        // }
    }

    async function sendChannelMessage(text) {

        const message = JSON.stringify({ text: text, action: OneToMany.TEXT })

        channel
            .sendMessage({ text: message })
            .then(async () => {
                console.log("==>send ", JSON.stringify(text))
                const data = {
                    author: "me",
                    type: 'text',
                    data: { text: text },
                }
                setCurrentMessage(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    async function pressedBuzzer(text) {
        const message = JSON.stringify({ action: AdditionalAction.PRESS_BUZZER })
        channel
            .sendMessage({ text: message })
            .then(async () => {
                console.log("==>send pressedBuzzer ", JSON.stringify(text))

                setBuzzerIsPressedBy(text);
            })
            .catch((err) => {
                console.log(err);
            });
    }


    async function sendChannelMessageToPeer(peerId) {
        console.log("sendChannelMessageToPeer to" + peerId)

        const message = JSON.stringify({ action: AdditionalAction.POKE_USER })

        chatClient
            .sendMessageToPeer({ text: message, offline: false }, peerId)
            .then(async () => {
                console.log("==>sendChannelMessageToPeer ", JSON.stringify(message))

            })
            .catch((err) => {
                console.log(err);
            });
    }

    async function clearPressedBuzzer() {
        const message = JSON.stringify({ action: AdditionalAction.CLEAR_BUZZER })
        channel
            .sendMessage({ text: message })
            .then(async () => {
                setBuzzerIsPressedBy("");
            })
            .catch((err) => {
                console.log(err);
            });
    }

    useEffect(() => {
        if (buzzerPressedBy?.length > 0) {
            setBuzzersList([...buzzersList, buzzerPressedBy]);
        } else {
            setBuzzersList([]);
        }
        // eslint-disable-next-line
    }, [buzzerPressedBy]);



    async function mutePeerAudio(peerId) {
        console.log("mutePeerAudio to" + peerId)

        const message = JSON.stringify({ action: ModeratorToOne.FORCE_MUTED_USER_AUDIO })

        chatClient
            .sendMessageToPeer({ text: message, offline: false }, peerId)
            .then(async () => {
                console.log("==>mutePeerAudio ", JSON.stringify(message))

            })
            .catch((err) => {
                console.log(err);
            });
    }


    async function mutePeerVideo(peerId) {
        console.log("mutePeerVideo to" + peerId)

        const message = JSON.stringify({ action: ModeratorToOne.FORCE_MUTED_USER_VIDEO })

        chatClient
            .sendMessageToPeer({ text: message, offline: false }, peerId)
            .then(async () => {
                console.log("==>mutePeerVideo ", JSON.stringify(message))

            })
            .catch((err) => {
                console.log(err);
            });
    }


    async function spotlightUserAction(userId, username) {

        const message = JSON.stringify({ text: userId === spotlightedUser ? "" : userId, action: OneToMany.SPOTLIGHTED_USER })
        channel
            .sendMessage({ text: message })
            .then(async () => {
                console.log("==>spotlightUserAction ", JSON.stringify(userId))
                if (userId === spotlightedUser) {
                    removePeerSpotlight(spotlightedUser)
                }
                setSpotlightedUser(userId === spotlightedUser ? "" : userId)


            })
            .catch((err) => {
                console.log(err);
            });
        // }

    }
    async function removePeerSpotlight(peerId) {
        console.log("removePeerSpotlight to" + peerId)
        const message = JSON.stringify({ action: OneToMany.REMOVED_SPOTLIGHTED_USER })
        chatClient
            .sendMessageToPeer({ text: message, offline: false }, peerId)
            .then(async () => {
                console.log("==>removePeerSpotlight ", JSON.stringify(message))
            })
            .catch((err) => {
                console.log(err);
            });
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


    function processOneToOneMessage(agoraRTMObject, memberId) {
        console.log("processOneToOneMessage===>", agoraRTMObject)
        // alert.success("your video is disabled " + agoraRTMObject["action"]);

        if (agoraRTMObject.action === OneToModerator.HAND_RAISED) {
            alert.success("hand raised request");

        }
        else if (agoraRTMObject.action === AdditionalAction.POKE_USER) {
            setPoked(memberId)
        }

        else if (agoraRTMObject.action === OneToModerator.INVITED_ON_STAGE_ACCEPT) {

        }
        else if (agoraRTMObject.action === OneToModerator.INVITED_ON_STAGE_REJECT) {

        } else if (agoraRTMObject.action === ModeratorToOne.FORCE_MUTED_USER_AUDIO) {
            alert.success("your audio is disabled");
            // forceAudio(true)
            setDisableAudio(true)
        } else if (agoraRTMObject.action === ModeratorToOne.INVITED_ON_STAGE) {

        } else if (agoraRTMObject.action === ModeratorToOne.FORCE_MUTED_USER_VIDEO) {
            alert.success("your video is disabled");
            setDisableVideo(true)
            // forceVideo(true)
        } else if (agoraRTMObject.action === ModeratorToOne.HAND_RAISE_ACCEPTED) {

        } else if (agoraRTMObject.action === ModeratorToOne.HAND_RAISE_REJECTED) {

        } else if (agoraRTMObject.action === ModeratorToOne.REMOVED_FROM_ROOM) {

        } else if (agoraRTMObject.action === ModeratorToOne.MOVED_TO_AUDIANCE) {

        }
    }

    function processOneToManyMessage(agoraRTMObject, uid) {
        console.log("processOneToManyMessage===>", agoraRTMObject)





        if (agoraRTMObject.action === AdditionalAction.PRESS_BUZZER) {
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
        }

        else if (agoraRTMObject.action === OneToMany.REMOVED_SPOTLIGHTED_USER) {
            setForceEnableVideo(true)
        } else if (agoraRTMObject.action === OneToMany.MAKE_ROOM_PUBLIC) {
            alert.success("your audio is disabled");
        } else if (agoraRTMObject.action === OneToMany.MAKE_ROOM_PRIVATE) {

        } else if (agoraRTMObject.action === OneToMany.RECORDING_STARTED) {
            alert.success("your video is disabled");
        } else if (agoraRTMObject.action === OneToMany.RECORDING_STOPED) {

        } else if (agoraRTMObject.action === OneToMany.REACTION_SEND) {

        } else if (agoraRTMObject.action === OneToMany.STREAM_STATUS) {

        }
    }


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
            }}
        >
            {children}
        </AgoraRTMContext.Provider>
    );

}


const useAgoraRTM = () => {
    const agoraObject = useContext(AgoraRTMContext);
    if (agoraObject == null) {
        throw new Error("useAgoraRTC() called outside of a AgoraRTMProvider?");
    }
    return agoraObject;
};

export { AgoraRTMProvider, useAgoraRTM };
