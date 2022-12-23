import { Provider as AlertProvider, positions, transitions } from 'react-alert'

import { AgoraRTCProvider } from './hooks/AgoraRTCProvider'
import { AgoraRTMProvider } from './hooks/AgoraRTMProvider'
import AlertTemplate from 'react-alert-template-basic'
import CueHeader from './assets/public/CueHeader'
import React from 'react'
import RoomApp from './RoomApp'
import { AgoraRTCScreenShareProvider } from './hooks/AgoraRTCScreenShareProvider'

// optional configuration
const options = {
    // you can also just use 'bottom center'
    position: positions.BOTTOM_CENTER,
    timeout: 5000,
    offset: '30px',
    // you can also just use 'scale'
    transition: transitions.SCALE
}
export default function App() {
    return (
        <>
            <AlertProvider template={AlertTemplate} {...options}>

                <AgoraRTCProvider>
                    <AgoraRTMProvider>
                        <AgoraRTCScreenShareProvider>
                        <CueHeader />
                        <RoomApp />
                        </AgoraRTCScreenShareProvider>
                    </AgoraRTMProvider>
                </AgoraRTCProvider>
            </AlertProvider>
        </>
    )
}