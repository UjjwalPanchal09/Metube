import React, { useEffect, useState } from "react";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import api from "../utils/api";
import { useDispatch } from "react-redux";
import {
  openDeleteVideoModal,
  openEditVideoModal,
} from "../redux/slices/modalSlice";

function MiniDashboardVideoList({ video, onDelete }) {
  const [likeCount, setLikeCount] = useState(null);
  const dispatch = useDispatch();
  const [isPublic,setIsPublic] = useState(false);

  useEffect(() => {
    setIsPublic(video.ispublished);
    getLikeCount();
  }, [video._id]);

  const getLikeCount = async () => {
    try {
      const response = await api.get(`/likes/likeCount/video/${video._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setLikeCount(response.data.data);
    } catch (error) {
      console.error("Error fetching like count:", error);
      setLikeCount("N/A");
    }
  };

  const togglePublishStatus = async () => {
    try {
      const response = await api.patch(`/videos/toggle/publish/${video._id}`,{},{
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      setIsPublic(!isPublic)
    } catch (error) {
      console.log(error);      
    }
  } 

  return (
    <div>
      <div className="flex flex-col gap-2 p-2">
        <div className="flex items-center gap-2">
          <img
            className="w-8 h-8 rounded-full"
            src={video.thumbnail}
            alt="Thumbnail"
          />
          <h1 className="text-white line-clamp-1">{video.title}</h1>
        </div>

        <div className="flex justify-center">
          <div className="flex gap-2 items-center mt-2 justify-center">
            <div
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${
                isPublic ? "bg-rose-500" : "bg-gray-500"
              }`}
              onClick={() => togglePublishStatus()}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow-md transform transition ${
                  isPublic ? "translate-x-6" : ""
                }`}
              ></div>
            </div>
            <span
              className={`border px-1 rounded-full text-xs ${
                isPublic
                  ? "text-green-500 border-green-500"
                  : "text-red-500 border-red-500"
              }`}
            >
              {isPublic ? "Public" : "Private"}
            </span>
          </div>
        </div>

        <div className="flex justify-center gap-5">
            <div className="text-center text-white font-semibold">Views : {video.views}</div>
            <div className="text-center text-white font-semibold">
            Likes : {likeCount !== null ? likeCount : "Loading..."}
            </div>
        </div>

        <div className="flex justify-center">
            <div className="h-fit flex gap-10 pl-4">
            <MdOutlineModeEditOutline
                onClick={() => dispatch(openEditVideoModal(video._id))}
                className="text-xl hover:text-2xl"
                color="white"
            />
            </div>

            <div className="h-fit flex gap-10 pl-4">
            <RiDeleteBinLine
                onClick={() => {
                dispatch(openDeleteVideoModal(video._id, onDelete));
                }}
                className="text-xl hover:text-2xl"
                color="white"
            />
            </div>  
        </div>
      </div>
      <hr className="border-gray-600" />
    </div>
  );
}

export default MiniDashboardVideoList;
