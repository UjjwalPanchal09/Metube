import React, { useEffect, useState } from "react";
import { BiSolidLike } from "react-icons/bi";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openDeleteCommentModal } from "../redux/slices/modalSlice";

function CommentCard({comment,onDelete}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [likeToggle, setLikeToggle] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likedComment, setLikedComment] = useState([]);
  const [publishedAt, setPublishedAt] = useState();
  

  useEffect(() => {    
    if (comment?.owner) {
      getUser(comment.owner);
      getLikeCount();
      getLikedComments();
      setPublishedAt(timeAgo(comment.createdAt));
    }
  }, [comment?.owner]);

  // This runs AFTER likedComment or Comment changes
  useEffect(() => {
    if (comment._id && likedComment.length > 0) {
      setLikeStatus();
    }
  }, [comment._id, likedComment]);

  // Fetch user data when comment is loaded
  const getUser = async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`, {});
      // console.log(response.data.data);
      setUser(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleLike = async () => {
    try {
      const response = await api.post(
        `/likes/comment/${comment._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log(response);
      if (likeToggle) {
        setLikeCount(likeCount - 1);
      } else {
        triggerNotification();
        setLikeCount(likeCount + 1);
      }
      setLikeToggle(!likeToggle);
    } catch (error) {
      console.error(error);
    }
  };

  const getLikeCount = async () => {
    try {
      const response = await api.get(
        `/likes/likeCount/comment/${comment._id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      // console.log(response);
      setLikeCount(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getLikedComments = async () => {
    try {
      const response = await api.get("/likes/liked-comments", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setLikedComment(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const setLikeStatus = () => {
    if (likedComment.length > 0) {
      const isLiked = likedComment.some((v) => v.comment === comment._id);   
      setLikeToggle(isLiked);  
    } else {
      setLike(false);
    }
  };

  const triggerNotification = async () => {
    if (user._id === localStorage.getItem("userId")) {
      return; // Don't send notification if the user is liking their own tweet
    }
    try {
      const response = await api.post(
        "/notifications/createNotification",
        {
          recipientId: user._id,
          senderId: localStorage.getItem("userId"),
          type: "like",
          message: `liked "${comment.content}"`,
          link: `/VideoDetail/${comment.video}`,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
    } catch (error) {
      console.log(error);
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
      <div className="flex items-start mt-4 gap-3 cursor-pointer">
        <img
          className="w-10 h-10 rounded-full"
          src={user.avatar}
          alt="Profile pic"
        />
        <div>
          <div onClick={() => navigate(`/Profile/${user._id}`)}>
            <div className="flex items-center gap-3">
              <h1 className="text-md text-white font-semibold">
                {user.fullname}
              </h1>
              <h2 className="text-xs text-gray-400">{publishedAt}</h2>
            </div>
            <div>
              <h2 className="text-xs text-gray-500">@{user.username}</h2>
            </div>
            <p className="text-white text-sm line-clamp-2 mt-1">
              {comment.content}
            </p>
          </div>
          <div className="flex gap-3 mt-2">
            <h1 className="text-xs text-gray-500 border border-gray-500 px-1 items-end rounded-md flex gap-1">
              {likeCount}{" "}
              <BiSolidLike
                onClick={() => toggleLike()}
                className={`text-lg hover:scale-125 ${
                  likeToggle ? "text-rose-500" : ""
                }`}
              />
            </h1>
            {(comment.owner === localStorage.getItem("userId")) && (
              <button onClick={() => { const payload = {commentId : comment._id,onDelete}; dispatch(openDeleteCommentModal(payload))}} className="text-xs text-gray-500 hover:font-semibold hover:text-red-500">
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
      <hr className="mt-1 border border-gray-700" />
    </div>
  );
}

export default CommentCard;
