const User = require('../models/user.model')

exports.get_404 = (request, response, next) => {
  response.render("error_404");
};

exports.get_permissions = async (request, response, next) => {
  // console.log(request.session.email, request.user.emails[0].value)
  const email = request.session.email ?? request.user.emails[0].value;
  const permissions = await User.getPermissions(email);
  const per_arr = permissions[0].map((p) => p.nombre_permiso);
  request.session.permissions = per_arr;
  // console.log(request.session.permissions)
  
  response.redirect('/')
}
