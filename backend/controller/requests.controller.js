const Requests = require("../models/requests.model");
const Events = require("../models/events.model");
const Collab = require('../models/collabs.model');
const Equipo = require("../models/equipo.model");
const sendWhatsapp = require('../util/sendWhatsapp'); 
const {contVac} = require("../util/contVacations");
const { request, response } = require("express");

exports.update_estado = async (req, res) => {
  const { estado, id_solicitud_falta } = req.body;
  const idAprobador = req.session.id_colaborador;

  try {
    await Requests.save_State(estado, id_solicitud_falta, idAprobador);

    if (Number(estado) === 1) {
      const info = await Requests.getNotificationData(id_solicitud_falta);

      if (info && info.telefono) {

        const fecha = new Date(info.start_date);
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const año = fecha.getFullYear();
        const fechaFormateada = `${dia}/${mes}/${año}`;
        
        await sendWhatsapp.sendWhatsAppNotiRequests(info.nombre, info.tipo_falta, fechaFormateada, info.telefono);
        console.log("info enviada");
      } else {
        console.warn("No se encontró teléfono del colaborador");
      }
    }
    res.redirect("/requests");
  } catch (error) {
    console.error("Error al actualizar estado y enviar notificación:", error);
    res.status(500).send("Error interno del servidor");
  }
};

exports.get_requests = async (request, response) => {

  const successRequest = request.session.successRequest;
  const errorRequest = request.session.errorRequest;

  delete request.session.successRequest;
  delete request.session.errorRequest;

  response.render("requests_page", {
    successRequest,
    errorRequest,
    selectedOption: "vacations",
    csrfToken: request.csrfToken(),
    permissions: request.session.permissions,
    
    
  });
};

exports.showPopUp = async (request, response) => {
  try {
    const email = request.session.email;

    const [allRequestsData] = await Requests.fetchDaysApproved(email);
    const [allPendingRequests] = await Requests.fetchDaysPending(email);
    const [holidaysData] = await Events.fetchEvents();
    const [approvedVacations] = await Requests.fetchApprovedVacationDays(email);
    const [pendingVacations] = await Requests.fetchPendingVacationDays(email);
    const [colabData] = await Collab.fetchCollabById(request.session.id_colaborador);
    
    const fechaIngreso = colabData[0].fechaIngreso;
    const approvedDays = approvedVacations.length;
    const pendingDays = pendingVacations.length;

    const { diasTotales } = await contVac(request);
    const remainingDays = diasTotales - approvedDays - pendingDays;

    response.json({
      all_requests: allRequestsData,
      pending_requests: allPendingRequests,
      holidays: holidaysData,
      approvedDays,
      pendingDays,
      diasTotales,
      remainingDays,
      fechaIngreso
    });
  } catch (e) {
    console.error("Error en showPopUp:", e);
    response.status(500).json({ 
      error: "Error fetching data for pop-up"
    });
  }
};

exports.get_vacations = async (request, response) => {
  const offset = request.body.offset * 10;
  const filter = request.body.filter;
  const [abscences] = await Requests.fetchVacations(
    request.session.id_colaborador,
    offset,
    filter
  )
    .then((data) => data)
    .catch((e) => console.error(e));

  const acceptance_colab = await Promise.all(abscences.map((e) => {
    if (!e.colabAprobador){
      return 0;
    } 
    return Collab.fetchAllCollabsName(e.colabAprobador).then(([c]) => c)
  }))

  response.json({
    selectedOption: "vacations",
    abscences,
    collab: acceptance_colab,
  });
};

exports.get_abscences = async (request, response) => {
  const offset = request.body.offset * 10;
  const filter = request.body.filter;
  const [abscences] = await Requests.fetchAbscences(
    request.session.id_colaborador,
    offset,
    filter
  )
    .then((data) => data)
    .catch((e) => console.error(e));

  const acceptance_colab = await Promise.all(abscences.map((e) => {
    if (!e.colabAprobador){
      return 0;
    } 
    return Collab.fetchAllCollabsName(e.colabAprobador).then(([c]) => c)
  }))

  response.json({
    selectedOption: "abscences",
    abscences,
    collab: acceptance_colab
  });
};

exports.get_collabs_requests = async (request, response) => {
  const offset = request.body.offset * 10;
  const filter = request.body.filter;
  const requests = await Requests.fetchRequests(
    request.session.permissions.includes('accept_requests') ? null : request.session.email,
    offset,
    filter
  )
    .then((data) => data)
    .catch((e) => console.error(e));
  const acceptance_colab = await Promise.all(requests[0].map((e) => {
    if (!e.colabAprobador){
      return 0;
    } 
    return Collab.fetchAllCollabsName(e.colabAprobador).then(([c]) => c)
  }))

  response.json({
    selectedOption: "requests",
    requests: requests,
    collab : acceptance_colab,
    sesion: request.session,
  });
};

exports.post_abscence_requests = async (request, response, next) => {
  console.log("hola")
  const daysOff = JSON.parse(request.body.validDays);
  const [type, subtype] = request.body.requestType.split("|");

  // Default status is "pending" (0)
  console.log("session", request.session.id_colaborador);
  let estadoSolicitud = 0;
  let colabAprobador;

  try {
     // Get the collaborator's role using their email (session)
    const [rolData] = await Equipo.fetchRolByEmail(request.session.email);
    const idRol = rolData[0]?.id_rol;
    console.log(idRol)

     /**If the role is SuperAdmin (id_rol = 3), automatically approve 
      * And if is lider (id_rol = 3), automatically status = 0.5 */ 
    if (idRol === 3) {
      estadoSolicitud = 1;
      colabAprobador = request.session.id_colaborador;
    } else if (idRol === 2) {
        estadoSolicitud = 0.5;
        colabAprobador = null;
    } else {
        estadoSolicitud = 0;
        colabAprobador = null;
    }

    console.log(estadoSolicitud)
    console.log("colabAprovador: ", colabAprobador);
     // Create a new request with form inputs and the calculated status
    const request_register = new Requests(
      request.session.email,
      subtype,
      daysOff,
      request.body.location,
      request.body.description,
      request.body.evidence,
      estadoSolicitud,
      colabAprobador,
    );
    console.log("Request_register: ", request_register);

    // Save the main request record to the database
    const result = await request_register.save(estadoSolicitud, colabAprobador);
    // Optional: simulate an error here if you want to test
    // throw new Error("Simulated server error");

    // Save each of the individual requested days 
    for (let i in daysOff) {
      await request_register.saveDates(result[0].insertId, i);
    }

    // If everything was successful
    request.session.successRequest = {
      startDate: daysOff[0],
      endDate: daysOff[daysOff.length - 1],
      location: request.body.location,
      description: request.body.description,
      evidence: request.body.evidence,
      totalDays: daysOff.length,
    };

  } catch (error) {
    // If any error occurs during saving
    console.error("Error saving request:", error);
    request.session.errorRequest = true;
  }

  // Always redirect to the main requests page
  response.redirect("/requests");
};

exports.update_request = async (request, response) => {
  // ahora son los realsDaysOff
  const daysOff = JSON.parse(request.body.validDays);  

  const [_ , subtype] = request.body.requestType.split("|");

  const request_update = Requests.updateConstructor(
    request.session.email,
    subtype, 
    daysOff,
    request.body.location,
    request.body.description,
    request.body.evidence,
    request.body.request_id
  );
  // console.log(request_update)
  await request_update.update()

  request.session.successRequest = {
    startDate: daysOff[0],
    endDate: daysOff[daysOff.length - 1],
    location: request.body.location,
    description: request.body.description,
    evidence: request.body.evidence,
    totalDays: daysOff.length,
  };
  response.redirect("/requests");
}