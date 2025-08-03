import { Router } from "express";
import { 
    loginUser,
    logoutUser,
    registerUser,
    sendOtp,
    verifyOtp,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    getUserById,
    updateUserCoverImage,
    getUserChannel,
    getUserWatchHistory
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/changePassword").post(verifyJWT,changeCurrentPassword)
router.route("/getCurrentUser").get(verifyJWT,getCurrentUser)  // get request
router.route("/updateAccountDetails").post(verifyJWT,upload.none(),updateAccountDetails)

router.route("/:userId").get(getUserById)  // get request

router.route("/updateUserAvatar").patch(verifyJWT,upload.single("newAvatar"),updateUserAvatar)
router.route("/updateUserCoverImage").patch(verifyJWT,upload.single("newCover"),updateUserCoverImage)

router.route("/c/:username").get(verifyJWT,getUserChannel)
router.route("/history").get(verifyJWT,getUserWatchHistory)

router.route("/otp/send").post(sendOtp);
router.route("/otp/verify").post(verifyOtp);
export default router  