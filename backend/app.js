const express = require("express");
const path = require("path");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../frontend/views"));
app.use(express.static(path.join(__dirname, "./public")));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  session({
    secret:
      "mi string secreto que debe ser un string aleatorio muy largo, no como este lolxd",
    resave: false,
    saveUninitialized: false,
  })
);

const middleware_auth = (request, response, next) => {
  console.log("User not signed in");
  // response.redirect("/login")
  next();
};

const login_routes = require("./routes/login.routes");
const general_routes = require("./routes/general.routes");

app.use("/log_in", login_routes);

app.use("/", middleware_auth, general_routes);

app.listen(3000, () => {
  console.log("App started in: http://localhost:3000");
});
