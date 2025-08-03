import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import NotificationCard from './NotificationCard';
import { closeNotificationModal } from '../redux/slices/modalSlice';
import api from '../utils/api';

function Notification() {
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndMarkNotifications = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch notifications
        const response = await api.get('/notifications/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        // console.log(response.data.data);        
        setNotifications(response.data.data);

        // Mark notifications as read
        await api.put('/notifications/read', null, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Optional: If you manage unread count in Redux, reset it here
        // dispatch(setUnreadCount(0));
      } catch (err) {
        console.error('Failed to fetch or update notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndMarkNotifications();
  }, [dispatch]);

  return (
    <div className='flex flex-col justify-between border border-rose-400 w-[85%] sm:w-[50%] md:w-[40%] lg:w-[30%] h-[60%] mt-[16%] sm:mt-[8%] mr-[8%] md:mt-[7%] lg:mt-[5%] flex flex-col bg-zinc-900 rounded-lg overflow-hidden'>
      <div className='flex flex-col m-2 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700'>
        {loading ? (
          <p className='text-gray-400 text-center'>Loading...</p>
        ) : notifications.length === 0 ? (
          <p className='text-gray-400 text-center'>No notifications</p>
        ) : (
          notifications.map((notif) => (
            <NotificationCard key={notif._id} notification={notif} />
          ))
        )}
      </div>

      <button
        onClick={() => dispatch(closeNotificationModal())}
        className='bg-zinc-700 text-white font-semibold text-xl'
      >
        HIDE
      </button>
    </div>
  );
}

export default Notification;
