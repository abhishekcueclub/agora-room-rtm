import "./Call.css";
import "bootstrap/dist/css/bootstrap.min.css";

import React, { useEffect, useState } from "react";

import AgoraRTC from "agora-rtc-sdk-ng";
import AgoraRTM from "agora-rtm-sdk";
import Backdrop from "./SlideDrawer/Backdrop";
import Draggable from 'react-draggable'; // The default
import { Launcher } from "react-chat-window"
import MainPage from "./SlideDrawer/MainPage";
import MediaPlayer from "./components/MediaPlayer";
import SlideDrawer from "./SlideDrawer/SlideDrawer";
import SlideDrawerGame from "./SlideDrawer/SlideDrawerGame";
import VirtualBackgroundExtension from "agora-extension-virtual-background";
import useAgora from "./hooks/useAgora";
import useAgoraChat from "./hooks/useAgoraChat";

// import Permissions from './Permissions'




export const client = AgoraRTC.createClient({ codec: "h264", mode: "rtc" });
// Create a VirtualBackgroundExtension instance

export const chatClient = AgoraRTM.createInstance("2e5346b36d1f40b1bbc62472116d96de");



export const extension = new VirtualBackgroundExtension();
// Register the extension
AgoraRTC.registerExtensions([extension]);

export default function RoomApp() {
  const [channel, setChannel] = useState("demo_channel");
  // // eslint-disable-next-line
  // const [appid, setAppid] = useState("2e5346b36d1f40b1bbc62472116d96de");
  // eslint-disable-next-line
  const [token, setToken] = useState("007eJxTYMi+FFS9dbHAbZv15faynhPvhPX73v/14dG+trObPcU27n+mwGBuYphqZmhpZJhkZGGSZpKSlJSclpqUbGhplpScYmxsIcU3M7khkJHh0NRMBkYoBPF5GFJSc/PjkzMS8/JScxgYAB7xJO0=");

  let channelName = channel;
  // eslint-disable-next-line


  const [textArea, setTextArea] = useState();
  // eslint-disable-next-line
  const { initRm, messages, sendChannelMessage, color,
    pressedBuzzer,
    clearPressedBuzzer,
    buzzersList,
    poked,
    sendChannelMessageToPeer,
    disableAudio,
    setDisableAudio,
    disableVideo,
    setDisableVideo,
    spotlightedUser,
    spotlightUserAction,
    mutePeerAudio,
    mutePeerVideo
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
    setBackgroundBlurring,
    setBackgroundColor,
    remoteUsersMap,
    remoteUsersSet
  } = useAgora(client, extension);


  useEffect(() => {
    if (disableAudio) {
      muteAudio(true, setDisableAudio)
      console.log("App.js Disable Audio")

    }

    if (disableVideo) {
      muteVideo(true, setDisableVideo)
      console.log("App.js Disable Video")
    }

  }, [disableAudio, disableVideo])

  // // eslint-disable-next-line
  // function submitMessage(event) {
  //   console.log(event);
  //   if (event.keyCode === 13) {
  //     event.preventDefault();
  //     if (textArea.trim().length === 0) return;
  //     console.log("event.target.value", event.target.value)
  //     sendChannelMessage(event.target.value);
  //     setTextArea("");
  //   }
  // }

  // eslint-disable-next-line
  function virtualBackgroundExtension() {
    console.log("virtualBackgroundExtension");
    setBackgroundBlurring()
  }

  const drawerToggleClickHandler = () => {
    setDrawerOpen(!drawerOpen)
  }


  const drawerGameToggleClickHandler = () => {
    setDrawerGameOpen(!drawerGameOpen)
  }
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerGameOpen, setDrawerGameOpen] = useState(false)

  // const captureUserMedia = callback => {
  //   navigator.mediaDevices.getUserMedia({ audio: true, video: false })
  //     .then(callback)
  //     .catch(err => {
  //       window.chrome.tabs.create({
  //         url: 'request-mic.html'
  //       });
  //     });
  // };

  const [spotlightedUserDetails, setSpotlightedUserDetails] = useState(null)

  useEffect(() => {
    if (spotlightedUser?.length > 0) {
      const user = remoteUsersMap.get(spotlightedUser)
      setSpotlightedUserDetails(user)
    } else {
      setSpotlightedUserDetails(null)
    }


  }, [spotlightedUser])

  return (
    <div>

      <h3>SpotlightedUser Speaking: {spotlightedUser}</h3>
      <br />
      <h3>===============================================</h3>
      <br />

      {
        spotlightedUserDetails !== null ? <> <div className="remote-player-wrapper" key={spotlightedUser} >
          <MediaPlayer
            isSelf={false}
            videoTrack={spotlightedUserDetails?.videoTrack}
            audioTrack={spotlightedUserDetails?.audioTrack}
          ></MediaPlayer>
          <label>{spotlightedUserDetails?.uid} </label> {" || "}
          <label> {spotlightedUserDetails?._video_muted_ ? "Video disabled" : "Video enabled"}</label>
          {" || "}
          <label> {spotlightedUserDetails?._audio_muted_ ? "Audio disabled" : "Audio enabled"}</label>
        </div> </> : null
      }

      <br />
      <h3>===============================================</h3>
      <br />

      <h3>Currently Speaking: {currentSpeaker}</h3>


      {
        joinState ? <div > <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => {
            drawerToggleClickHandler()
          }}
        >
          Show Participants
        </button> <button
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
          {"        "}

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

        </div>
          : null
      }
      < SlideDrawer
        mutePeerAudio={mutePeerAudio}
        mutePeerVideo={mutePeerVideo}
        show={drawerOpen}
        drawerToggleClickHandler={drawerToggleClickHandler}
        remoteUsers={remoteUsers}
        spotlightedUser={spotlightedUser}
        spotlightUserAction={spotlightUserAction}
      />
      {/* < SlideDrawerGame show={drawerGameOpen} drawerToggleClickHandler={drawerGameToggleClickHandler} joinState={joinState} username={username} /> */}
      {drawerOpen ? <Backdrop /> : null}
      {joinState ? <form className="call-form">
        <input
          type="text"
          value={poketoUser}
          name="poketoUser"
          onChange={(event) => {
            setPokeToUser(event.target.value);
          }}
        />
        {"        "}

        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => {
            sendChannelMessageToPeer(poketoUser);
          }}
        >
          Poke User
        </button>


        <h5>Who poked you {poked}</h5>


      </form> : null}
      <div className="call">

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
            null
        }
        <br />
        <div className="player-container">


          <div className="remotePlayers">
            <div class="wrapper">

              {
                joinState ?
                  <div className="local-player-wrapper"
                  // style={{
                  //   position: 'absolute',
                  // }}
                  >
                    <MediaPlayer
                      isSelf={true}
                      videoTrack={localVideoTrack}
                      audioTrack={localAudioTrack}
                    />
                    <label>{username} </label> {" || "}
                    <label> {muteVideoState ? "Video disabled" : "Video enabled"}</label>
                    {" || "}
                    <label> {muteAudioState ? "Audio disabled" : "Audio enabled"}</label>
                    <br />

                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        virtualBackgroundExtension()
                      }}
                    >
                      Virtual Background
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        setBackgroundColor()
                      }}
                    >
                      Black Background
                    </button>
                    <br />
                    <br />
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      disabled={!joinState}
                      onClick={() => {
                        muteAudio(false, setDisableAudio)
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
                        muteVideo(false, setDisableVideo);
                      }}
                    >
                      {!muteVideoState ? "MuteVideo" : "UnmuteVideo"}

                    </button>
                  </div> : null
              }
              {/* remoteUsersMap,
              remoteUsersSet */}
              {remoteUsersSet.map((userId) => {
                const user = remoteUsersMap.get(userId)
                console.log("remoteUsersSet abhishek", remoteUsersSet)
                // return (<div><p>{userId + "--" + JSON.stringify(user)}</p></div>)
                return (<div>{
                  user === null || spotlightedUser === userId ? null : <div className="remote-player-wrapper" key={userId} >
                    <MediaPlayer
                      isSelf={false}
                      videoTrack={user?.videoTrack}
                      audioTrack={user?.audioTrack}
                    ></MediaPlayer>
                    <label>{user?.uid} </label> {" || "}
                    <label> {user?._video_muted_ ? "Video disabled" : "Video enabled"}</label>
                    {" || "}
                    <label> {user?._audio_muted_ ? "Audio disabled" : "Audio enabled"}</label>
                  </div>
                }</div>)
              }

              )}
            </div>
          </div>
        </div>
      </div >
      {
        joinState ? <Launcher
          agentProfile={{
            teamName: 'Room Chat',
            imageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png'
          }
          }
          onMessageWasSent={(data) => {
            // if (text.trim().length === 0) return;
            console.log("event.target.value", data?.data?.text)
            sendChannelMessage(data?.data?.text);
            // setTextArea("");
          }
          }
          messageList={messages}
          showEmoji={false}

        /> : null}

      {
        joinState ? <div>
          <label>Buzzer is pressed by</label>
          <br />
          {buzzersList?.map((user, index) => (
            <div className="remote-player-wrapper" key={user}>
              <label>{index + 1}: {user}</label>
            </div>))}
        </div> : null
      }
    </div >
  );
}
