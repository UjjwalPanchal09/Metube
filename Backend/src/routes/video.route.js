import {Router} from "express";
import { getAllVideos,
    getAllVideosOfUser,
    getVideoById,
    publishVideo,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    incrementViews
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/publish").post(
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1,
        },
    ]),
    publishVideo
)

router.route("/getAllVideos").get(getAllVideos);
router.route("/getAllVideosOfUser/:userId").get(getAllVideosOfUser);
router.route("/:videoId").get(getVideoById);
router.route("/update/:videoId").patch(upload.single("thumbnail"),updateVideo);
router.route("/delete/:videoId").delete(deleteVideo);
router.route("/toggle/publish/:videoId").patch(togglePublishStatus);
router.route("/views/:videoId").post(incrementViews);

export default router


