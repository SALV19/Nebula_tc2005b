exports.get_collabs = (request, response, next) => {
  console.log(request.session.permissions);
  if (request.session.permissions) {
    if (request.session.permissions.includes("view_collabs")) {
      next();
    } else {
      response.render("error_401");
    }
  } else {
    response.redirect("/log_in");
  }
};
