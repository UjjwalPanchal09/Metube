import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/likes.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const like = await Like.findOne({ likedBy: req.User._id, video: videoId });

    if (like) {
        try {
            await Like.findByIdAndDelete(like._id);
        } catch (error) {
            throw new ApiError(500, "Failed to delete like");
        }
    }

    if (!like) {
        try {
            await Like.create({ likedBy: req.User._id, video: videoId });
        } catch (error) {
            throw new ApiError(500, "Failed to create like");
        }
    }

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Like toggled successfully"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    const like = await Like.findOne({
        likedBy: req.User._id,
        comment: commentId,
    });

    if (like) {
        try {
            await Like.findByIdAndDelete(like._id);
        } catch (error) {
            throw new ApiError(500, "Failed to delete like");
        }
    }

    if (!like) {
        try {
            await Like.create({ likedBy: req.User._id, comment: commentId });
        } catch (error) {
            throw new ApiError(500, "Failed to create like");
        }
    }

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Like toggled successfully"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    const like = await Like.findOne({ likedBy: req.User._id, tweet: tweetId });

    if (like) {
        try {
            await Like.findByIdAndDelete(like._id);
        } catch (error) {
            throw new ApiError(500, "Failed to delete like");
        }
    }

    if (!like) {
        try {
            await Like.create({ likedBy: req.User._id, tweet: tweetId });
        } catch (error) {
            throw new ApiError(500, "Failed to create like");
        }
    }
    return res
        .status(200)
        .json(new ApiResponse(200, null, "Like toggled successfully"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
    const likedVideos = await Like.find({
        likedBy: req.User._id,
        video: { $ne: null },
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                likedVideos,
                "Liked videos fetched successfully"
            )
        );
});

const getLikedComments = asyncHandler(async (req, res) => {
    const likedComments = await Like.find({
        likedBy: req.User._id,
        comment: { $ne: null },
    })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                likedComments,
                "Liked comments fetched successfully"
            )
        );
});

const getLikedTweets = asyncHandler(async (req, res) => {
    const likedTweets = await Like.find({
        likedBy: req.User._id,
        tweet: { $ne: null },
    })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                likedTweets,
                "Liked tweets fetched successfully"
            )
        );
});

const getLikeCounts = asyncHandler(async (req, res) => {
    const { videoId, commentId, tweetId } = req.params;
    let likeCounts = 0;

    if (videoId && isValidObjectId(videoId)) {
        likeCounts = await Like.countDocuments({ video: videoId });
    } else if (commentId && isValidObjectId(commentId)) {
        likeCounts = await Like.countDocuments({ comment: commentId });
    } else if (tweetId && isValidObjectId(tweetId)) {
        likeCounts = await Like.countDocuments({ tweet: tweetId });
    } else {
        throw new ApiError(400, "Invalid ID provided");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, likeCounts, "Like counts fetched successfully")
        );
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos,
    getLikedComments,
    getLikedTweets,
    getLikeCounts,
};
