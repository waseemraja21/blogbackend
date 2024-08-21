const User = require('../models/userModel');
const HttpError = require("../models/errorModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const {v4: uuid} = require('uuid');
const { runInNewContext } = require('vm');
const { error, log } = require('console');


//===============Register a new user 
//post request + api/users/register
//unprotected
const registerUser = async (req, res, next)=>{
    try{
        const {name, email, password, password2} = req.body;
        if(!name || !email || !password){
            return next(new HttpError('Fill in all fields.', 422));
        }

        const newEmail = email.toLowerCase();

        const emailExists = await User.findOne({email: newEmail});
        if(emailExists){
            return next(new HttpError("Email already exists"));
        }

        if((password.trim()).length < 6){
            return next(new HttpError("Password should be at least six characters", 422));
        }
        if(password != password2){
            return next(new HttpError("Passwords don't match.", 422));
        }

        //all details are correct so we hash password before saving it INTO DATABASE

        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(password, salt);
        const newUser = await User.create({name, email: newEmail, password: hashedPass});
        res.status(201).json("New user : " +newUser.email+' registered successfully');


    }catch(error){
        return next(new HttpError("User registration failed.", 422));
    }
}























//===============Login a new user 
//post request + api/users/login
//unprotected
const loginUser = async (req, res, next)=>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return next(new HttpError("Fill in all credentials."), 422);
        }
        const newEmail = email.toLowerCase();
        const user = await User.findOne({email: newEmail});
        if(!user){
            return next(new HttpError("Invalid Email.", 422));
        }
        console.log(req.body);
        
        const comparePass = await bcrypt.compare(password, user.password);
        if(!comparePass){
            return next(new HttpError('Invalid Password.', 422));
        }

        const {_id, name} = user; // we can also use email , then it should be unique
        const token = jwt.sign({userId: _id, name}, process.env.JWT_SECRET, {expiresIn: "1d"})
   
        res.status(200).json({token, userId: _id, name, email});

    }catch(error){
        return next(new HttpError('Login failed. Please check credentials.', 422));
    
    }
}




















//=============== User Profile 
//GEt request + api/users/:id
//protected
const getUser = async (req, res, next)=>{
    try{
        const {id} = req.params;        
        const user = await User.findById(id).select('-password');
        if(!user){
            return next(new HttpError("User not Found!.", 404));
        }
        res.status(200).json(user);
    }catch(error){
        return next(new HttpError(error));
    }
}























//===============Change User avatar 
//post request + api/users/change-avatar
//protected
const changeAvatar = async (req, res, next)=>{
    try{
        
        if(!req.files.avatar){
            return next(new HttpError('Please choose an image.', 422));
        }
        console.log("recieved file successfully");
        
        //find user from database
       // console.log(req.user);
        const user = await User.findById(req.user.userId).select('-password');
        //console.log(user);
        if(!user){
            return next(new HttpError("User not found.", 422));
        }
        //delete old avatar if exists
        if(user.avatar){
            fs.unlink(path.join(__dirname, '..', 'uploads', user.avatar),(err)=>{
                if(err){
                    return next(new HttpError(err));
                }
            })
        }
        const {avatar} = req.files;
        //check file size
        if(avatar.size > 500000){
            return next(new HttpError('Profile picture too big. Should be less than 500kb.', 422));
        }
        // renaming it so that no duplicate names
        let fileName;
        fileName = avatar.name;
        let splittedFileName = fileName.split('.');
        let newFilename = splittedFileName[0]+uuid()+'.'+splittedFileName[splittedFileName.length-1];
        avatar.mv(path.join(__dirname, '..', 'uploads', newFilename), async (err)=>{
            if(err){
                return next(new HttpError(err));
            }

            const updatedAvatar = await User.findByIdAndUpdate(req.user.userId, {avatar: newFilename}, {new: true}).select('-password');
            if(!updatedAvatar){
                return next(new HttpError("Avatar couldn't be changed.", 422));
            }
            res.status(200).json(updatedAvatar);
        })


    }catch(error){
        console.error(error);
        return next(new HttpError(error));
    }
}

























//===============Edit User Details 
//patch request + api/users/edit-user
//protected
const editUser = async (req, res, next)=>{
        try{
            const {currentPassword, newPassword, confirmNewPassword} = req.body;
            console.log(req.body);
            if( !currentPassword || !newPassword || !confirmNewPassword){
                return next(new HttpError("Fill in all fields.", 403));
            }
            //get user from database
            console.log(req.user);
            const user = await User.findById(req.user.userId);
            if(!user){
                return next(new HttpError("User not found.", 403));
            }
            // make sure new email doesn't already exist
            // const emailExists = await User.findOne({email});
            // if(emailExists && (emailExists._userId != req.user.userId)){
            //     return next(new HttpError("Email already exists.", 422));
            // }
            //compare pass password to database password
            const validateUserPassword = await bcrypt.compare(currentPassword, user.password);
            if(!validateUserPassword){
                return next(new HttpError("Invalid current password.", 422));
            }
            //compare new passwords
            if(newPassword != confirmNewPassword){
                return next(new HttpError("New passwords do not match.", 422));
            }

            //Hash new password
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(newPassword, salt);

            //update user info in database
            const newInfo = await User.findByIdAndUpdate(req.user.userId, {password: hash}, {new: true});
            res.status(200).json(newInfo);

        }catch(error){
            return next(new HttpError(error));
        }
}
























//===============Get all users/authors
//Get request + api/users/
//unprotected
const getAuthors = async (req, res, next)=>{
    try{
        const authors = await User.find().select('-password');// this will hide passwords
        res.json(authors);

    }catch(error){
        return next(new HttpError(error));
    }
}





























module.exports = {registerUser, loginUser, getAuthors, getUser, changeAvatar, editUser}