const Requests = require("../models/requests.model");
const Events = require("../models/events.model");
const Collab = require('../models/collabs.model');

exports.update_estado = (req, res) => {
  Requests.save_State(req.body.estado, req.body.id_solicitud_falta, req.session.id_colaborador);
  res.redirect("/requests");
};


exports.get_requests = async (request, response) => {
  const all_requests = await Requests.fetchDaysApproved(request.session.email)
    .then((data) => data[0])
    .catch((e) => e);
  const holidays = await Events.fetchEvents()
    .then((data) => data[0])
    .catch((error) => error);

  const successRequest = request.session.successRequest;
  delete request.session.successRequest;

  response.render("requests_page", {
    selectedOption: "vacations",
    permissions: request.session.permissions,
    all_requests: all_requests,
    holidays: holidays,
    csrfToken: request.csrfToken(),
    successRequest, //Para el ejs
  });
};

exports.get_collabs_requests = async (request, response) => {
  const offset = request.body.offset * 10;
  const filter = request.body.filter;
  const [requests] = await Requests.fetchRequests(
    request.session.email,
    offset,
    filter
  )
    .then((data) => data)
    .catch((e) => console.error(e));
  
  const acceptance_colab = await Promise.all(requests.map((e) => {
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

  response.json({
    selectedOption: "abscences",
    abscences,
  });
};

exports.post_abscence_requests = async (request, response, next) => {
  // ahora son los realsDaysOff
  const daysOff = JSON.parse(request.body.validDays);

  const subtype = request.body.requestType;

  const request_register = Requests.postConstructor(
    request.session.email,
    subtype, // <-- Guardamos solo el subtipo
    daysOff,
    request.body.location,
    request.body.description,
    request.body.evidence
  );

  await request_register
    .save()
    .then(async (e) => {
      for (i in daysOff) {
        await request_register
          .saveDates(e[0].insertId, i)
          .then((e) => e)
          .catch((e) => {
            console.error(e);
            return e;
          });
      }
    })
    .catch((e) => console.error(e));

  request.session.successRequest = {
    startDate: daysOff[0],
    endDate: daysOff[daysOff.length - 1],
    location: request.body.location,
    description: request.body.description,
    evidence: request.body.evidence,
    totalDays: daysOff.length,
  };
  response.redirect("/requests");
};

exports.update_request = async (request, response) => {
  // ahora son los realsDaysOff
  const daysOff = JSON.parse(request.body.validDays);  

  const subtype = request.body.requestType;

  const request_update = Requests.updateConstructor(
    request.session.email,
    subtype, 
    daysOff,
    request.body.location,
    request.body.description,
    request.body.evidence,
    request.body.userId
  );

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