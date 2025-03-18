let settings = {
  selectedOption: 'active',
}
exports.get_collabs = (request, response) => {
  response.render("collabs", {
    ...settings,
    permissions: request.session.permissions,
    csrfToken: request.csrfToken(),
  });
};
