const express = require ('express');
const router = express.Router();
require("../db/conn");
const User =require('../model/studentSchema');
const Student = require('../model/studentSchema');//obtained the student schema
const jwtoken = require("jsonwebtoken");

const Teacher = require('../model/teacherSchema');



const SAuthenticate =require("../middleware/Sauthenticate")
const TAuthenticate =require("../middleware/Tauthenticate")


router.post("/Sregister",(req,res)=>{
    const {name,email,phone,password,cpassword}=req.body;

    if(!(name&&email&&phone&&password&&cpassword)){
        return res.status(422).json({error:"Please fill the entire data"});
    }

    Student.findOne({email:email})
    .then((studentExist)=>{
        if(studentExist){
        return res.status(422).json({error:"Email already exist"});
            
        }
        else if(password!==cpassword){
        return res.status(422).json({error:"Password not matching"});

        }



        const student=new Student({name,email,phone,password,cpassword});
        student.save()
        .then(()=>{
            res.status(200).json({messgae:"User is being registered succeffully"})
        })
        .catch((err)=>{
            console.log(err);        })
    })
    .catch((err)=>{
        console.log(err);
    })

})
router.post("/Tregister", async (req,res)=>{
    const {name,email,phone,password,cpassword}=req.body;

    if(!(name&&email&&phone&&password&&cpassword)){
        return res.status(422).json({error:"Please fill the entire data"});
    }

    Teacher.findOne({email:email})
    .then((teacherExist)=>{
        if(teacherExist){
        return res.status(422).json({error:"Email already exist"});
            
        }
        else if(password!==cpassword){
        return res.status(422).json({error:"Password not matching"});

        }



        const teacher=new Teacher({name,email,phone,password,cpassword});
        teacher.save()
        .then(()=>{
            res.status(200).json({messgae:"User is being registered succeffully"})
        })
        .catch((err)=>{
            console.log(err);        })
    })
    .catch((err)=>{
        console.log(err);
    })

})


router.post("/Ssignin", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!(email && password)) {
        return res.status(400).json({ error: "Please fill in all the data" });
      }
    
      const userExist = await Student.findOne({ email: email });

      if (userExist && userExist.password === password) {
    

        const token = await userExist.generateAuthToken();
        console.log(token);
        
        res.cookie("jwtoken",token,{
            expires:new Date(Date.now()+25892000000),
            httpOnly:true
        }) 

        res.status(200).json({ message: "Login" });
      } else if (userExist && !(userExist.password === password)) {
        return res.status(400).json({ error: "Invalid Credentials" });
      } else {
        return res.status(400).json({ error: "No account found" });
      }
    } catch (error) {
      // Handle any errors that occur during the execution
      res.status(500).json({ error: "Internal Server Error" });
    }
  });



router.post("/Tsignin", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!(email && password)) {
        return res.status(400).json({ error: "Please fill in all the data" });
      }
  
      const userExist = await Teacher.findOne({ email: email });

      if (userExist && userExist.password === password) {
    

        const token = await userExist.generateAuthToken();
        // console.log(token);
        
        res.cookie("jwtoken",token,{
            expires:new Date(Date.now()+25892000000),
            httpOnly:true
        })

        res.status(200).json({ message: "Login" });
      } else if (userExist && !(userExist.password === password)) {
        return res.status(400).json({ error: "Invalid Credentials" });
      } else {
        return res.status(400).json({ error: "No account found" });
      }
    } catch (error) {
      // Handle any errors that occur during the execution
      res.status(500).json({ error: "Internal Server Error" });
    }
  });


  router.post('/Tknown',TAuthenticate,async (req,res)=>{
    try{
      const {sbName}=req.body;

      if(!sbName)
      {
        console.log("error in the contact form")
        return res.json({error:"Please fill the correct contact forn"})
      }



      const userContact=await Teacher.findOne({_id:req.userID});

      if(userContact){
        const userMessage=await userContact.addSb(sbName);

        await userContact.save();

        res.status(201).json({message:"user Contact success"})
      }


    }
    catch(error)
    {
      console.log(error);
    }
})


  router.post('/SWant',SAuthenticate,async (req,res)=>{
    try{
      const {sbName}=req.body;

      if(!sbName)
      {
        console.log("error in the contact form")
        return res.json({error:"Please fill the correct contact forn"})
      }



      const userContact=await Student.findOne({_id:req.userID});

      if(userContact){
        const userMessage=await userContact.addSb(sbName);

        await userContact.save();

        res.status(201).json({message:"user Contact success"})
      }


    }
    catch(error)
    {
      console.log(error);
    }
})



router.post("/find",SAuthenticate, async(req,res)=>{

  try{
    
    const findBestMatch = async (studentId) => {
      try {
        const student = await Student.findById(studentId).lean().exec();
        const { subjectPrefernce } = student;
    
        const match = await Teacher.aggregate([
          {
            $addFields: {
              matchingSubjects: {
                $size: {
                  $setIntersection: [
                    "$subjectKnown.sbName",
                    subjectPrefernce.map((pref) => pref.sbName)
                  ]
                }
              }
            }
          },
          {
            $sort: { matchingSubjects: -1 }
          },
          {
            $limit: 1
          }
        ]);
    
        if (match.length > 0) {
          return match[0];
        }
    
        return null; // No matching teacher found
      } catch (error) {
        console.error(error);
        throw error;
      }
    };
    
    // Usage example
    const studentId = req.userID;
    findBestMatch(studentId)
      .then((match) => {
        if (match) {
          return res.json({"Best matching teacher:": match.name});
        } else {
          console.log("No matching teacher found");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  catch(err){
    console.log(err);
  }

})

router.get("/",(req,res)=>{
    res.send("Hello from the server routeer")
})


module.exports=router;
