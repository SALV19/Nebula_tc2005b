const Colaborador = require('../models/collabs.model');
const Departamento = require('../models/departamento.model');
const Empresa = require('../models/empresa.model');
const Equipo = require('../models/equipo.model');
const Rol = require('../models/rol.model');

const generator = require('generate-password-browser');

let settings = {
  selectedOption: 'active',
}

exports.get_collabs = async (request, response) => {
  try {
    const [collabsDataPues, collabsDataMod, depData, empData, rolData] = await Promise.all([
      Colaborador.fetchAllColabPues(),
      Colaborador.fetchAllColabMod(),
      Departamento.fetchAllDep(),
      Empresa.fetchAllEmp(),
      Rol.fetchAllRol(),
    ]);

    const [rowsColP, fieldDataColPues] = collabsDataPues;
    const [rowsColM, fieldDataColMod] = collabsDataMod;
    const [rowsDep, fieldDataDep] = depData;
    const [rowsEmp, fieldDataEmp] = empData;
    const [rowsRol, fieldDataRol] = rolData;

    const successData = request.session.successData;

    request.session.successData = null;

    response.render("collabs", {
      ...settings,
      permissions: request.session.permissions,
      csrfToken: request.csrfToken(),
      puesto: rowsColP, 
      modalidad: rowsColM,
      empresa: rowsEmp,
      departamento: rowsDep,
      rol: rowsRol,
      successData
    });
  } catch (error) {
    console.log(error);
  }
};


exports.post_collab = (request, response) => {
  console.log(request.body);
  const new_Colab = new Colaborador(request.body.nombre, request.body.apellidos, 
      request.body.fechaNacimiento, request.body.telefono, request.body.puesto, 
      request.body.email, request.body.fechaIngreso, request.body.ubicacion, 
      request.body.modalidad, request.body.curp, request.body.rfc);
  
  console.log(new_Colab);
  const password = generator.generate({
    length: 10,
    numbers: true
  });

  new_Colab.save(password)
    .then(([rows]) => {
      if (rows.length === 0) throw new Error("No se encontró el colaborador insertado.");
      const idcolab = rows[0].id_colaborador;

      const new_equipo = new Equipo(request.body.id_departamento, request.body.id_rol);
      return new_equipo.save(idcolab);
    }).then(() => {
      console.log("Equipo guardado");

      request.session.successData = {
        email: request.body.email,
        password: password
      };

      response.redirect("/view_collabs");
    })
    .catch((error) => {
      console.log(error);
      response.redirect("/view_collabs?error=true");
  }); 
};

  