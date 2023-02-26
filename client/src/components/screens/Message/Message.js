import React from 'react'
import TimeAgo from 'timeago-react'
import './Message.css'
let own = false;

const Message = ({ message, senderId, stateId }) => {
  let own = false;
  console.log(senderId)
  console.log(stateId)
    if (senderId === stateId) {
      own = true;
    }

  console.log(own)
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