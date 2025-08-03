import React, { useState } from "react";
import { closePlaylistModal } from "../redux/slices/modalSlice";
import { useDispatch } from "react-redux";
import { MdVerified } from "react-icons/md";
import PrimaryButton from "../utils/PrimaryButton";
import api from "../utils/api";

function CreatePlaylist() {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      const data = {
        name : title,
        description,
      };
      const response = await api.post("/playlist/createPlaylist", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSuccess(true);
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  return (
    <div>
      <div className="max-h-[650px] md:w-fit w-72 overflow-y-auto border border-white rounded-xl pt-2 px-8 md:px-16 pb-6 bg-zinc-900 shadow-[0px_0px_20px_rgba(251,113,133,0.9)]">
        <button
          className="pl-[104%] text-white text-2xl hover:text-gray-300"
          onClick={() => dispatch(closePlaylistModal())}
        >
          ✖
        </button>
        <h2 className="text-2xl text-center text-white font-semibold mb-8">
          CREATE NEW PLAYLIST
        </h2>
        {success ? (
          <div>
            <div className="flex flex-col justify-center items-center mt-8">
              <MdVerified size={72} color="green" />
              <h1 className="mt-4 text-white font-semibold text-2xl">
                Playlist Created successfully!
              </h1>
            </div>
          </div>
        ) : (
          <div>
            <div className="md:w-96 flex flex-col items-center gap-5">
              <div className="w-full flex flex-wrap justify-between gap-2">
                <label className="text-lg text-white" htmlFor="password">
                  Title :{" "}
                </label>
                <input
                  className="rounded-md focus:ring-2 focus:ring-rose-500 outline-none px-1"
                  onChange={(e) => setTitle(e.target.value)}
                  type="Title"
                  placeholder="Enter title"
                />
              </div>
              <div className="w-full flex flex-wrap justify-between gap-2">
                <label className="text-lg text-white" htmlFor="password">
                  Description :{" "}
                </label>
                <input
                  className="rounded-md focus:ring-2 focus:ring-rose-500 outline-none px-1"
                  onChange={(e) => setDescription(e.target.value)}
                  type="description"
                  placeholder="Enter description"
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              <PrimaryButton onClick={handleSubmit}>
                Create Playlist
              </PrimaryButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreatePlaylist;
