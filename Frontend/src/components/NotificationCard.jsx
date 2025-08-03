import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { closeNotificationModal } from "../redux/slices/modalSlice";

function NotificationCard({ notification }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sender, message,link, createdAt } = notification;
  const [senderData, setSenderData] = useState({ name: "", avatar: "" });
  const [publishedAt, setPublishedAt] = useState();

  useEffect(() => {          
    const getUser = async () => {
      try {        
        const response = await api.get(`/users/${sender}`, {});
        setSenderData(response.data.data);
        // console.log(response.data.data);
        
      } catch (error) {
        console.log(error);
      }
    };
    if (sender) {
        getUser()
        setPublishedAt(timeAgo(notification.createdAt));
    };
  }, [sender]);

  const timeAgo = (publishedDate) => {
    const now = new Date();
    const published = new Date(publishedDate);
    const diffInSeconds = Math.floor((now - published) / 1000);
  
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  
    const divisions = [
      { amount: 60, name: "seconds" },
      { amount: 60, name: "minutes" },
      { amount: 24, name: "hours" },
      { amount: 7, name: "days" },
      { amount: 4.34524, name: "weeks" },
      { amount: 12, name: "months" },
      { amount: Number.POSITIVE_INFINITY, name: "years" },
    ];
  
    let duration = diffInSeconds;
    for (let i = 0; i < divisions.length; i++) {
      if (duration < divisions[i].amount) {
        return rtf.format(-Math.floor(duration), divisions[i].name);
      }
      duration = duration / divisions[i].amount;
    }
    return "";
  }

  return (
    <div className="transition-colors rounded-md">
      <div onClick={() => {navigate(link); dispatch(closeNotificationModal())}} className="hover:bg-zinc-800 flex items-start gap-3 p-2 cursor-pointer rounded-md"> 
        <img
          src={senderData.avatar || "/default-avatar.png"}
          alt={senderData.fullname || "User"}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="flex flex-col text-sm text-white">
          <p>
            <strong className="text-white line-clamp-2">
              {senderData.fullname || "Someone"}
            </strong>{" "}
            {message}
          </p>
          <span className="text-xs text-gray-400">{publishedAt}</span>
        </div>
      </div>
      <hr className="border-gray-700 my-1" />
    </div>
  );
}

export default NotificationCard;
