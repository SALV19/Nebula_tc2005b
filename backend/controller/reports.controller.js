exports.get_reports = (request, response) => {
    response.render("reports", {
      permissions: request.session.permissions,
      csrfToken: request.csrfToken(),
    });
  };
  