import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { MdVerified } from "react-icons/md";
import PrimaryButton from "../utils/PrimaryButton";
import { closeEditPlaylistModal } from "../redux/slices/modalSlice";
import api from "../utils/api";

export default function EditPlaylist({playlist}) {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [Updated, setUpdated] = useState(false);

  useEffect(() => {
    setTitle(playlist.name)
    setDescription(playlist.description)
  },[playlist])

  const updatePlaylist = async () => {
    setLoading(true)
    try {
      const data = {
        name : title,
        description,
      };
      const response = await api.put(
        `/playlist/updatePlaylist/${playlist._id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token
          },
        }
      );
      setLoading(false);
      setUpdated(true)
    } catch (error) {
      console.log(error);
      setError("Playlist not updated, try again!")
      setLoading(false)
    }
  };

  return (
    <div>
      <div className="max-h-[650px] md:w-fit w-72 overflow-y-auto border border-white rounded-xl pt-2 px-16 pb-6 bg-zinc-900 shadow-[0px_0px_20px_rgba(251,113,133,0.9)]">
        <button
          className="pl-[100%] text-white text-2xl hover:text-gray-300"
          onClick={() => dispatch(closeEditPlaylistModal())}
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
                  Playlist Updated
                </h1>
                <div className="flex justify-center items-center mt-4">
                  <PrimaryButton
                    onClick={() => {
                      dispatch(closeEditPlaylistModal());
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
                EDIT PLAYLIST
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

              {/* Error Message */}
              {error && (
                <p className="text-red-500 text-center text-md mt-4">{error}</p>
              )}
              {/* Submit Button */}
              <div className="my-4">
                <button
                  onClick={() => updatePlaylist()}
                  disabled={loading}
                  className="w-full text-white font-medium text-xl bg-rose-500 rounded-lg py-2 px-4 hover:bg-rose-600 shadow-md"
                  type="submit"
                >
                  {loading ? "Updating..." : "Update Playlist"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
