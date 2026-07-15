// In this file we are going to write task controllers
// Almost all methods are going to take time to complete their execution
// so we are going to apply async await that's why we'll make a utility called asyncHandler.
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as arctic from "arctic";
import User from "../models/userModel.js";
import asyncHandler from "../utilities/asyncHandler.js";
import generateUniqueUsername from "../utilities/generateUniqueUsername.js";

// *** throw new Error(message) *** this line will immediately reject the ongoing promise and the error will be forwarded to the our errorHandler middleware

// Preparing the redirect URIs for google
const googleRedirectURI = process.env.NODE_ENV === "development" 
? "http://localhost:5000/api/v1/auth/google/callback" 
: "https://orbi-ji1n.onrender.com/api/v1/auth/google/callback";

// Preparing the redirect URIs for github
const githubRedirectURI = process.env.NODE_ENV === "development" 
? "http://localhost:5000/api/v1/auth/github/callback" 
: "https://orbi-ji1n.onrender.com/api/v1/auth/github/callback";

// Initiating Google's Client for OAuth
const google = new arctic.Google(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    googleRedirectURI
);

// Initiating Github's Client for OAuth
const github = new arctic.GitHub(
    process.env.GITHUB_CLIENT_ID,
    process.env.GITHUB_CLIENT_SECRET, 
    githubRedirectURI
);

//@desc Register a user
//@route " POST /api/v1/auth/register"
//@access public
const registerUser = asyncHandler(async(req, res, next) => {
    const { username, email, password } = req.body;

    if(!username || !email || !password) {
        res.status(400);
        throw new Error("All feilds are required");
    }

    const existingUser = await User.findOne({username: username});

    if(existingUser) {
        res.status(409);
        throw new Error("User already exists, try loggin in.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        auth: "native",
        username: username,
        email: email,
        password: hashedPassword,
    });

    res.status(200);
    res.json({
        message: `User: ${username} created successfully.`,
        result: {
            username: user.username,
            email: user.email,
        }
    });
});

//@desc Login a user
//@route " POST /api/v1/auth/login"
//@access public
const loginUser = asyncHandler(async(req, res, next) => {
    const { email, password } = req.body;

    if(!email || !password) {
        res.status(400);
        throw new Error("All fields are required!");
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
        );
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
        );
        res.status(200);
        res.cookie("refreshToken", refreshToken,
            {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 7 * 24 * 60 * 60 * 1000
            }
        );
        res.cookie("accessToken", accessToken,
            {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 15 * 60 * 1000
            }
        );
        res.cookie("wsToken", wsToken,
            {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 15 * 60 * 1000
            }
        );
        res.cookie("userA_ID", user._id,
            {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 365 * 24 * 60 * 60 * 1000
            }
        );
        res.json({
            success: true,
            message: "Successfully logged in.",
            userData: {
                _id: user._id,
                username: user.username,
            }
        });
    }   
    else {
        res.status(401);
        throw new Error("Invalid email or password.");
    }
});

//@desc Authenticates a user with one click
//@route " GET /api/v1/auth/google"
//@access public
const googleAuthStart = asyncHandler(async(req, res, next) => {
    const codeVerifier = arctic.generateCodeVerifier();
    const state = arctic.generateState();

    res.cookie("state", state, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 10 * 60 * 1000,
    });

    res.cookie("code_verifier", codeVerifier, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 10 * 60 * 1000,
    });

    const url = google.createAuthorizationURL(
        state,
        codeVerifier,
        ["openid", "profile", "email"]
    );

    if(!url) throw new Error("Error getting an authorization URL.");

    res.redirect(url.href);    
})

// Initiates the OAuth flow for google
//@route " GET /api/v1/auth/google/callback"
//@access public
const googleAuthCallbackHandler = asyncHandler(async (req, res, next) => {
    const { code, state } = req.query;

    if (state !== req.cookies.state) {
        res.status(400);
        throw new Error("Invalid state parameter");
    }

    const codeVerifier = req.cookies.code_verifier;
    const tokens = await google.validateAuthorizationCode(code, codeVerifier);
    const idToken = tokens.idToken();
    const claims = arctic.decodeIdToken(idToken);

    const { sub: googleId, email, name, picture } = claims;

    let existingUser = await User.findOne({ googleId });
    if (!existingUser) existingUser = await User.findOne({ email });

    let user;
    if (existingUser) {
        if (!existingUser.googleId) {
            existingUser.googleId = googleId;
        
            if (!existingUser.auth) {
                existingUser.auth = "google";
            }
        
            await existingUser.save();
        }
        user = existingUser;
    } else {
        let attempts = 0;
        while (attempts < 5) {
        try {
            const username = await generateUniqueUsername();
            user = await User.create({
                auth: "google",
                avatar: picture,
                name,
                googleId,
                username,
                email,
            });
            break;
        } catch (err) {
            if (err.code === 11000) {
            attempts++;
            continue;
            }
            throw err;
        }
        }
    }

    // JWTs
    const accessToken = jwt.sign({ user: { _id: user._id, username: user.username } },
        process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ user: { _id: user._id, username: user.username } },
        process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
    const wsToken = jwt.sign({ user: { _id: user._id, username: user.username } },
        process.env.WS_TOKEN_SECRET, { expiresIn: "15m" });

    // Cookies
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "none", maxAge: 7*24*60*60*1000 });
    res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "none", maxAge: 15*60*1000 });
    res.cookie("wsToken", wsToken, { httpOnly: true, secure: true, sameSite: "none", maxAge: 15*60*1000 });
    res.cookie("userA_ID", user._id.toString(), { httpOnly: true, secure: true, sameSite: "none", maxAge: 365*24*60*60*1000 });

    res.redirect(process.env.NODE_ENV === "production" ? process.env.FRONTEND_HOST + "/home" : "http://localhost:5173/home");
});


//@desc Initiates OAuth flow for github
//@route " GET /api/v1/auth/github"
//@access public
const githubAuthStart = asyncHandler(async(req, res, next) => {
    const state = arctic.generateState();

    res.cookie("state", state, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 10 * 60 * 1000,
    });

    const url = github.createAuthorizationURL(
        state, 
        ["read:user", "user:email"]
    );

    res.redirect(url.href);
})

//@desc Authenticates a user with one click
//@route " GET /api/v1/auth/github/callback"
//@access public
const githubAuthCallbackHandler = asyncHandler(async (req, res) => {
    const { code, state } = req.query;

    if (!code) {
        res.status(400);
        throw new Error("Missing authorization code.");
    }

    if (state !== req.cookies.state) {
        res.status(400);
        throw new Error("Invalid state parameter.");
    }

    const tokens = await github.validateAuthorizationCode(code);

    const accessToken = tokens.accessToken();

    // Fetch user profile
    const userResponse = await fetch("https://api.github.com/user", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github+json",
        },
    });

    if (!userResponse.ok) {
        throw new Error("Failed to fetch GitHub user profile.");
    }

    const profile = await userResponse.json();

    // Fetch user's email addresses
    const emailResponse = await fetch("https://api.github.com/user/emails", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github+json",
        },
    });

    if (!emailResponse.ok) {
        throw new Error("Failed to fetch GitHub email.");
    }

    const emails = await emailResponse.json();

    const primaryEmail = emails.find(
        (email) => email.primary && email.verified
    )?.email;

    if (!primaryEmail) {
        res.status(400);
        throw new Error("No verified primary email found.");
    }

    const {
        id: githubId,
        name,
        avatar_url: avatar,
    } = profile;

    let existingUser = await User.findOne({ githubId });

    if (!existingUser) {
        existingUser = await User.findOne({ email: primaryEmail });
    }

    let user;

    if (existingUser) {
        if (!existingUser.githubId) {
            existingUser.githubId = githubId;
        }

        if (!existingUser.auth) {
            existingUser.auth = "github";
        }

        if (!existingUser.avatar) {
            existingUser.avatar = avatar;
        }

        if (!existingUser.name && name) {
            existingUser.name = name;
        }

        await existingUser.save();

        user = existingUser;
    } else {
        let attempts = 0;

        while (attempts < 5) {
            try {
                const username = await generateUniqueUsername();

                user = await User.create({
                    auth: "github",
                    githubId,
                    username,
                    email: primaryEmail,
                    name,
                    avatar,
                });

                break;
            } catch (err) {
                if (err.code === 11000) {
                    attempts++;
                    continue;
                }

                throw err;
            }
        }
    }

    // Generate JWTs
    const jwtPayload = {
        user: {
            _id: user._id,
            username: user.username,
        },
    };

    const accessJWT = jwt.sign(
        jwtPayload,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
    );

    const refreshJWT = jwt.sign(
        jwtPayload,
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );

    const wsJWT = jwt.sign(
        jwtPayload,
        process.env.WS_TOKEN_SECRET,
        { expiresIn: "15m" }
    );

    // Cookies
    res.cookie("refreshToken", refreshJWT, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accessToken", accessJWT, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 15 * 60 * 1000,
    });

    res.cookie("wsToken", wsJWT, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 15 * 60 * 1000,
    });

    res.cookie("userA_ID", user._id.toString(), {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 365 * 24 * 60 * 60 * 1000,
    });

    res.redirect(
        process.env.NODE_ENV === "production"
            ? `${process.env.FRONTEND_HOST}/home`
            : "http://localhost:5173/home"
    );
});

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
});

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
                        sameSite: "none",
                        maxAge: 15 * 60 * 1000
                    }
                );
                res.cookie("wsToken", newWsToken,
                    {
                        httpOnly: true,
                        secure: true,
                        sameSite: "none",
                        maxAge: 15 * 60 * 1000
                    }
                );
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
});

//@desc Logout a user
//@route " POST /api/v1/auth/logout"
//@access private
const logoutUser = asyncHandler(async(req, res, next) => {
    res.clearCookie("refreshToken", 
        {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        }
    );
    res.clearCookie("accessToken", 
        {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        }
    );
    res.clearCookie("wsToken", 
        {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        }
    );
    res.clearCookie("userA_ID", 
        {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        }
    );
    res.status(200);
    res.json(
        {
            success: true,
            message: "Logged out successfully"
        }
    );
});

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
});

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
                    sameSite: "none",
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
            );
    }
    else{
        res.status(401);
        throw new Error("Unauthorized.");
    }
});

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
});

export {
    registerUser,
    loginUser,
    googleAuthStart,
    googleAuthCallbackHandler,
    githubAuthStart,
    githubAuthCallbackHandler,
    getCurrentUser,
    refreshToken,
    logoutUser,
    updateUser,
    deleteUser,
    searchUser
};