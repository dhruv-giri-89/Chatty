import jwt from 'jsonwebtoken'; 
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
    try{
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized, no token provided' });
    }
     try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
     }
     catch (error) {
        console.error('Error verifying token:', error.message);
        return res.status(401).json({ message: 'Unauthorized, invalid token' });
}}
catch (error) {
    console.error('Error in protectRoute middleware:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
} 
};