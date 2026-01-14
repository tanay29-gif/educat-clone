import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asycHandler.js";

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {

    // Registration logic here
    // validation password, email format, username uniqueness, etc.
    // refresh token generation and storage
    // upload of avatar image if provided on cloudinary
    const { username, password, fullName, email, role, } = req.body;
    console.log("body: ", req.body);

    if ([username, password, fullName, email, role].some(field => field.trim() === "")) {
        throw new ApiResponse(400, "All fields are required");
    }
    await User.findOne({ $or: [{ username }, { email }] })
        .then(existingUser => {
            if (existingUser) {
                throw new ApiResponse(409, "Username or email already in use");
            }
        });
    console.log("req.file: ", req.file);
    let avatar = { url: "http://res.cloudinary.com/ditlczffv/image/upload/v1768022277/mpkinhyh394ef8olhfgx.png" };

    if (req.file) {
        const avatarLocalPath = req.file?.path;
        // console.log("avatarLocalPath: ", avatarLocalPath);

        if (!avatarLocalPath) {
            throw new ApiError(400, "Avatar file is required")
        }
        const uploadedAvatar = await uploadOnCloudinary(avatarLocalPath);
        avatar = uploadedAvatar;
    }
    // console.log("avatar: ", avatar);

    const user = await User.create({
        username,
        password,
        fullName,
        email,
        role,
        avatar: avatar.url
    })
    console.log("Created user: ", user);


    const refreshToken = user.generateRefreshToken();
       user.refreshTokens = refreshToken;
    const accessToken = user.generateAccessToken();
       await user.save({ validateBeforeSave: false });


    const Createduser = await User.findById(user._id).select("-password -refreshToken")
    if (!Createduser) {
        throw new ApiError(500, "User creation failed");
    }


    const options = {

        httpOnly: true,
        secure: true,
    };
    return res
        .status(201)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(new ApiResponse(201, "User registered successfully", {
            user: Createduser, accessToken, refreshToken
        }));

})

const loginUser = asyncHandler(async (req, res) => {
    // Login logic here
    const { username, password } = req.body;

    if ([username, password].some(field => field.trim() === "")) {
        throw new ApiResponse(400, "All fields are required");
    }
    const user = await User.findOne({ username }).select("+password");
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

    const options = {
        httpOnly: true,
        secure: true,
    };
    return res
        .status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(new ApiResponse(200, "User logged in successfully", {
            user: user, accessToken, refreshToken
        }));

})

const logoutUser = asyncHandler(async (req, res) => {
    // Logout logic here
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    user.refreshTokens = null;
    await user.save({ validateBeforeSave: false });

    const options = {
        httpOnly: true,
        secure: true,
    };
    return res
        .status(200)
        .clearCookie("refreshToken", options)
        .clearCookie("accessToken", options)
        .json(new ApiResponse(200, "User logged out successfully"));
}
)

const changePassword = asyncHandler(async (req, res) => {
    // Change password logic here
    const { oldPassword, newPassword } = req.body;
    const userId = req.user._id;

    if ([oldPassword, newPassword].some(field => field.trim() === "")) {
        throw new ApiResponse(400, "All fields are required");
    }
    const user = await User.findById(userId).select("+password");
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const isOldPasswordValid = await user.comparePassword(oldPassword);
    if (!isOldPasswordValid) {
        throw new ApiError(401, "Old password is incorrect");
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
    return res
        .status(200)
        .json(new ApiResponse(200, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})

const updateUserProfile = asyncHandler(async(req, res) => {
    const userId = req.user._id;
    const { fullName, email } = req.body;

    const user = await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                fullName,
                email
            }
        },
        { new: true }
    ).select("-password");

    return res
        .status(200)
        .json(new ApiResponse(200, "Profile updated successfully", user));


});

const updateAvatar = asyncHandler(async(req, res) => {
    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing");
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading avatar");
    }
    const userId = req.user._id;
    const user = await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    ).select("-password");

    return res
        .status(200)
        .json(new ApiResponse(200, "Avatar updated successfully", user));
});

const deleteUser = asyncHandler(async(req, res) => {
    const userId = req.user._id;
    await User.findByIdAndDelete(userId);

    return res
        .status(200)
        .json(new ApiResponse(200, "User deleted successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

export {
    registerUser,
    loginUser,
    logoutUser,
    changePassword,
    getCurrentUser,
    updateUserProfile,
    updateAvatar,
    deleteUser,
    refreshAccessToken

};