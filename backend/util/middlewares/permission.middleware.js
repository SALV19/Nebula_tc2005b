exports.general_permissions = (request, response, next) => {
  console.log("Permisos:", request.session.permissions);
  if (request.session.permissions.length > 0) {
    next()
  } else {
    console.log("NO TIENE PERMISOS, NO PASA DE ACA");
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
