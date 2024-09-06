const User = require('../models/User')
const { verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin } = require('./verifyToken')
const Cryptojs=require("crypto-js")
const router=require('express').Router()

router.put("/:id",verifyTokenAndAuth, async (req,res)=>{
    if(req.body.password){
        req.body.password=Cryptojs.AES.encrypt(req.body.password,process.env.CRYP_SEC).toString()
    }
    try {
       const updatedUser = await User.findByIdAndUpdate(req.params.id,{
        $set: req.body
       },{new:true});
       res.status(200).json(updatedUser)
    } catch (error) {
        res.status(500).json(error)
    }
});
//Delete
router.delete("/:id" , verifyTokenAndAuth, async (req,res)=>{
   try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User has been deleted")
   } catch (error) {
    res.status(500).json(error)
   } 
})
//GET USER
router.get("/find/:id" , verifyTokenAndAdmin, async (req,res)=>{
    try {
         const user=await User.findById(req.params.id)
         const { password, ...others }=user._doc;

          res.status(200).json(others);
    } catch (error) {
     res.status(500).json(error)
    } 
 });

 //GET ALL USER
router.get("/", verifyTokenAndAdmin, async (req,res)=>{
    const query=req.query.new
    try {
         const users= query ? await User.find().sort({ _id: -1 }).limit(1):await User.find();

        res.status(200).json(users);
    } catch (error) {
     res.status(500).json(error)
    } 
 })

 // GET USER STATS
 router.get('/stats',verifyTokenAndAdmin,async(req,res)=>{
    const date = new Date();
    const lastyear=new Date(date.setFullYear(date.getFullYear()-1));
    try {
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastyear } } },
            {
                $project: {
                    month: { $month: "$createdAt" }
                }
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 }
                }
            }
        ])
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json(error)
    }
 })


module.exports=router