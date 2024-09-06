const express=require('express')
const app=express();
const mongoose=require('mongoose')
const dotenv=require('dotenv')
const userRoute=require("./routes/user")
const authRoute=require("./routes/auth")
const productRoute=require("./routes/product")
const cartRoute=require("./routes/cart")
const cartOrder=require("./routes/order")





dotenv.config()

mongoose.connect(process.env.MONGO_URL).then(()=>console.log("db connected")).catch((err)=>console.log(err));

// app.get('/api/test',(req,res)=>{
//     console.log("Success");
//     res.json("Success")
// })
app.use(express.json())

app.use("/api/auth",authRoute)
app.use("/api/users",userRoute)
app.use("/api/products",productRoute)
app.use("/api/carts",cartRoute)
app.use("/api/orders",cartOrder)






app.listen(5000 ,()=>{
    console.log("Backend is running");
    
})
