exports.general_permissions = (request, response, next) => {
  if (request.session.permissions.length > 0) {
    next()
  } else {
    response.render("error_401");
  }
};

exports.view_collabs = (request, response, next) => {
  if (request.session.permissions.includes('consult_collabs')) {
    next()
  } else {
    response.render("error_401");
  }
}

exports.view_reports = (request, response, next) => {
  if (request.session.permissions.includes('create_reports')) {
    next()
  } else {
    response.render("error_401");
  }
}
