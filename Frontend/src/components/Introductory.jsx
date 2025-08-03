import React from "react";
import { VscCircleFilled } from "react-icons/vsc";
import Reel from "../assets/Reel.jpg";
import { motion } from "framer-motion";
import PrimaryButton from "../utils/PrimaryButton";
import SecButton from "../utils/SecButton";
import { useDispatch, useSelector } from "react-redux";
import { openLogin,openRegister } from "../redux/slices/modalSlice";

function Introductory() {
    const images = [Reel, Reel, Reel, Reel, Reel];
    const dispatch = useDispatch()
    const {isLoginOpen} = useSelector((state) => state.modal)

  return (
    <div className="mt-12">
      <h1 className="text-white font-bold text-center text-5xl lg:text-8xl md:text-7xl">
        Welcome to Metube
      </h1>
      <h1 className="text-white font-bold text-center text-xl lg:text-4xl md:text-3xl mt-6">
        Your ultimate video-sharing destination
      </h1>
      <h2 className="text-white font-semibold flex justify-center items-center gap-2 mt-4 text-lg md:text-2xl">
        Watch <VscCircleFilled style={{ fontSize: "20px", color: "white" }} />{" "}
        Upload <VscCircleFilled style={{ fontSize: "20px", color: "white" }} />{" "}
        Share
      </h2>
      <div className="flex justify-center gap-5 mt-10">
        <PrimaryButton onClick={()=> dispatch(openLogin())} className="bg-rose-400 text-xl md:text-3xl px-4">Login</PrimaryButton>
        <SecButton onClick={() => dispatch(openRegister())} className="bg-stone-400 text-xl md:text-3xl ">Signup</SecButton>
      </div>

      {/* Animation
      <div className="overflow-hidden w-full mt-16">
        <motion.div
          className="flex"
          animate={{ x: ["100%", "-100%"] }} // Moves from right to left
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }} // Infinite loop
        >
          {images.map((image, index) => (
            <img
              key={index}
              className="h-28 w-auto"
              src={image}
              alt={`Reel ${index + 1}`}
            />
          ))}
        </motion.div>
      </div>       */
      }

      
    </div>
  );
}

export default Introductory;
