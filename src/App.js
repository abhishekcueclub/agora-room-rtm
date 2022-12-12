import "./Call.css";
import "bootstrap/dist/css/bootstrap.min.css";

import React, { useState } from "react";

import AgoraRTC from "agora-rtc-sdk-ng";
import AgoraRTM from "agora-rtm-sdk";
import Draggable from 'react-draggable'; // The default
import { Launcher } from "react-chat-window"
import MediaPlayer from "./components/MediaPlayer";
import useAgora from "./hooks/useAgora";
import useAgoraChat from "./hooks/useAgoraChat";

// import Permissions from './Permissions'



const client = AgoraRTC.createClient({ codec: "h264", mode: "rtc" });

const chatClient = AgoraRTM.createInstance("2e5346b36d1f40b1bbc62472116d96de");

export default function App() {

  const [channel, setChannel] = useState("demo_channel");
  // eslint-disable-next-line
  const [appid, setAppid] = useState("2e5346b36d1f40b1bbc62472116d96de");
  // eslint-disable-next-line
  const [token, setToken] = useState("007eJxTYHA5mCP7S2z30/frW8qL1va+PbxC0PJ2HKfMm4vXf56exv9ZgcHcxDDVzNDSyDDJyMIkzSQlKSk5LTUp2dDSLCk5xdjYYpb0tOSGQEaGJ64JjIwMEAji8zCkpObmxydnJOblpeYwMAAAWgMlnQ==");

  let channelName = channel;

  const [textArea, setTextArea] = useState();
  // eslint-disable-next-line
  const { initRm, messages, sendChannelMessage, color,
    pressedBuzzer,
    clearPressedBuzzer,
    buzzersList,
    poked,
    sendChannelMessageToPeer
  } = useAgoraChat(
    chatClient,
    channelName,
  );
  const [poketoUser, setPokeToUser] = useState("");

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
    muteAudioState,
    updateUsername,
    username,
    currentSpeaker,
  } = useAgora(client);


  // eslint-disable-next-line
  function submitMessage(event) {
    console.log(event);
    if (event.keyCode === 13) {
      event.preventDefault();
      if (textArea.trim().length === 0) return;
      console.log("event.target.value", event.target.value)
      sendChannelMessage(event.target.value);
      setTextArea("");
    }
  }

  return (
    <div>
      {remoteUsers.map((user) => (
        <div key={user.uid}>

          <label>{user.uid} </label> {" || "}
          <label> {user._video_muted_ ? "Video disabled" : "Video enabled"}</label>
          {" || "}
          <label> {user._audio_muted_ ? "Audio disabled" : "Audio enabled"}</label>

        </div>
      ))}
      <div className="call">

        {/* <Draggable> */}

        <div className="local-player-wrapper" style={{
          position: 'absolute',
        }} >
          <MediaPlayer
            isSelf={true}
            videoTrack={localVideoTrack}
            audioTrack={localAudioTrack}
          ></MediaPlayer>
          <label>{username}</label>
          <br />
          <br />
          <label>Video Enabled: {!muteVideoState ? "true" : "false"}</label>
          <br />

          <label>Audio Enabled: {!muteAudioState ? "true" : "false"}</label>

          <form className="call-form">



            <div className="button-group">



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
                {"        "}
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
            </div>
          </form>
        </div>


        {/* </Draggable> */}
        {joinState ? <Launcher
          agentProfile={{
            teamName: 'Room Chat',
            imageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png'
          }}
          onMessageWasSent={(data) => {
            // if (text.trim().length === 0) return;
            console.log("event.target.value", data?.data?.text)
            sendChannelMessage(data?.data?.text);
            // setTextArea("");
          }}
          messageList={messages}
          showEmoji
        /> : null}

        {joinState ? <form className="call-form">



          <div className="button-group">
            <br />


            <div className="button-group">
              <input
                type="text"
                value={poketoUser}
                name="poketoUser"
                onChange={(event) => {
                  setPokeToUser(event.target.value);
                }}
              />
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  sendChannelMessageToPeer(poketoUser);
                }}
              >
                Poke User
              </button>
              <br /><br />
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  pressedBuzzer(username);
                }}
              >
                Press Buzzer
              </button>
              {"        "}
              <button
                id="clearBuzzerPressed"
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  clearPressedBuzzer();
                }}
              >
                Clear Buzzer

              </button>

              <br />
              <br />


              <label>Who poked you {poked}</label>
              <br />
              <br />
              <label>Buzzer is pressed by</label>

              <br />
              <br />
              {buzzersList?.map((user, index) => (
                <div className="remote-player-wrapper" key={user}>
                  <label>{index + 1}: {user}</label>
                </div>))}

            </div>
          </div>
        </form> : null}

        {
          !joinState ? <form className="call-form">

            <label>
              Username:
              <input
                value={username}
                type="text"
                name="username"
                onChange={(event) => {
                  updateUsername(event.target.value);
                }}
              />
            </label>

            <br />
            <br />
            {/* <label>
            AppID:
            <input
              type="text"
              name="appid"
              onChange={(event) => {
                setAppid(event.target.value);
              }}
            />
          </label> */}





            <label>
              Token(Optional):
              <input
                type="text"
                name="token"
                value={token}
                onChange={(event) => {
                  setToken(event.target.value);
                }}
              />
            </label>
            <label>
              <b> Channel: </b>
              <input
                type="text"
                value={channel}
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
                  join(channel, token, initRm, username);
                }}
              >
                Join
              </button>
            </div>
          </form> :
            <form className="call-form">
              <label>Currently Speaking: {currentSpeaker}</label>



              <div className="button-group">
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
                <br />
              </div>
            </form>
        }

        {/* <b> */}
        {/* {JSON.stringify(joinState) === "joined"
          ? "No One is Here"
          : "Welcome to the '" + channel + "' Room"}
      </b>{" "} */}
        <br />
        {/* <b> Local Video: {JSON.stringify(localVideoTrack)}</b> <br />
      <b> Remote Video: {JSON.stringify(rmoteUsers)}</b> */}
        <br />
        <div className="player-container">


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
                <label>{user.uid} </label> {" || "}
                <label> {user._video_muted_ ? "Video disabled" : "Video enabled"}</label>
                {" || "}
                <label> {user._audio_muted_ ? "Audio disabled" : "Audio enabled"}</label>


                {/* <label>{JSON.stringify(user)}</label> */}

              </div>
            ))}
          </div>
        </div>

        {/* <div className="d-flex flex-column py-5 px-3">
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
      </div> */}
        {/* <div>
        <h2> {JSON.stringify(color)} </h2>
        <input
          placeholder="Type your message here"
          onChange={(e) => setTextArea(e.target.value)}
          value={textArea}
          onKeyDown={submitMessage}
        />
      </div> */}

      </div >
    </div>
  );
}
