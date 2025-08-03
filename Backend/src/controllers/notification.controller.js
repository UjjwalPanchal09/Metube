import { Notification } from "../models/notification.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// @desc    Get user's notifications (latest first)
// @route   GET /api/notifications
// @access  Private
export const getUserNotifications = asyncHandler(async (req, res) => {  
  const notifications = await Notification.find({ recipient: req.User._id })
    .sort({ createdAt: -1 })
    .limit(20);

  return res.status(200).json(
    new ApiResponse(200, notifications, "Notifications fetched successfully")
  );
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read
// @access  Private
export const markAllAsRead = asyncHandler(async (req, res) => {
  const result = await Notification.updateMany(
    { recipient: req.User._id, isRead: false },
    { $set: { isRead: true } }
  );

  if (!result.acknowledged) {
    throw new ApiError(500, "Failed to mark notifications as read");
  }

  return res.status(200).json(
    new ApiResponse(200, null, "All notifications marked as read")
  );
});

// @desc    Get count of unread notifications
// @route   GET /api/notifications/unread-count
// @access  Private
export const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Notification.countDocuments({
    recipient: req.User._id,
    isRead: false,
  });

  return res.status(200).json(
    new ApiResponse(200, count, "Unread notification count fetched")
  );
});

// @desc    Create a new notification
// @route   POST /api/notifications
// @access  Private or Server logic
export const createNotification = asyncHandler(async (req, res) => {
  const { recipientId, senderId, type, message, link } = req.body;

  const notification = await Notification.create({
    recipient: recipientId,
    sender: senderId,
    type,
    message,
    link,
  });

  if (!notification) {
    throw new ApiError(500, "Failed to create notification");
  }

  return res.status(201).json(
    new ApiResponse(201, notification, "Notification created successfully")
  );
});
