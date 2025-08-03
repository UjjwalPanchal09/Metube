import React, { useState,useEffect } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openLogin } from "../redux/slices/modalSlice";

function MiniVideoListCard(video) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
    <div onClick={()=> { if(localStorage.getItem('token')) navigate(`/VideoDetail/${video.video._id}`); else dispatch(openLogin())}} className="h-[100px] hover:bg-zinc-800 flex gap-2 rounded-md cursor-pointer border border-gray-700 rounded-lg">
      <img
        className="rounded-md w-[40%] m-1"
        src={video.video.thumbnail}
        alt="Thumbnail"
      />

      <div className="flex flex-col py-2">
        <h1 className="w-[70%] text-white text-md font-semibold line-clamp-1 sm:line-clamp-2">
          {video.video.title}
        </h1>
        <div className="mt-2">
          <div className="flex items-center gap-2 sm:mt-2">
            <img
              className="h-6 w-6 rounded-full"
              src={user.avatar}
              alt="Profile pic"
            />
            <h1 className="text-gray-400 text-xs">{user.fullname}</h1>
          </div>
          <h3 className="text-gray-400 text-xs mt-1">{video.video.views} Views | {publishedAt}</h3>
        </div>
      </div>
    </div>
  );
}

export default MiniVideoListCard;
