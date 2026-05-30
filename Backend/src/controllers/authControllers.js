// In this file we are going to write task controllers
// Almost all methods are going to take time to complete their execution
// so we are going to apply async await that's why we'll make a utility called asyncHandler.
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "../utilities/asyncHandler.js"

// *** throw new Error(message) *** this line will immediately reject the ongoing promise and the error will be forwarded to the our errorHandler middleware

//@desc Register a user
//@route " POST /api/v1/auth/register"
//@access public
const registerUser = asyncHandler(async(req, res, next) => {
    const {username, email, password, publicKey} = req.body

    if(!username || !email || !password) {
        res.status(400);
        throw new Error("Bad Request: All feilds are required");
    }

    if(!publicKey) {
        throw new Error("Something went wrong");
    }

    const existingUser = await User.findOne({username: username});

    if(existingUser) {
        res.status(409);
        throw new Error("Bad Request: User already exists, try loggin in");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        username: username,
        email: email,
        password: hashedPassword,
        publicKey: publicKey,
    })

    res.status(200);
    res.json({
        message: `User: ${username} created successfully.`,
        result: {
            username: user.username,
            email: user.email,
        }
    });
})

//@desc Login a user
//@route " POST /api/v1/auth/login"
//@access public
const loginUser = asyncHandler(async(req, res, next) => {
    const { email, password } = req.body;

    if(!email || !password) {
        res.status(400);
        throw new Error("Bad Request: All fields are required!");
    }

    const user = await User.findOne({email: email});
    if(user && (await bcrypt.compare(password, user.password))) {
        // if the input passes above checks then generate an access token for the user
        const accessToken = jwt.sign(
            {
                user: {
                    _id: user._id,
                    username: user.username,
                },
            },
        
            process.env.ACCESS_TOKEN_SECRET,
        
            {
                expiresIn: "15m"
            }
        );
        const refreshToken = jwt.sign(
            {
                user: {
                    _id: user._id,
                    username: user.username,
                },
            },
        
            process.env.REFRESH_TOKEN_SECRET,
        
            {
                expiresIn: "7d"
            }
        )
        const wsToken = jwt.sign(
            {
                user: {
                    _id: user._id,
                    username: user.username,
                },
            },
        
            process.env.WS_TOKEN_SECRET,
        
            {
                expiresIn: "15m"
            }
        )
        res.status(200);
        res.cookie("refreshToken", refreshToken,
            {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            }
        )
        res.cookie("accessToken", accessToken,
            {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 15 * 60 * 1000
            }
        )
        res.cookie("wsToken", wsToken,
            {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 15 * 60 * 1000
            }
        )
        res.cookie("userA_ID", user._id,
            {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 365 * 24 * 60 * 60 * 1000
            }
        )
        res.json({
            success: true,
            message: "Successfully logged in.",
            userData: {
                _id: user._id,
                username: user.username,
            }
        })
    }   
    else {
        res.status(401);
        throw new Error("Invalid email or password.");
    }
})

//@desc verify if the user is authenticated
//@route " POST /api/v1/auth/curruser"
//@access public
const getCurrentUser = asyncHandler(async(req, res, next) => {
    const refToken = req.cookies.refreshToken;

    if(refToken){
        jwt.verify(refToken, process.env.REFRESH_TOKEN_SECRET, 
            (err, decoded) => {
                if(err) {
                    res.status(401);
                    throw new Error("Token missing, invalid or expired.");
                }

                const user = decoded.user;
                res.status(200);
                res.json({
                    success: true,
                    message: "User is verified!",
                    userData: user,
                });
            }
        );
    }
    else{
        res.status(401);
        throw new Error("Token missing, invalid or expired.");
    }
})

//@desc provides a new access token based on refresh token
//@route " POST /api/v1/auth/refresh"
//@access public
const refreshToken = asyncHandler(async(req, res, next) => {
    const refToken = req.cookies.refreshToken;
    
    if(refToken) {
        jwt.verify(refToken, process.env.REFRESH_TOKEN_SECRET, 
            (err, decoded) => {
                if(err) {
                    res.status(401);
                    throw new Error("Token missing, invalid or expired.");
                }

                const user = decoded.user;
                const newAccessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
                const newWsToken = jwt.sign({ user }, process.env.WS_TOKEN_SECRET, { expiresIn: "15m" });
                res.status(200);
                res.cookie("accessToken", newAccessToken,
                    {
                        httpOnly: true,
                        secure: true,
                        sameSite: "strict",
                        maxAge: 15 * 60 * 1000
                    }
                )
                res.cookie("wsToken", newWsToken,
                    {
                        httpOnly: true,
                        secure: true,
                        sameSite: "strict",
                        maxAge: 15 * 60 * 1000
                    }
                )
                res.json({
                    success: true,
                    message: "Access token generated successfully.",
                });
            }
        );
    }
    else{
        res.status(401);
        throw new Error("Token missing, invalid or expired.");
    }
})

//@desc Logout a user
//@route " POST /api/v1/auth/logout"
//@access private
const logoutUser = asyncHandler(async(req, res, next) => {
    res.clearCookie("refreshToken", 
        {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        }
    );
    res.clearCookie("accessToken", 
        {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        }
    );
    res.clearCookie("wsToken", 
        {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        }
    );
    res.clearCookie("userA_ID", 
        {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        }
    );
    res.status(200)
    .json(
        {
            success: true,
            message: "Logged out successfully"
        }
    )
})

//@desc Update a user
//@route " POST /api/v1/auth/update"
//@access private
const updateUser = asyncHandler(async(req, res, next) => {
    const { email } = req.body;
    const { password } = req.body;
    const { _id } = req.user;
    
    // first hash the incoming password then store it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Build update object dynamically
    const updateFields = {};
    if(email) updateFields.email = email;
    if(password) updateFields.password = hashedPassword;

    const updatedUser = await User.findByIdAndUpdate(_id, { $set: updateFields }, { new: true });
    
    res.status(200);
    res.json(
        {
            success: true,
            message: "User account updated successfully.",
            result: {
                username: updateUser.username,
                email: updateUser.email
            },
        }
    );
})

//@desc Delete a user
//@route " POST /api/v1/auth/delete"
//@access private
const deleteUser = asyncHandler(async(req, res, next) => {    
    const { email, password } = req.body;

    if(!email || !password) {
        res.status(400);
        throw new Error("Unauthorized");
    }

    if(req.cookies.refreshToken) {
        const decoded = jwt.verify(req.cookies.refreshToken, process.env.REFRESH_TOKEN_SECRET);
        if(req.user._id !== decoded?.user._id) {
            res.status(401);
            throw new Error("Unauthorized");
        }

        const targetUser = await User.findById(req.user._id);
        if(!targetUser || !(await bcrypt.compare(password, targetUser.password))) {
            res.status(401);
            throw new Error("Unauthorized");
        }


        const deletedUser = await User.findByIdAndDelete(targetUser._id);
            res.status(200);
            res.clearCookie("refreshToken", 
                {
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict",
                }
            );
            res.json(
                {
                    success: true,
                    message: "User removed successfully.",
                    result: {
                        username: deletedUser.username,
                        email: deletedUser.email,
                    }
                }
            )
    }
    else{
        res.status(401);
        throw new Error("Unauthorized.");
    }
})

//@desc Search a user in the DB
//@route " POST /api/v1/auth/search?query=username"
//@access private
const searchUser = asyncHandler(async(req, res, next) => {
    const { query } = req.query;

    if(!query || query.trim() === '') {
        res.status(400);
        throw new Error("Bad Request: Search query is required");
    }

    const results = await User.find(
        {username: {$regex: `^${query}`, $options: 'i'}}
    ).select('_id avatar username').limit(10);

    if(!results) {
        res.status(400);
        throw new Error("Something went wrong while querying");
    }

    res.status(200);
    res.json({
        success: true,
        results: results
    });
})

export {
    registerUser,
    loginUser,
    getCurrentUser,
    refreshToken,
    logoutUser,
    updateUser,
    deleteUser,
    searchUser
}