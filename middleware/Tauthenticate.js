//here we will verify out the jwt token
const jwt = require("jsonwebtoken");
const Teacher = require("../model/teacherSchema")

const Authenticate = async (req,res,next)=>{
    try{
        const token =req.cookies.jwtoken;
        const verifyToken = jwt.verify(token,process.env.SECRET_KEY);//and if the verification succeeds, it returns the decoded token payload.

        const rootUser = await Teacher.findOne({_id:verifyToken._id,"tokens.token":token});

        if(!rootUser){
            throw new Error ("User not found")
        }
       
        req.token=token;
        req.rootUser=rootUser;
        req.userID=rootUser._id;//this will come handy when we will have to senf the data tio the serever via the contact forn
       
        next();
    }
    catch(err){
        res.status(401).send("Unauthorized:No token provided");
        console.log(err);
    }

}






module.exports=Authenticate