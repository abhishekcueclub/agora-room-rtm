import { get } from 'lodash';

export const encryptedMessageToOneToOne = (action, senderId, peerId, additionalData) => {
    const message = JSON.stringify({ action: action, peerId: peerId, senderId: senderId, additionalData: additionalData, agoraRTMype: AgoraRTMType.ONE_TO_ONE })
    return { text: message, offline: false }
}

export const encryptedMessageToOneToMany = (action, senderId, additionalData) => {
    const message = JSON.stringify({ action: action, senderId: senderId, additionalData: additionalData, agoraRTMype: AgoraRTMType.ONE_TO_MANY })
    return { text: message, offline: false }
}

export const decryptedMessage = (messageData) => {
    const messageObj = JSON.parse(messageData)
    return AgoraRTMObject(messageObj)
}

const AgoraRTMObject = data => {
    // cuelog('DataEventObject==>>', JSON.stringify(data))
    return {
        peerId: safeUnwrap(data, 'peerId', null), //ModeratorToOne,OneToModerator else null
        senderId: safeUnwrap(data, 'senderId', null),
        action: safeUnwrap(data, 'action', null), //OneToModerator, ModeratorToOne,OneToMany,OneToMany
        agoraRTMype: safeUnwrap(data, 'agoraRTMype', null), //AgoraRTMType
        additionalData: safeUnwrap(data, 'additionalData', null), //AgoraRTMType
    };
};

export const AgoraRTMType = {
    ONE_TO_ONE: 'ONE_TO_ONE',
    ONE_TO_MANY: 'ONE_TO_MANY',
};


export const safeUnwrap = (data, key, defaultValue) => {
    return get(data, key, defaultValue);
};

// Aud -> mod &&  1:1
export const OneToModerator = {
    HAND_RAISED: 'HAND_RAISED',
    INVITED_ON_STAGE_ACCEPT: 'INVITE_ON_STAGE_ACCEPT',
    INVITED_ON_STAGE_REJECT: 'INVITE_ON_STAGE_REJECT',
};

// mod -> Aud &&  1:1
export const ModeratorToOne = {
    INVITED_ON_STAGE: 'INVITE_ON_STAGE',
    FORCE_MUTED_USER_AUDIO: 'FORCE_MUTED_USER_AUDIO',
    FORCE_MUTED_USER_VIDEO: 'FORCE_MUTED_USER_VIDEO',
    HAND_RAISE_ACCEPTED: 'HAND_RAISE_ACCEPTED',
    HAND_RAISE_REJECTED: 'HAND_RAISE_REJECTED',
    REMOVED_FROM_ROOM: 'REMOVED_FROM_ROOM',
    MOVED_TO_AUDIANCE: 'MOVED_TO_AUDIANCE', // SELF AS WELL 
};

// mod  to all || all to all [reaction]
export const OneToMany = {
    TEXT: 'TEXT',
    SPOTLIGHTED_USER: 'SPOTLIGHTED_USER',
    REMOVED_SPOTLIGHTED_USER: 'REMOVED_SPOTLIGHTED_USER',
    MAKE_ROOM_PUBLIC: 'MAKE_ROOM_PUBLIC',
    MAKE_ROOM_PRIVATE: 'MAKE_ROOM_PRIVATE',
    RECORDING_STARTED: 'RECORDING_STARTED',
    RECORDING_STOPED: 'RECORDING_STOPED',
    REACTION_SEND: 'REACTION_SEND', // all to all
    STREAM_STATUS: "STREAM_STATUS", // casting information to All 
    SCREEN_SHARED: 'SCREEN_SHARED',

};



// mod  to all || all to all [reaction]
export const AdditionalAction = {
    PRESS_BUZZER: 'PRESS_BUZZER',
    CLEAR_BUZZER: 'CLEAR_BUZZER',
    POKE_USER: "POKE_USER" // casting information to All 
};
export const AgoraChannelProfile = {
    LIVE_BROADCASTING: 'LIVE_BROADCASTING',
};
export const AgoraUserRole = {
    BROADCASTER: 'BROADCASTER',
    AUDIENCE: 'AUDIENCE',
};