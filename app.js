require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", { useUnifiedTopology: true, useNewUrlParser: true });    //for local database
//mongoose.connect("mongodb+srv://Jay-Kishnani:eramudata@cluster0.mrm71.mongodb.net/userDB", { useUnifiedTopology: true, useNewUrlParser: true });  
//for cloud database

const userSchema = new mongoose.Schema({    //Creating a schema for the manager/user
    name : String ,
    email: {
        type :String,
        required : true
    },
    occupation: String,
    resName : String, 
    resLoc  : String,
    password :{
        type :String,
        required : true
    }
});

const empSchema = new mongoose.Schema({   //create a schema for employee records
    name : String ,
    EmpID:String,
    Designation: String,
    Date : String, 
    Salary : String
});

const ngoSchema = new mongoose.Schema({    //creating a schema for ngo records
    date : String , 
    name:String,
    food: String,
    email : String, 
    text : String
});

const revSchema = new mongoose.Schema({   //create a schema for customer reviews
    date: String,
    name:{
        type :String,
        required : true
    },
    review:{
        type :String,
        required : true
    },
    number:String,
    email:String,
});


const resvtnSchema = new mongoose.Schema({   //create a schema for reservation 
    name:String,
    date:String,
    time:String,
    customer_count:String,
    phone:String
});

userSchema.plugin(encrypt,{secret : process.env.SECRET ,encryptedFields: ['password'] });  //Encrypting the password


const User = new mongoose.model("User",userSchema);  //Creating a model using userSchema
const Emp = new mongoose.model("Emp",empSchema);       //Creating a model using empSchema
const Ngo = new mongoose.model("Ngo",ngoSchema);
const Rev = new mongoose.model("Rev",revSchema);       //Creating a model using ngoSchema
const Resvtn = new mongoose.model("Resvtn",resvtnSchema);


app.get("/",function(req,res){                         //get request for the home route
    res.render("index");
 });

 app.get("/index",function(req,res){                   //get request for the index
    res.render("index");
 });

app.get("/Login",function(req,res){                    //get request for the Login route
   res.render("Login");
});


app.get("/Sign_up",function(req,res){                  //get request for the Sign up page 
    res.render("Sign_up");
});

app.get("/services",function(req,res){                //get request for the services page
    res.render("Login");
});

           
app.get("/staff_management",function(req,res){       //get request for the staff management page
    res.render("staff_management");
});

app.get("/ngo_log",function(req,res){                //get request for the ngo log
res.render("ngo_log");
});


app.get("/update_ngo_log",function(req,res){          //get request for the updation of ngo log
res.render("update_ngo_log");
});

app.get("/review_view",function(req,res){
res.sendFile(__dirname+"/views/review_view.html");
});

app.get("/menu",function(req,res){
    res.sendFile(__dirname+"/menu/menu.html");
});

app.get("/review",function(req,res){
console.log("Review Log has loaded");
    Rev.find(function (err, foundItems) {
        if(err){
            console.log(err);
        }else{
        res.render("review", {Reviews: foundItems });
        }
    })
});

app.get("/update_reviews",function(req,res){
res.render("update_reviews");
});

app.get("/updated_reviews.html",function(req,res){
    res.sendFile(__dirname+"/views/updated_reviews.html")
});

app.get("/staff_management_view_employee_details", function (req, res) {  //get request for viewing employee deets
    console.log("staff management view has loaded");
    Emp.find(function (err, foundItems) {
        if(err){
            console.log(err);
        }else{
        res.render("staff_management_view_employee_details", {Entry: foundItems });
        }
    })
  });

app.get("/bill_generator",function(req,res){                 //get request for the bill generator 
    res.sendFile(__dirname+"/bill_generator/bill_generator.html");

});

app.get("/staff_management_alter",function(req,res){         //get request for altering the staff management deets
    res.render("staff_management_alter");
});

app.get("/updated_ngo_log",function(req,res){     
    res.render("updated_ngo_log");
});


app.get("/view_ngo_log", function (req, res) {  //get request for viewing employee deets
    console.log("NGO Log has loaded");
    Ngo.find(function (err, foundItems) {
        if(err){
            console.log(err);
        }else{
        res.render("view_ngo_log", {Logs: foundItems });
        }
    })
  });

app.get("/reserve_updated.html",function(req,res){
    res.sendFile(__dirname+"/views/reserve_updated.html");
 });

app.get("/Reservation",function(req,res){
   res.render("Reserve");
})

app.post("/Reserve",function(req,res){
    const newResvtn = Resvtn({
        name:req.body.name,
        date:req.body.date,
        time:req.body.time,
        customer_count:req.body.customer_count,
        phone:req.body.phone
    });
    newResvtn.save(function(err){
        if(err){
            console.log(err);
            res.write("<h1>An error occurred while submitting the form :/</h1>");
            res.write("<h2>Try filling the form once again</h2>");
        }else{
            res.redirect("reserve_updated.html") ;  //Add option for menu and other facilities instead of staff management
        }
    }); 
})


app.post("/update_reviews",function(req,res){
    console.log(req.body);
    const newRev = Rev({
        date : req.body.date,
        name: req.body.name,
        review: req.body.review,
        number: req.body.number,
        email : req.body.email,
    });
    newRev.save(function(err){
        if(err){
            console.log(err);
            res.write("<h1>An error occurred while submitting the form :/</h1>");
            res.write("<h2>Try filling the form once again</h2>")
        }else{
            res.redirect("updated_reviews.html");    //Add option for menu and other facilities instead of staff management
        }
    }); 
});
    

app.post("/update_ngo_log",function(req,res){
    console.log(req.body);
    const newNgo = Ngo({
        date : req.body.date,
        text: req.body.text,
        name: req.body.name,
        email : req.body.email,
    });
    newNgo.save(function(err){
        if(err){
            console.log(err);
            res.write("<h1>An error occurred while submitting the form :/</h1>");
            res.write("<h2>Try filling the form once again</h2>")
        }else{
            res.redirect("updated_ngo_log.html");    //Add option for menu and other facilities instead of staff management
        }
    }); 
});
   


app.post("staff_management_view_employee_details",function(req,res){  //Post request for viewing employee
    // details(check vailidity almsot useless)
     console.log(req.body);
 
});



app.post("/staff_management_alter",function(req,res){    // Post request for adding staff 
    console.log(req.body);
    const newEmp = new Emp({
        name :  req.body.name,
        EmpID: req.body.EmpID,
        Designation : req.body.Desig,
        Date:  req.body.Date,
        Salary: req.body.Salary
       });
   
       newEmp.save(function(err){
           if(err){
               console.log(err);
               res.write("<h1>An error occurred while submitting the form :/</h1>");
               res.write("<h2>Try filling the form once again</h2>")
           }else{
               res.redirect("staff_management_view_employee_details");    //Add option for menu and other facilities instead of staff management
           }
       }); 
});

app.post("/Sign_up",function(req,res){   //Post request for Signing up 
    const newUser = new User({
     name :  req.body.Name,
     email: req.body.email,
     occupation : req.body.occupation,
     resName : req.body.resName,
     resLoc:  req.body.resLoc,
     password: req.body.password
    });

    newUser.save(function(err){
        if(err){
            console.log(err);
            res.render("failed_signup");
        }else{
            res.render("services");    
        }
    }); 
    
});




app.post("/Login",function(req,res){    //Post request to take and authenticate login data 
    const email = req.body.email;
    const password = req.body.password;
    console.log(req.body.email);
     
 
    User.findOne({email : email}, function(err, foundUser){
        if(err){
            console.log(err);
            res.render("failed_login");
        }else{
            if(foundUser){
                if(foundUser.password === password){
                    res.render("services");    
                }
            }
        }
    })

});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {                    //Listening to the server at port 3000
    console.log("Server has started successfully");
  });
  


