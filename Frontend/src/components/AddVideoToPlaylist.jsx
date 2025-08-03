import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { closeAddVideoToPlaylistModal } from "../redux/slices/modalSlice";
import VideoListCard from "./VideoListCard";
import api from "../utils/api";
import PrimaryButton from "../utils/PrimaryButton";
import { MdVerified } from "react-icons/md";

function AddVideoToPlaylist({ playlist }) {
  const dispatch = useDispatch();
  const [success, setSuccess] = useState(false);
  const [videos, setVideos] = useState([]);
  const [videosToAdd, setVideosToAdd] = useState([]);

  useEffect(() => {
    console.log(playlist);

    fetchVideos();
  }, [playlist]);

  const fetchVideos = async () => {
    try {
      const response = await api.get(
        `/videos/getAllVideosOfUser/${localStorage.getItem("userId")}`,
        {
          params: { page: 1, limit: 10 },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const allUserVideos = response.data.data.videos;

      // Since playlist.videos contains only IDs, compare directly
      const filteredVideos = allUserVideos.filter(
        (video) => !playlist.videos.includes(video._id)
      );

      setVideos(filteredVideos);
    } catch (err) {
      console.log("Failed to fetch videos", err);
    }
  };

  const handleCheckboxChange = (e, video) => {
    if (e.target.checked) {
      // Add the video if it's not already in the list
      setVideosToAdd((prev) => [...prev, video]);
    } else {
      // Remove the video if it was unchecked
      setVideosToAdd((prev) => prev.filter((v) => v._id !== video._id));
    }
  };

  const addVideosToPlaylist = async () => {
    try {
      await Promise.all(
        videosToAdd.map((video) =>
          api.post(
            `/playlist/${playlist._id}/video/${video._id}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
        )
      );
      setSuccess(true);
      console.log("All videos added successfully.");
    } catch (error) {
      console.error("Error adding videos:", error);
    }
  };

  return (
    <div>
      <div className="max-h-[650px] md:w-fit w-72 overflow-y-auto border border-white rounded-xl pt-2 px-16 pb-6 bg-zinc-900 shadow-[0px_0px_20px_rgba(251,113,133,0.9)]">
        <button
          className="pl-[107%] text-white text-2xl hover:text-gray-300"
          onClick={() => dispatch(closeAddVideoToPlaylistModal())}
        >
          ✖
        </button>
        <h2 className="text-2xl text-center text-white font-semibold mb-8">
          SELECT VIDEOS
        </h2>
        {success ? (
          <div>
            <div className="flex flex-col justify-center items-center mt-8">
              <MdVerified size={72} color="green" />
              <h1 className="mt-4 text-white font-semibold text-2xl">
                Videos Added successfully!
              </h1>
            </div>
          </div>
        ) : (
          <div className="flex flex-col iteems-center">
            {videos.map((video) => (
              <div
                key={video._id}
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  value={video._id}
                  onChange={(e) => handleCheckboxChange(e, video)}
                  className="mr-4"
                />
                <VideoListCard video={video} />
              </div>
            ))}

            <PrimaryButton
              onClick={() => addVideosToPlaylist()}
              className="my-6"
            >
              Add Videos
            </PrimaryButton>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddVideoToPlaylist;
