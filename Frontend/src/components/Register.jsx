import React, { useEffect, useRef, useState } from "react";
import PrimaryButton from "../utils/PrimaryButton";
import SecButton from "../utils/SecButton";
import { MdDeleteForever } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  registrationStart,
  registrationSuccess,
  registrationFailure,
} from "../redux/slices/registerSlice";
import { openLogin, closeRegister } from "../redux/slices/modalSlice";
import api from "../utils/api";
import { AiOutlineLoading } from "react-icons/ai";
import { MdVerified } from "react-icons/md";
import { PiArrowFatLinesDownFill } from "react-icons/pi";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";

function Register() {
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.register);
  const [loadingWheel, setLoadingWheel] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [cover, setCover] = useState(null);
  const [passwordStatus, setPasswordStatus] = useState(true);
  const [passcode, setPasscode] = useState(null);
  const [verified, setVerified] = useState(false);
  const [VerificationError, setVerificationError] = useState(null);
  const [step, setstep] = useState(false);
  const [otp, setOtp] = useState(null);
  const [email, setEmail] = useState(null);
  const [token, setToken] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isDisabled, setIsDisabled] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm();

  useEffect(() => {
    if (verified) {
      handleSubmit(onSubmit)(); // Automatically submit the form when verified
    }
  }, [verified]);

  // Handle image selection with validation
  const handleImageChange = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB");
        return;
      }

      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        alert("Only JPG, JPEG, and PNG formats are allowed");
        return;
      }

      // Set image preview
      const imageUrl = URL.createObjectURL(file);

      if (type === "avatar") {
        setAvatar(imageUrl);
        setValue("avatar", file); // Manually set value
        trigger("avatar"); // Trigger validation
      } else if (type === "cover") {
        setCover(imageUrl);
        setValue("coverImage", file);
        trigger("coverImage");
      }
      event.target.value = "";
    }
  };

  // Remove selected image
  const removeImage = (type) => {
    if (type === "avatar") {
      setAvatar(null);
    } else if (type === "cover") {
      setCover(null);
    }
  };

  const handlePassword = (p1, key) => {
    if (key === "p") {
      setPasscode(p1);
    }
    if (key === "cp") {
      if (p1 !== passcode) {
        setPasswordStatus(false);
      } else {
        setPasswordStatus(true);
      }
    }
  };

  const onSubmit = async (data) => {
    // console.log("Form Data on Submit:", data);
    setLoadingWheel(true);
    if (!avatar) {
      dispatch(registrationFailure("Upload an avatar!"));
      return;
    }

    if (passwordStatus === false) {
      dispatch(registrationFailure("Password does not match!"));
      return;
    }

    dispatch(registrationStart());

    if (verified === false) {
      setEmail(data.email);
      sendOtp(data.email);
      setLoadingWheel(false);
    } else {
      const formData = new FormData();
      formData.append("fullname", data.fullname);
      formData.append("email", data.email);
      formData.append("username", data.username);
      formData.append("password", data.password);
      if (data.avatar) {
        formData.append("avatar", data.avatar);
      }
      if (data.coverImage) {
        formData.append("coverImage", data.coverImage);
      }

      try {
        const response = await api.post("/users/register", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        dispatch(registrationSuccess(response.data));
        setRegistered(true);
        dispatch(closeRegister());
        dispatch(openLogin());
        setLoadingWheel(false);
      } catch (error) {
        console.log("Registration Error:", error);
        dispatch(
          registrationFailure(
            error.response?.data?.message || "Not Registered!"
          )
        );
        setLoadingWheel(false);
      }
    }
  };

  const sendOtp = async (email) => {
    const data = {
      email: email,
    };
    try {
      const response = await api.post("/users/otp/send", data, {
        headers: { "Content-Type": "application/json" },
      });
      setstep(true);
      setToken(response.data.token);
      setTimer(60);
    } catch (error) {
      dispatch(
        registrationFailure(
          error.response?.data?.message || "Failed to send OTP!"
        )
      );
    }
  };

  const verifyOtp = async () => {
    const data = {
      otp: otp,
      token: token,
      email: email,
    };
    try {
      const response = await api.post("/users/otp/verify", data, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.data.success) {
        setVerified(true);
        setstep(false);
      } else {
        setstep(false);
        setVerificationError(response.data.message);
      }
    } catch (error) {
      setstep(false);
      dispatch(
        registrationFailure(
          error.response?.data?.message || "Verification failed!"
        )
      );
      setstep(true);
    }
  };

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setIsDisabled(false);
    }
  }, [timer]);

  const handleResend = () => {
    sendOtp(email); // Call your resend OTP function here
    setTimer(60); // Reset timer
    setIsDisabled(true);
  };

  return (
    <div className="md:w-fit w-[90%]">
      <div className="max-h-screen min-h-96 overflow-y-auto border border-white rounded-xl px-10 pt-2 pb-6 bg-zinc-900 shadow-[0px_0px_20px_rgba(251,113,133,0.9)]">
        <button
          className="pl-[100%] text-white text-2xl hover:text-gray-300"
          onClick={() => dispatch(closeRegister())}
        >
          ✖
        </button>
        <h2 className="text-2xl text-center text-white font-semibold mb-8">
          SIGN UP
        </h2>
        {!registered && (
          <div>
            {!step ? (
              <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="md:flex justify-between items-center">
                    <label className="flex text-white" htmlFor="fullname">
                      <h6 className="text-red-500">*</h6>
                      FullName :{" "}
                    </label>
                    <input
                      {...register("fullname", {
                        required: "FullName is required",
                      })}
                      className="rounded-md m-2 px-1"
                      type="text"
                      placeholder="Name"
                    />
                  </div>
                  {errors.fullname && (
                    <p className="text-red-500 text-sm text-right">
                      {errors.fullname.message}
                    </p>
                  )}
                  <div className="md:flex justify-between items-center">
                    <label className="flex text-white" htmlFor="email">
                      <h6 className="text-red-500">*</h6>
                      Email :{" "}
                    </label>
                    <input
                      {...register("email", { required: "Email is required" })}
                      className="rounded-md m-2 px-1"
                      type="email"
                      placeholder="Email"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm text-right">
                      {errors.email.message}
                    </p>
                  )}
                  <div className="md:flex justify-between items-center">
                    <label className="flex text-white" htmlFor="username">
                      <h6 className="text-red-500">*</h6>
                      Username :{" "}
                    </label>
                    <input
                      {...register("username", {
                        required: "Username is required",
                      })}
                      className="rounded-md m-2 px-1"
                      type="text"
                      placeholder="Username"
                    />
                  </div>
                  {errors.username && (
                    <p className="text-red-500 text-sm text-right">
                      {errors.username.message}
                    </p>
                  )}
                  <div className="md:flex justify-between items-center">
                    <label className="flex text-white" htmlFor="Password">
                      <h6 className="text-red-500">*</h6>
                      Password :{" "}
                    </label>
                    <input
                      {...register("password", {
                        required: "Password is required",
                      })}
                      className="rounded-md m-2 px-1"
                      type="password"
                      placeholder="Password"
                      onChange={(e) => handlePassword(e.target.value, "p")}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm text-right">
                      {errors.password.message}
                    </p>
                  )}
                  <div className="md:flex justify-between items-center">
                    <label
                      className="flex text-white"
                      htmlFor="ConfirmPassword"
                    >
                      <h6 className="text-red-500">*</h6>
                      Confirm Password :{" "}
                    </label>
                    <input
                      {...register("confirmPassword", {
                        required: "Please confirm the password",
                      })}
                      className={`rounded-md m-2 px-1 ${
                        passwordStatus ? "" : "border-2 border-red-600"
                      }`}
                      type="password"
                      placeholder="Confirm Password"
                      onChange={(e) => handlePassword(e.target.value, "cp")}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm text-right">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                  {/* Avatar Upload */}
                  <div className="flex justify-between items-center mt-4">
                    <label className="flex cursor-pointer bg-stone-600 text-white px-2 py-1 rounded-md hover:bg-stone-700">
                      <h6 className="text-red-500">*</h6>
                      Upload Avatar
                      <input
                        // {...register("avatar")}
                        name="avatar"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, "avatar")}
                        className="absolute opacity-0 w-0 h-0"
                      />
                    </label>
                    {avatar && (
                      <div className="flex items-center">
                        <img
                          src={avatar}
                          alt="Avatar Preview"
                          className="w-12 h-12 object-cover rounded-md"
                        />
                        <MdDeleteForever
                          onClick={() => removeImage("avatar")}
                          color="Red"
                          size={32}
                        />
                      </div>
                    )}
                  </div>
                  {errors.avatar && (
                    <p className="text-red-500 text-sm text-right">
                      {errors.avatar.message}
                    </p>
                  )}

                  {/* Cover Image Upload */}
                  <div className="flex justify-between items-center mt-4">
                    <label className="cursor-pointer bg-stone-600 text-white px-2 py-1 rounded-md hover:bg-stone-700">
                      Upload Cover Image
                      <input
                        // {...register("coverImage")}
                        name="coverImage"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, "cover")}
                        className="absolute opacity-0 w-0 h-0"
                      />
                    </label>
                    {cover && (
                      <div className="flex items-center">
                        <img
                          src={cover}
                          alt="Cover Preview"
                          className="w-12 h-12 object-cover rounded-md"
                        />
                        <MdDeleteForever
                          onClick={() => removeImage("cover")}
                          color="Red"
                          size={32}
                        />
                      </div>
                    )}
                  </div>
                  {errors.coverImage && (
                    <p className="text-red-500 text-sm text-right">
                      {errors.coverImage.message}
                    </p>
                  )}
                  {error && (
                    <p className="text-red-500 text-sm text-center mt-2">
                      {error}
                    </p>
                  )}
                  {verified && (
                    <div className="flex justify-center items-center mt-4">
                      <IoCheckmarkDoneCircleOutline size={28} color="green" />
                      <h1 className="text-green-600">Verified</h1>
                    </div>
                  )}
                  <div className="flex justify-center mt-4">
                    <PrimaryButton type="submit">
                      {(loading && !verified) || loadingWheel ? (
                        <AiOutlineLoading className="animate-spin text-xl text-stone-800 mx-8 my-1" />
                      ) : (
                        "Register"
                      )}
                    </PrimaryButton>
                  </div>
                </form>
                <hr className="mt-4" />
                <p className="text-blue-600 text-sm text-center mt-2 pointer-cursor">
                  Already have an account?
                </p>
                <div className="flex justify-center mt-2">
                  <SecButton
                    onClick={() => {
                      dispatch(closeRegister());
                      dispatch(openLogin());
                    }}
                  >
                    Log in
                  </SecButton>
                </div>
              </div>
            ) : (
              <div className="m-10">
                <div className="mt-10">
                  <h1 className="text-white font-semibold text-lg text-center m-4">
                    Verify your email
                  </h1>
                  <div className="flex gap-3 justify-center mt-10">
                    <label
                      className="text-white text-lg font-semibold"
                      htmlFor="Otp"
                    >
                      OTP :{" "}
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      pattern="\d*"
                      onChange={(e) => setOtp(e.target.value)}
                      inputMode="numeric"
                      className="w-32 h-8 text-xl text-center rounded-md focus:border-stone-500 focus:ring focus:ring-stone-600 outline-none"
                      placeholder="Enter OTP"
                    />
                  </div>
                  {VerificationError && (
                    <p className="text-red-500 text-sm text-center mt-2">
                      {VerificationError}
                    </p>
                  )}
                  <div className="mt-4 flex justify-center mt-6">
                    <PrimaryButton onClick={() => verifyOtp()}>
                      Verify
                    </PrimaryButton>
                  </div>
                  <div className="flex justify-center mt-4">
                    <SecButton
                      className={`text-sm text-white rounded-md ${
                        isDisabled
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-stone-500 hover:bg-stone-600"
                      }`}
                      onClick={handleResend}
                      disabled={isDisabled}
                    >
                      {isDisabled ? `Resend OTP in ${timer}s` : "Resend OTP"}
                    </SecButton>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {registered && (
          <div className="m-10">
            <div className="flex justify-center items-center mt-4">
              <MdVerified size={72} color="green" />
            </div>
            <h1 className="text-center text-white mt-8 font-bold text-xl">
              Congratulations!
            </h1>
            <h1 className="text-center text-white mt-4 font-semibold text-xl">
              Registered Successfully
            </h1>
            <div className="flex justify-center items-center mt-4">
              <PiArrowFatLinesDownFill size={32} color="green" />
            </div>
            <div className="flex justify-center items-center mt-4">
              <PrimaryButton
                onClick={() => {
                  dispatch(closeRegister());
                  dispatch(openLogin());
                }}
                className="text-4xl"
              >
                Log in
              </PrimaryButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Register;
