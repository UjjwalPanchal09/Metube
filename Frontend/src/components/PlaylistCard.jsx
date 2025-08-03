import React, { useEffect, useState } from "react";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { useLocation,matchPath, useNavigate } from "react-router-dom";
import Playlist_Thumbnail from "../assets/Playlist_Thumbnail.png"
import api from "../utils/api";
import { useDispatch } from "react-redux";
import { openDeletePlaylistModal, openEditPlaylistModal } from "../redux/slices/modalSlice";

function PlaylistCard({playlist}) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user,setUser] = useState({});
  const [thumbnail, setThumbnail] = useState(Playlist_Thumbnail);
  const match = matchPath(`/Profile/${localStorage.getItem("userId")}`, location.pathname);

  useEffect(() => {
    if(playlist.videos.length){      
      fetchVideo(playlist.videos[0]); 
    }
    getUser();
  },[playlist.owner])
  
  const getUser = async () => {
    try {
      const response = await api.get(`/users/${playlist.owner}`, {});
      setUser(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchVideo = async (videoId) => {
    try {
      const response = await api.get(`/videos/${videoId}`,{
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })    
      // setVideo(response.data.data);
      setThumbnail(response.data.data.thumbnail);     
    } catch (error) {
      console.log(error);      
    }
  }


  return (
    <div className="w-72 sm:w-80 lg:w-72 my-4 cursor-pointer border border-zinc-800 rounded-md">
      <div className="w-full h-full">
        <div onClick={() => navigate(`/playlistView/${playlist._id}`)} className="relative">
          <img
            className="rounded h-52 w-full"
            src={thumbnail}
            alt="Playlist Thumbnail"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
          <div className="absolute inset-0 flex items-end justify-between m-2">
            <div className="w-[70%]">
              {/* <h1 className="text-white font-semibold">{playlist.name}</h1> */}
              <h3 className="text-gray-400 text-xs line-clamp-4">
                {playlist.description}
              </h3>
            </div>
            <h3 className="text-white text-sm font-semibold">{playlist.videos.length} Videos</h3>
          </div>
        </div>
        <div className="flex gap-2 items-start justify-between items-center p-1">
          <div onClick={() => navigate(`/playlistView/${playlist._id}`)} className="flex gap-2">
            <img
              className="w-8 h-8 rounded-full mt-1"
              src={user.avatar}
              alt="Profile pic"
            />
            <div>
              <h1 className="text-sm text-white font-semibold">
                {playlist.name}
              </h1>
              <h3 className="text-gray-400 text-xs">{user.fullname}</h3>
              {/* <p className='text-white line-clamp-1 text-xs'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eos in commodi beatae harum, corporis sed totam magnam culpa unde modi?</p> */}
            </div>
          </div>
          {
            match && 
            <div className="flex items-center text-white gap-3 pr-1">
              <div>
                <MdOutlineModeEditOutline onClick={() => dispatch(openEditPlaylistModal(playlist))}  className="text-2xl hover:text-3xl" />
              </div>
              <div>
                <RiDeleteBinLine onClick={() => dispatch(openDeletePlaylistModal(playlist._id))} className="text-2xl hover:text-3xl" />
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default PlaylistCard;
