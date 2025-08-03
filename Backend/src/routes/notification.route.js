import express from 'express';
import {
  getUserNotifications,
  markAllAsRead,
  getUnreadCount,
  createNotification
} from '../controllers/notification.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Get all notifications for the logged-in user
router.get('/', verifyJWT, getUserNotifications);

// Mark all notifications as read
router.put('/read', verifyJWT, markAllAsRead);

// Get count of unread notifications
router.get('/unread-count', verifyJWT, getUnreadCount);

// Create a new notification
router.post('/createNotification', verifyJWT, createNotification);

export default router;
