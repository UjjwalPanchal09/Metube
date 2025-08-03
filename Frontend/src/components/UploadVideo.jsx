import { useDropzone } from "react-dropzone";
import { useCallback } from "react";
import { useState } from "react";
import { CloudUpload } from "lucide-react";
import { closeUploadVideoModal } from "../redux/slices/modalSlice";
import { RiVideoDownloadLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { MdVerified } from "react-icons/md";
import PrimaryButton from "../utils/PrimaryButton";
import api from "../utils/api";

export default function UploadVideo() {
  const dispatch = useDispatch();
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [Uploaded, setUploaded] = useState(false);

  const uploadVideo = async () => {
    if (!videoFile || !thumbnail) {
      setError("Please upload both video and thumbnail");
      return;
    }

    if (!title) {
      setError("Please enter a title");
      return;
    }
    if (!description) {
      setError("Please enter a description");
      return;
    }

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
    formdata.append("videoFile", videoFile);
    formdata.append("thumbnail", thumbnail);
    formdata.append("ispublished", isPublic);

    try {
      const response = await api.post("/videos/publish", formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Include token
        },
      });
      setUploaded(true);
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

  const handleVideoUpload = (event) => {
    setVideoFile(event.target.files[0]);
  };

  const handleThumbnailUpload = (event) => {
    setThumbnail(event.target.files[0]);
  };

  const onDrop = useCallback((acceptedFiles) => {
    setVideoFile(acceptedFiles[0]);
    console.log(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="w-[90%] sm:w-[80%] md:w-[50%] ">
      <div className="max-h-[800px] overflow-y-auto border border-white rounded-xl pt-2 px-4 md:px-16 pb-6 bg-zinc-900 shadow-[0px_0px_20px_rgba(251,113,133,0.9)]">
        <button
          className="pl-[95%] text-white text-2xl hover:text-gray-300"
          onClick={() => dispatch(closeUploadVideoModal())}
        >
          ✖
        </button>

        <div>
          {Uploaded ? (
            <div>
              <div className="W-fit m-4">
                <div className="flex justify-center items-center mt-4">
                  <MdVerified size={72} color="green" />
                </div>
                <h1 className="text-center text-white mt-8 font-bold text-xl">
                  Video Uploaded
                </h1>
                <h1 className="w-96 text-center text-white mt-4 text-xl">
                  Your video is published{" "}
                  {isPublic ? "publically" : "privately"}, you can change the
                  Visibility later.
                </h1>
                <div className="flex justify-center items-center mt-4">
                  <PrimaryButton
                    onClick={() => {
                      dispatch(closeUploadVideoModal());
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
                UPLOAD VIDEO
              </h2>

              {/* Drag and Drop Box */}
              <div className="border-2 border-dashed border-stone-400 p-4 md:p-6 rounded-lg text-center">
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  {!videoFile ? (
                    <div className="flex flex-col items-center">
                      <CloudUpload className="text-purple-400 w-16 h-16" />
                      <p className="text-white font-medium mt-2">
                        Drag and drop video files to upload
                      </p>
                      <p className="text-gray-400 text-sm">
                        Your videos will be private until you publish them.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center mx-10">
                      <RiVideoDownloadLine
                        className="w-24 h-20 p-2 text-sm bg-rose-200 rounded-lg"
                        color="black"
                      />
                      <h1 className="text-white text-xl font-bold">
                        Video file uploaded
                      </h1>
                      <h1 className="text-white text-lg">
                        Filename : {videoFile.name}
                      </h1>
                    </div>
                  )}
                </div>
                <label className="mt-4 inline-block bg-rose-500 text-white font-semibold text-xl px-4 py-2 rounded-lg cursor-pointer hover:bg-rose-600 shadow-md">
                  Select Files
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleVideoUpload}
                  />
                </label>
              </div>

              {/* Thumbnail Upload */}
              <div className="mt-4">
                <label className="text-white block font-medium">
                  Thumbnail*
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
              </div>

              {/* Title Input */}
              <div className="mt-4">
                <label className="text-white block font-medium">Title*</label>
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
                <label className="text-white block">Description*</label>
                <textarea
                  className="w-full h-14 md:h-32 bg-gray-800 text-white px-2 py-2 mt-1 rounded-lg border border-stone-400 focus:ring-2 focus:ring-stone-400 outline-none resize-none"
                  placeholder="Enter video description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Toggle Switch for Public/Private */}
              <div className="mt-4 items-center justify-between">
                <label className="text-white font-medium">
                  Video Visibility*
                </label>
                <div className="flex gap-5 items-center mt-2 justify-center">
                  <div
                    className={`w-16 h-8 flex items-center rounded-full p-1 cursor-pointer ${
                      isPublic ? "bg-rose-500" : "bg-gray-500"
                    }`}
                    onClick={() => setIsPublic(!isPublic)}
                  >
                    <div
                      className={`w-6 h-6 bg-white rounded-full shadow-md transform transition ${
                        isPublic ? "translate-x-8" : ""
                      }`}
                    ></div>
                  </div>
                  <span
                    className={`border px-2 py-1 rounded-full ${
                      isPublic
                        ? "text-green-500 border-green-500"
                        : "text-red-500 border-red-500"
                    }`}
                  >
                    {isPublic ? "Public" : "Private"}
                  </span>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <p className="text-red-500 text-center text-md mt-4">{error}</p>
              )}
              {/* Submit Button */}
              <div className="my-4">
                <button
                  onClick={uploadVideo}
                  disabled={loading}
                  className="w-full text-white font-semibold text-xl bg-rose-500 rounded-lg py-2 px-4 hover:bg-rose-600 shadow-md"
                  type="submit"
                >
                  {loading ? "Uploading..." : "Upload Video"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
