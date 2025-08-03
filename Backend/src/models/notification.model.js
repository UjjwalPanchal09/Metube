import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // 👈 user who triggered the action
    required: true,
  },
  type: { 
    type: String, 
    required: true 
  }, // e.g., 'like', 'comment', 'subscribe'
  message: { 
    type: String, 
    required: true 
  },
  link: { 
    type: String 
  }, // Optional: e.g., `/video/123`
  isRead: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

export const Notification = mongoose.model("Notification", notificationSchema);
