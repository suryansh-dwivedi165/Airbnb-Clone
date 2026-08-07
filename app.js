if(process.env.NODE_ENV !== "production") {
  require("dotenv").config();
} 

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express(); 
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const port = 3000;
const ExpressError = require("./utils/ExpressError.js"); 
const session = require("express-session"); 
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport"); 
const localStragegy = require("passport-local");
const User = require("./models/user.js"); 

const listingRouter = require("./routes/listing.js"); 
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js"); 

app.listen(port, () => {
  console.log("Server start on port 3000");
});
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

main()
  .then(() => {
    console.log("Connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(process.env.ATLASDB_URL);
}  

const store = MongoStore.create({
  store,
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24*3600
}); 

store.on("error", () => {
  console.log("Erorr in Mongo session store")
})

const sessionOptions = {
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized: false,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
}

app.use(session(sessionOptions));
app.use(passport.initialize()); 
app.use(passport.session());
app.use(flash()); 

passport.use(new localStragegy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());  

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");  
  res.locals.currUser = req.user;
  next();
}) 

// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email:"student@gmail.com",
//     username:"Suryansh Dwived"
//   }); 

//   let registerUser = await User.register(fakeUser, "Hello World"); 
//   res.send(registerUser); 
// }) 

app.use("/listings", listingRouter); 
app.use("/listings/:id/reviews", reviewRouter);
app.use("/users", userRouter); 

app.use((req, res) => {
    throw new ExpressError(404, "Page Not Found");
});

app.use((err, req, res, next) => {
  let { status=500, message="Something went wrong"} = err; 
  res.status(status).render("listings/error.ejs", {message}); 
  // res.status(status).send(message);
}) 

// app.get("/", (req, res) => {
//   res.send("It is the root directory ");
// }); 