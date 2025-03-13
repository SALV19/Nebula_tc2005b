exports.get_collabs = (request, response, next) => {
  if (request.session.permisions) {
    if (request.session.permisions.includes("view_collabs")) {
      next();
    } else {
      response.render("error_401");
    }
  } else {
    response.redirect("/log_in");
  }
};
