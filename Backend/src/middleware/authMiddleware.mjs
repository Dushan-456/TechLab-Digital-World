import jwt from "jsonwebtoken";
import User from "../models/User.mjs";

export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : req.cookies?.jwt;

        if (!token) {
            return res.status(401).json({
                message: "Authentication Error",
                error: "Access Denied. Please log in.",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const authUser = await User.findById(decoded.userId).select("-passwordHash");

        if (!authUser) {
            return res.status(401).json({
                message: "Authentication Error",
                error: "Not authorized, user not found.",
            });
        }

        req.authUser = authUser;
        next();
    } catch (err) {
        console.error("JWT Authentication Error:", err);
        return res.status(401).json({
            message: "Authentication Error",
            error: "Not authorized, token invalid or expired.",
        });
    }
};

export const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.authUser) {
            return res.status(401).json({
                message: "Authorization Error",
                error: "User not authenticated.",
            });
        }

        if (!allowedRoles.includes(req.authUser.role)) {
            return res.status(403).json({
                message: "Authorization Error",
                error: `Access Denied. Required roles: ${allowedRoles.join(', ')}.`,
            });
        }
        next();
    };
};

export const attachUserIfAuthenticated = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : req.cookies?.jwt;

    if (!token) return next();

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const authUser = await User.findById(decoded.userId).select("-passwordHash");

        if (authUser) {
            req.authUser = authUser;
        }
        next(); 
    } catch (error) {
        res.clearCookie('jwt');
        next();
    }
};