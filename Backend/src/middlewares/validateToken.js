// This is a middleware and it will run on every private route in order to authorize the request
import jwt from "jsonwebtoken";
import asyncHandler from "../utilities/asyncHandler.js";

const validateToken = asyncHandler(async(req, res, next) => {
    const cookies = req.cookies;
    if(cookies && cookies.accessToken) {
        const token = cookies.accessToken;

        if(!token) {
            res.status(401);
            throw new Error("Token is missing after bearer keyword");
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if(err){
                res.status(401);
                throw new Error("Invalid token or expired token");
            }
            req.user = decoded.user;
            next();
        });
    }
    else {
        res.status(403);
        throw new Error("User is not authorised or token is missing.");
    }
})

export default validateToken;