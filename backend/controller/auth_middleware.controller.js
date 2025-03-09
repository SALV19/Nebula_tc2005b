exports.auth_user = (request, response, next) => {
  console.log("auth middleware");
  if (request.session.user || request.user) {
    next();
  } else {
    response.redirect("/log_in");
  }
};
