import React, { useState } from 'react'
import { useEffect } from 'react'
import './Conversation.css'
const Conversation = ({ conversation, currentUser }) => {
  const [friendLoading, setFriendLoading] = useState(true);
  const [friend, setFriend] = useState("");
  useEffect(() => {
    const findFriend = () => {
      const friendId = conversation.members.find((c) => c !== currentUser);
      fetch(`/searchuser/${friendId}`)
        .then(res => res.json())
        .then((result) => {
          setFriend(result);
          setFriendLoading(false);
        })
    }
    findFriend();
  }, [])


  return (
    <>
      {
        friendLoading && friend.pic == null
          ?
          <h2>loading...</h2>
          :
          <div className="conversation">
            <img
              className="conversationImg"
              src={friend?.pic}
              alt="img"
            />
            <span className="conversationName">{friend?.name}</span>
          </div>
      }
    </>
  )
}

export default Conversation