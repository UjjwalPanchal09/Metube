import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { closeLogout } from "../redux/slices/modalSlice";
import PrimaryButton from "../utils/PrimaryButton";
import SecButton from "../utils/SecButton";

function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    dispatch(logout());
    dispatch(closeLogout());
    navigate("/");
  };

  return (
    <div className="h-fit md:w-96 w-72 border border-white rounded-xl pt-6 px-10 pb-12 bg-zinc-900 shadow-[0px_0px_20px_rgba(251,113,133,0.9)]">
      <h2 className="text-2xl text-center text-white font-semibold mb-6">
        Are you sure you want to logout?
      </h2>
      <div className="flex flex-col gap-5">
        <PrimaryButton onClick={() => handleLogout()}>Logout</PrimaryButton>
        <SecButton onClick={() => dispatch(closeLogout())}>Cancel</SecButton>
      </div>
    </div>
  );
}

export default Logout;
