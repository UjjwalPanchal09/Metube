import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const searchVideos = asyncHandler(async (req, res) => {
    const q = req.query.query;

    if (!q || q.trim() === "") {
        throw new ApiError(400, "Search query is required");
    }

    const searchRegex = new RegExp(q, "i"); // case-insensitive

    const videos = await Video.find({
        title: { $regex: searchRegex },
        ispublished: true,
    }).limit(5); // limit for dropdown

    return res.status(200).json(
        new ApiResponse(200, videos, "Search results fetched successfully")
    );
});

export { searchVideos };
