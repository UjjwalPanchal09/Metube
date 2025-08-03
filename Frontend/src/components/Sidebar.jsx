import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  openTweetModal,
  openUploadVideoModal,
  openEditProfileModal,
  openPlaylistModal,
} from "../redux/slices/modalSlice";
function Sidebar({ userId, toggle, setToggle }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const [toggle, setToggle] = useState(0);

  return (
    <div>
      <div className="flex flex-col justify-between items-center mx-2 mt-4">
        <button
          onClick={() => {
            navigate("/Home");
          }}
          className={`flex justify-center w-full mt-2 rounded py-1 text-white cursor-pointer hover:font-bold`}
        >
          Home
        </button>
        <hr className="border-1 border-gray-500 w-full" />
        {userId.id === localStorage.getItem("userId") && (
          <div>
            <button
              onClick={() => {
                setToggle(0);
                dispatch(openEditProfileModal());
              }}
              className={`flex justify-center w-full mt-2 rounded py-1 text-white cursor-pointer hover:font-bold`}
            >
              Edit Profile
            </button>
            <hr className="border-1 border-gray-500 w-full" />
            <button
              onClick={() => {
                setToggle(0);
                dispatch(openTweetModal());
              }}
              className={`flex justify-center w-full mt-2 rounded py-1 text-white cursor-pointer hover:font-bold`}
            >
              Post Tweet
            </button>
            <hr className="border-1 border-gray-500 w-full" />
            <button
              onClick={() => {
                setToggle(0);
                dispatch(openUploadVideoModal());
              }}
              className={`flex justify-center w-full mt-2 rounded py-1 text-white cursor-pointer hover:font-bold`}
            >
              Upload Video
            </button>
            <hr className="border-1 border-gray-500 w-full" />
            <button
              onClick={() => {
                setToggle(0);
                dispatch(openPlaylistModal());
              }}
              className={`flex justify-center w-full mt-2 rounded py-1 text-white cursor-pointer hover:font-bold`}
            >
              Create Playlist
            </button>
            <hr className="border-1 border-gray-500 w-full" />

            <button
              onClick={() => {
                setToggle(5);
              }}
              className={`flex justify-center w-full mt-2 rounded py-1 text-white cursor-pointer hover:font-bold ${
                toggle === 5 ? "md:bg-zinc-600 md:font-semibold" : ""
              }`}
            >
              Subscribed Channels
            </button>
            <hr className="border-1 border-gray-500 w-full" />
          </div>
        )}
        <button
          onClick={() => {
            setToggle(1);
          }}
          className={`flex justify-center w-full mt-2 rounded py-1 text-white cursor-pointer hover:font-bold ${
            toggle === 1 ? "md:bg-zinc-600 md:font-semibold" : ""
          }`}
        >
          Videos
        </button>
        <hr className="border-1 border-gray-500 w-full" />
        <button
          onClick={() => {
            setToggle(2);
          }}
          className={`flex justify-center w-full mt-2 rounded py-1 text-white cursor-pointer hover:font-bold ${
            toggle === 2 ? "md:bg-zinc-600 md:font-semibold" : ""
          }`}
        >
          Playlists
        </button>
        <hr className="border-1 border-gray-500 w-full" />
        <button
          onClick={() => {
            setToggle(3);
          }}
          className={`flex justify-center w-full mt-2 rounded py-1 text-white cursor-pointer hover:font-bold ${
            toggle === 3 ? "md:bg-zinc-600 md:font-semibold" : ""
          }`}
        >
          Tweets
        </button>
        <hr className="border-1 border-gray-500 w-full" />

        <button
          onClick={() => {
            setToggle(4);
          }}
          className={`flex justify-center w-full mt-2 rounded py-1 text-white cursor-pointer hover:font-bold ${
            toggle === 4 ? "md:bg-zinc-600 md:font-semibold" : ""
          }`}
        >
          Dashboard
        </button>
        <hr className="border-1 border-gray-500 w-full" />
      </div>
    </div>
  );
}

export default Sidebar;
