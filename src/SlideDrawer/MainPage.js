import React from 'react'

export default function MainPage({ drawerToggleClickHandler }) {
    return (
        <div>

            <p>MainPage</p>
            <button
                type="button"
                className="btn btn-primary btn-sm"

                onClick={() => {
                    drawerToggleClickHandler()
                }}
            >
                Hide Participants

            </button>
        </div>
    )
}