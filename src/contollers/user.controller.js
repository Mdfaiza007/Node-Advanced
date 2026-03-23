//  step -1  => get user details from frontend
// step -2 => validation(email,username), not empty
// step -3 => check if user already exits(check email,username)
// step -4 =>  check for image and avatar
// step -5 => upload them to cloudinary, avatar
// step -6 => create user object - create enter in db
// step -7 => remove password and refresh token field from response
// step -8 => check for user creation
// step -9 => return response

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User, User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiRes } from "../utils/ApiRes.js";


// access and refresh token in method
const generateAccessAndRefereshTokens = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave : false})

        return {accessToken,refreshToken}

    }
    catch(error) {
        throw new ApiError(500,"Something went wrong while generating refresh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {

    // STEP 1: Get user details from frontend
    const { fullname, email, username, password } = req.body;

    console.log("fullname:", fullname);
    console.log("email:", email);
    console.log("username:", username);
    console.log("password:", password);

    // STEP 2: Validate fields
    if (
        [fullname, email, username, password].some(
            (field) => !field || field.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }

    // STEP 3: Check if user already exists
  const existedUser = await User.findOne({
   $or: [{ username: username.toLowerCase() }, { email }]
});

console.log("Existing User:", existedUser);

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }
    // console.log(req.files)
    // STEP 4: Get avatar and cover image from multer
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    } 

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    // STEP 5: Upload to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar upload failed");
    }

    let coverImage = "";
    if (coverImageLocalPath) {
        const uploadedCover = await uploadOnCloudinary(coverImageLocalPath);
        coverImage = uploadedCover?.url || "";
    }

    // STEP 6: Create user in DB
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage,
        email : email.toLowerCase(),
        password,
        username: username.toLowerCase()
    });

    // STEP 7: Remove sensitive fields
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    // STEP 8: Check if user created
    if (!createdUser) {
        throw new ApiError(
            500,
            "Something went wrong while registering the user"
        );
    }

    // STEP 9: Send response
    return res.status(201).json(
        new ApiRes(201, createdUser, "User registered successfully")
    );

});

const loginUser = asyncHandler(async(req,res) => {
    // get body -> data(frontend se data)
    // check username/email exit
    // find the user
    // check password
    // access and refresh token generate and send user
    // send cookies
    const {email,username,password} = req.body

    if(!username || !email) {
        throw new ApiError(400,"username or password is required")
    }

    const user = await User.findOne({
        $or : [{username,email}]
    })

    if(!user) {
        throw new ApiError(404,"User does not exit")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid) {
        throw new ApiError(401,"Password is not valid")
    }

    const {accessToken,refreshToken} = await generateAccessAndRefereshTokens(user._id)

    // send cookies
    const loggedUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken,options)
    .cookie("refreshToken", refreshToken,options)
    .json(
        new ApiRes(
            200,
            {
                user: loggedUser,accessToken,refreshToken
            },
            "User logged in Successfully"
        )
    )

})

const logoutUser = asyncHandler(async(req,res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set : {
                refreshToken : undefined
            }
        },
        {
            new : true
        }
    )
    const options = {
        httpOnly : true,
        secure : true
    }
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiRes(200,{},"User logged Out"))
})

export {
     registerUser,
    loginUser,
    logoutUser
}