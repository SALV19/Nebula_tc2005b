const User = require("../models/user.model");
const argon2 = require("argon2");

exports.get_log_in = (request, response) => {
  response.render("log_in");
};

exports.post_log_in = async (request, response) => {
  const email = request.body.email;
  const password = request.body.password;

  const user_info = await getUserLoginInfo(email, password);
  const hash_password = await argon2.hash(password);

  if (await argon2.verify(user_info[0][0].contrasena, password)) {
    console.log("login success");
    request.session.user = user_info;
    response.redirect("/");
  }
};

async function getUserLoginInfo(email) {
  const user_info = await User.fetchByEmail(email);

  return user_info;
}
