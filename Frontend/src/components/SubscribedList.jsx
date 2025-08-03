import React from "react";
import { useLocation } from "react-router-dom";
import ChannelCard from "./ChannelCard";
import { useSelector } from "react-redux";

function SubscribedList() {
  const location = useLocation();
  const { toggleSubscription } = useSelector((state) => state.modal);
  const subscribedChannels = location.state?.subscribedChannels || [];

  return (
    <div className="mt-4 mx-2">
      {subscribedChannels.map((channel) => (
        <ChannelCard
          key={channel}
          channel={channel}
          toggleSubscription={toggleSubscription}
        />
      ))}
    </div>
  );
}

export default SubscribedList;
