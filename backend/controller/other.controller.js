exports.get_404 = (request, response, next) => {
  response.render("error_404");
};
