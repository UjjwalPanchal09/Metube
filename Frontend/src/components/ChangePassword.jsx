import React, { useState } from "react";
import PrimaryButton from "../utils/PrimaryButton";
import api from "../utils/api";
import { MdVerified } from "react-icons/md";

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const changePassword = async () => {
    if (!(currentPassword || newPassword || confirmPassword)) {
      setError("Please fill in all required fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const data = {
        currentPassword,
        newPassword,
      };
      const response = await api.post("users/changePassword", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(response);
      setSuccess(true);
    } catch (error) {
      setError("Current password is incorrect !!");
    }
  };

  return (
    <div>
      {success ? (
        <div>
          <div className="flex flex-col justify-center items-center mt-8">
            <MdVerified size={72} color="green" />
            <h1 className="mt-4 text-white font-semibold text-2xl">
              Password updated successfully!
            </h1>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl text-center text-white font-semibold mb-8">
            CHANGE PASSWORD
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap justify-between gap-2">
              <label className="text-lg text-white" htmlFor="password">
                Current Password :{" "}
              </label>
              <input
                className="rounded-md focus:ring-2 focus:ring-rose-500 outline-none px-1"
                onChange={(e) => setCurrentPassword(e.target.value)}
                type="password"
                placeholder="Enter password"
              />
            </div>
            <hr className="hidden md:block" />
            <div className="flex flex-wrap justify-between gap-2">
              <label className="text-white text-lg" htmlFor="password">
                New Password :{" "}
              </label>
              <input
                className="rounded-md focus:ring-2 focus:ring-rose-500 outline-none px-1"
                onChange={(e) => setNewPassword(e.target.value)}
                type="password"
                placeholder="Enter password"
              />
            </div>
            <div className="flex flex-wrap justify-between gap-2">
              <label className="text-white text-lg" htmlFor="password">
                Confirm New Password :{" "}
              </label>
              <input
                className={`rounded-md outline-none px-1 ${
                  newPassword === confirmPassword
                    ? "focus:ring-[3px] focus:ring-green-500"
                    : "focus:ring-[3px] focus:ring-red-600"
                }`}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                placeholder="Enter password"
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            <PrimaryButton className="mt-6" onClick={() => changePassword()}>
              Change Password
            </PrimaryButton>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChangePassword;
