import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import PrimaryButton from "../utils/PrimaryButton";
import SecButton from "../utils/SecButton";
import api from "../utils/api";
import { closeDeletePlaylistModal } from "../redux/slices/modalSlice";
import { useNavigate } from "react-router-dom";

function DeletePlaylist({playlistId}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
        const response  = await api.delete(`/playlist/deletePlaylist/${playlistId}`)
        navigate(`/Profile/${localStorage.getItem("userId")}`)
        dispatch(closeDeletePlaylistModal());
    } catch (error) {
        console.log(error);        
    }
  };

  return (
    <div className="h-fit md:w-96 w-72 border border-white rounded-xl pt-6 px-10 pb-12 bg-zinc-900 shadow-[0px_0px_20px_rgba(251,113,133,0.9)]">
      <h2 className="text-2xl text-center text-white font-semibold mb-6">
        Are you sure ?
      </h2>
      <div className="flex flex-col gap-5">
        <PrimaryButton onClick={() => dispatch(closeDeletePlaylistModal())}>Cancel</PrimaryButton>
        <SecButton onClick={() => handleDelete()}>Delete</SecButton>
      </div>
    </div>
  );
}

export default DeletePlaylist;
