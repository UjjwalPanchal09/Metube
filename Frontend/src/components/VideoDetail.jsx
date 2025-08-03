import React, { useEffect, useState } from "react";
import PrimaryButton from "../utils/PrimaryButton";
import SecButton from "../utils/SecButton";
import VideoListCard from "./VideoListCard";
import CommentCard from "./CommentCard";
import api from "../utils/api";
import { BiSolidLike } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
function VideoDetail() {
  const videoId = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState({});
  const [videos, setVideos] = useState([]);
  const [user, setUser] = useState({});
  const [like, setLike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [likedVideos, setLikedVideos] = useState([]);
  const [publishedAt, setPublishedAt] = useState();
  const [subscribe, setSubscribe] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);

  useEffect(() => {
    fetchVideos();
    fetchVideo();
  }, [videoId]);

  useEffect(() => {
    let timeoutId;

    if (video.owner && video.duration) {
      const viewKey = `viewed_${video._id}`;
      const hasViewed = localStorage.getItem(viewKey);

      getUser();
      fetchComments();
      getLikeCount();
      getLikedVideos();
      checkSubscriptionStatus();
      getSubscriberCount();
      setPublishedAt(timeAgo(video.createdAt));

      if (!hasViewed) {
        const rawDelay = video.duration * 0.01 * 1000;
        const delay = Math.max(rawDelay, 5000);
        timeoutId = setTimeout(() => {
          incrementViews();
          localStorage.setItem(viewKey, true); // mark as viewed
        }, delay);
      }
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [video.owner, video.duration]);

  // This runs AFTER likedVideos or video changes
  useEffect(() => {
    if (video._id && likedVideos.length > 0) {
      setLikeStatus();
    }
  }, [video._id, likedVideos]);

  const postComment = async () => {
    const data = {
      commentText: comment,
    };
    try {
      const response = await api.post(`/comment/${video._id}`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setComments((prevComments) => [response.data.data, ...prevComments]);
      // console.log(response.data.data);
      setCommentCount(commentCount+1);
      setComment("");
    } catch (error) {
      console.log(error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await api.get(`/comment/${video._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      // console.log(response);
      setCommentCount(response.data.data.length);
      setComments(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchVideos = async () => {
    try {
      const response = await api.get("/videos/getAllVideos", {
        params: { page: 1, limit: 10 }, // Adjust pagination if needed
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      // console.log(response.data.data);
      setVideos(response.data.data.videos);
    } catch (err) {
      console.log("Failed to fetch videos");
    }
  };

  const fetchVideo = async () => {
    try {
      const response = await api.get(`/videos/${videoId.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      // console.log(response.data.data);
      setVideo(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getUser = async () => {
    try {
      const response = await api.get(`/users/${video.owner}`, {});
      setUser(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleLike = async () => {
    try {
      const response = await api.post(
        `/likes/video/${video._id}`,
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
    if (user._id === localStorage.getItem("userId")) {
      return; // Don't send notification if the user is liking their own video
    }
    try {
      const response = await api.post('/notifications/createNotification', {
        recipientId: user._id,
        senderId: localStorage.getItem("userId"),
        type: "like",
        message: `liked your video "${video.title}"`,
        link: `/VideoDetail/${videoId}`
      },{
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    } catch (error) {
      console.log(error);
    }
  }

  const getLikeCount = async () => {
    try {
      const response = await api.get(`/likes/likeCount/video/${video._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      // console.log(response);
      setLikeCount(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getLikedVideos = async () => {
    try {
      const response = await api.get("/likes/liked-videos", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      // console.log(response.data.data);
      setLikedVideos(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const setLikeStatus = () => {
    if (likedVideos.length > 0) {
      const isLiked = likedVideos.some((v) => v.video === video._id);
      setLike(isLiked);
    } else {
      setLike(false);
    }
  };

  const incrementViews = async () => {
    try {
      const response = await api.post(
        `/videos/views/${videoId.id}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log(response);
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
  };

  const checkSubscriptionStatus = async () => {
    try {
      const response = await api.get(
        `/subscription/isSubscribed/${video.owner}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      // console.log(response.data.data);
      setSubscribe(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleSubscription = async () => {
    try {
      const response = await api.post(
        `/subscription/${video.owner}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      // console.log(response);
      if (subscribe) {
        setSubscriberCount(subscriberCount - 1);
      } else {
        setSubscriberCount(subscriberCount + 1);
      }
      setSubscribe(!subscribe);
    } catch (error) {
      console.log(error);
    }
  };

  const getSubscriberCount = async () => {
    try {
      const response = await api.get(`/subscription/subscriberCount/${video.owner}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      // console.log(response.data.data);
      setSubscriberCount(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletedComment = (deletedId) => {    
    const updatedCommentList = comments.filter((comment) => comment._id !== deletedId);
    setComments(updatedCommentList);
    setCommentCount(updatedCommentList.length)
  }

  return (
    <div className="flex flex-col md:flex-row gap-3 md:mx-0">
      <div className="md:w-[64%] ml-0 md:ml-12">
        <div className="mt-4">
          <video
            className="rounded flex justify-center items-center bg-gray-900 h-[500px] w-full"
            src={video.videoFile}
            controls
            autoPlay
          >
            Oops!, This video can not be played.
          </video>
        </div>
        <div className="borde rounded-lg px-2 py-4">
          <div className="flex justify-between mr-4 items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">{video.title}</h1>
              <h2 className="text-xs text-gray-400 mt-1">
                {video.views} views | {publishedAt}
              </h2>
            </div>
            <h1 className="flex text-white text-lg items-center bg-zinc-800 px-2 gap-2 rounded-full">
              <BiSolidLike
                onClick={() => toggleLike()}
                className={`hover:scale-125 ${like ? "text-rose-500" : ""}`}
                size={24}
              />{" "}
              {likeCount}
            </h1>
          </div>
          {/* <hr className="mt-4" /> */}
          <div className="flex justify-between items-center  mt-4">
            <div
              onClick={() => navigate(`/Profile/${user._id}`)}
              className="flex items-end gap-3 cursor-pointer"
            >
              <div className="flex items-center gap-2 mt-2">
                <img
                  className="h-8 w-8 rounded-full"
                  src={user.avatar}
                  alt="Profile pic"
                />
              </div>
              <div>
                <h1 className="text-white text-sm">{user.fullname}</h1>
                <h2 className="text-xs text-gray-400">{subscriberCount} Subsribers</h2>
              </div>
            </div>
            {video.owner !== localStorage.getItem("userId") && (
              <PrimaryButton
                onClick={() => toggleSubscription()}
                className={`text-xl rounded-2xl px-4 ${
                  subscribe ? "bg-stone-500 hover:bg-stone-600" : ""
                }`}
              >
                {subscribe ? "Unsubscribe" : "Subscribe"}
              </PrimaryButton>
            )}
          </div>
          <hr className="mt-4" />
          <div className="mt-4">
            <h1 className="text-lg text-white font-semibold">Description</h1>
            <p className="text-white text-sm">{video.description}</p>
          </div>
        </div>
        <div className="mt-4 border rounded-lg px-2 py-4">
          <h1 className="text-xl text-white font-semibold px-2">
            {commentCount} Comments
          </h1>
          <div className="flex items-center gap-3 mt-4 mx-4">
            <input
              className="w-full h-10 rounded-lg px-2"
              value={comment}
              type="text"
              placeholder="Add a comment..."
              onChange={(e) => setComment(e.target.value)}
            />
            <PrimaryButton onClick={() => postComment()}>Comment</PrimaryButton>
          </div>
          {/* Comment Section */}
          <div className="ml-2">
            {comments.map((comment) => (
              <CommentCard key={comment._id} comment={comment} onDelete={handleDeletedComment}/>
            ))}
          </div>
        </div>
      </div>
      <div className="md:w-[33%] md:borde rounded-lg mt-4 p-2">
        <div className="flex flex-col gap-3">
          {videos.map((video) => (
            <VideoListCard key={video._id} video={video} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default VideoDetail;
