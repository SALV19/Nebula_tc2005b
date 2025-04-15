const { response } = require("express");
const Collaborator = require("../models/collabs.model");
const { deploymentmanager } = require("googleapis/build/src/apis/deploymentmanager");
const {contVac} = require("../util/contVacations");
const Requests = require("../models/home.model");

exports.get_personal_info = async (request, response) => {

  const absences = await Requests.fetchDaysApproved(request.session.email)
  .then(data => data[0])
  .catch(e => {
    console.error("Error fetching approved absences:", e);
    return [];
  });
  const faults = await Requests.fetchAdmsFaults(request.session.id_colaborador)
  .then(data => data[0])
  .catch(e => {
    console.error("Error fetching administrative faults:");
    return [];
  }) 

  contVac(request)
  .then(({diasDisponibles,diasTotales, error}) =>{
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


      response.render("personal_info", {
        permissions: request.session.permissions,
        csrfToken: request.csrfToken(),
        diasDisponibles,
        diasTotales,
        error,
        faults: faults.length,
        total_absences: absences.length,
        fullName: fullName, 
        email: rowsC[0].email, 
        rol: rowsC[0].tipo_rol, 
        ubicacion: rowsC[0].ubicacion, 
        puesto: rowsC[0].puesto, 
        departamento: rowsC[0].nombre_departamento, 
        foto: link,
      });
    })
  })

  

  


  
};


  