const User = require('../models/user.model')

exports.get_404 = (request, response, next) => {
  response.render("error_404");
};

exports.get_permissions = async (request, response, next) => {
  if(request.cookies.email) {
    request.session.email = request.cookies.email;
    request.session.permissions = request.cookies.permissions;
    request.session.id_colaborador = request.cookies.id_colaborador;
    if(request.cookies.come_from == 1) {
      response.redirect('/follow_ups?selectedOption=Meetings');
    } else {
      response.redirect('/');
    }
    return;
  }
  const email = request.session.email ?? request.user.profile.emails[0].value;
  if (request.user || request.session.email) {
    const active = request.session.estado ?? request.user.user.estado
  
    if (!active) {
      response.render("error_401")
      request.session.destroy()
      return
    }
  } else if (!request.user.user) {
    request.session.permissions = [];
    response.redirect("/")
    return
  }
  if (request.user) {
    request.session.email = request.user.profile.emails[0].value;

    if (request.user.user?.id_colaborador) {
      request.session.id_colaborador = request.user.user.id_colaborador;
      const isFirstLogin = await first_login(request.user.user.contrasena);
      if(isFirstLogin === true) {
        request.session.firstLogin = true;
        request.session.sourceRoute = "initial";
        response.redirect('/log_in/initial_password');
        return; 
      } 
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
  response.cookie("come_from", 0, {maxAge: 360000, httpOnly: true});
  
  response.redirect('/')
}

async function first_login(dbpassword) {
  const prefijo = "first";
  if (dbpassword.startsWith(prefijo)) {
    return true;
  } else {
    return false;
  }
}