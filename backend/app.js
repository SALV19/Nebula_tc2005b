const express = require("express");
const path = require("path");
const session = require("express-session");
const bodyParser = require("body-parser");

const User = require("./models/user.model");

const app = express();

app.set("view engine", "ejs");
app.set("views", [
  path.join(__dirname, "../frontend/views"),
  path.join(__dirname, "../frontend/views/error"),
]);
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

// TO-FIX -> ramas de autentificación tienen el verdadero middleware
const middleware_auth = async (request, response, next) => {
  console.log("User not signed in");
  request.session.email = "santialducin@gmail.com";
  request.session.permisions = await User.getPermissions(
    request.session.email
  ).then((permission_arr) =>
    permission_arr[0].map((permision) => permision.nombre_permiso)
  );
  // response.redirect("/login")
  next();
};

const login_routes = require("./routes/login.routes");
const general_routes = require("./routes/general.routes");

const other_controllers = require("./controller/other.controller");

app.use("/log_in", login_routes);

app.use("/", middleware_auth, general_routes);

app.use(other_controllers.get_404);

app.listen(3000, () => {
  console.log("App started in: http://localhost:3000");
});
