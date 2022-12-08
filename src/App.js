import "./Call.css";
import "bootstrap/dist/css/bootstrap.min.css";

import React, { useState } from "react";

import AgoraRTC from "agora-rtc-sdk-ng";
import AgoraRTM from "agora-rtm-sdk";
import MediaPlayer from "./components/MediaPlayer";
import useAgora from "./hooks/useAgora";
import useAgoraChat from "./hooks/useAgoraChat";

const client = AgoraRTC.createClient({ codec: "h264", mode: "rtc" });

const chatClient = AgoraRTM.createInstance("2e5346b36d1f40b1bbc62472116d96de");

export default function App() {
  const [channel, setChannel] = useState("demo_channel");
  // eslint-disable-next-line
  const [appid, setAppid] = useState("741e61921b284f4dbbcfebc196bcd338");
  // eslint-disable-next-line
  const [token, setToken] = useState("default");

  let channelName = channel;

  const [textArea, setTextArea] = useState();
  // eslint-disable-next-line
  const { messages, sendChannelMessage, color } = useAgoraChat(
    chatClient,
    channelName
  );

  const {
    localAudioTrack,
    localVideoTrack,
    leave,
    join,
    joinState,
    remoteUsers,
    muteVideo,
    muteAudio,
    muteVideoState,
    muteAudioState
  } = useAgora(client);
  // eslint-disable-next-line
  function submitMessage(event) {
    console.log(event);
    if (event.keyCode === 13) {
      event.preventDefault();
      if (textArea.trim().length === 0) return;
      sendChannelMessage(event.target.value);
      setTextArea("");
    }
  }

  return (
    <div className="call">
      <form className="call-form">
        <label>
          AppID:
          <input
            type="text"
            name="appid"
            onChange={(event) => {
              setAppid(event.target.value);
            }}
          />
        </label>
        <label>
          Token(Optional):
          <input
            type="text"
            name="token"
            onChange={(event) => {
              setToken(event.target.value);
            }}
          />
        </label>
        <label>
          <b> Channel: </b>
          <input
            type="text"
            name="channel"
            onChange={(event) => {
              setChannel(event.target.value);
            }}
          />
        </label>

        <div className="button-group">
          <button
            id="join"
            type="button"
            className="btn btn-primary btn-sm"
            disabled={joinState}
            onClick={() => {
              join(channel, "007eJxTYJj2fdZ5oUNNAjxfWMIeH3K+9eKwXILLbMvVNwzWFYlM3PlUgcHcxDDVzNDSyDDJyMIkzSQlKSk5LTUp2dDSLCk5xdjYgufyxOSGQEaG2D2ZrIwMEAji8zCkpObmxydnJOblpeYwMAAA0xskGw==");
            }}
          >
            Join
          </button>
          <button
            id="leave"
            type="button"
            className="btn btn-primary btn-sm"
            disabled={!joinState}
            onClick={() => {
              leave();
            }}
          >
            Leave
          </button>
        </div>
      </form>
      {/* <b> */}
      {/* {JSON.stringify(joinState) === "joined"
          ? "No One is Here"
          : "Welcome to the '" + channel + "' Room"}
      </b>{" "} */}
      <br />
      {/* <b> Local Video: {JSON.stringify(localVideoTrack)}</b> <br />
      <b> Remote Video: {JSON.stringify(remoteUsers)}</b> */}
      <br />
      <div className="player-container">
        {/* <div> {client.uid} </div> */}
        <div className="local-player-wrapper">
          {/* <p className="local-player-text">
            {localVideoTrack && `localTrack`}
            {joinState && localVideoTrack ? `(${client.uid})` : ""}
          </p> */}
          <MediaPlayer
            isSelf={true}
            videoTrack={localVideoTrack}
            audioTrack={localAudioTrack}
          ></MediaPlayer>
        </div>
        <form className="call-form">



          <div className="button-group">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              disabled={!joinState}
              onClick={() => {
                muteAudio()
              }}
            >
              {!muteAudioState ? "MuteAudio" : "UnmuteAudio"}
            </button>
            <button
              id="leave"
              type="button"
              className="btn btn-primary btn-sm"
              disabled={!joinState}
              onClick={() => {
                muteVideo();
              }}
            >
              {!muteVideoState ? "MuteVideo" : "UnmuteVideo"}

            </button>
          </div>
        </form>

        <div className="remotePlayers">
          {remoteUsers.map((user) => (
            <div className="remote-player-wrapper" key={user.uid}>
              {/* <p>Remote Player + {user.uid} </p> */}
              {/* //   <p className="remote-player-text">{`remoteVideo(${user.uid})`}</p> */}
              <MediaPlayer
                isSelf={false}
                videoTrack={user.videoTrack}
                audioTrack={user.audioTrack}
              ></MediaPlayer>
            </div>
          ))}
        </div>
      </div>

      <div className="d-flex flex-column py-5 px-3">
        <h2>{channel} </h2>

        {messages.map((data, index) => {
          return (
            <div className="row" key={`chat${index + 1}`}>
              <h5 className="font-size-15" style={{ color: data.user.color }}>
                {`${data.user.name} :`}
              </h5>
              <p className="text-break">{` ${JSON.stringify(data)}`}</p>
            </div>
          );
        })}
      </div>
      <div>
        <h2> {JSON.stringify(color)} </h2>
        <input
          placeholder="Type your message here"
          onChange={(e) => setTextArea(e.target.value)}
          value={textArea}
          onKeyDown={submitMessage}
        />
      </div>
    </div>
  );
}
