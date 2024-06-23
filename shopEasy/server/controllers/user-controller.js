import {validationResult} from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const { text } = pkg;
import pkg from "body-parser";


import HttpError from "../models/http-error.js";
import { User } from "../models/user.js";
import { sendEmail } from "../middlewares/nodemailer.js";
import { Profile } from "../models/profile.js";



export const getUsers = async(req,res,next)=>{
    try{
        const user2 = req.user;
        if(user2){
            res.json({
                message:"User is Authorized",
                success:true,
                user:user2
            })
        }
        else{
            res.json({
                message:"UnAuthorized",
                success:false
            })
        }
    } catch(err){
        const error = new HttpError('Fetching users failed, try again later',500);
        return next(error);
    }
};

export const signup = async(req,res,next)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return next(
            new HttpError('Invalid inputs paassed, please check your data.',422)

        );
    }
    const {name,email,password}= req.body;

    let existingUser;
    try{
        existingUser = await User.findOne({email:email});
    } catch(err){
       const error = new HttpError('Signing up failed, try again later.',500);
       return next(error);
    }

    if(existingUser){
        const error = new HttpError('User already exists , login instead',422);
        return next(error);
    }

    let hashedPassword;
    try{
      // console.log("password = ",password);
        hashedPassword = await bcrypt.hash(password,10);
    } catch(err){
        const error = new HttpError('Error hashing password, try again ',500);
        return next(error);
    }
    
    const createdUser = new User({
        name,
        email,
        password: hashedPassword
    });
    console.log("hashedPass=",hashedPassword);
    try{
        await createdUser.save();
    } catch(err){
        const error = new HttpError('Signing up failed,please try again later.',500);
        return next(error); 
    }

    let token;
    try{
        token = jwt.sign(
           { email: createdUser.email,
            name:createdUser.name
           },
            'dont_share_token',
            {expiresIn : '1h'}
        );
    } catch (err){
        const error = new HttpError('Failed to create token,please try again',500);
        return next(error);
    }
    res.cookie('jwt',token,{httpOnly:true, maxAge:3600000*24});
    res.status(201).json({
        success:true,
        message:"Successfully registered",
       user:{ name: createdUser.name,
        email: createdUser.email
       },
        // password : hashedPassword,
        token:token
    });

    // Send email with new password
    const msg = `
    <p>Dear ${createdUser.name},</p>
    <p>Congratulations on signing up! 🎉 You've just unlocked a world of amazing products and exclusive deals at our online store.</p>
    <p>At ShopEasy, we strive to bring you a seamless and enjoyable shopping experience with a wide range of products across various categories. Whether you're looking for the latest gadgets, fashionable apparel, or home essentials, we've got you covered.</p>
    <p>We're excited to have you as part of our community and can't wait for you to start exploring our offerings. Take advantage of personalized recommendations, special promotions, and fast, reliable shipping.</p>
    <p>If you have any questions or need assistance, our support team is here to help. We're dedicated to ensuring your shopping experience with ShopEasy is nothing short of excellent.</p>
    <p>Once again, welcome to ShopEasy, and thank you for choosing us for your shopping needs!</p>
    <p>Best regards,</p>
    <p>The ShopEasy Team</p>`; 
    sendEmail(createdUser.email, `Welcome to ShopEasy!`, msg);
};

export const login = async(req,res,next)=>{
    const {email , password} = req.body;
    let existingUser;

    try{
        existingUser = await User.findOne({email :email});
    } catch(err){
        const error = new HttpError('Loging in failed,please try again later',500);
        return next(error);
    }

    if(!existingUser){
        const error = new HttpError('Invalid credentials, could not log you in ',403);
        return next(error);
    }

    let isValidPassword;
    try{
        isValidPassword = await bcrypt.compare(password, existingUser.password);

    } catch(err){
        const error = new HttpError('Could not log you in , check credentials and try again ',500);
        return next(error);
    }

    if(!isValidPassword){
        const error = new HttpError('Invalid creddentials, could not log you in.',403);
        return next(error);
    }

    let token;
  try {
    token = jwt.sign(
      {  email: existingUser.email ,
        name:existingUser.name
      },
      'dont_share_token',
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Logging in failed(token), please try again later.',
      500
    );
    return next(error);
  }
  res.cookie('jwt',token,{httpOnly:true, maxAge:3600000*24
  });
  res.json({
    success:true,
    message:"logging in successful",
  user: { name:existingUser.name,
    email: existingUser.email,},
    token:token
  });
};

export const logout = async (req, res) => {
    res.clearCookie("jwt").json({
        success: true,
        message: "Logout Successfully!"
    });
  }




  