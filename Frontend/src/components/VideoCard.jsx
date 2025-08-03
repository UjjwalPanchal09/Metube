import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
function VideoCard(video) {
  const navigate = useNavigate()
  const [user,setUser] = useState({})
  const [publishedAt, setPublishedAt] = useState();

  useEffect(() => {
    getUser();
    setPublishedAt(timeAgo(video.video.createdAt));
  }, [video?.video?.owner]);

  // Fetch user data when video is loaded
  const getUser = async() => {
      try {
        const response = await api.get(`/users/${video.video.owner}`,{})
        setUser(response.data.data)
      } catch (error) {
        console.log(error)
      }
  }

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
    <div onClick={() => navigate(`/VideoDetail/${video.video._id}`)} className="w-72 sm:w-80 lg:w-72 mt-4 hover:bg-zinc-800 rounded-md">
      <div className="w-full h-[70%]">
        <img
          className="rounded h-full w-[95%] m-auto mt-1"
          src={video.video.thumbnail}
          alt="Playlist Thumbnail"
        />
      </div>
      <div className="w-full flex items-center gap-2 mt-2 px-2">
        <img className="w-8 h-8 rounded-full" src={user.avatar} alt="Profile pic" />
        <div className="w-full">
            <h1 className="text-white font-semibold line-clamp-1">{video.video.title}</h1>
            <div className="flex justify-between items-center">
                <h3 className="text-gray-400 text-xs w-[40%] line-clamp-1">{user.fullname}</h3>
                <h3 className="text-gray-400 text-xs">{video.video.views} Views | {publishedAt}</h3>
            </div>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;
