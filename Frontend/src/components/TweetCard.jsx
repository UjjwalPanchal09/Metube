import React, { useEffect, useState } from "react";
import { BiSolidLike } from "react-icons/bi";
import api from "../utils/api";
import { openDeleteTweetModal, openEditTweetModal } from "../redux/slices/modalSlice";
import { useDispatch } from "react-redux";
function TweetCard(tweet) {
  const dispatch = useDispatch();
  const [like, setLike] = useState(false);
  const [user, setUser] = useState({});
  const [likeCount, setLikeCount] = useState(0);
  const [likedTweet, setLikedTweet] = useState([]);
  const [publishedAt, setPublishedAt] = useState();

  useEffect(() => {
    getUser();
    getLikeCount();
    getLikedTweet();
    setPublishedAt(timeAgo(tweet.tweet.createdAt));
  }, [tweet.tweet.owner]);

  // This runs AFTER likedTweet or Tweet changes
  useEffect(() => {
    if (tweet.tweet._id && likedTweet.length > 0) {
      setLikeStatus();
    }
  }, [tweet.tweet._id, likedTweet]);

  // Fetch user data when video is loaded
  const getUser = async () => {
    // console.log("Tweet Owner ID:", tweet.tweet.owner);
    try {
      const response = await api.get(`/users/${tweet.tweet.owner}`, {});
      //   console.log(response);
      setUser(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleLike = async () => {
    try {
      const response = await api.post(
        `/likes/tweet/${tweet.tweet._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      // console.log(response);
      if (like) {
        setLikeCount(likeCount - 1);
      } else {
        triggerNotification();
        setLikeCount(likeCount + 1);
      }
      setLike(!like);
    } catch (error) {
      console.error(error);
    }
  };

  const triggerNotification = async () => {
    if(user._id === localStorage.getItem("userId")) {
      return; // Don't send notification if the user is liking their own tweet
    }
    try {
      const response = await api.post('/notifications/createNotification', {
        recipientId: user._id,
        senderId: localStorage.getItem("userId"),
        type: "like",
        message: `liked "${tweet.tweet.content}"`,
        link: ""
      },{
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    } catch (error) {
      console.log(error);
    }
  }

  const getLikeCount = async () => {
    try {
      const response = await api.get(
        `/likes/likeCount/tweet/${tweet.tweet._id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // console.log(response.data);
      setLikeCount(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getLikedTweet = async () => {
    try {
      const response = await api.get("/likes/liked-tweets", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setLikedTweet(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const setLikeStatus = () => {
    if (likedTweet.length > 0) {
      const isLiked = likedTweet.some((v) => v.tweet === tweet.tweet._id);
      setLike(isLiked);
    } else {
      setLike(false);
    }
  };

  const timeAgo = (publishedDate) => {
    const now = new Date();
    const published = new Date(publishedDate);
    const diffInSeconds = Math.floor((now - published) / 1000);
  
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  
    const divisions = [
      { amount: 60, name: "seconds" },
      { amount: 60, name: "minutes" },
      { amount: 24, name: "hours" },
      { amount: 7, name: "days" },
      { amount: 4.34524, name: "weeks" },
      { amount: 12, name: "months" },
      { amount: Number.POSITIVE_INFINITY, name: "years" },
    ];
  
    let duration = diffInSeconds;
    for (let i = 0; i < divisions.length; i++) {
      if (duration < divisions[i].amount) {
        return rtf.format(-Math.floor(duration), divisions[i].name);
      }
      duration = duration / divisions[i].amount;
    }
    return "";
  }

  return (
    <div>
      <div className="flex gap-3 mr-6 mt-4">
        <img
          className="w-10 h-10 rounded-full mt-1"
          src={user.avatar}
          alt="Profile pic"
        />
        <div>
          <div className="flex gap-5 items-center">
            <h1 className="font-semibold text-white">{user.fullname}</h1>
            <h3 className="text-gray-400 text-xs">{publishedAt}</h3>
          </div>
          <p className="text-white line-clamp-2 text-sm mt-1">
            {tweet.tweet.content}
          </p>
          <div className="flex gap-3 w-fit mt-2">
            <h1 className="text-md text-white border px-2 rounded-md flex items-center gap-2">
              {likeCount}{" "}
              <BiSolidLike
                onClick={() => toggleLike()}
                className={`text-xl hover:scale-125 ${
                  like ? "text-rose-500" : ""
                }`}
              />
            </h1>
            {
              tweet.tweet.owner === localStorage.getItem("userId") && (
               <div className="flex gap-3">
                 <h1
                  onClick={() => dispatch(openEditTweetModal(tweet.tweet))}
                  className="text-white hover:text-red-500 font-semibold cursor-pointer"
                >
                  Edit
                </h1>
                <h1
                  onClick={() => dispatch(openDeleteTweetModal(tweet.tweet._id))}
                  className="text-white hover:text-red-500 font-semibold cursor-pointer"
                >
                  Delete
                </h1>
              </div>
            )}
          </div>
        </div>
      </div>
      <hr className="mt-2 border-gray-600" />
    </div>
  );
}

export default TweetCard;
