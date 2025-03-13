const User = require("../models/user.model");
const argon2 = require("argon2");

exports.get_log_in = (request, response) => {
  response.render("log_in", {
    error: null,
  });
};

exports.post_log_in = async (request, response) => {
  const email = request.body.email;
  const password = request.body.password;

  const user_info = await getUserLoginInfo(email, password);

  if (!!user_info[0].length) {
    if (await argon2.verify(user_info[0][0].contrasena, password)) {
      const permissions = await User.getPermissions(email);
      const per_arr = permissions[0].map((p) => p.nombre_permiso);
      console.log(per_arr);
      request.session.permissions = per_arr;
      console.log(request.session.permissions);

      request.session.user = user_info;
      response.redirect("/");
    } else {
      response.render("log_in", {
        error: "wrong_password",
      });
    }
  } else {
    response.render("log_in", {
      error: "user_not_found",
    });
  }
};

async function getUserLoginInfo(email) {
  const user_info = await User.fetchByEmail(email);

  return user_info;
}

exports.auth_fail = (request, response) => {
  response.send("Failure to authenticate");
};
