// Requirements
const express = require("express");
const path = require("path");
const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");

require("dotenv").config();
require("./util/google_auth");

// Server set-up
const app = express();

app.set("view engine", "ejs");
app.set("views", [
  path.join(__dirname, "../frontend/views"),
  path.join(__dirname, "../frontend/views/error"),
]);
app.use(express.static(path.join(__dirname, "./public")));
app.use(express.json());

app.use(
  session({
    secret:
      "mi string secreto que debe ser un string aleatorio muy largo, no como este lolxd",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const csrf = require("csurf");
const csrfProtection = csrf();
app.use(csrfProtection);

app.use(passport.authenticate("session"));

//  Routes and middlewares
const auth_middleware = require("./util/auth_middleware");

const login_routes = require("./routes/login.routes");
const general_routes = require("./routes/general.routes");

const other_controllers = require("./controller/other.controller");

app.use("/log_in", login_routes);
app.use("/", auth_middleware, general_routes);

app.use(other_controllers.get_404);

// Start server
app.listen(3000, () => {
  console.log("App started in: http://localhost:3000");
});
