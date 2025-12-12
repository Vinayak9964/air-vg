const express = require("express");
const app = express();

app.get("/user",(req,res)=>{
   res.cookie("iamcookie", "value");
    res.send("i sent cookie");
});
app.get("/",(req,res)=>{
    res.send("i root");
})

app.listen("4000",(req,res)=>{
    console.log("port is running");
})