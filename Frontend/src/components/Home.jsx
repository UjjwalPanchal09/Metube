import React, { useEffect, useState } from "react";
import PlaylistCard from "./PlaylistCard";
import VideoCard from "./VideoCard";
import api from "../utils/api";
import GeneralButton from "../utils/GeneralButton";
function Home() {
  const [videos, setVideos] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [videoPageNumber, setVideoPageNumber] = useState(1);
  const [playlistPageNumber, setPlaylistPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVideos(1);
    fetchPlaylists(1);
  }, []);

  // Fetch Videos from API
  const fetchVideos = async (p) => {
    setLoading(true);
    setError(null);
    try {
      console.log(p);
      
      const response = await api.get("/videos/getAllVideos", {
        params: { page: p, limit: 10 }, // Adjust pagination if needed
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setVideos(response.data.data.videos);
    } catch (err) {
      setError("Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  };

  const fetchPlaylists = async (p) => {
    try {
      const response = await api.get("/playlist/getAllPlaylists", {
        params: { page: p, limit: 10 }, // Adjust pagination if needed
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      // console.log(response.data.data.Playlists);
      setPlaylists(response.data.data.Playlists);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div>
        <h1 className="text-white font-semibold text-4xl text-center mt-8">
          Videos
        </h1>
        <hr className="mt-2 border border-gray-600" />
        <div className="flex gap-5 flex-wrap justify-center">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
        <div className="flex justify-center gap-4 my-4">
          <GeneralButton onClick={() => {setVideoPageNumber(videoPageNumber+1); fetchVideos(videoPageNumber+1)}} className="rounded-full">Load More</GeneralButton>
        </div>
        <h1 className="text-white font-semibold text-4xl text-center mt-8">
          Playlists
        </h1>
        <hr className="mt-2 border border-gray-600" />
        <div className="flex gap-5 flex-wrap justify-center">
          {playlists.map(
            (playlist) =>
              playlist.videos.length > 0 && (
                <PlaylistCard key={playlist._id} playlist={playlist} />
              )
          )}
        </div>
        <div className="flex justify-center gap-4 my-4">
          <GeneralButton onClick={() => {setPlaylistPageNumber(playlistPageNumber+1); fetchVideos(playlistPageNumber+1)}} className="rounded-full">Load More</GeneralButton>
        </div>
      </div>
    </div>
  );
}

export default Home;
