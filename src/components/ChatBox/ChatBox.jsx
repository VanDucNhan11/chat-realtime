import React from 'react'
import './ChatBox.css'
import assets from '../../assets/assets'
import { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { useState } from 'react'
import { useEffect } from 'react'
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { async } from '@firebase/util'
import { toast } from 'react-toastify'

import upload from '../../lib/upload'

const ChatBox = () => {

    const { userData, messagesId, chatUser, messages, setMessages, chatVisible, setChatVisible } = useContext(AppContext);

    const [input, setInput] = useState("");

    const sendMessage = async () => {
        try {
            if (input && messagesId) {
                // Cập nhật tin nhắn vào Firestore
                await updateDoc(doc(db, 'messages', messagesId), {
                    messages: arrayUnion({
                        sId: userData.id,
                        text: input,
                        createdAt: new Date(),
                    }),
                });

                const userIDs = [chatUser.rId, userData.id];

                // Sử dụng `for...of` để xử lý tốt `async/await`
                for (const id of userIDs) {
                    const userChatsRef = doc(db, 'chats', id);
                    const userChatsSnapshot = await getDoc(userChatsRef);

                    if (userChatsSnapshot.exists()) {
                        const userChatData = userChatsSnapshot.data();
                        const chatIndex = userChatData.chatsData.findIndex(
                            (c) => c.messageId === messagesId // sửa `messagesId` cho đúng
                        );

                        // Kiểm tra nếu `chatIndex` hợp lệ
                        if (chatIndex !== -1) {
                            const lastMessage = input.slice(0, 30); // Lấy nội dung ngắn của tin nhắn

                            // Cập nhật các thuộc tính cần thiết
                            userChatData.chatsData[chatIndex].lastMessage = lastMessage;
                            userChatData.chatsData[chatIndex].updatedAt = Date.now();

                            // Đánh dấu tin nhắn chưa đọc nếu người nhận không phải là người gửi
                            if (userChatData.chatsData[chatIndex].rId === userData.id) {
                                userChatData.chatsData[chatIndex].messageSeen = false;
                            }

                            // Cập nhật lại Firestore
                            await updateDoc(userChatsRef, {
                                chatsData: userChatData.chatsData,
                            });
                        } else {
                            console.error('Chat index not found');
                        }
                    } else {
                        console.error('User chat data does not exist for user:', id);
                    }
                }
            }
        } catch (error) {
            toast.error(error.message || 'Error sending message');
            console.error(error);
        }
        setInput("");
    }

    const sendImage = async (e) => {
        try {

            const fileUrl = await upload(e.target.files[0]);

            if (fileUrl && messagesId) {
                await updateDoc(doc(db, 'messages', messagesId), {
                    messages: arrayUnion({
                        sId: userData.id,
                        image: fileUrl,
                        createdAt: new Date(),
                    }),
                });

                const userIDs = [chatUser.rId, userData.id];

                // Sử dụng `for...of` để xử lý tốt `async/await`
                for (const id of userIDs) {
                    const userChatsRef = doc(db, 'chats', id);
                    const userChatsSnapshot = await getDoc(userChatsRef);

                    if (userChatsSnapshot.exists()) {
                        const userChatData = userChatsSnapshot.data();
                        const chatIndex = userChatData.chatsData.findIndex(
                            (c) => c.messageId === messagesId // sửa `messagesId` cho đúng
                        );

                        // Kiểm tra nếu `chatIndex` hợp lệ
                        if (chatIndex !== -1) {
                            const lastMessage = "Hình ảnh"; // Lấy nội dung ngắn của tin nhắn

                            // Cập nhật các thuộc tính cần thiết
                            userChatData.chatsData[chatIndex].lastMessage = lastMessage;
                            userChatData.chatsData[chatIndex].updatedAt = Date.now();

                            // Đánh dấu tin nhắn chưa đọc nếu người nhận không phải là người gửi
                            if (userChatData.chatsData[chatIndex].rId === userData.id) {
                                userChatData.chatsData[chatIndex].messageSeen = false;
                            }

                            // Cập nhật lại Firestore
                            await updateDoc(userChatsRef, {
                                chatsData: userChatData.chatsData,
                            });
                        } else {
                            console.error('Chat index not found');
                        }
                    } else {
                        console.error('User chat data does not exist for user:', id);
                    }
                }
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const convertTimestamp = (timestamp) => {
        let date = timestamp.toDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
        if (hour > 12) {
            return hour - 12 + ":" + minute + " PM";
        }
        else {
            return hour - 12 + ":" + minute + " AM";
        }
    }


    useEffect(() => {
        if (messagesId) {
            const unSub = onSnapshot(doc(db, 'messages', messagesId), (res) => {
                setMessages(res.data().messages.reverse())
            })
            return () => {
                unSub();
            }
        }
    }, [messagesId])

    return chatUser ? (
        <div className={`chat-box ${chatVisible?"":"hidden"}`}>
            <div className="chat-user">
                <img src={chatUser?.userData?.avatar || assets.avatar_icon} alt="" />
                <p>{chatUser.userData.name} {Date.now()-chatUser.userData.lastSeen <= 70000 ? <img className='dot' src={assets.green_dot} alt="" /> : null}</p>
                <img src={assets.help_icon} className='help' alt="" />
                <img onClick={()=>setChatVisible(false)} src={assets.arrow_icon} className='arrow' alt="" />
            </div>

            <div className="chat-msg">
                {messages.map((msg, index) => (
                    <div key={index} className={msg.sId === userData.id ? "s-msg" : "r-msg"}>
                        {msg.image
                            ? <img className='msg-img' src={msg.image} alt="" />
                            : <p className="msg">{msg.text}</p>
                        }
                        <div>
                            <img src={msg.sId === userData.id ? userData.avatar : chatUser.userData.avatar} alt="" />
                            <p>{convertTimestamp(msg.createdAt)}</p>
                        </div>
                    </div>
                ))}

            </div>

            <div className="chat-input">
                <input onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder='Aa..' />
                <input onChange={sendImage} type="file" id='image' accept='image/png, image/jpeg' hidden />
                <label htmlFor="image">
                    <img src={assets.gallery_icon} alt="" />
                </label>
                <img onClick={sendMessage} src={assets.send_button} alt="" />
            </div>
        </div>
    )
        : <div className={`chat-welcome ${chatVisible?"":"hidden"}`}>
            <img src={assets.logo_icon} alt="" />
            <p>Trò chuyệnn mọi lúc, mọi nơi</p>
        </div>
}

export default ChatBox