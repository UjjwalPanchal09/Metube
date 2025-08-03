import React, { useEffect, useState } from "react";
import PrimaryButton from "../utils/PrimaryButton";
import GeneralButton from "../utils/GeneralButton";
import VideoListCard from "./VideoListCard";
import PlaylistCard from "./PlaylistCard";
import TweetCard from "./TweetCard";
import ChannelCard from "./ChannelCard";
import Dashboard from "./Dashboard";
import Sidebar from "./Sidebar";
import api from "../utils/api";
import cover_default from "../assets/cover_default.jpg";
// import avatar_default from "../assets/avatar_default.png";
import {
  openTweetModal,
  openUploadVideoModal,
  openEditProfileModal,
  openPlaylistModal,
  openToggleSubscription,
} from "../redux/slices/modalSlice";
import { FaUserEdit } from "react-icons/fa";
import { GrPlayFill } from "react-icons/gr";
import { TiPlus } from "react-icons/ti";
import { RiPlayList2Fill } from "react-icons/ri";
import { TbMessageReportFilled } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
function Profile() {
  const userId = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [subscribe, setSubscribe] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [toggle, setToggle] = useState(0);
  const [subscribedChannels, setSubscribedChannels] = useState([]);

  const [user, setUser] = useState({});
  const [videos, setVideos] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setToggle(-1);
    getUser();
    fetchVideos();
    fetchPlaylists();
    checkSubscriptionStatus();
    getSubscriberCount();
    fetchSubscribedChannels();
  }, [userId]);

  // Fetch user data when video is loaded
  const getUser = async () => {
    try {
      const response = await api.get(`/users/${userId.id}`, {});
      setUser(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch Videos from API
  const fetchVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(
        `/videos/getAllVideosOfUser/${userId.id}`,
        {
          params: { page: 1, limit: 10 }, // Adjust pagination if needed
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setVideos(response.data.data.videos);
    } catch (err) {
      setError("Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  };

  const fetchPlaylists = async () => {
    try {
      const response = await api.get(
        `/playlist/getUserPlaylists/${userId.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPlaylists(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTweets = async () => {
    try {
      const response = await api.get(`/tweet/user/${userId.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // console.log(response.data.data);
      setTweets(response.data.data);
    } catch (error) {
      setError(error);
      console.error(error);
    }
  };

  const checkSubscriptionStatus = async () => {
    try {
      const response = await api.get(
        `/subscription/isSubscribed/${userId.id}`,
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

  const toggleSubscription = async (channelId) => {
    try {
      const response = await api.post(
        `/subscription/${channelId}`,
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
        triggerNotification();
      }
      setSubscribe(!subscribe);
      const updatedSubscribedChannels = subscribedChannels.filter(
        (channel) => channel != channelId
      );
      setSubscribedChannels(updatedSubscribedChannels);
    } catch (error) {
      console.log(error);
    }
  };

  const getSubscriberCount = async () => {
    try {
      const response = await api.get(
        `/subscription/subscriberCount/${userId.id}`,
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

  const fetchSubscribedChannels = async () => {
    try {
      const response = await api.get(`/subscription/subscriber/${userId.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSubscribedChannels(response.data.data);
      // console.log(subscribedChannels);
    } catch (error) {
      console.log(error);
    }
  };

  const triggerNotification = async () => {
    try {
      const response = await api.post(
        "/notifications/createNotification",
        {
          recipientId: userId.id,
          senderId: localStorage.getItem("userId"),
          type: "subscribe",
          message: "subscribed to your channel.",
          link: `/Profile/${localStorage.getItem("userId")}`,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex">
      <div className="w-[20%] hidden md:block">
        <Sidebar userId={userId} toggle={toggle} setToggle={setToggle} />
      </div>
      <div className="h-full w-full md:w-[80%]">
        <div>
          <img
            className="h-32 md:h-52 w-full"
            src={user.coverImage ? user.coverImage : cover_default}
            alt="Cover Image"
          />
        </div>
        <div className="flex  flex-col md:flex-row justify-between items-center px-5 md:px-10 mt-4">
          <div className="flex items-center gap-5">
            <img
              className="rounded-full w-24 h-24 md:w-32 md:h-32"
              src={user.avatar}
              alt="Profile pic"
            />
            <div>
              <h1 className="text-white font-semibold text-lg md:text-2xl">
                {user.fullname}
              </h1>
              <h2 className="text-gray-400 text-xs md:text-sm">
                @{user.username}
              </h2>
              <h3 className="text-gray-400 text-xs md:text-sm">
                {subscriberCount} Subscribers
              </h3>
            </div>
          </div>
          {userId.id === localStorage.getItem("userId") ? (
            <div className="hidden md:block">
              <div className="md:w-60 lg:w-96 flex flex-wrap justify-end gap-2">
                <PrimaryButton
                  onClick={() => dispatch(openUploadVideoModal())}
                  className="font-semibold flex items-start gap-1"
                >
                  Upload Video
                  <TiPlus />
                </PrimaryButton>
                <PrimaryButton
                  onClick={() => dispatch(openPlaylistModal())}
                  className="font-semibold flex items-start gap-1"
                >
                  Create Playlist
                  <TiPlus />
                </PrimaryButton>
                <PrimaryButton
                  onClick={() => dispatch(openTweetModal())}
                  className="font-semibold flex items-start gap-1"
                >
                  Tweet
                  <TiPlus />
                </PrimaryButton>
                <GeneralButton
                  onClick={() => dispatch(openEditProfileModal())}
                  className="w-fit font-semibold flex items-center gap-2 rounded-md"
                >
                  <FaUserEdit />
                  Edit
                </GeneralButton>
              </div>
            </div>
          ) : (
            <PrimaryButton
              onClick={() => toggleSubscription(userId.id)}
              className={`text-xl rounded-2xl px-4 mt-6 ${
                subscribe ? "bg-stone-500 hover:bg-stone-600" : ""
              }`}
            >
              {subscribe ? "Unsubscribe" : "Subscribe"}
            </PrimaryButton>
          )}
        </div>
        <hr className="md:hidden mt-4 md:mt-1 " />
        <div className="flex flex-col md:flex-row justify-between items-center mx-10 mt-10">
          {userId.id === localStorage.getItem("userId") && (
            <button
              onClick={() => {
                setToggle(6);
                dispatch(openEditProfileModal());
              }}
              className={`md:hidden flex justify-center w-full mt-2 border md:border-none rounded-md md:rounded-none py-1 text-white cursor-pointer hover:font-bold ${
                toggle === 6 ? "md:bg-zinc-600 md:font-semibold" : ""
              }`}
            >
              Edit Profile
            </button>
          )}
          {userId.id === localStorage.getItem("userId") && (
            <button
              onClick={() => {
                setToggle(7);
                dispatch(openUploadVideoModal());
              }}
              className={`md:hidden flex justify-center md:w-[25%] w-full mt-2 border md:border-none rounded-md md:rounded-none py-1 text-white cursor-pointer hover:font-bold ${
                toggle === 7 ? "md:bg-zinc-600 md:font-semibold" : ""
              }`}
            >
              Upload Video
            </button>
          )}
          {userId.id === localStorage.getItem("userId") && (
            <button
              onClick={() => {
                setToggle(7);
                dispatch(openPlaylistModal());
              }}
              className={`md:hidden flex justify-center md:w-[25%] w-full mt-2 border md:border-none rounded-md md:rounded-none py-1 text-white cursor-pointer hover:font-bold ${
                toggle === 7 ? "md:bg-zinc-600 md:font-semibold" : ""
              }`}
            >
              Create Playlist
            </button>
          )}

          <button
            onClick={() => {
              setToggle(1);
              fetchVideos();
            }}
            className={`hidden md:block flex justify-center md:w-[25%] w-full mt-2 border md:border-none rounded-md md:rounded-none py-1 text-white cursor-pointer hover:font-bold ${
              toggle === 1 ? "md:bg-zinc-600 md:font-semibold" : ""
            }`}
          >
            Videos
          </button>

          {/* for small screen */}
          <button
            onClick={() => {
              setToggle(1);
              fetchVideos();
              navigate("/VideoList", { state: { videos: videos } });
            }}
            className={`md:hidden flex justify-center md:w-[25%] w-full mt-2 border md:border-none rounded-md md:rounded-none py-1 text-white cursor-pointer hover:font-bold ${
              toggle === 1 ? "md:bg-zinc-600 md:font-semibold" : ""
            }`}
          >
            Videos
          </button>

          <button
            onClick={() => {
              setToggle(2);
            }}
            className={`hidden md:block flex justify-center md:w-[25%] w-full mt-2 border md:border-none rounded-md md:rounded-none py-1 text-white cursor-pointer hover:font-bold ${
              toggle === 2 ? "md:bg-zinc-600 md:font-semibold" : ""
            }`}
          >
            Playlists
          </button>

          {/* for small screen */}
          <button
            onClick={() => {
              setToggle(2);
              navigate("/PlaylistList", { state: { playlists: playlists } });
            }}
            className={`md:hidden flex justify-center md:w-[25%] w-full mt-2 border md:border-none rounded-md md:rounded-none py-1 text-white cursor-pointer hover:font-bold ${
              toggle === 2 ? "md:bg-zinc-600 md:font-semibold" : ""
            }`}
          >
            Playlists
          </button>

          <button
            onClick={() => {
              setToggle(3);
              fetchTweets();
            }}
            className={`hidden md:block flex justify-center md:w-[25%] w-full mt-2 border md:border-none rounded-md md:rounded-none py-1 text-white cursor-pointer hover:font-bold ${
              toggle === 3 ? "md:bg-zinc-600 md:font-semibold" : ""
            }`}
          >
            Tweets
          </button>

          {/* for small screen */}
          <button
            onClick={() => {
              setToggle(3);
              fetchTweets();
              navigate("/TweetList", { state: { tweets: tweets } });
            }}
            className={`md:hidden flex justify-center md:w-[25%] w-full mt-2 border md:border-none rounded-md md:rounded-none py-1 text-white cursor-pointer hover:font-bold ${
              toggle === 3 ? "md:bg-zinc-600 md:font-semibold" : ""
            }`}
          >
            Tweets
          </button>

          <button
            onClick={() => {
              setToggle(4);
            }}
            className={`hidden md:block flex justify-center md:w-[25%] w-full mt-2 border md:border-none rounded-md md:rounded-none py-1 text-white cursor-pointer hover:font-bold ${
              toggle === 4 ? "md:bg-zinc-600 md:font-semibold" : ""
            }`}
          >
            Dashboard
          </button>

          {/* for small screen */}
          <button
            onClick={() => {
              setToggle(4);
              navigate("/MiniDashboard", {
                state: { videos: videos, subscriberCount: subscriberCount },
              });
            }}
            className={`md:hidden lg:hidden xl:hidden flex justify-center md:w-[25%] w-full mt-2 border md:border-none rounded-md md:rounded-none py-1 text-white cursor-pointer hover:font-bold ${
              toggle === 4 ? "md:bg-zinc-600 md:font-semibold" : ""
            }`}
          >
            Dashboard
          </button>

          {userId.id === localStorage.getItem("userId") && (
            <button
              onClick={() => {
                setToggle(5);
              }}
              className={`hidden md:block flex justify-center md:w-[25%] w-full mt-2 border md:border-none rounded-md md:rounded-none py-1 text-white cursor-pointer hover:font-bold ${
                toggle === 5 ? "md:bg-zinc-600 md:font-semibold" : ""
              }`}
            >
              Subscribed
            </button>
          )}

          {/* for small screen */}
          {userId.id === localStorage.getItem("userId") && (
            <button
              onClick={() => {
                setToggle(5);
                dispatch(openToggleSubscription(toggleSubscription));
                navigate("/SubscribedList", {
                  state: { subscribedChannels: subscribedChannels },
                });
              }}
              className={`md:hidden flex justify-center md:w-[25%] w-full mt-2 border md:border-none rounded-md md:rounded-none py-1 text-white cursor-pointer hover:font-bold ${
                toggle === 5 ? "md:bg-zinc-600 md:font-semibold" : ""
              }`}
            >
              Subscribed
            </button>
          )}
        </div>
        <hr className="mt-4 md:mt-1 border-2" />
        <div className="hidden md:block">
          {toggle === 1 && !videos.length && (
            <div className="flex flex-col items-center">
              <div className="flex justify-center items-center w-12 h-12 bg-rose-400 rounded-full mt-10">
                <GrPlayFill />
              </div>
              <h1 className="text-white font-semibold mt-4">
                No videos uploaded
              </h1>
              <p className="text-white mt-2">
                This page has yet to upload a video. Search another page in
                order to find more videos.
              </p>
            </div>
          )}
          {toggle === 1 && videos.length && (
            <div className="flex flex-col gap-5 justify-start mt-4 md:mx-0 lg:mx-10">
              {videos.map((video) => (
                <VideoListCard key={video._id} video={video} />
              ))}
            </div>
          )}
          {toggle === 2 && !playlists.length && (
            <div className="flex flex-col items-center">
              <div className="flex justify-center items-center w-12 h-12 bg-rose-400 rounded-full mt-10">
                <RiPlayList2Fill size={24} />
              </div>
              <h1 className="text-white font-semibold mt-4">
                No playlist created
              </h1>
              <p className="text-white mt-2">
                There are no playlist created on this channel.
              </p>
            </div>
          )}
          {toggle === 2 && playlists.length && (
            <div className="flex flex-wrap justify-center gap-5 mt-4">
              {playlists.map((playlist) => (
                <PlaylistCard key={playlist._id} playlist={playlist} />
              ))}
            </div>
          )}
          {toggle === 3 && !tweets.length && (
            <div className="flex flex-col items-center">
              <div className="flex justify-center items-center w-12 h-12 bg-rose-400 rounded-full mt-10">
                <TbMessageReportFilled size={24} />
              </div>
              <h1 className="text-white font-semibold mt-4">No Tweets</h1>
              <p className="text-white mt-2">
                This channel has yet to make a Tweet.
              </p>
            </div>
          )}
          {toggle === 3 && tweets.length && (
            <div className="flex-1 flex-wrap gap-5 w-full mt-4 ml-6">
              {tweets.map((tweet) => (
                <TweetCard key={tweet._id} tweet={tweet} />
              ))}
            </div>
          )}
          {toggle === 4 && (
            <div className="mt-4 mx-4">
              <Dashboard videos={videos} userId={userId.id} subscriberCount={subscriberCount} />
            </div>
          )}
          {toggle === 5 && !subscribedChannels.length && (
            <div className="flex flex-col items-center">
              <div className="flex justify-center items-center w-12 h-12 bg-rose-400 rounded-full mt-10">
                <TbMessageReportFilled size={24} />
              </div>
              <h1 className="text-white font-semibold mt-4">
                Not subscribed any channel
              </h1>
              <p className="text-white mt-2">
                This channel has yet to subscribe a new channel.
              </p>
            </div>
          )}
          {toggle === 5 && subscribedChannels.length && (
            <div className="flex flex-col gap-5 mt-4 mx-4">
              {subscribedChannels.map((channel) => (
                <ChannelCard
                  key={channel}
                  channel={channel}
                  toggleSubscription={toggleSubscription}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
