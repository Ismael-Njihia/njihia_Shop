import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken.js";

//Auth user & get token
//route Post/api/users/login
//access public
const authUser = asyncHandler(async(req,res)=>{
    const {email,password} = req.body;
    const user = await User.findOne({email});

    if(user && (await user.matchPassword(password))){

       generateToken(res, user._id);
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
    const { name, email, password} = req.body;
    const userExists = await User.findOne({email});
    if(userExists){
        res.status(400)
        throw new Error("User already exists")
    }
    const user = await User.create({
        name,
        email,
        password
    })
    if(user){

        generateToken(res, user._id);

        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin,
        })
    }else{
        res.status(400)
        throw new Error("Invalid user data")
    }
});

//Logout user/Clear cookie
//route Post/api/users/logout
//access private
const logoutUser = asyncHandler(async(req,res)=>{
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({message: 'logout success'});
});

//get user profile
//route Get/api/users/Profle
//access private
const getUserProfile = asyncHandler(async(req,res)=>{
   const user  = await User.findById(req.user._id);

   if(user){
       res.status(200).json({
           _id:user._id,
           name:user.name,
           email:user.email,
           isAdmin:user.isAdmin,
       })
    }else{
        res.status(404)
        throw new Error("User not found")
    }
});

//Update User profile
//route PuT/api/users/Profle
//access private
const updateUserProfile = asyncHandler(async(req,res)=>{
    const user  = await User.findById(req.user._id);
    if(user ){
       user.name = req.body.name || user.name; 
       user.email = req.body.email || user.email;

         if(req.body.password){
            user.password = req.body.password;
         }

        const updatedUser = await user.save();
    

    res.status(200).json({
        _id:updatedUser._id,
        name:updatedUser.name,
        email:updatedUser.email,
        isAdmin:updatedUser.isAdmin,

    })
    }else{
        res.status(404)
        throw new Error("User not found")
    }
});

//all users Profile
//route Get/api/users
//access private/admin
const  getUsers= asyncHandler(async(req,res)=>{
    const users = await User.find({});
    res.status(200).json(users)
});

//Delete users
//route Delete/api/users/:id
//access private/admin
const  deleteUser = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.params.id);
    if(user){
        if(user.isAdmin){
            res.status(400)
            throw new Error("Can not delete admin user")
        }else{
            await User.deleteOne({_id: user._id})
            res.status(200).json({message:"User deleted successfully"})
        }
    }else{
        res.status(404)
        throw new Error("User not found")
    }
});

//Get User by Id
//route Get/api/user/:id
//access private/admin
const  getUserById= asyncHandler(async(req,res)=>{
    const user = await User.findById(req.params.id).select('-password');
    if(user){
        res.status(200).json(user)
    }else{
        res.status(404)
        throw new Error("User not found")
    }
});

//Update user Profile
//route put/api/users/:id
//access private/admin
const  updateUser = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.params.id);
    if(user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = Boolean(req.body.isAdmin);

        const updatedUser = await user.save();
        res.status(200).json({
            _id:updatedUser._id,
            name:updatedUser.name,
            email:updatedUser.email,
            isAdmin:updatedUser.isAdmin,
        })
    }
        else{res.status(404)
        throw new Error("User not found")}
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