module.exports = (request, response, next) => {
  // TO-DELETE
  if (request.session.email || request.user) {
    next();
  } else {
    response.redirect("/log_in");
    // next();
  }
};
