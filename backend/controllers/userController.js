import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

//Auth user & get token
//route Post/api/users/login
//access public
const authUser = asyncHandler(async(req,res)=>{
    const {email,password} = req.body;
    const user = await User.findOne({email});

    if(user && (await user.matchPassword(password))){

        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
            expiresIn: '30d' 
        })


        //set Jwt as HttpOnly cookie
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 30 // 30 days
        })
       res.json({
              _id:user._id,
                name:user.name,
                email:user.email,
                isAdmin:user.isAdmin,
       })
    }else{
        res.status(401)
        throw new Error("Invalid email or password")
    }
    
});

//Auth user & get token
//route Post/api/users
//access public
const registerUser = asyncHandler(async(req,res)=>{
    res.send("registerUser")
});

//Logout user/Clear cookie
//route Post/api/users/logout
//access private
const logoutUser = asyncHandler(async(req,res)=>{
    res.send("logoutUser")
});

//get user profile
//route Get/api/users/Profle
//access private
const getUserProfile = asyncHandler(async(req,res)=>{
    res.send("getUserProfile")
});

//Update User profile
//route PuT/api/users/Profle
//access private
const updateUserProfile = asyncHandler(async(req,res)=>{
    res.send("updateUserProfile")
});

//all users Profile
//route Get/api/users
//access private/admin
const  getUsers= asyncHandler(async(req,res)=>{
    res.send("getUsers ")
});

//Delete users
//route Delete/api/users/:id
//access private/admin
const  deleteUser = asyncHandler(async(req,res)=>{
    res.send("deleteUser")
});

//Get User by Id
//route Get/api/user/:id
//access private/admin
const  getUserById= asyncHandler(async(req,res)=>{
    res.send("getUserById ")
});

//Update user Profile
//route put/api/users/:id
//access private/admin
const  updateUser = asyncHandler(async(req,res)=>{
    res.send("Update users ")
});

export{
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUser,
    updateUserProfile,
    getUsers,
    getUserById,
    deleteUser
}