import "../Call.css";
import './SlideDrawer.css'

import React, { useEffect, useState } from 'react'

import {
    chatClient
} from "../App"
// import useAgora from "../hooks/useAgora";
import useAgoraChat from "../hooks/useAgoraChat";

export default function SlideDrawerGame({ show, drawerToggleClickHandler, joinState, username }) {
    // const [channel, setChannel] = useState("demo_channel");

    useEffect(() => {
        initRm(username)

        // eslint-disable-next-line
    }, [])

    // eslint-disable-next-line
    const { initRm, messages, sendChannelMessage, color,
        pressedBuzzer,
        clearPressedBuzzer,
        buzzersList,
        poked,
        sendChannelMessageToPeer
    } = useAgoraChat(
        chatClient,
        "demo_channel",);
    const [poketoUser, setPokeToUser] = useState("");



    return (

        <div className={show ? "side-drawer open" : "side-drawer"}>
            <button
                className="btn btn-primary btn-sm"

                type="button"
                onClick={() => {
                    drawerToggleClickHandler()
                }}
            >
                Hide Participants

            </button>
            <h1>Quick game {"" + joinState}</h1>

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
                                console.log("username==", username)
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
                        <h1>Quick game {"" + buzzersList.length}</h1>

                        {buzzersList?.map((user, index) => (
                            <div className="remote-player-wrapper" key={user}>
                                <label>{index + 1}: {user}</label>
                            </div>))}

                    </div>
                </div>
            </form> : null}
        </div>
    )
}