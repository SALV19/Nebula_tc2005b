exports.get_requests = (request, response) => {
  console.log(request.session)
  response.render("requests_page");
};
