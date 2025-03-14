let settings = {
  selectedOption: 'requests',
}

exports.get_requests = (request, response) => {
  response.render("requests_page", {
    ...settings,
    permissions: request.session.permissions
  });
};
