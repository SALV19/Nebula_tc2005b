const Requests = require("../models/requests.model");
const Events = require("../models/events.model");
const Equipo = require("../models/equipo.model");
const {contVac} = require("../util/contVacations");
const { request, response } = require("express");


exports.update_estado = async (req, res) => {
  Requests.save_State(req.body.estado, req.body.id_solicitud_falta);
  res.redirect("/requests");
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
    });
  } catch (e) {
    console.error("Error en showPopUp:", e);
    response.status(500).json({ 
      error: "Error al obtener datos para el pop-up" 
    });
  }
};



exports.get_collabs_requests = async (request, response) => {
  const offset = request.body.offset * 10;
  const filter = request.body.filter;
  const requests = await Requests.fetchRequests(
    request.session.email,
    offset,
    filter
  )
    .then((data) => data)
    .catch((e) => console.error(e));
  response.json({
    selectedOption: "requests",
    requests: requests,
  });
};

exports.get_vacations = (request, response) => {
  settings.selectedOption = "vacations";
  response.json({
    selectedOption: settings.selectedOption,
  });
};

exports.get_abscences = (request, response) => {
  settings.selectedOption = "vacations";

  response.json({
    selectedOption: settings.selectedOption,
  });
};

exports.post_abscence_requests = async (request, response, next) => {
  const daysOff = JSON.parse(request.body.validDays);
  const [type, subtype] = request.body.requestType.split("|");

  let estadoSolicitud = 0;

  try {
    // Obtener el rol del colaborador
    const [rolData] = await Equipo.fetchRolByEmail(request.session.email);
    const idRol = rolData[0]?.id_rol;

    if (idRol === 3) {
      estadoSolicitud = 1;
    }

    // Crear solicitud
    const request_register = new Requests(
      request.session.email,
      subtype,
      daysOff,
      request.body.location,
      request.body.description,
      request.body.evidence,
      estadoSolicitud
    );

    // Guardar solicitud (simula error si quieres probar)
    const result = await request_register.save(estadoSolicitud);
    //throw new Error("Simulación de error de servidor"); // <- solo si quieres forzar error

    for (let i in daysOff) {
      await request_register.saveDates(result[0].insertId, i);
    }

    // Si todo sale bien
    request.session.successRequest = {
      startDate: daysOff[0],
      endDate: daysOff[daysOff.length - 1],
      location: request.body.location,
      description: request.body.description,
      evidence: request.body.evidence,
      totalDays: daysOff.length,
    };

  } catch (error) {
    console.error("Error al guardar solicitud:", error);
    request.session.errorRequest = true;
  }

  // Redirige solo una vez, sin importar si hubo error o éxito
  response.redirect("/requests");
};
