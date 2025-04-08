const User = require("../models/user.model");
const argon2 = require("argon2");

let status = {
  error: null,
}

exports.get_log_in = (request, response) => {
  response.clearCookie('email');
  response.render("log_in", {
    ...status, 
    csrfToken: request.csrfToken(),
  });
};

exports.post_log_in = async (request, response) => {
  request.session.email = null;
  request.session.id_colaborador = null;
  const email = request.body.email;
  const password = request.body.password;

  const user_info = await getUserLoginInfo(email, password);

  if (user_info[0].length) {
    if (await argon2.verify(user_info[0][0].contrasena, password)) {
      request.session.email = request.body.email;
      
      request.session.id_colaborador = user_info[0][0].id_colaborador;
      response.redirect("/log_in/success");
    } else {
      status.error = 'wrong_password'
      response.render("log_in", {
        ...status, 
        csrfToken: request.csrfToken(),
      });
    }
  } else {
    status.error = 'user_not_found'
    response.render("log_in", {
      ...status, 
      csrfToken: request.csrfToken(),
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