import React, { useEffect, useState } from "react";
import { closeEditTweetModal } from "../redux/slices/modalSlice";
import { useDispatch } from "react-redux";
import { MdVerified } from "react-icons/md";
import PrimaryButton from "../utils/PrimaryButton";
import api from "../utils/api";

function EditTweet({ tweetId }) {
  const dispatch = useDispatch();
  const [tweetText, setTweetText] = useState();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log(tweetId?._id);
    if (tweetId) {
      setTweetText(tweetId.content);
    }
  }, [tweetId]);

  const postTweet = async () => {
    try {
      const data = {
        tweetText: tweetText,
      };
      const response = await api.post(`/tweet/${tweetId._id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(response);
      setSuccess(true);
    } catch (error) {
      console.error(error);
      setError(error?.response?.data?.message || "Failed to update tweet.");
    }
  };


  return (
    <div>
      <div className="max-h-[650px] md:w-fit w-72 overflow-y-auto border border-white rounded-xl pt-2 px-16 pb-6 bg-zinc-900 shadow-[0px_0px_20px_rgba(251,113,133,0.9)]">
        <button
          className="pl-[110%] text-white text-2xl hover:text-gray-300"
          onClick={() => dispatch(closeEditTweetModal())}
        >
          ✖
        </button>
        <h2 className="text-2xl text-center text-white font-semibold mb-8">
          UPDATE TWEET
        </h2>
        {success ? (
          <div>
            <div className="flex flex-col justify-center items-center mt-8">
              <MdVerified size={72} color="green" />
              <h1 className="mt-4 text-white font-semibold text-2xl">
                Tweet updated successfully!
              </h1>
            </div>
          </div>
        ) : (
          <div>
            <div className="md:w-72 flex flex-col items-center">
              <h1 className="text-white text-sm">
                Express your thoughts here :{" "}
              </h1>
              {/* Tweet input field */}
              <textarea
                className="border-2 border-gray-300 rounded-md p-2 w-full mb-4"
                placeholder="What's happening?"
                value={tweetText}
                onChange={(e) => setTweetText(e.target.value)}
              />
              {/* Error message */}
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {/* Tweet button */}
              <PrimaryButton onClick={postTweet}>Update Tweet</PrimaryButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditTweet;
