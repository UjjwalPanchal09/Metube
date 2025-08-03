import React, { useEffect, useState } from "react";
import GeneralButton from "../utils/GeneralButton";
import DashboardVideoList from "./DashboardVideoList";
import { FaEye } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { SiGoogledisplayandvideo360 } from "react-icons/si";

function Dashboard(data) {
  const [videos, setVideos] = useState([]);
  const [totalVideos, setTotalVideos] = useState(0);
  const [totalViews, setTotalViews] = useState(0);

  useEffect(() => {
    if (data.videos && Array.isArray(data.videos)) {
      setVideos(data.videos);
    }
  }, [data.videos]);

  useEffect(() => {
    const total = videos.reduce((acc, video) => acc + video.views, 0);
    setTotalViews(total);
    setTotalVideos(videos.length);
  }, [videos]);

  const handleDelete = (deletedId) => {
    const updatedVideos = videos.filter((video) => video._id !== deletedId);
    setVideos(updatedVideos);
  };

  return (
    <div>
      {/* Stats section */}
      <div className="flex gap-5">
        <div className="w-80 border p-4">
          <FaEye
            className="w-12 h-12 bg-rose-500 p-2 rounded-full"
            color="white"
          />
          <h2 className="text-sm text-gray-400 mt-4">Total Views</h2>
          <h1 className="text-white text-2xl font-semibold">{totalViews}</h1>
        </div>
        <div className="w-80 border p-4">
          <CgProfile
            className="w-12 h-12 bg-rose-500 p-2 rounded-full"
            color="white"
          />
          <h2 className="text-sm text-gray-400 mt-4">Total Subscribers</h2>
          <h1 className="text-white text-2xl font-semibold">
            {data.subscriberCount}
          </h1>
        </div>
        <div className="w-80 border p-4">
          <SiGoogledisplayandvideo360
            className="w-12 h-12 bg-rose-500 p-2 rounded-full"
            color="white"
          />
          <h2 className="text-sm text-gray-400 mt-4">Total Videos</h2>
          <h1 className="text-white text-2xl font-semibold">{totalVideos}</h1>
        </div>
      </div>

      {/* Video list section */}
      {data.userId === localStorage.getItem("userId") && (
        <div className="border mt-10 mx-2">
          <div className="flex border px-4">
            <h1 className="w-[40%] text-white font-semibold text-lg text-center">
              Your Videos
            </h1>
            <h1 className="w-[15%] text-white font-semibold text-lg text-center">
              Status
            </h1>
            <h1 className="w-[15%] text-white font-semibold text-lg text-center">
              Views
            </h1>
            <h1 className="w-[15%] text-white font-semibold text-lg text-center">
              Likes
            </h1>
            <h1 className="w-[15%] text-white font-semibold text-lg text-center">
              Edit / Delete
            </h1>
          </div>
          <div>
            {videos.map((video) => (
              <DashboardVideoList
                key={video._id}
                video={video}
                onDelete={handleDelete}
              />
            ))}
          </div>
          <div className="flex justify-center gap-4 my-4">
            <GeneralButton className="rounded-full">Load More</GeneralButton>
          </div>
        </div>
      )}
      <hr className="mt-10 border-gray-600" />
    </div>
  );
}

export default Dashboard;
