module.exports = (request, response, next) => {
  if (request.session.email || request.user) {
    next();
  } else {
    response.redirect("/log_in");
  }
};
