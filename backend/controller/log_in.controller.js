exports.get_log_in = (request, response) => {
  response.render("log_in");
};

exports.post_log_in = (request, response) => {
  request.session.username = request.body.username;
  request.session.password = request.body.password;
  console.log(request.body.username);
  console.log(request.body.password);
  response.redirect('/');
};



  