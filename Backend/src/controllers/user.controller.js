import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { user } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import {v2} from "cloudinary";
import mongoose from "mongoose";
import {sendOTP} from "../utils/sentOtp.js";
import { console } from "inspector";
import { log } from "console";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const User = await user.findById(userId) 
        const accessToken = User.generateAccessToken()
        const refreshToken = User.generateRefreshToken()

        User.refreshToken = refreshToken
        await User.save({ validateBeforeSave : false })

        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating access and refresh token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    const { fullname, email, username, password } = req.body;


    // validation - non empty

    // if(fullname === ""){
    //     throw new ApiError(400,"fullname is required")
    // }
    // similarly, we have to check for all other fields also but,
    // Advance/experienced programmers do the same thing using the following code

    if (
        [fullname, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }


    // check if user already exists : username, email

    const existedUser = await user.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User already exists, Try with another email");
    }


    // check for images, check for avatar
    
    const avatarLocalPath = req.files?.avatar?.[0]?.path;


    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    // Checking because Avatar is required field
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required...");
    }
   


    // upload them to cloudinary, avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    
    // Rechecking because Avatar is required field
    if (!avatar) {
        throw new ApiError(402, "Avatar is required")
    }


    // create user object - create entry in db

    const newUser = await user.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    // remove password and refresh token field from response
    const createdUser = await user.findById(newUser._id).select(
        "-password -refreshToken"
    )

    // check for user creation

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }


    // return response

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

})

const sendOtp = asyncHandler(async(req, res) => {
    const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  const otpResponse = await sendOTP(email);

  if (!otpResponse.success) {
    return res.status(500).json({ success: false, message: "Failed to send OTP" });
  }

  res.status(200).json({ success: true, message: "OTP sent successfully", token: otpResponse.token });
})

const verifyOtp = asyncHandler(async(req, res) => {
    const { email, otp, token } = req.body;
    console.log(req.body)
    if (!email || !otp || !token) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.email === email && decoded.otp === otp) {
            return res.status(200).json({ success: true, message: "OTP verified successfully" });
        } else {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }
    } catch (error) {
        return res.status(400).json({ success: false, message: "OTP expired or invalid" });
    }
})

const loginUser = asyncHandler(async(req,res) => {
    let {email,username,password} = req.body;

    // access based on username (or email)
    
    if(!(username || email)){
        throw new ApiError(400,"username or email is required")
    }
    
    // find the user
    if(username)
        username = username.toLowerCase()
    if(email)
        email = email.toLowerCase()
    

    const newUser = await user.findOne({
        $or: [{username},{email}]
    })

    if(!newUser){
        throw new ApiError(404,"User does not exist")
    }
    
    
    // password check

    const isPasswordvalid = await newUser.isPasswordCorrect(password)

    if(!isPasswordvalid){
        throw new ApiError(401,"Invalid Password")
    }

    // generate access and refresh token
    
    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(newUser._id)
    
    
    // send cookie and reponse
    
    const loggedInUser = await user.findById(newUser._id).select("-password -refreshToken")
    
    const options = {
        // httpOnly: true,
        // secure: true
    }

    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,accessToken,refreshToken
            },
            "user logged in successfully"
        )
    )
})

const logoutUser = asyncHandler(async (req,res) => {
    await user.findByIdAndUpdate(
        req.User._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new : true
        }
    )

    const options = {
        // httpOnly: true,
        // secure: true
    }

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200,{},"user logged out !!")
    )
})

const refreshAccessToken = asyncHandler( async (req,res) => {
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    
        if(!incomingRefreshToken){
            throw new ApiError(401,"unauthorized request")
        }
    
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const User = await user.findById(decodedToken?._id)
    
        if(!User){
            throw new ApiError(401,"Invalid refresh token")
        }
    
        if(incomingRefreshToken !== User?.refreshToken){
            throw new ApiError(401,"Refresh token is expired or used")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken,newRefreshToken} = await generateAccessAndRefreshTokens(User._id)
    
        return res.status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("newRefreshToken",newRefreshToken,options)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401,error?.message || "invalid access token")
    }
})

const changeCurrentPassword = asyncHandler(async(req,res) => {
    const {currentPassword,newPassword} = req.body;

    if(!(currentPassword || newPassword)){
        throw new ApiError(400,"currentPassword or newPassword is required")
    }

    const currentUserId = req.User?._id;
    const currentUser = await user.findById(currentUserId);
    const isPasswordvalid = await currentUser.isPasswordCorrect(currentPassword)

    if(!isPasswordvalid){
        throw new ApiError(401,"Invalid Password")
    }

    currentUser.password = newPassword;
    await currentUser.save({ validateBeforeSave : false });

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Password changed successfully"
        )
    )
})

const getCurrentUser = asyncHandler(async(req,res) => {
    return res.status(200)
    .json(
        new ApiResponse(200,
        req.User,
        "User fetched successfully")
    )
})

const updateAccountDetails = asyncHandler(async(req,res) => {
    console.log(req.body);
    
    const {fullName,email} = req.body;

    if(!(fullName || email)){
        throw new ApiError(400,"At least one field is required to update!");
    }
    
    const currentUserId = req.User?._id;
    let currentUser;

    try {
        currentUser = await user.findById(currentUserId).select(
            "-password -refreshToken"
        )
    } catch (error) {
        throw new ApiError(500, "Current User not found")
    }

    if(fullName){
        currentUser.fullname = fullName;
    }
    if(email){
        currentUser.email = email;
    }

    await currentUser.save({validateBeforeSave: false});

    return res.status(200)
    .json(
        new ApiResponse(200, currentUser, "Details updated successfully!")
    )
})

const updateUserAvatar = asyncHandler(async(req,res) => {
    const newAvatar = req.file.path;

    if(!newAvatar){
        throw new ApiError(400,`Avatar file is missing!!! ${req.file}`)
    }

    const currentUserId = req.User?._id;
    let currentUser = await user.findById(currentUserId);

    const oldAvatarUrl = currentUser.avatar;
    let oldPublicId = null;

    // If there is an old cover image, extract the public_id from the URL
    if (oldAvatarUrl) {
        const urlParts = oldAvatarUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const publicId = fileName.split('.')[0]; // Extracting the public_id (before the file extension)
        oldPublicId = publicId;
    }

    // Delete the old image from Cloudinary (if exists)
    if (oldPublicId) {
        try {
            await v2.uploader.destroy(oldPublicId);
        } catch (error) {
            throw new ApiError(500, "Error while deleting old image");
        }
    }

    const avatar = await uploadOnCloudinary(newAvatar);

    if(!avatar.url){
        throw new ApiError(400,"Error while uploading Avatar!")
    }

    currentUser = await user.findByIdAndUpdate(
        req.User?._id,
        {
            $set: { avatar : avatar.url }
        },
        {new: true}
    ).select( "-password" )

    return res.status(200)
    .json(
        new ApiResponse(200,currentUser,"Avatar Updated Successfully!")
    )
})

const updateUserCoverImage = asyncHandler(async(req,res) => { 
    const newCover = req.file.path;

    if(!newCover){
        throw new ApiError(400,"coverImage file is missing!")
    }

    const currentUserId = req.User?._id;
    let currentUser = await user.findById(currentUserId);

    const oldCoverImageUrl = currentUser.coverImage;
    let oldPublicId = null;

    // If there is an old cover image, extract the public_id from the URL
    if (oldCoverImageUrl) {
        const urlParts = oldCoverImageUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const publicId = fileName.split('.')[0]; // Extracting the public_id (before the file extension)
        oldPublicId = publicId;
    }

    // Delete the old image from Cloudinary (if exists)
    if (oldPublicId) {
        try {
            await v2.uploader.destroy(oldPublicId);
        } catch (error) {
            throw new ApiError(500, "Error while deleting old image");
        }
    }


    const coverImage = await uploadOnCloudinary(newCover);

    if(!coverImage.url){
        throw new ApiError(400,"Error while uploading coverImage!")
    }

    currentUser = await user.findByIdAndUpdate(
        req.User?._id,
        {
            $set: { coverImage : coverImage.url }
        },
        {new: true}
    ).select( "-password" )

    return res.status(200)
    .json(
        new ApiResponse(200,currentUser,"CoverImage Updated Successfully!")
    )
})

const getUserById = asyncHandler(async(req,res) => {
    const { userId } = req.params;
    if(!userId?.trim()){
        throw new ApiError(400,"userId is missing")
    }

    const User = await user.findById(userId)
       .select("-password")

    if(!User){
        throw new ApiError(404,"User not found")
    }

    return res.status(200)
    .json(
        new ApiResponse(200,User,"User fetched successfully")
    )       
})

const getUserChannel = asyncHandler(async (req,res) => {
    const { username } = req.params;

    if(!username?.trim()){
        throw new ApiError(400,"username is missing")
    }

    const channel = await user.aggregate([
        {
            $match: { username: username?.toLowerCase() }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "channel",
                foreignField: "_id",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "sunscriber",
                foreignField: "_id",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                subscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.User?._id,"$subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullname: 1,
                username: 1,
                subscribersCount: 1,
                subscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1                
            }
        }
    ])

    if(!channel?.length){
        throw new ApiError(404,"Channel does not exist")
    }

    return res.status(200)
    .json(
        new ApiResponse(200, channel[0], "Channel fetched Successfully")
    )
})

const getUserWatchHistory = asyncHandler(async (req,res) => {
    const currentUser = await user.aggregate([
        {
            $match: { 
                _id: new mongoose.Types.ObjectId(req.User._id) 
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "user",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullname: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]

                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                }
            }
        }
    ])

    return res.status(200)
    .json(
        new ApiResponse(200, currentUser[0].watchHistory, "Watch history fetched successfully")
    )
})

export { 
    registerUser,
    sendOtp,
    verifyOtp,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    getUserById, 
    updateUserCoverImage,
    getUserChannel,
    getUserWatchHistory    
}                      