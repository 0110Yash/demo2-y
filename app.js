const express =require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app=express();
const cookieParser =require('cookie-parser');
dotenv.config({path:'./config.env'});


require("./db/conn");//setted the connection with the databvse
const PORT =process.env.PORT;


app.use(cookieParser());


const Student =require("./model/studentSchema");//obtained the student object
const Teacher=require("./model/teacherSchema");//obtained the teacher schema
app.use(express.json());


app.use(require("./router/auth"));//made the path in the router


app.listen(PORT,()=>{console.log(`Server is running on the root of ${PORT}`)})//started on the portaasasasas