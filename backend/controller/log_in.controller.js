exports.get_log_in = (request, response) => {
  response.render("log_in");
};

exports.post_log_in = (request, response) => {
  console.log("post_login");
  request.session.email = request.body.email;
  request.session.password = request.body.password;

  response.status(200);
};
