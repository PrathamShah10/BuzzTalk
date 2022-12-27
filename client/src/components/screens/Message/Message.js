import React from 'react'
import TimeAgo from 'timeago-react'
import './Message.css'
const Message = ({ message, own }) => {
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">
        <TimeAgo
        datetime={message.createdAt}
      />
      </div>
    </div>
  )
}

export default Message