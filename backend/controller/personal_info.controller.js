const { response } = require("express");
const Collaborator = require("../models/collabs.model");
const { deploymentmanager } = require("googleapis/build/src/apis/deploymentmanager");

exports.get_personal_info = (request, response) => {

  console.log(request.user.user.id_colaborador);

  Collaborator.fetchPersonalInfo(request.user.user.id_colaborador)
  .then(data => {
    const [rowsC, fieldData] = data;

    const fullName = rowsC[0].nombre +' ' + rowsC[0].apellidos;

    let link = rowsC[0].foto;

    if(link.length < 10) {
      if(request.user) {
        link = request.user.profile._json.picture;
      }
    }

    console.log(rowsC[0]);

    response.render("personal_info", {
      permissions: request.session.permissions,
      csrfToken: request.csrfToken(),
      fullName: fullName, 
      email: rowsC[0].email, 
      rol: rowsC[0].tipo_rol, 
      ubicacion: rowsC[0].ubicacion, 
      puesto: rowsC[0].puesto, 
      departamento: rowsC[0].nombre_departamento, 
      foto: link,
    });
  })


  
};


  