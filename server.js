require("dotenv").config();
const express=require("express"), mongoose=require("mongoose"), helmet=require("helmet"), path=require("path");
const rateLimit=require("express-rate-limit");
const app=express(); app.disable("x-powered-by"); app.use(helmet({contentSecurityPolicy:false}));
app.use(express.json({limit:"30kb"})); app.use(rateLimit({windowMs:15*60*1000,limit:100}));
app.use(express.static(path.join(__dirname,"public")));
const Recommendation=require("./src/models/Recommendation");
const {recommend}=require("./src/services/recommendationEngine");
const {sendSMS}=require("./src/services/smsService");
app.get("/api/health",(_req,res)=>res.json({status:"running",database:mongoose.connection.readyState===1?"connected":"disconnected"}));
app.post("/api/crops/recommend",async(req,res)=>{
 try{
  const {farmerName="",location="",soilType,season,rainfall,waterAvailability,landArea=null}=req.body||{};
  const soils=["Alluvial","Black","Red","Laterite","Sandy","Clay","Loamy"], seasons=["Kharif","Rabi","Summer","Year-round"], waters=["Low","Moderate","High"];
  const rain=Number(rainfall);
  if(!soils.includes(soilType)||!seasons.includes(season)||!waters.includes(waterAvailability)||!Number.isFinite(rain)||rain<0||rain>5000) return res.status(400).json({message:"Please enter valid soil, season, rainfall and water availability."});
  const crops=recommend({soilType,season,rainfall:rain,waterAvailability});
  let saved=false;
  if(mongoose.connection.readyState===1){await Recommendation.create({farmerName:String(farmerName).slice(0,80),location:String(location).slice(0,100),soilType,season,rainfall:rain,waterAvailability,landArea,crops});saved=true;}
  res.json({input:{soilType,season,rainfall:rain,waterAvailability},crops,saved,notice:"Educational suggestions only. Verify with a local agriculture expert before planting."});
 }catch(e){console.error(e.message);res.status(500).json({message:"Could not generate recommendations."});}
});
app.get("/api/crops/history",async(_req,res)=>{if(mongoose.connection.readyState!==1)return res.status(503).json({message:"MongoDB is not connected."});try{res.json({items:await Recommendation.find().sort({createdAt:-1}).limit(50).select("-__v")});}catch(e){res.status(500).json({message:"Could not load history."});}});
app.post("/api/sms/send",async(req,res)=>{
 const {phone,message}=req.body||{};
 if(typeof phone!=="string"||!/^\+?[1-9]\d{7,14}$/.test(phone.trim()))return res.status(400).json({message:"Use international phone format, e.g. +919876543210."});
 if(typeof message!=="string"||message.trim().length<5||message.length>500)return res.status(400).json({message:"Message must be 5–500 characters."});
 try{await sendSMS(phone.trim(),message.trim());res.json({success:true,message:"SMS request accepted by provider."});}
 catch(e){console.error("SMS provider:",e.message);res.status(502).json({message:e.message});}
});
app.get("*",(_req,res)=>res.sendFile(path.join(__dirname,"public","index.html")));
(async()=>{try{if(process.env.MONGODB_URI)await mongoose.connect(process.env.MONGODB_URI);else console.warn("MONGODB_URI not configured; history saving disabled.");app.listen(process.env.PORT||5008,()=>console.log(`Verdant Crop App: http://localhost:${process.env.PORT||5008}`));}catch(e){console.error("Startup failed:",e.message);process.exit(1);}})();
