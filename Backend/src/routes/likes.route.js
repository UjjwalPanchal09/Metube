import {Router} from "express";
import {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos,
    getLikedComments,
    getLikedTweets,
    getLikeCounts
} from "../controllers/likes.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/video/:videoId").post(toggleVideoLike);
router.route("/tweet/:tweetId").post(toggleTweetLike);
router.route("/comment/:commentId").post(toggleCommentLike);
router.route("/liked-videos").get(getLikedVideos);
router.route("/liked-comments").get(getLikedComments);
router.route("/liked-tweets").get(getLikedTweets);
router.route("/likeCount/video/:videoId?").get(getLikeCounts);
router.route("/likeCount/comment/:commentId?").get(getLikeCounts);
router.route("/likeCount/tweet/:tweetId?").get(getLikeCounts);

export default router;

