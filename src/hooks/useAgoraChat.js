import { useEffect, useRef, useState } from "react";

import randomColor from "randomcolor";

// import AgoraRTM from "agora-rtm-sdk";


// import AgoraRTM from "agora-rtm-sdk";



// let USER_ID = Math.floor(Math.random() * 100000001);

export default function useAgoraChat(client, channelName) {
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
  let channel = useRef(client.createChannel(channelName)).current;


  let [poked, setPoked] = useState(null);


  let [disableAudio, setDisableAudio] = useState(false);
  let [disableVideo, setDisableVideo] = useState(false);
  let [spotlightedUser, setSpotlightedUser] = useState("");


  const initRm = async (userId) => {
    await client.login({
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

    await client.setLocalUserAttributes({
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

    client.on("MessageFromPeer", async (message, memberId) => {
      console.log("agora----MessageFromPeer user===>", message)
      const messageObj = JSON.parse(message?.text)

      if (messageObj?.action === "disableAudio") {
        setDisableAudio(true)
        console.log("agora----disableAudio user===>")
      } else if (messageObj?.action === "disableVideo") {
        setDisableVideo(true)
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
    let user = await client.getUserAttributes(uid);

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

    client
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

    client
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

    client
      .sendMessageToPeer({ text: message, offline: false }, peerId)
      .then(async () => {
        console.log("==>mutePeerVideo ", JSON.stringify(message))

      })
      .catch((err) => {
        console.log(err);
      });
  }


  async function spotlightUserAction(userId) {
    const message = JSON.stringify({ text: userId, action: "spotlight" })
    channel
      .sendMessage({ text: message })
      .then(async () => {
        console.log("==>send ", JSON.stringify(userId))
        // const data = {
        //   author: "me",
        //   type: 'text',
        //   data: { text: text },
        // }
        // setCurrentMessage(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    if (currentMessage) setMessages([...messages, currentMessage]);
    // eslint-disable-next-line
  }, [currentMessage]);

  return {
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
    mutePeerAudio
  };
}
