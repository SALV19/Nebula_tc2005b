let settings = {
  selectedOption: 'vacations',
}

exports.get_requests = (request, response) => {
  response.render("requests_page", {
    ...settings,
    permissions: request.session.permissions,
    csrfToken: request.csrfToken(),
  });
};
