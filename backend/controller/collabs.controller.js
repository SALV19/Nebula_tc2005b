const Colaborador = require('../models/collabs.model');
const Departamento = require('../models/departamento.model');
const Empresa = require('../models/empresa.model');
const Equipo = require('../models/equipo.model');
const Rol = require('../models/rol.model');

const generator = require("generate-password-browser");

let settings = {
  selectedOption: "active",
};

exports.get_collabs = async (request, response) => {
  try {
    const [collabsDataPues, collabsDataMod, depData, empData, rolData] =
      await Promise.all([
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
      successData,
    });
  } catch (error) {
    console.error(error);
  }
};

exports.post_collab = (request, response) => {
  const new_Colab = new Colaborador(
    request.body.nombre,
    request.body.apellidos,
    request.body.fechaNacimiento,
    request.body.telefono,
    request.body.puesto,
    request.body.email,
    request.body.fechaIngreso,
    request.body.ubicacion,
    request.body.modalidad,
    request.body.curp,
    request.body.rfc
  );

  const password = generator.generate({
    length: 10,
    numbers: true,
  });

  new_Colab
    .save(password)
    .then(([rows]) => {
      if (rows.length === 0)
        throw new Error("No se encontró el colaborador insertado.");
      const idcolab = rows[0].id_colaborador;

      const new_equipo = new Equipo(
        request.body.id_departamento,
        request.body.id_rol
      );
      return new_equipo.save(idcolab);
    })
    .then(() => {
      request.session.successData = {
        email: request.body.email,
        password: password,
      };

      response.redirect("/view_collabs");
    })
    .catch((error) => {
      console.error(error);
      response.redirect("/view_collabs?error=true");
    });
};

exports.get_collabs_info = async (request, response) => {
  const offset = request.body.offset * 10;
  const filter = request.body.filter;
  let collabs;
  if (request.session.permissions.includes('consult_all_collabs')) {
    collabs = await Colaborador.fetchCollabs(null, offset, filter)
      .then((data) => data)
      .catch((e) => console.error(e));
  }
  else {
    collabs = await Colaborador.fetchCollabs(request.session.email, offset, filter)
      .then((data) => data)
      .catch((e) => console.error(e));
  }
  response.json({
    selectedOption: "Active",
    collabs: collabs,
  });
  
};

exports.get_collab_data = async (req, res) => {
  try {
    const id = req.body.id_colaborador;

    const [collabResult] = await Colaborador.fetchCollabById(id);
    const [equipoResult] = await Equipo.fetchEquipoById(id);    

    res.json({
      colaborador: collabResult[0],
      equipo: equipoResult[0],
    });
  } catch (error) {
      console.error(error);
      response.redirect("/view_collabs?error=true");
  }
};


exports.update_collab = async (request, response) => {
  try {
    const id = request.body.id_colaborador;
    console.log("Actualizando colaborador:", id);

    const edit_Colab = new Colaborador(
      request.body.nombre,
      request.body.apellidos,
      request.body.fechaNacimiento,
      request.body.telefono,
      request.body.puesto,
      request.body.email,
      request.body.fechaIngreso,
      request.body.ubicacion,
      request.body.modalidad,
      request.body.curp,
      request.body.rfc
    );

    const edit_equipo = new Equipo(
      request.body.id_departamento,
      request.body.id_rol
    );

    // Agrega esto para inspeccionar lo recibido
    console.log("Datos recibidos del formulario:");
    console.log(request.body);

    await edit_Colab.updateById(id);
    await edit_equipo.updateById(id);

    // Guardamos en sesión los datos para mostrar el SweetAlert
    request.session.successData = {
      updated: true,
      nombre: request.body.nombre,
      apellidos: request.body.apellidos
    };

    response.redirect("/view_collabs");
  } catch (error) {
    console.error("Error al actualizar colaborador:", error);
    response.redirect("/view_collabs?error=true");
  }
};
