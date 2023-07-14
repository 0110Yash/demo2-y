const mongoose=require('mongoose');
// const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");


const studentSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
    },
    tokens:[//array since once user can login multiple times
        {
            token:{//se this is token 
                type:String,
                required:true
            }
        }
    ],


    subjectPrefernce:[
        {
            sbName:{
            type:String,
            required:true
            }
        }
    ]
})
studentSchema.methods.addSb=async function(sbNameV){
    try{
        this.subjectPrefernce=this.subjectPrefernce.concat({sbName:sbNameV});
        await this.save();
        return this.subjectPrefernce;
    }
    catch(err){
        console.log(err);
    }



}
studentSchema.methods.generateAuthToken = async function(){
    try{
        let token =jwt.sign({_id:this._id},process.env.SECRET_KEY);
        this.tokens=this.tokens.concat({token:token});
        await this.save();
     
       
        return token;
    } catch(err){

    }
}
const Student =mongoose.model('STUDENT',studentSchema);//inside the curly it should be full caps and also see that the const will hjave the first as the upp case
module.exports=Student;
