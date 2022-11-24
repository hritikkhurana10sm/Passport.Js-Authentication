const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/users');
const passport = require('passport');
const uri = `mongodb+srv://hritikkhurana10sm:Parth@cluster0.xj9exik.mongodb.net/?retryWrites=true&w=majority`;
const ejs = require('ejs');

const expressSession = require('express-session');
const {initializingPassport} = require('./passportConfig');
const {isAuthenticated} = require('./passportConfig');
app.set("view engine" , "ejs");



mongoose
  .connect(uri, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log("DataBase Connected Successfully");
  })
  .catch(err => console.log(err));

app.use(expressSession({
  secret : "secret",
  resave: false,
  saveUninitialized : false
}))

initializingPassport(passport);


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(passport.initialize());
app.use(passport.session());



app.get('/' , (req , res)=>{
    res.render("index");
})

app.get('/register' , (req , res)=>{ 
    return res.render("register");
})

app.get('/login' , (req , res)=>{ 
  return res.render("login");
})

app.post('/register' , async (req , res)=>{
    console.log('user ', req.body);
     const user = await User.findOne({username : req.body.username});
      
     if(user){return res.status(400).send(`User already exists ${user}`)};

     const newUser = await User.create(req.body);
     res.status(201).send(newUser);
})

app.get('/home' , isAuthenticated, (req , res)=>{
  res.send("hey this is home page");
})

app.post('/login' , passport.authenticate("local" , {
   failureRedirect:"/login"
}), (req , res)=>{

    return res.send('Signed In Successfully');
})

app.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});

app.listen(3000 , ()=>{
    console.log('listening ')
})