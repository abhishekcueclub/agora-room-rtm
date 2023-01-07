import "./Call.css";
import "bootstrap/dist/css/bootstrap.min.css";

import React, { useEffect, useState } from "react";

// import AgoraRTC from "agora-rtc-sdk-ng";
// import AgoraRTM from "agora-rtm-sdk";
import Backdrop from "./SlideDrawer/Backdrop";
// import Draggable from 'react-draggable'; // The default
import { Launcher } from "react-chat-window"
// import MainPage from "./SlideDrawer/MainPage";
import MediaPlayer from "./components/MediaPlayer";
import Select from 'react-select'
import SlideDrawer from "./SlideDrawer/SlideDrawer";
import { UserRole } from "./hooks/AgoraConstant";
// import SlideDrawerGame from "./SlideDrawer/SlideDrawerGame";
// import VirtualBackgroundExtension from "agora-extension-virtual-background";
// import useAgora from "./hooks/useAgora";
// import useAgoraChat from "./hooks/useAgoraChat";
import { useAgoraRTC } from "./hooks/AgoraRTCProvider";
import { useAgoraRTM } from "./hooks/AgoraRTMProvider";
import { useAgoraScreenShare } from "./hooks/AgoraRTCScreenShareProvider";

// import Permissions from './Permissions'




//export const client = AgoraRTC.createClient({ codec: "h264", mode: "live" });
// Create a VirtualBackgroundExtension instance

// export const chatClient = AgoraRTM.createInstance("64dfb90f167841ceb1b3eadf38401");



// export const extension = new VirtualBackgroundExtension();
// Register the extension
// AgoraRTC.registerExtensions([extension]);

export default function RoomApp() {
  const [channel, setChannel] = useState("demo_channel");
  // // eslint-disable-next-line
  // eslint-disable-next-line
  const [token, setToken] = useState("007eJxTYEjLjpgmlOWo8fPqfR1XWyuvi5Veu55d/PPujfWpiQl6n08oMJibGKaaGVoaGSYZWZikmaQkJSWnpSYlG1qaJSWnGBtb1E7YmdwQyMhQvZWNkZEBAkF8HoaU1Nz8+OSMxLy81BwGBgDefySP");

  // let channelName = channel;
  // eslint-disable-next-line
  const options = [
    { value: UserRole.LISTENER, label: UserRole.LISTENER },
    { value: UserRole.SPEAKER, label: UserRole.SPEAKER },
    { value: UserRole.MODERATOR, label: UserRole.MODERATOR }
  ]


  // eslint-disable-next-line
  const {
    initRm,
    messages,
    sendChannelMessage,
    // color,
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
    mutePeerVideo,
    pinUser,
    pinUserAction,
    forceEnableVideo,
    // eslint-disable-next-line
    isShareShareStatus,
    // eslint-disable-next-line
    shareShareAction,
    enableHandRaised,
    enableHandRaisedAction,
    raiseHand,
    isHandRaised,
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
  } = useAgoraRTM();

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
    isUserAudience,
    // setIsSharingEnabled,
    // isSharingEnabled,
    // localscreenTrack,
    // handleScreenShareClick,
    setIsUserAudience,
    currentSpeaker,
    setBackgroundBlurring,
    setBackgroundColor,
    remoteUsersMap,
    remoteUsersSet,
    forceVideo,
    client,
    role,
    updateRole,
    remoteUserIndexViaIdMap,
    updateCameraEnabledForUser
  } = useAgoraRTC()

  const {
    handleScreenShareClick,
    isSharingEnabled,
    setIsSharingEnabled,
    localscreenTrack,
  } = useAgoraScreenShare();

  const [initialLaunch, setInitiaLaunch] = useState(false)


  useEffect(() => {
    if (initialLaunch) {
      sendCameraEnabledDisabled(muteVideoState)
    }
    setInitiaLaunch(true)
  }, [muteVideoState])

  useEffect(() => {
    if (cameraEnabledForUser != null) {
      updateCameraEnabledForUser(cameraEnabledForUser, setCameraEnabledForUser)
    }
  }, [cameraEnabledForUser])

  //useAgora(client, extension);


  useEffect(() => {
    setIsSharingEnabled(isShareShareStatus)
  }, [isShareShareStatus])

  useEffect(() => {
    // const min = 1000;
    // const max = 9999;
    // const rand = Math.round(min + Math.random() * (max - min));
    // updateUsername("cue" + rand)
    if (forceRemoveUser) {
      leave()
    }
    // eslint-disable-next-line
  }, [forceRemoveUser])


  useEffect(() => {
    const min = 1000;
    const max = 9999;
    const rand = Math.round(min + Math.random() * (max - min));
    updateUsername("cue" + rand)
    // eslint-disable-next-line
  }, [])


  useEffect(() => {




    if (forceEnableVideo && !muteVideoState) {
      forceVideo(true)
      console.log("App.js Disable Audio")
    }
    // eslint-disable-next-line
  }, [forceEnableVideo])


  useEffect(() => {
    if (disableAudio) {
      muteAudio(true, setDisableAudio)
      console.log("App.js Disable Audio")

    }

    if (disableVideo) {
      muteVideo(true, setDisableVideo)
      console.log("App.js Disable Video")
    }
    // eslint-disable-next-line
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
  const handleScreenShare = (isSharingEnabled) => {
    handleScreenShareClick(isSharingEnabled, client, token, function (resp) {
      shareShareAction(resp, function (result, error) {
        if (result) {
          console.log('screen share sucess ', result)
        } else {
          console.log('screen share failed ', error)
        }
      })
    });
  }
  // eslint-disable-next-line
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
  const [pinUserDetails, setPinUserDetails] = useState(null)

  useEffect(() => {
    if (spotlightedUser?.length > 0) {
      const user = remoteUsersMap.get(spotlightedUser)
      setSpotlightedUserDetails(user)
    } else {
      setSpotlightedUserDetails(null)
    }

    // eslint-disable-next-line
  }, [spotlightedUser])

  useEffect(() => {
    console.log("Hello world")
    if (pinUser?.length > 0) {
      const user = remoteUsersMap.get(pinUser)
      setPinUserDetails(user)
    } else {
      setPinUserDetails(null)
    }

    // eslint-disable-next-line
  }, [pinUser])

  return (
    <div>
      {
        joinState ? <div>

          {
            invitedOnStage?.length > 0 ?
              <div>

                {
                  role === UserRole.MODERATOR && (
                    <div>
                      <h3>invited On Stage : {invitedOnStage}</h3>
                      <span>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            // this.props.inviteOnStageAction(user.uid, UserRole.MODERATOR)
                            acceptRejectInviteOnStageAction(username, invitedOnStage, true)

                          }}
                        >
                          accept invite
                        </button>
                      </span>



                      <span>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            acceptRejectInviteOnStageAction(username, invitedOnStage, false)

                            // this.props.inviteOnStageAction(user.uid, UserRole.LISTENER)
                          }}
                        >
                          reject invite
                        </button>
                      </span>
                    </div>
                  )}


              </div> : null
          }


          {/* <h3>SpotlightedUser Speaking: {spotlightedUser}</h3>
          <h3>{invitedOnStage?.length > 0 ? `invited On Stage to be ${invitedOnStage}` : ""}</h3>

 */}


          <h3>{userRole === UserRole.SPEAKER ? "Chote aaj se tu bhi Avenger" : "You are just hero"}</h3>

          <h3>{enableHandRaised ? "Hand Raised is enabled" : "Hand Raised is disabled"}</h3>

          {enableHandRaised ? <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => {
              raiseHand()
            }}
          >
            {!isHandRaised ? "Hand's up" : "hand's down"}
          </button> : null}

          {
            role === UserRole.MODERATOR && (
              <div>
                <h3>{handRaisedUser.length > 0 ? "List of user raised hand" : (enableHandRaised ? "No One Raised hand" : null)}</h3>
                {handRaisedUser.map((user) => {
                  return (<div>{user} {" "}<button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      acceptedRejectHandRaised(user, true)
                    }}
                  >
                    Accepted
                  </button> {" "}<button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      acceptedRejectHandRaised(user, false)
                    }}
                  >
                      Rejected
                    </button></div>)
                })}
              </div>
            )}

          <br />
          <h3>===============================================</h3>
          <br />

          {
            spotlightedUserDetails !== null ?
              <>
                <div className="remote-player-wrapper" key={spotlightedUser} >
                  <MediaPlayer
                    isSelf={false}
                    videoTrack={spotlightedUserDetails?.videoTrack}
                    audioTrack={spotlightedUserDetails?.audioTrack}
                    username={spotlightedUserDetails?.uid}
                  ></MediaPlayer>
                  <label>{spotlightedUserDetails?.uid} </label> {" || "}
                  <label> {spotlightedUserDetails?._video_muted_ ? "Video disabled" : "Video enabled"}</label>
                  {" || "}
                  <label> {spotlightedUserDetails?._audio_muted_ ? "Audio disabled" : "Audio enabled"}</label>
                </div>
              </> :
              pinUserDetails !== null ?
                <>
                  <div className="remote-player-wrapper" key={pinUser} >
                    <MediaPlayer
                      isSelf={false}
                      videoTrack={pinUserDetails?.videoTrack}
                      audioTrack={pinUserDetails?.audioTrack}
                      username={pinUserDetails?.uid}
                    />
                    <label>{pinUserDetails?.uid} </label> {" || "}
                    <label> {pinUserDetails?._video_muted_ ? "Video disabled" : "Video enabled"}</label>
                    {" || "}
                    <label> {pinUserDetails?._audio_muted_ ? "Audio disabled" : "Audio enabled"}</label>
                  </div>
                </> : isSharingEnabled ? <>
                  <div className="remote-player-wrapper" key={pinUser} >
                    <MediaPlayer
                      isSelf={false}
                      videoTrack={localscreenTrack}
                      //audioTrack={pinUserDetails?.audioTrack}
                      username={'screen share'}
                    />
                    <label>{pinUserDetails?.uid} </label> {" || "}
                    <label> {pinUserDetails?._video_muted_ ? "Video disabled" : "Video enabled"}</label>
                    {" || "}
                    <label> {pinUserDetails?._audio_muted_ ? "Audio disabled" : "Audio enabled"}</label>
                  </div>
                </> : null
          }




          <br />
          <h3>===============================================</h3>
          <br />

          <h3>Currently Speaking: {currentSpeaker}</h3>
        </div> : null
      }



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
          {
            role === UserRole.MODERATOR || role === UserRole.SPEAKER && (
              <div>
                <button
                  id="leave"
                  type="button"
                  className="btn btn-primary btn-sm"
                  disabled={!joinState}
                  onClick={() => {
                    handleScreenShare(isSharingEnabled);
                  }}
                >
                  {isSharingEnabled ? 'stop screen share' : 'start screen share'}
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    enableHandRaisedAction();
                  }}
                >
                  {enableHandRaised ? "Disable Hand Raised" : "Enable Hand Raised"}
                </button>
              </div>

            )}


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

        recordingStatusAction={recordingStatusAction}
        recordingStatus={recordingStatus}
        forceRemoveUserAction={forceRemoveUserAction}
        updateRoomMediaTypeAction={updateRoomMediaTypeAction}
        roomMediaType={roomMediaType}
        updateRoomTypeAction={updateRoomTypeAction}
        roomType={roomType}
        inviteOnStageAction={inviteOnStageAction}
        mutePeerAudio={mutePeerAudio}
        mutePeerVideo={mutePeerVideo}
        show={drawerOpen}
        drawerToggleClickHandler={drawerToggleClickHandler}
        remoteUsers={remoteUsers}
        spotlightedUser={spotlightedUser}
        spotlightUserAction={spotlightUserAction}

        pinUser={pinUser}
        pinUserAction={pinUserAction}
        role={role}
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
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Select defaultValue={role}
                onChange={(item) => updateRole(item.value)}
                options={options}
              />
            </div>


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

            {
              username.length > 3 ? <div className="button-group">
                <button
                  id="join"
                  type="button"
                  className="btn btn-primary btn-sm"
                  disabled={joinState}
                  onClick={() => {
                    //console.log("Join --- channel ", role)
                    join(channel, token, initRm, username, role);
                  }}
                >
                  Join
                </button>
              </div> : null
            }

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
                      username={username}
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
                    {/* <Imagebackground /> */}
                    {/* <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        setBackgroundImage()
                      }}
                    >
                      Image Background
                    </button> */}


                    <br />
                    <br />
                    {!isUserAudience && (
                      <>
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
                      </>
                    )}
                  </div> : null
              }
              {/* remoteUsersMap,
              remoteUsersSet */}

              {

                [...Array(remoteUsersSet?.length)].map((_, idIndex) => {

                  const userId = remoteUserIndexViaIdMap?.get(idIndex)

                  const user = remoteUsersMap?.get(userId)

                  console.log("idIndex====>Array", idIndex)
                  console.log("user====>Array", user)
                  console.log("remoteUsersMap====>Array", remoteUsersMap)
                  console.log("remoteUserIndexViaIdMap====>Array", remoteUserIndexViaIdMap)

                  return (user != null ? <div>{
                    user === null || spotlightedUser === userId ? null : <div className="remote-player-wrapper" key={userId} >
                      <MediaPlayer
                        isSelf={false}
                        videoTrack={user?.videoTrack}
                        audioTrack={user?.audioTrack}
                        username={user?.uid}
                      ></MediaPlayer>
                      <label>{user?.uid} </label> {" || "}
                      <label> {user?._video_muted_ ? "Video disabled" : "Video enabled"}</label>
                      {" || "}
                      <label> {user?._audio_muted_ ? "Audio disabled" : "Audio enabled"}</label>
                      <label> User int Id {user?._uintid}</label>


                    </div>
                  }</div> : null)

                })

              }


              {/* {remoteUsersSet.map((userId) => {
                const user = remoteUsersMap.get(userId)
                console.log("remoteUsersSet abhishek", user)
                // return (<div><p>{userId + "--" + JSON.stringify(user)}</p></div>)
                return (<div>{
                  user === null || spotlightedUser === userId ? null : <div className="remote-player-wrapper" key={userId} >
                    <MediaPlayer
                      isSelf={false}
                      videoTrack={user?.videoTrack}
                      audioTrack={user?.audioTrack}
                      username={user?.uid}
                    ></MediaPlayer>
                    <label>{user?.uid} </label> {" || "}
                    <label> {user?._video_muted_ ? "Video disabled" : "Video enabled"}</label>
                    {" || "}
                    <label> {user?._audio_muted_ ? "Audio disabled" : "Audio enabled"}</label>
                    <label> User int Id {user?._uintid}</label>


                  </div>
                }</div>)
              }
              )} */}
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
      {/* <canvas id="canvas" width="700" height="400"></canvas> */}

    </div >
  );
}
