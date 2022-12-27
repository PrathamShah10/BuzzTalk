import React, { useContext, useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { UserContext } from '../../../App'
import './Chat.css'
import Conversation from '../Conversation/Conversation';
// import ChatOnline from '../ChatOnline/ChatOnline';
import Modal from '../Modal'
import Message from '../Message/Message'
const Chat = () => {
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [showModal,setShowModal] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const socket = useRef();
    const { state, dispatch } = useContext(UserContext);
    const scrollRef = useRef();



    useEffect(() => {
        socket.current = io("ws://localhost:8900");
        socket.current.on("getMessage", (data) => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now(),
            });
        });
    }, []);

    useEffect(() => {
        arrivalMessage &&
            currentChat?.members.includes(arrivalMessage.sender) &&
            setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage, currentChat]);

    useEffect(() => {
        state && socket.current.emit("addUser", state?._id);
    }, [state != null]);

    useEffect(() => {
        const getConversations = () => {
            fetch(`/getconversation/${state?._id}`)
                .then(res => res.json())
                .then((result) => {
                    setConversations(result);
                })
                .catch(err => console.log(err))

        };
        getConversations();
    }, [state?._id,showModal]);

    useEffect(() => {
        const getMessages = () => {
            fetch(`/getmessage/${currentChat?._id}`)
                .then(res => res.json())
                .then((result) => {
                    setMessages(result);
                })
        };
        getMessages();
    }, [currentChat]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const message = {
            sender: state?._id,
            text: newMessage,
            conversationId: currentChat._id,
        };

        const receiverId = currentChat.members.find(
            (member) => member !== state?._id
        );

        socket.current.emit("sendMessage", {
            senderId: state?._id,
            receiverId,
            text: newMessage,
        });


        fetch('/message', {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                conversationId: currentChat?._id,
                sender: state?._id,
                text: newMessage
            })
        })
            .then(res => res.json())
            .then((result) => {
                setMessages([...messages, result]);
                setNewMessage("");
            })
            .catch(err => console.log(err))
    };

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <>
            {
                state
                    ?
                    <div className="messenger">
                        <div className="chatMenu">
                            <div className="chatMenuWrapper">
                                <button className="btn waves-effect waves-light #64b5f6 dark green"
                                onClick={() => setShowModal(true)}
                                >
                                    Add conversation
                                </button>
                                {
                                    showModal
                                    ?
                                    <Modal
                                    communication={true}
                                    currUser={state?._id}
                                    onClose ={()=>setShowModal(false)}

                                    />
                                    :
                                    ""
                                }
                                {conversations.map((c) => (
                                    <div onClick={() => setCurrentChat(c)}>
                                        <Conversation conversation={c} currentUser={state?._id} />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="chatBox">
                            <div className="chatBoxWrapper">
                                {currentChat ? (
                                    <>
                                        <div className="chatBoxTop">
                                            {messages.map((m) => (
                                                <div ref={scrollRef}>
                                                    <Message message={m} own={m.sender === state?._id} />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="chatBoxBottom">
                                            <textarea
                                                className="chatMessageInput"
                                                placeholder="write something..."
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                value={newMessage}
                                            ></textarea>
                                            <button className="chatSubmitButton" onClick={handleSubmit}>
                                                Send
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <span className="noConversationText">
                                        Open a conversation to start a chat.
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    :
                    <h2>loading...</h2>
            }

        </>
    );
}

export default Chat