import "./SlideDrawer.css";

import { RoomMediaType, RoomType, UserRole } from "../hooks/AgoraConstant";

import React from "react";

export default class SlideDrawer extends React.Component {
    render() {
        let drawerClasses = "side-drawer";
        if (this.props.show) {
            console.log('this.props.role', this.props.role);
            drawerClasses = "side-drawer open";
        }
        return (
            <div className={drawerClasses}>
                <button
                    className="btn btn-primary btn-sm"
                    type="button"
                    onClick={() => {
                        this.props.drawerToggleClickHandler();
                    }}
                >
                    Hide Participants
                </button>
                {"  "}

                <button
                    className="btn btn-primary btn-sm"
                    type="button"
                    onClick={() => {
                        this.props.recordingStatusAction();
                    }}
                >
                    {this?.props?.recordingStatus ? "Stop Recroding" : "Start Recording"}
                </button>


                <h1>Participants {this.props.remoteUsers?.length}</h1>
                <h1>RoomType {this?.props?.roomType}</h1>
                <h1>RoomMediaType {this?.props?.roomMediaType}</h1>
                {
                    this.props.role === UserRole.MODERATOR && (
                        <div>
                            {
                                this?.props?.roomType !== RoomType.RESTRICTED ? <button
                                    className="btn btn-primary btn-sm"
                                    type="button"
                                    onClick={() => {
                                        this.props.updateRoomTypeAction(RoomType.RESTRICTED);
                                    }}
                                >
                                    {RoomType.RESTRICTED}
                                </button> : null
                            }
                            {" "}

                            {
                                this?.props?.roomType !== RoomType.PRIVATE ? <button
                                    className="btn btn-primary btn-sm"
                                    type="button"
                                    onClick={() => {
                                        this.props.updateRoomTypeAction(RoomType.PRIVATE);
                                    }}
                                >
                                    {RoomType.PRIVATE}
                                </button> : null
                            }
                            {" "}
                            {
                                this?.props?.roomType !== RoomType.PUBLIC ? <button
                                    className="btn btn-primary btn-sm"
                                    type="button"
                                    onClick={() => {
                                        this.props.updateRoomTypeAction(RoomType.PUBLIC);
                                    }}
                                >
                                    {RoomType.PUBLIC}
                                </button> : null
                            }
                            {" "}
                        </div>
                    )
                }



                <div>
                    {this.props.remoteUsers.map((user) => (
                        <div key={user.uid}>
                            <li key={user.uid}>
                                <b> {user.uid}</b> (
                                <span>
                                    {" "}
                                    <label>
                                        {" "}
                                        {user._video_muted_ ? "Video disabled" : "Video enabled"}
                                    </label>
                                </span>
                                ) (
                                <span>
                                    {" "}
                                    <label>
                                        {" "}
                                        {user._audio_muted_ ? "Audio disabled" : "Audio enabled"}
                                    </label>{" "}
                                </span>
                                )
                                {
                                    this.props.role === UserRole.MODERATOR && (
                                        <>
                                            <span>

                                                <button
                                                    type="button"
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => {
                                                        this.props.forceRemoveUserAction(user.uid)
                                                    }}
                                                >
                                                    Remove User
                                                </button>
                                            </span>

                                            <span>
                                                {!user._audio_muted_ ? (
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() => {
                                                            this.props.mutePeerAudio(user.uid)
                                                        }}
                                                    >
                                                        Mute Audio
                                                    </button>
                                                ) : null}
                                            </span>
                                            <span>
                                                {!user._video_muted_ ? (
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() => {

                                                            this.props.mutePeerVideo(user.uid)

                                                            // pressedBuzzer(username);
                                                        }}
                                                    >
                                                        Disable Video
                                                    </button>
                                                ) : null}
                                            </span>

                                            <span>
                                                <button
                                                    type="button"
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => {
                                                        this.props.spotlightUserAction(user.uid, user.uid)
                                                    }}
                                                >
                                                    Spotlight User
                                                </button>
                                            </span>


                                            <span>
                                                <button
                                                    type="button"
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => {
                                                        this.props.inviteOnStageAction(user.uid, UserRole.SPEAKER)
                                                    }}
                                                >
                                                    invited on stage
                                                </button>
                                            </span>



                                            <span>
                                                <button
                                                    type="button"
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => {
                                                        this.props.inviteOnStageAction(user.uid, UserRole.MODERATOR)
                                                    }}
                                                >
                                                    make moderator
                                                </button>
                                            </span>



                                            <span>
                                                <button
                                                    type="button"
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => {
                                                        this.props.inviteOnStageAction(user.uid, UserRole.LISTENER)
                                                    }}
                                                >
                                                    move to audiance
                                                </button>
                                            </span>
                                        </>

                                    )}



                                {/* <span>
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-sm"
                                        onClick={() => {
                                            if (this.props.pinUser !== user.uid) {
                                                this.props.pinUserAction(user.uid)
                                            } else {
                                                this.props.pinUserAction("")
                                            }
                                        }}
                                    >
                                        Pin User
                                    </button>
                                </span> */}



                                {/* spotlightedUser={spotlightedUser} spotlightUserAction={spotlightUserAction} */}
                            </li>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}
