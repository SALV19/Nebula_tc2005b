const User = require('../models/user.model')

exports.get_404 = (request, response, next) => {
  response.render("error_404");
};

exports.get_permissions = async (request, response, next) => {
  const email = request.session.email ?? request.user.profile.emails[0].value;
  if (request.user) {
    request.session.email = request.user.profile.emails[0].value;
    if (request.user.user?.id_colaborador) {
      request.session.id_colaborador = request.user.user.id_colaborador
    }
    else {
      request.session.id_colaborador =null
      request.session.permissions = []
      response.redirect('/')
      return
    }
  }
  const permissions = await User.getPermissions(email);
  const per_arr = permissions[0].map((p) => p.nombre_permiso);
  request.session.permissions = per_arr;
  
  response.redirect('/')
}
