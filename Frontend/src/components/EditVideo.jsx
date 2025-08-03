import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { MdVerified } from "react-icons/md";
import PrimaryButton from "../utils/PrimaryButton";
import { closeEditVideoModal } from "../redux/slices/modalSlice";
import api from "../utils/api";

export default function EditVideo({ videoId }) {
  const dispatch = useDispatch();
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [Updated, setUpdated] = useState(false);

  useEffect(() => {
    fetchVideo();
  }, [videoId]);

  const fetchVideo = async () => {
    try {
      const response = await api.get(`/videos/${videoId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTitle(response.data.data.title);
      setDescription(response.data.data.description);
      // setIsPublic(response.data.data.ispublished);
    } catch (error) {
      console.log(error);
    }
  };

  const updateVideo = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated. Please log in.");
      setLoading(false);
      return;
    }
    const formdata = new FormData();
    formdata.append("title", title);
    formdata.append("description", description);    
    // formdata.append("ispublished", isPublic);
    if (thumbnail) formdata.append("thumbnail", thumbnail);

    try {
      const response = await api.patch(`/videos/update/${videoId}`, formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Include token
        },
      });
      //   console.log(response);
      setUpdated(true);
    } catch (error) {
      console.error("Error uploading video:", error);
      if (error.response?.data?.message) {
        setError(error.response?.data?.message);
      } else {
        setError("Failed to upload video");
      }
      dispatch(setLoading(false));
      return;
    }
  };

  const handleThumbnailUpload = (event) => {
    setThumbnail(event.target.files[0]);
  };

  return (
    <div>
      <div className="max-h-[650px] md:w-fit w-72 overflow-y-auto border border-white rounded-xl pt-2 px-16 pb-6 bg-zinc-900 shadow-[0px_0px_20px_rgba(251,113,133,0.9)]">
        <button
          className="pl-[100%] text-white text-2xl hover:text-gray-300"
          onClick={() => dispatch(closeEditVideoModal())}
        >
          ✖
        </button>

        <div>
          {Updated ? (
            <div>
              <div className="W-fit m-4">
                <div className="flex justify-center items-center mt-4">
                  <MdVerified size={72} color="green" />
                </div>
                <h1 className="text-center text-white mt-8 font-bold text-xl">
                  Video Updated
                </h1>
                <div className="flex justify-center items-center mt-4">
                  <PrimaryButton
                    onClick={() => {
                      dispatch(closeEditVideoModal());
                    }}
                    className="text-4xl"
                  >
                    Close
                  </PrimaryButton>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl text-center text-white font-semibold mb-8">
                EDIT VIDEO
              </h2>

              {/* Title Input */}
              <div className="mt-4">
                <label className="text-white block font-medium">Title</label>
                <input
                  type="text"
                  className="w-full bg-gray-800 text-white px-2 py-2 mt-1 rounded-lg border border-stone-400 focus:ring-2 focus:ring-stone-400 outline-none"
                  placeholder="Enter video title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* description Input */}
              <div className="mt-4">
                <label className="text-white block">Description</label>
                <textarea
                  className="w-full h-32 bg-gray-800 text-white px-2 py-2 mt-1 rounded-lg border border-stone-400 focus:ring-2 focus:ring-stone-400 outline-none resize-none"
                  placeholder="Enter video description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Thumbnail Upload */}
              <div className="mt-4">
                <label className="text-white block font-medium">
                  Thumbnail
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <label className="bg-rose-500 text-white text-lg font-semibold px-2 py-1 rounded-lg cursor-pointer hover:bg-rose-600">
                    Choose File
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleThumbnailUpload}
                    />
                  </label>
                  <span className="text-gray-400">
                    {thumbnail ? thumbnail.name : "No file chosen"}
                  </span>
                </div>
                <h1 className="text-[60%] mt-1 text-gray-500">
                  Add a new image file to replace/add new thumbnail
                </h1>
              </div>              

              {/* Error Message */}
              {error && (
                <p className="text-red-500 text-center text-md mt-4">{error}</p>
              )}
              {/* Submit Button */}
              <div className="my-4">
                <button
                  onClick={() => updateVideo()}
                  disabled={loading}
                  className="w-full text-white font-medium text-xl bg-rose-500 rounded-lg py-2 px-4 hover:bg-rose-600 shadow-md"
                  type="submit"
                >
                  {loading ? "Updating..." : "Update Video"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
