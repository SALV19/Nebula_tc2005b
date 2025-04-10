exports.get_personal_info = (request, response) => {
    response.render("personal_info", {
      permissions: request.session.permissions,
      csrfToken: request.csrfToken(),
    });
  };
  