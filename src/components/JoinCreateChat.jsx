import React, { useState } from "react";
import chat from "../assets/chat.png";
import toast from "react-hot-toast";
import { createRoomApi, joinChatApi } from "../services/RoomService";
import useChatContext from "../context/ChatContext";
import { data, useNavigate } from "react-router";

const JoinCreateChat = () => {
  const [detail, setDetails] = useState({
    roomId: "",
    userName: "",
  });

  const { roomId, userName, setRoomId, setCurrentUser, setConnected } =
    useChatContext();

  const navigate = useNavigate();

  function handleFormInputChange(event) {
    event.preventDefault();
    setDetails({
      ...detail,
      [event.target.name]: event.target.value,
    });
  }

  async function joinChat() {
    if (validateForm()) {
      // join chat
      try {
        const room = await joinChatApi(detail.roomId);
        toast.success("joined ...");
        setCurrentUser(detail.userName);
        setRoomId(room.roomId);
        setConnected(true);
        // forward to chat page
        navigate("/chat");
      } catch (error) {
        if (error.status == 400) {
          toast.error(error.response.data);
        } else {
          toast.error("Error in joining room");
        }
        console.log(error);
      }
    }
  }
  async function createRoom() {
    if (validateForm()) {
      // create room

      console.log(detail);
      // call api to create room on backend
      try {
        const response = await createRoomApi(detail.roomId);
        console.log(response);
        toast.success("Room Created Successfully !!!");
        // join the room
        setCurrentUser(detail.userName);
        setRoomId(response.roomId);
        setConnected(true);
        // forward to chat page
        navigate("/chat");
        joinChat();
      } catch (error) {
        console.log(error);
        if (error.status == 400) {
          toast.error("Room is already exist !!!");
        } else {
          toast.error("Something went wrong !!!");
        }
      }
    }
  }

  function validateForm() {
    if (detail.roomId === "" || detail.userName === "") {
      toast.error("Invalid Input !!!");
      return false;
    }
    return true;
  }
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="dark:border-gray-700 border p-10 w-full flex flex-col gap-5 max-w-md rounded dark:bg-gray-900 shadow">
        <div>
          <img src={chat} alt="" className="w-24 mx-auto" />
        </div>

        <h1 className="text-2xl font-semibold text-center">
          Join Room / Create Room ..
        </h1>
        {/* name */}
        <div className="">
          <label htmlFor="name" className="block font-medium mb-2">
            Your Name
          </label>
          <input
            onChange={handleFormInputChange}
            value={detail.userName}
            name="userName"
            placeholder="Enter Name ..."
            type="text"
            id="name"
            className="w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* room id */}
        <div className="">
          <label htmlFor="name" className="block font-medium mb-2">
            Room ID / New Room ID
          </label>
          <input
            onChange={handleFormInputChange}
            value={detail.roomId}
            name="roomId"
            type="text"
            placeholder="Enter Room ID ..."
            id="name"
            className="w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* button */}
        <div className="flex justify-center gap-2 mt-2">
          <button
            onClick={joinChat}
            className="px-3 py-2 dark:bg-blue-500 hover:dark:bg-blue-800 rounded-full"
          >
            Join Room
          </button>
          <button
            onClick={createRoom}
            className="px-3 py-2 dark:bg-orange-500 hover:dark:bg-orange-800 rounded-full"
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinCreateChat;
