import React, { useContext, useEffect, useRef, useState } from "react";

import AgoraRTM from "agora-rtm-sdk";
import { appid } from "./AgoraRTCProvider";
import randomColor from "randomcolor";

const AgoraRTMContext = React.createContext(null);


export const chatClient = AgoraRTM.createInstance("2e5346b36d1f40b1bbc62472116d96de");
let channelName = "demo_channel";

const AgoraRTMProvider = ({ children }) => {

    // const [joinState, setJoinState] = useState(false);


    // const {
    //   muteVideo,
    //   muteAudio,

    // } = useAgora();
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
            console.log("agora----MessageFromPeer user===>", message)
            const messageObj = JSON.parse(message?.text)

            if (messageObj?.action === "disableAudio") {
                setDisableAudio(true)
                console.log("agora----disableAudio user===>")
            } else if (messageObj?.action === "disableVideo") {
                setDisableVideo(true)
                console.log("agora----disableVideo user===>")
            } else if (messageObj?.action === "removeSpotlight") {
                setForceEnableVideo(true)
                console.log("agora----disableVideo user===>")
            } else if (messageObj?.action === "poked") {
                setPoked(memberId)
            }

            console.log(memberId + "==>MessageFromPeer", JSON.stringify(message))
        });
        // eslint-disable-next-line
    }, []);

    async function handleMessageReceived(data, uid) {
        // eslint-disable-next-line
        let user = await chatClient.getUserAttributes(uid);

        console.log("agora----handleMessageReceived user===>", user)

        console.log(uid + "==>text-----", JSON.stringify(data))

        const messageObj = JSON.parse(data?.text)
        if (messageObj?.action === "buzzer") {
            setBuzzerIsPressedBy(uid)
        } else if (messageObj?.action === "disableAudio") {
            setDisableAudio(true)
            console.log("agora----disableAudio user===>", user)
        } else if (messageObj?.action === "disableVideo") {
            setDisableVideo(true)
            console.log("agora----disableVideo user===>", user)
        } else if (messageObj?.action === "spotlight") {
            setSpotlightedUser(messageObj?.text)
            setForceEnableVideo(false)
        } else if (messageObj?.action === "clear_buzzer") {
            setBuzzersList([])
        } else if (messageObj?.action === "poked") {
            setPoked(uid)
        } else if (messageObj?.action === "text") {
            const dataMessage = {
                author: "them",
                type: 'text',
                data: {
                    text: uid + ": " + messageObj?.text
                },
            }
            setCurrentMessage(dataMessage);
            // console.log(uid + "1 ==>text-----", JSON.stringify(dataMessage))
        }
    }

    async function sendChannelMessage(text) {

        const message = JSON.stringify({ text: text, action: "text" })

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
        const message = JSON.stringify({ action: "buzzer" })
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

        const message = JSON.stringify({ action: "poked" })

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

        const message = JSON.stringify({ action: "clear_buzzer" })
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

        const message = JSON.stringify({ action: "disableAudio" })

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

        const message = JSON.stringify({ action: "disableVideo" })

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

        // if (userId == spotlightedUser) {
        //   setSpotlightedUser(userId)
        // } else {
        const message = JSON.stringify({ text: userId === spotlightedUser ? "" : userId, action: "spotlight" })
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
        const message = JSON.stringify({ action: "removeSpotlight" })
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
