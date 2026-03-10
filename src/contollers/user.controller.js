import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { use } from "react";
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiRes } from "../utils/ApiRes.js";

const registerUser = asyncHandler(async(req,res) => {
    //  step -1  => get user details from frontend
    // step -2 => validation(email,username), not empty
    // step -3 => check if user already exits(check email,username)
    // step -4 =>  check for image and avatar
    // step -5 => upload them to cloudinary, avatar
    // step -6 => create user object - create enter in db
    // step -7 => remove password and refresh token field from response
    // step -8 => check for user creation
    // step -9 => return response

    const {fullname, email,username,password} = req.body
    console.log("email", email);

    // if(fullname === "") {
    //     throw new ApiError(400,"fullname is required")
    // }

    if (
        [fullname,email,username,password].some((field) => field?.trim()==="")
    ) {
        throw new ApiError(400, "All fields are required")
    }
    // step 02
    const exitedUser =  User.findOne({
        $or : [ {username}, {email}]
    })
    // step 03
    if(exitedUser) {
        throw new ApiError(409,"User with email or username already exits")
    }
    // step 04
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }
    // step 05
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar) {
        throw new ApiError(400,"Avatar file is required")
    }

    // Step 06
    const user = await User.create({
        fullname,
        avatar : avatar.url,
        coverImage : coverImage?.url || "",
        email,
        password,
        username : username.toLowerCase()
    })

    // Step 07
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // step 08
    if(!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }


    // step 09
    return res.status(201).json(
        new ApiRes(200,createdUser,"User Registered Successfully")
    )
})


export {registerUser,}