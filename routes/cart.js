const Cart = require('../models/Cart')
const { verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin } = require('./verifyToken')
const Cryptojs=require("crypto-js")
const router=require('express').Router()

// Create
router.post('/',verifyToken,async (req,res)=>{
    const newCart = new Cart(req.body)
    try {
        const saveCart = await newCart.save();
        res.status(200).json(saveCart)
    } catch (error) {
        res.status(500).json(error)
    }
})
// UPDATE
router.put("/:id",verifyTokenAndAuth, async (req,res)=>{
    try {
       const updatedCart = await Cart.findByIdAndUpdate(req.params.id,{
        $set: req.body
       },{new:true});
       res.status(200).json(updatedCart)
    } catch (error) {
        res.status(500).json(error)
        console.log(error);
        
    }
});
//Delete
router.delete("/:id" , verifyTokenAndAuth, async (req,res)=>{
   try {
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("Product has been deleted")
   } catch (error) {
    res.status(500).json(error)
   } 
})
//GET USER Cart
router.get("/find/:id" ,verifyTokenAndAuth, async (req,res)=>{
    try {
         const cart=await Cart.findOne({userId: req.params.id})
          res.status(200).json(cart);
    } catch (error) {
     res.status(500).json(error)
    } 
 });

// Get All
router.get("/",verifyTokenAndAdmin,async(req,res)=>{
    try{
        const carts=await Cart.find()
        res.status(200).json(carts)
    }catch(err){
        res.status(500).json(err)
    }
})
 

module.exports=router