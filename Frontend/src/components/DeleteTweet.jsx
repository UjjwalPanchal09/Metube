import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import PrimaryButton from "../utils/PrimaryButton";
import SecButton from "../utils/SecButton";
import api from "../utils/api";
import { closeDeleteTweetModal } from "../redux/slices/modalSlice";

function DeleteTweet({payload}) {
  const dispatch = useDispatch();

 const deleteTweet = async () => {  
    try {
      await api.delete(`/tweet/${payload}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("tweet deleted!");
      if (payload.onDelete) payload.onDelete(payload); // Notify parent if provided
      dispatch(closeDeleteTweetModal());
    } catch (error) {
      console.error("Error deleting tweet:", error);
    }
  };

  return (
    <div className="h-fit md:w-96 w-72 border border-white rounded-xl pt-6 px-10 pb-12 bg-zinc-900 shadow-[0px_0px_20px_rgba(251,113,133,0.9)]">
      <h2 className="text-2xl text-center text-white font-semibold mb-6">
        Are you sure ?
      </h2>
      <div className="flex flex-col gap-5">
        <PrimaryButton onClick={() => dispatch(closeDeleteTweetModal())} >Cancel</PrimaryButton>
        <SecButton onClick={() => deleteTweet()}>Delete</SecButton>
      </div>
    </div>
  );
}

export default DeleteTweet;
