const Colaborador = require("../models/collabs.model");
const Departamento = require("../models/departamento.model");
const Empresa = require("../models/empresa.model");
const Equipo = require("../models/equipo.model");
const Rol = require("../models/rol.model");
const Requests = require("../models/home.model");
const fs = require('fs');
const FaltaAdministrativa = require("../models/fa.model")

const {google} = require('googleapis');

const {contVac} = require('../util/contVacations')

const generator = require("generate-password-browser");
const { off } = require("../util/database");

let settings = {
  selectedOption: "active",
};

exports.get_collabs = async (request, response) => {
  try {
    const [collabsDataPues, collabsDataMod, depData, rolData] =
      await Promise.all([
        Colaborador.fetchAllColabPues(),
        Colaborador.fetchAllColabMod(),
        Departamento.fetchAllDep(),
        // Empresa.fetchAllEmp(),
        Rol.fetchAllRol(),
      ]);

    const [rowsColP, fieldDataColPues] = collabsDataPues;
    const [rowsColM, fieldDataColMod] = collabsDataMod;
    const [rowsDep, fieldDataDep] = depData;
    const [rowsRol, fieldDataRol] = rolData;
    const empresa = rowsDep.reduce(
      (accum, emp_dep) => {
        if (!accum.has(emp_dep.nombre_empresa)) {
          accum.set(emp_dep.nombre_empresa, [{departamento: emp_dep.nombre_departamento, id: emp_dep.id_departamento}])
        }
        else {
          accum.get(emp_dep.nombre_empresa).push({departamento: emp_dep.nombre_departamento, id: emp_dep.id_departamento})
        }
        return accum
      },
      new Map()
    )

    const successData = request.session.successData;
    request.session.successData = null;

    const successDataUpdate = request.session.successDataUpdate;
    request.session.successDataUpdate = null;
    
    response.render("collabs", {
      ...settings,
      permissions: request.session.permissions,
      csrfToken: request.csrfToken(),
      puesto: rowsColP,
      modalidad: rowsColM,
      empresa: empresa,
      // departamento: rowsDep,
      rol: rowsRol,
      successData,
      successDataUpdate,
      errorMessage: null,
    });
  } catch (error) {
    console.error(error);
    response.redirect("/view_collabs?error=true");
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

      console.log("ID DEPT0",request.body.id_departamento)
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
      response.redirect("/view_collabs?error=true&message=ER_DUP_ENTRY");
    });
};

exports.get_collabs_info = async (request, response) => {
  const offset = request.body.offset * 10;
  const filter = request.body.filter;
  let collabs;
  let diasDisponibles_Totales, abscences;

  if (request.session.permissions.includes('consult_all_collabs')) {
    [collabs] = await Colaborador.fetchCollabs(null, offset, filter)
      .then((data) => data)
      .catch((e) => console.error(e));

    abscences = await Promise.all(collabs.map(async (c) => {
      const abscences = await Requests.fetchDaysApproved(null, id=c.id_colaborador)
        .then(data => data[0])
        .catch(e => {
          console.error("Error fetching approved absences:", e);
          return [];
        });
        return abscences.length
    }))
    diasDisponibles_Totales = await Promise.all(collabs.map(async (c) => {
                        const dias_disponibles_totales = await contVac(null, null, colab_id=c.id_colaborador)
                          .then((e) => {
                            return e
                          })
                        return dias_disponibles_totales
                      }))
                    
  }
  else {
    [collabs] = await Colaborador.fetchCollabs(request.session.email, offset, filter)
      .then((data) => data)
      .catch((e) => console.error(e));
    abscences = await Promise.all(collabs.map(async (c) => {
      const abscences = await Requests.fetchDaysApproved(null, id=c.id_colaborador)
        .then(data => data[0])
        .catch(e => {
          console.error("Error fetching approved absences:", e);
          return [];
        });
        return abscences.length
    }))
    diasDisponibles_Totales = await Promise.all(collabs.map(async (c) => {
      const aaaa = await contVac(null, null, colab_id=c.id_colaborador)
        .then((e) => {
          return e
        })
      return aaaa
    })) 
  }
  
  response.json({
    selectedOption: "Active",
    collabs: collabs,
    diasDisponibles_Totales: diasDisponibles_Totales,
    abscences,
  });
};
exports.get_inactive = async (request, response) => {
  const offset = request.body.offset * 10;
  const filter = request.body.filter;
  let collabs;
  let diasDisponibles_Totales, abscences;

  if (request.session.permissions.includes('consult_all_collabs')) {
    [collabs] = await Colaborador.fetchInactiveCollabs(null, offset, filter)
      .then((data) => data)
      .catch((e) => console.error(e));

    abscences = await Promise.all(collabs.map(async (c) => {
      const abscences = await Requests.fetchDaysApproved(null, id=c.id_colaborador)
        .then(data => data[0])
        .catch(e => {
          console.error("Error fetching approved absences:", e);
          return [];
        });
        return abscences.length
    }))
    diasDisponibles_Totales = await Promise.all(collabs.map(async (c) => {
                        const dias_disponibles_totales = await contVac(null, null, colab_id=c.id_colaborador)
                          .then((e) => {
                            return e
                          })
                        return dias_disponibles_totales
                      }))
                    
  }
  else {
    [collabs] = await Colaborador.fetchCollabs(request.session.email, offset, filter)
      .then((data) => data)
      .catch((e) => console.error(e));
    abscences = await Promise.all(collabs.map(async (c) => {
      const abscences = await Requests.fetchDaysApproved(null, id=c.id_colaborador)
        .then(data => data[0])
        .catch(e => {
          console.error("Error fetching approved absences:", e);
          return [];
        });
        return abscences.length
    }))
    diasDisponibles_Totales = await Promise.all(collabs.map(async (c) => {
      const aaaa = await contVac(null, null, colab_id=c.id_colaborador)
        .then((e) => {
          return e
        })
      return aaaa
    })) 
  }
  
  response.json({
    selectedOption: "Active",
    collabs: collabs,
    diasDisponibles_Totales: diasDisponibles_Totales,
    abscences,
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
      request.body.rfc,
    );

    const edit_equipo = new Equipo(
      request.body.id_departamento,
      request.body.id_rol
    );

    // Agrega esto para inspeccionar lo recibido

    await edit_Colab.updateById(id);
    await edit_equipo.updateById(id);

    // Guardamos en sesión los datos para mostrar el SweetAlert
  
    const rolMap = {
      1: "Collaborator",
      2: "Lider",
      3: "Super Admin"
    };

    const modalidadMap = {
      0: "In-person",
      1: "Hybrid",
      2: "Remote"
    };

    // Crea un objeto resumen
    request.session.successDataUpdate = {
      nombre: request.body.nombre,
      apellidos: request.body.apellidos,
      puesto: request.body.puesto,
      email: request.body.email,
      telefono: request.body.telefono,
      rfc: request.body.rfc,
      curp: request.body.curp,
      entryDate: request.body.fechaIngreso,
      birthday: request.body.fechaNacimiento,
      ubicacion: request.body.ubicacion,
      modalidad: modalidadMap[request.body.modalidad],
      rol: rolMap[request.body.id_rol],
    };

    response.redirect("/view_collabs");
  } catch (error) {
    console.error("Error al actualizar colaborador:", error);
    response.redirect("/view_collabs?error=true");
  }
};

exports.uploadFA = async (request, response)=> {
  console.log("Llego a la funcion upload")

  const { file } = request;
  const my_file = file

  //Validar tipo de archivo
  const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (!allowedTypes.includes(my_file.mimetype)) {
    return response.status(400).json({ success: false, message: 'Solo se permiten archivos PDF o DOCX' });
  }

  console.log(my_file)

  const googleLogin = request.user?.accessToken ? 1 : 0;

  if (googleLogin == 1) {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID, 
      process.env.GOOGLE_CLIENT_SECRET, 
      process.env.REDIRECT
      // 'http://localhost:3000/log_in/success'
    );
    
    oauth2Client.setCredentials({
      access_token: request.user.accessToken 
    });

    const drive = google.drive({version: 'v3', auth: oauth2Client});
    const id_fa = request.body.id_fa;
    // Nombre para evitar duplicados
    const fileName = `${id_fa}_${Date.now()}_${my_file.originalname}`; 

    const requestBody = {
      name: fileName,  
      fields: 'id, name, webViewLink, mimeType',
    };

    const media = {
      mimeType: my_file.mimetype,
      body: fs.createReadStream(my_file.path),
    };

    try {
      const fileUploaded = await drive.files.create({
        requestBody,
        media: media,
      });

      //Borra el archivo Temporal
      fs.unlinkSync(my_file.path);

      // Respuesta al frontend
      
      // Construye el enlace de visualización manualmente
      const fileId = fileUploaded.data.id;
      const fileLink = `https://drive.google.com/file/d/${fileId}/view`;

      // Respuesta al frontend
      // console.log('File ID:', fileId);
      // console.log('Link:', fileLink);
    
      await FaltaAdministrativa.updateLink(id_fa, fileLink);

      return response.json({
        success: true,
        fileId: fileId,
        name: fileUploaded.data.name,
        mimeType: fileUploaded.data.mimeType,
        viewLink: fileLink,
      });
      // return file.data;
    } catch (err) {
      console.error("Error al subir a Drive:", err);
      return response.status(500).json({ success: false, message: 'Error al subir archivo a Drive' });
    }
  } else {
      return response.status(403).json({ success: false, message: 'No estás autenticado con Google' });
  }
};
exports.get_faults = async (request, response) => {
  const offset = request.body.offset * 10;
  // console.log("Offsets: ", offset);
  
  const filter = request.body.filter;
  // console.log("Filtro", filter);

  const ids = await Colaborador.fetchPaginatedCollabIds(offset, filter);

  const rows = await Colaborador.fetchFaultsCollabsByIds(ids);

  const faults = await Colaborador.fetchAllFaults();

  // console.log("Total IDs obtenidos:", ids.length); 
  // console.log("Total rows devueltos por fetchFaultsCollabsByIds:", rows.length); 

  const map = {};
  rows.forEach(c => {
    map[c.id_colaborador] = {
      ...c,
      faltas: [],
    };
  });

  faults.forEach(f => {
    if (map[f.id_colaborador]) {
      map[f.id_colaborador].faltas.push({
        id_fa: f.id_fa,
        motivo: f.motivo,
        fecha: f.fecha,
        link: f.link
      });
    }
  });

  const resultado = Object.values(map);

  response.json({
    selectedOption: 'Faults',
    permissions: request.session.permissions,
    faults : resultado,
  });
}

exports.delete_Collab = async (request, response) => {
  try {
    const id_colaborador = request.body.valor;
    const result = await Colaborador.deleteCollab(id_colaborador);

    response.json({
      success: true,
      message: `Colaborador eliminado correctamente.`,
      result,
    })
  } catch (error) {
    console.error("Error al eliminar colaborador:", error);

    response.json({
      success: false, 
      error: 'Error al eliminar colaborador.' 
    })
  }
}

