import { AgoraRTCProvider } from './hooks/AgoraRTCProvider'
import { AgoraRTMProvider } from './hooks/AgoraRTMProvider'
import CueHeader from './assets/public/CueHeader'
import React from 'react'
import RoomApp from './RoomApp'

export default function App() {
    return (
        <>
            <AgoraRTCProvider>
                <AgoraRTMProvider>
                    <CueHeader />
                    <RoomApp />
                </AgoraRTMProvider>
            </AgoraRTCProvider>
        </>
    )
}