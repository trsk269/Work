const express = require("express");
const path =require("path");
const bcrypt=require("bcrypt");
const {collection,product} =require("./config");
const movieRoutes = require("../routes/product");
const cors = require("cors");
const app =  express();

let cartItems = [];
app.use(express.json());

app.use(cors());

app.use(express.static("public"));

app.use(express.urlencoded({extended :false}));

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine','ejs');

app.use("/api", movieRoutes);

const port=5001;

const session = require("express-session");

// Add the session middleware
app.use(session({
    secret: "your_secret_key_here",
    resave: false,
    saveUninitialized: true
}));


app.get("/", (req, res) => {
    res.render("login");
});


app.get("/signup",(req,res)=>{
    res.render("signup");
});



app.get("/search",(req,res)=>{
    res.render("search");
});



app.get("/display", async (req, res) => {
    try {
      // Retrieve products from the database
      const products = await product.find();
  
      // Render the products using an EJS template
      res.render("display", { products }); // Assuming you have a products.ejs template
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).send("Internal Server Error");
    }
});




app.post("/signup", async (req,res)=>{
    const data ={
        name : req.body.username,
        password : req.body.password
    }

    const existingUser = await collection.findOne({name : data.name});

    if(existingUser)
    {
        res.send("user already exist");
    }
    else
    {

       const salRounds = 10 ;
       const hashpassword  =await bcrypt.hash(data.password,salRounds);
       data.password=hashpassword;

        const userdata = await collection.insertMany(data);
        console.log(userdata);
    }
});

var n;

app.post("/login", async (req, res) => {
    try {
        const user = await collection.findOne({ name: req.body.username });
        if (!user) {
            res.send("User not found");
        } else {
            const passwordMatch = await bcrypt.compare(req.body.password, user.password);
            if (passwordMatch) {
                // Set the user's name in the session upon successful login
                req.session.username = req.body.username;
                res.redirect("/home"); // Redirect to the home page
            } else {
                res.send("Wrong password");
            }
        }
    } catch (error) {
        res.send("Login failed");
    }
});

app.get("/home", (req, res) => {
    // Retrieve the username from the session
    const username = req.session.username;
    // Render the home page with the retrieved username
    res.render("home", { username: username });
});


app.get("/cart", (req, res) => {
    // Here you would typically fetch the cart items from the session or database
    const cartItems = []; // Sample cart items for demonstration
    res.render("cart", { cartItems });
});

app.get("/profile",(req,res)=>{
    const user = req.session.username;
    res.render("profile",{username:user});
});


app.listen(port, ()=>{
    console.log(`it is working at port 5001`);
})
