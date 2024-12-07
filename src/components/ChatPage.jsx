import React, { useEffect, useRef, useState } from "react";
import { MdSend, MdAttachFile } from "react-icons/md";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";
import SockJS from "sockjs-client";
import { baseUrl } from "../config/AxiosHelper";
import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";
import { getMessages } from "../services/RoomService";
import { timeAgo } from "../config/hepler";
const ChatPage = () => {
  const {
    roomId,
    currentUser,
    connected,
    setConnected,
    setRoomId,
    setCurrentUser,
  } = useChatContext();

  // console.log(roomId);
  // console.log(currentUser);
  // console.log(connected);

  const navigate = useNavigate();
  useEffect(() => {
    if (!connected) {
      navigate("/");
    }
  }, [connected, roomId, currentUser]);

  const [messages, setMessages] = useState([
    {
      content: "Hello ?",
      sender: "Deva",
    },
    {
      content: "Hello ?",
      sender: "Devendra",
    },
    {
      content: "Hello ?",
      sender: "Deva",
    },
    {
      content: "Hello ?",
      sender: "Deva",
    },
    {
      content: "Hello ?",
      sender: "Deva",
    },
    {
      content: "Hello ?",
      sender: "Devendra",
    },
    {
      content: "Hello ?",
      sender: "Deva",
    },
    {
      content: "Hello ?",
      sender: "Devendra",
    },
    {
      content: "Hello ?",
      sender: "Deva",
    },
  ]);

  const [input, setInput] = useState("");

  const inputRef = useRef(null);
  const chatBoxRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);
  // page init

  // message ko load karna hoga
  useEffect(() => {
    // load messages
    async function loadMessages() {
      try {
        const messages = await getMessages(roomId);
        // console.log(messages);
        setMessages(messages);
      } catch (error) {
        console.log(error);
      }
    }

    if (connected) {
      loadMessages();
    }
  }, []);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scroll({
        top: chatBoxRef.current.scrollHeight,
        behavor: "smooth",
      });
    }
  }, [messages]);

  // stompClient ko init karna hoga

  // subscribe

  useEffect(() => {
    const connectWebSocket = () => {
      //  SockJs
      const sock = new SockJS(`${baseUrl}/chat`);

      const client = Stomp.over(sock);

      client.connect({}, () => {
        setStompClient(client);

        toast.success("connected");

        client.subscribe(`/topic/room/${roomId}`, (message) => {
          console.log(message);
          const newMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, newMessage]);
          // rest of the work after success receiving the message
        });
      });
    };

    if (connected) {
      connectWebSocket();
    }
  }, [roomId]);

  // send message handle

  const sendMessage = async () => {
    if (stompClient && connected && input.trim()) {
      console.log(input);
      //
      const message = {
        sender: currentUser,
        content: input,
        roomId: roomId,
      };

      stompClient.send(
        `/app/sendMessage/${roomId}`,
        {},
        JSON.stringify(message)
      );

      setInput("");
    }
  };

  // logoutt
  function handleLogout() {
    stompClient.disconnect();
    setConnected(false);
    setCurrentUser("");
    setRoomId("");
    navigate("/");
  }

  return (
    <div className="">
      <header className="dark:border-green-700 fixed w-full dark:bg-gray-900 py-5 border shadow flex justify-around items-center">
        {/* room name container */}
        <div>
          <h1 className="text-2xl font-semibold">
            Room : <span>{roomId}</span>
          </h1>
        </div>
        {/* username container */}
        <div className="">
          <h1 className="text-2xl font-semibold">
            User : <span>{currentUser}</span>
          </h1>
        </div>
        {/* button: leave room */}
        <div>
          <button
            onClick={handleLogout}
            className="dark:bg-red-500 dark:hover:bg-red-700 px-3 py-2 rounded-full"
          >
            Leave Room
          </button>
        </div>
      </header>

      {/*  */}
      <main
        ref={chatBoxRef}
        className="py-20 px-10 w-2/3 dark:bg-slate-600 mx-auto h-screen overflow-auto"
      >
        <div className="message_container">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === currentUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`my-2 ${
                  message.sender === currentUser
                    ? "bg-green-800"
                    : "bg-gray-800"
                } p-2 rounded max-w-xs`}
              >
                <div className="flex flex-row gap-2">
                  <img
                    src={"https://avatar.iran.liara.run/public/girl"}
                    alt=""
                    className="h-10 w-10"
                  />
                  <div className=" flex flex-col gap-1">
                    <p className="text-sm font-bold">{message.sender}</p>
                    <p>{message.content}</p>
                    <p className="text-xm text-green-400">
                      {timeAgo(message.timeStamp)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* input message container */}

      <div className="fixed bottom-4 w-full h-16">
        <div className="h-full flex gap-4 rounded-full w-1/2 mx-auto pr-10 dark:bg-gray-900 items-center justify-between">
          {/* input message*/}
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            type="text"
            placeholder="Type your message here..."
            className="dark:border-gray-700 w-full  dark:bg-gray-600 px-5 py-2  rounded-full h-full focus:ring-0 focus:outline-none"
          />
          <div className="flex gap-1">
            <button
              onClick={sendMessage}
              className="dark:bg-purple-600 h-10 w-10 flex justify-center items-center rounded-full "
            >
              <MdSend size={20} />
            </button>
            <button className="dark:bg-green-600 h-10 w-10 flex justify-center items-center rounded-full ">
              <MdAttachFile size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
