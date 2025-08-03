import React, { useEffect, useState } from 'react'
import SecButton from '../utils/SecButton'
import api from '../utils/api';
import { MdPersonRemove } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

function ChannelCard({channel,toggleSubscription}) {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
   const [subscriberCount, setSubscriberCount] = useState(0);

  useEffect(() => {
    getChannel();
    getSubscriberCount();
  },[channel])

  const getChannel = async () => {    
    try {
      const response = await api.get(`/users/${channel}`, {});
      setUser(response.data.data);      
    } catch (error) {
      console.log(error);
    }
  };

  const getSubscriberCount = async() => {
    try {
      const response = await api.get(`/subscription/subscriberCount/${channel}`,{
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      // console.log(response.data.data);
      setSubscriberCount(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
        <div className='flex items-center justify-between'>
        <div onClick={() => navigate(`/Profile/${channel}`)} className='flex gap-3 items-center cursor-pointer'>
            <img className="w-12 h-12 rounded-full" src={user.avatar} />
            <div>
                <h1 className='text-lg font-semibold text-white'>{user.fullname}</h1>
                <h2 className="text-sm text-gray-400">{subscriberCount} Subsribers</h2>
            </div>
        </div>
        <SecButton onClick={() => toggleSubscription(channel)} className='flex gap-2 items-center'> Unsubscribe <MdPersonRemove color='white' size={24}/></SecButton>
        </div>
        <hr className='mt-4 border-gray-600'/>
    </div>
  )
}

export default ChannelCard