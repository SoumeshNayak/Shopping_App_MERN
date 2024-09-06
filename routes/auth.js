const User = require('../models/User')

const router=require('express').Router()
const Cryptojs=require("crypto-js")
const jwt=require("jsonwebtoken")

//Register
router.post("/register", async (req,res)=>{
    const newuser=new User({
        username: req.body.username,
        email: req.body.email,
        password: Cryptojs.AES.encrypt(req.body.password,process.env.CRYP_SEC).toString()
    })
    try{
        const savedUser= await newuser.save();
        res.status(201).json(savedUser)
    }catch(err){
        res.status(500).json(err)
    }
    
    
});
//Login
router.post("/login",async (req,res)=>{
    try {
        const user=await User.findOne({ username : req.body.username }); 
        
        !user && res.status(401).json("No such user");
        const hashPassword=Cryptojs.AES.decrypt(user.password,process.env.CRYP_SEC);

        const pass=hashPassword.toString(Cryptojs.enc.Utf8);
        pass !== req.body.password && res.status(401).json("wrong cradentials");

        // JWT 
        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin,
        },process.env.JWT_SEC,{expiresIn: "3d"})

        const { password, ...others }=user._doc;

        res.status(200).json({...others,accessToken});
    } catch (err) {
        res.status(500).json(err)
        console.log(err);
        
    }
    
})

module.exports=router