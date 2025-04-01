const User = require('../models/user.model')

exports.get_404 = (request, response, next) => {
  response.render("error_404");
};

exports.get_permissions = async (request, response, next) => {

  if(request.cookies.email) {
    console.log("permissions");
    console.log(request.session.permissions);
    request.session.email = request.cookies.email;
    request.session.permissions = request.cookies.permissions;
    request.session.id_colaborador = request.cookies.id_colaborador;
    response.redirect('/follow_ups/meeting');
    return;
  }

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

  response.cookie("email", email, {maxAge: 360000, httpOnly: true});
  response.cookie("id_colaborador", request.session.id_colaborador, {maxAge: 360000, httpOnly: true});
  response.cookie("permissions", request.session.permissions, {maxAge: 360000, httpOnly: true});
  
  response.redirect('/')
}
