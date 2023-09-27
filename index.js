const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UsersModel = require("./models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const CreateCustomerModel = require("./models/Customer")

 
const app = express();
app.use(express.json());
app.use(cors({
  origin:["http://localhost:3000"],
  methods:["GET","POST"],
  withcredentials:true
}
));
app.use(cookieParser());
app.use(cors());
const varifyUser = (req, res,next)=>{
    const token = req.cookie.token;
    if(!token){
      return res.json("Token is Missing")
    }else{
      jwt.verify(token, "jwt-secret-key", (err, decoded)=>{
        if(err){
          return res.json("Error with token")
        }else{
          if(decoded.role === "admin"){
            next()
          }else{
            return res.json("Not admin")
          }
        }
      })
    }
}
app.get("/dashboard", varifyUser ,(req, res)=>{
    res.json()
})
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  UsersModel.findOne({ email: email })
  .then((user) => {
    if (user) {
        bcrypt.compare(password, user.password, (err,response) =>{
            if(response) { 
               const token = jwt.sign({email : user.email, role:user.role},
                "jwt-secret-key",{expiresIn:"1d"})
                  res.cookie("token",token)
                  return res.json({Status:"Success", role:user.role})
            }else{
               return res.json("The password is incorrect")
            }
        })
    } else {
    return  res.json("No record existed");
    }
  });
});

app.post("/register", (req, res) => {
  const { name,role ,email, password} = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      UsersModel.create({ name, email, password: hash })
        .then((user) => res.json("Success"))
        .catch((err) => res.json(err));
    })
    .catch((err) => console.log(err.mongoose));
});

app.get("/getUsers", (req,res)=>{
 UsersModel.find()
  .then(users=>res.json(users))
  .then(err=>res.json(err))
});

// app.post("/cratecustomer",(req,res)=>{
//       CreateCustomerModel.create(req.body)
//       .then(customers=>res.json(customers))
//       .catch(err=>res.json(err))
// })
//const PORT = process.PORT || 5000;

//mongoose.connect("mongodb://127.0.0.1:27017/paymentTracker");
mongoose.connect("mongodb+srv://baniico:Oslbiqor19OyO4B2@cluster0.cpw2wje.mongodb.net/Payment_app?");

app.listen(3001, () => {
 console.log("Server is connected to the Database");
});