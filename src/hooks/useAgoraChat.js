import { useEffect, useRef, useState } from "react";

import randomColor from "randomcolor";

// import AgoraRTM from "agora-rtm-sdk";


let USER_ID = Math.floor(Math.random() * 100000001);

export default function useAgoraChat(client, channelName) {
  // const [joinState, setJoinState] = useState(false);

  let [messages, setMessages] = useState([]);
  // eslint-disable-next-line
  let [members, setMembers] = useState([]);

  let [currentMessage, setCurrentMessage] = useState();
  // eslint-disable-next-line
  let color = useRef(randomColor({ luminosity: "dark" })).current;
  let channel = useRef(client.createChannel(channelName)).current;

  // async function join(channel, token, uid) {

  //   if (!client) return;

  //   await client.join(appid, channel, token);
  //   await client.publish([microphoneTrack, cameraTrack]);

  //   setJoinState(true);
  // }

  const initRm = async () => {
    await client.login({
      uid: USER_ID.toString()
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
      name: USER_ID.toString(),
      color
    });
  };
  // eslint-disable-next-line
  useEffect(() => {
    initRm();
    // eslint-disable-next-line
  }, [USER_ID]);

  useEffect(() => {
    channel.on("ChannelMessage", (data, uid) => {
      handleMessageReceived(data, uid);
    });

    channel.on("AttributesUpdated", (attr) => {
      console.log("==>AttributesUpdated", JSON.stringify(attr))
    });

    channel.on("MessageFromPeer", async (message, memberId) => {
      console.log(memberId + "==>MessageFromPeer", JSON.stringify(message))
    });
  });

  async function handleMessageReceived(data, uid) {
    let user = await client.getUserAttributes(uid);
    console.log(uid + "==>text", JSON.stringify(data))

    console.log(data);
    if (data.messageType === "TEXT") {
      let newMessageData = { user, messsage: data?.text };
      setCurrentMessage(newMessageData);
    }
  }

  async function sendChannelMessage(text) {
    channel
      .sendMessage({ text })
      .then(async () => {
        console.log("==>send ", JSON.stringify(text))

        // await client.setLocalUserAttributes({
        //   name: text.toString()
        // });

        setCurrentMessage({
          user: { name: "Current User (Me)", color },
          message: text
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    if (currentMessage) setMessages([...messages, currentMessage]);
    // eslint-disable-next-line
  }, [currentMessage]);

  return { messages, sendChannelMessage, color };
}
