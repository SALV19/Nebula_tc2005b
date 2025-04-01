const Requests = require("../models/requests.model");
const Events = require("../models/events.model");

exports.update_estado = async (req, res) => {
  Requests.save_State(req.body.estado, req.body.id_solicitud_falta);
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

exports.get_vacations = async (request, response) => {
  const offset = request.body.offset * 10;
  const filter = request.body.filter;
  const vacations = await Requests.fetchVacations(
    request.session.id_colaborador,
    offset,
    filter
  )
    .then((data) => data)
    .catch((e) => console.error(e));

  response.json({
    selectedOption: "vacations",
    vacations,
  });
};
exports.get_abscences = async (request, response) => {
  const offset = request.body.offset * 10;
  const filter = request.body.filter;
  const abscences = await Requests.fetchAbscences(
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

  //Hacer validaciones en el servidor DESPUES
  // // Validación: si es ausencia y hay más de 3 días hábiles, debe haber evidencia
  // if (
  //   request.body.requestType === "Absence" &&
  //   daysOff.length > 3 &&
  //   !request.body.evidence
  // ) {
  //   // Aquí puedes redirigir o mostrar un error
  //   return response.status(400).send("Se requiere evidencia para ausencias mayores a 3 días hábiles.");
  // }

  const [type, subtype] = request.body.requestType.split("|");

  const request_register = new Requests(
    request.session.email,
    subtype, // <-- Guardamos solo el subtipo
    daysOff,
    request.body.location,
    request.body.description,
    request.body.evidence
  );

  if (true) {
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
      .catch((e) => console.log(e));
  }

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
