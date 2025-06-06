import jwt from 'jsonwebtoken';

export const generateToken = (userID,res)=> {
    const token = jwt.sign({ id: userID }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV  === "production",
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000, 
    });
    return token;
}