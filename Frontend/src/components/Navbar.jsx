import React, { useEffect, useState } from "react";
import Routing from "../utils/Routing";
import MeTube from "../assets/MeTube.png";
import { useLocation, useNavigate, matchPath } from "react-router-dom";
import { Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  openLogin,
  openRegister,
  openLogout,
  openNotificationModal,
  closeNotificationModal,
  openSearchingModal,
  closeSearchingModal,
} from "../redux/slices/modalSlice";
import { IoNotifications } from "react-icons/io5";
import { GoDotFill } from "react-icons/go";
import api from "../utils/api";
import Footer from "./Footer";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isNotificationModalOpen, isSearchingModalOpen } = useSelector((state) => state.modal);
  const [search, setSearch] = useState("");
  const [notificationBox, setNotificationBox] = useState(false);
  const [notificationFlag, setNotificationFlag] = useState(false);
  let user = useSelector((state) => state.auth.user);


  useEffect(() => {    
    if (user) {
      checkNotification();
    }
  }, [user]);  

  const checkNotification = async () => {
    if(!user) return;
    try {
      const response = await api.get('/notifications/unread-count',{
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      if(response.data.data > 0){
        setNotificationFlag(true);
      }
    } catch (error) {
      console.log(error);      
    }
  }

  const match = matchPath(
    `/Profile/${localStorage.getItem("userId")}`,
    location.pathname
  );

  const handleNotification = () => {
    if(notificationBox){
      dispatch(closeNotificationModal())
    }
    else{
      dispatch(openNotificationModal());
      setNotificationFlag(false);
    }
    setNotificationBox(!notificationBox);
  }

  const handleSearch = async (value) => {
    setSearch(value);
    dispatch(closeSearchingModal())
    if(!value) {
      return;
    }
    try {
      const response = await api.get(`/search/videos?query=${value}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      // console.log(response.data.data);
      dispatch(openSearchingModal(response.data.data));      
    } catch (error) {
      console.log(error);     
    }
  }

  return (
    <div>
      <div className="relative bg-zinc-950 text-white shadow-[0px_0px_20px_rgba(251,113,133,0.5)]">
        {/* Navbar content */}
        <div className="flex items-center justify-between px-2 md:px-6 py-2 sm:py-4 relative z-8">
          {/* Logo */}
          <img
            onClick={() => {
              if (user) {
                navigate("/Home");
              }
              else{
                navigate("/");
              }
            }}
            src={MeTube}
            alt="Logo"
            className="w-8 h-8 md:w-12 md:h-12 cursor-pointer rounded-full hover:shadow-[0px_0px_20px_rgba(251,113,133,0.8)]"
          />

          {/* Search Bar */}
          <div className="ml-[10%] md:ml-20 relative flex items-center w-[50%] bg-zinc-900 rounded-full shadow-[0px_0px_20px_rgba(251,113,133,0.5)]">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-1 md:py-2 text-white bg-transparent border-none outline-none placeholder-gray-400"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <Search className="absolute right-4 text-gray-400 cursor-pointer" />
          </div>

          {/* Auth Buttons / Profile */}
          {user && location.pathname !== "/" ? (
            <div className="flex items-center">
              <div className="flex">
                <IoNotifications onClick={() => handleNotification()} className="size-4 sm:size-6 md:size-8 mr-2" />
                {notificationFlag && (
                  <GoDotFill
                    onClick={() => handleNotification()}
                    // size={20}
                    className="size-3 sm:size-5 text-red-500 absolute ml-[1%] cursor-pointer"
                  />
                )}
              </div>
              {match ? (
                <div className="flex gap-2 md:gap-5">
                  <h2
                    onClick={() => dispatch(openLogout())}
                    className="sm:ml-2 md:ml-4 font-semibold hover:font-bold text-xs text-rose-500 md:text-lg cursor-pointer"
                  >
                    Logout
                  </h2>
                </div>
              ) : (
                <div className="sm:w-20 flex justify-end">
                  <button
                    onClick={() =>
                      navigate(`/Profile/${localStorage.getItem("userId")}`)
                    }
                  >
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="w-8 h-8 md:w-12 md:h-12 rounded-full cursor-pointer hover:shadow-[0px_0px_20px_rgba(251,113,133,0.8)]"
                    />
                  </button>
                </div>
              )}
            </div>
          ) : (
            (location.pathname === "/" || location.pathname === "/TermsAndConditions" || location.pathname === "/PrivacyPolicy") && (
              <div className="flex gap-2 md:gap-5">
                <h2
                  onClick={() => dispatch(openLogin())}
                  className="font-semibold hover:font-bold text-xs text-rose-400 md:text-lg cursor-pointer"
                >
                  Login
                </h2>
                <h2
                  onClick={() => dispatch(openRegister())}
                  className="font-semibold hover:font-bold text-xs text-stone-400 md:text-lg cursor-pointer"
                >
                  Signup
                </h2>
              </div>
            )
          )}
        </div>
      </div>
      <div className={`${isNotificationModalOpen || isSearchingModalOpen ? "blur-sm" : ""}`}>
        <Routing />
      </div>
    </div>
  );
}
