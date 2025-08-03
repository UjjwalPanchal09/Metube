import React from "react";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Register from "./components/Register";
import UploadVideo from "./components/UploadVideo";
import PostTweet from "./components/PostTweet";
import EditProfile from "./components/EditProfile";
import CreatePlaylist from "./components/CreatePlaylist";
import AddVideoToPlaylist from "./components/AddVideoToPlaylist";
import EditVideo from "./components/EditVideo";
import EditPlaylist from "./components/EditPlaylist";
import DeletePlaylist from "./components/DeletePlaylist";
import DeleteVideo from "./components/DeleteVideo";
import Notification from "./components/Notification";
import { useDispatch, useSelector } from "react-redux";
import { closeSearchingModal } from "./redux/slices/modalSlice";
import SearchBox from "./components/SearchBox";
import DeleteTweet from "./components/DeleteTweet";
import DeleteComment from "./components/DeleteComment";
import EditTweet from "./components/EditTweet";
import Footer from "./components/Footer";
function App() {
  const dispatch = useDispatch();
  const {
    isLoginOpen,
    isRegisterationOpen,
    isUploadVideoModalOpen,
    isPlaylistModalOpen,
    isTweetModalOpen,
    isEditProfileModalOpen,
    isAddVideoToPlaylistModalOpen,
    selectedPlaylist,
    isEditVideoModalOpen,
    videoIdToEdit,
    isEditTweetModalOpen,
    tweetToEdit,
    isEditPlaylistModalOpen,
    playlistToEdit,
    isDeletePlaylistModalOpen,
    playlistIdToDelete,
    isDeleteVideoModalOpen,
    videoIdToDelete,
    isDeleteTweetModalOpen,
    TweetIdToDelete,
    isDeleteCommentModalOpen,
    CommentIdToDelete,
    isNotificationModalOpen,
    isSearchingModalOpen,
    searchResults,
    isLogoutOpen,
  } = useSelector((state) => state.modal);

  return (
    <div
      onClick={() => dispatch(closeSearchingModal())}
      className="min-h-screen flex flex-col bg-zinc-900"
    >   
      {/* Main Content */}
      <div
        className={`flex-grow ${
          isLoginOpen ||
          isRegisterationOpen ||
          isUploadVideoModalOpen ||
          isPlaylistModalOpen ||
          isTweetModalOpen ||
          isEditProfileModalOpen ||
          isAddVideoToPlaylistModalOpen ||
          isEditVideoModalOpen ||
          isEditTweetModalOpen ||
          isEditPlaylistModalOpen ||
          isDeletePlaylistModalOpen ||
          isDeleteVideoModalOpen ||
          isDeleteTweetModalOpen ||
          isDeleteCommentModalOpen ||
          isLogoutOpen
            ? "blur-sm"
            : ""
        }`}
      >
        <Navbar />
      </div>
      <div className={`${
          isLoginOpen ||
          isRegisterationOpen ||
          isUploadVideoModalOpen ||
          isPlaylistModalOpen ||
          isTweetModalOpen ||
          isEditProfileModalOpen ||
          isAddVideoToPlaylistModalOpen ||
          isEditVideoModalOpen ||
          isEditTweetModalOpen ||
          isEditPlaylistModalOpen ||
          isDeletePlaylistModalOpen ||
          isDeleteVideoModalOpen ||
          isDeleteTweetModalOpen ||
          isDeleteCommentModalOpen ||
          isLogoutOpen
            ? "blur-sm"
            : ""
        }`}>
        <Footer />
      </div>

      {/* Modals */}
      {isSearchingModalOpen && (
        <div className="fixed inset-y-16 inset-x-0 flex justify-center">
          <SearchBox videos={searchResults} />
        </div>
      )}

      {isLoginOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <Login />
        </div>
      )}
      {isLogoutOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <Logout />
        </div>
      )}
      {isRegisterationOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <Register />
        </div>
      )}
      {isUploadVideoModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <UploadVideo />
        </div>
      )}
      {isPlaylistModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <CreatePlaylist />
        </div>
      )}
      {isTweetModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <PostTweet />
        </div>
      )}
      {isEditProfileModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <EditProfile />
        </div>
      )}
      {isAddVideoToPlaylistModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <AddVideoToPlaylist playlist={selectedPlaylist} />
        </div>
      )}
      {isEditVideoModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <EditVideo videoId={videoIdToEdit} />
        </div>
      )}
      {isEditTweetModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <EditTweet tweetId={tweetToEdit} />
        </div>
      )}
      {isEditPlaylistModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <EditPlaylist playlist={playlistToEdit} />
        </div>
      )}
      {isDeleteVideoModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <DeleteVideo payload={videoIdToDelete} />
        </div>
      )}
      {isDeleteTweetModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <DeleteTweet payload={TweetIdToDelete} />
        </div>
      )}
      {isDeleteCommentModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <DeleteComment payload={CommentIdToDelete} />
        </div>
      )}
      {isDeletePlaylistModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <DeletePlaylist playlistId={playlistIdToDelete} />
        </div>
      )}
      {isNotificationModalOpen && (
        <div className="fixed inset-0 flex justify-end">
          <Notification />
        </div>
      )}
    </div>
  );
}

export default App;
