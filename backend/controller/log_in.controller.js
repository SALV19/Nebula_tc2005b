const User = require("../models/log_in.model");

exports.get_log_in = (request, response) => {
  response.render("log_in");
};

exports.post_log_in = (request, response) => {
  request.session.username = request.body.username;
  request.session.password = request.body.password;
  console.log(request.body.username);
  console.log(request.body.password);
  const user = new User(request.body.username, request.body.password);
    user.save()
        .then(() => {
            console.log("User saved");
            response.redirect('/');
        })
        .catch((error) => {
            console.log(error);
            //response.redirect('/log_in');
        }); 
};

