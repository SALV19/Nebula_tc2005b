const express = require("express");

const app = express();

const middleware_auth = (req, res, next) => {
  console.log("User not signed in")
  // res.redirect("/login")
  next()
}

const login_routes = require("./routes/login.routes")
const general_routes = require("./routes/general.routes")

app.use("/login", login_routes)

app.use("/", middleware_auth, general_routes)

console.log("App started in: http://localhost:3000");
app.listen(3000);
