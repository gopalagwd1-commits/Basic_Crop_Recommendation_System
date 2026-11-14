const mongoose=require("mongoose");
module.exports=mongoose.model("Recommendation",new mongoose.Schema({
 farmerName:{type:String,trim:true,maxlength:80,default:""},location:{type:String,trim:true,maxlength:100,default:""},
 soilType:{type:String,required:true},season:{type:String,required:true},rainfall:{type:Number,min:0,max:5000,required:true},
 waterAvailability:{type:String,required:true},landArea:{type:Number,default:null},
 crops:[{name:String,score:Number,suitability:String,reasons:[String],note:String}]
},{timestamps:true}));
