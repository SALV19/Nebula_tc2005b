const express = require("express");
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../frontend/views"));

const middleware_auth = (request, response, next) => {
  console.log("User not signed in");
  // response.redirect("/login")
  next();
};

const login_routes = require("./routes/login.routes");
const general_routes = require("./routes/general.routes");

app.use("/login", login_routes);

app.use("/", middleware_auth, general_routes);

console.log("App started in: http://localhost:3000");
app.listen(3000);
