import "./SlideDrawer.css";

import React from "react";

export default class SlideDrawer extends React.Component {
    render() {
        let drawerClasses = "side-drawer";
        if (this.props.show) {
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
                <h1>Participants {this.props.remoteUsers?.length}</h1>

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
                            </li>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}
