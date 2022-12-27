import React from 'react'
import './ChatOnline.css'
const ChatOnline = () => {
    return (
        <div className="chatOnline">
            <div className="chatOnlineFriend">
                <div className="chatOnlineImgContainer">
                    <img
                        className="chatOnlineImg"
                        alt=""
                    />
                    <div className="chatOnlineBadge"></div>
                </div>
                <span className="chatOnlineName">username</span>
            </div>
        </div>
    )
}

export default ChatOnline