const Requests = require("../models/requests.model");
const Events = require("../models/events.model")

exports.get_requests = async (request, response) => {
  
  const all_requests = await Requests.fetchDaysApproved(request.session.email).then(data => data[0]).catch(e => e);
  const holidays = await Events.fetchEvents().then(data => data[0]).catch(error => error)
  response.render("requests_page", {
    selectedOption: "vacations",
    permissions: request.session.permissions,
    all_requests: all_requests,
    holidays: holidays,
    csrfToken: request.csrfToken(),
  });
};

exports.get_collabs_requests = async (request, response) => {
  settings.selectedOption = "requests";
  const offset = request.body.offset * 10;
  const filter = request.body.filter;
  const requests = await Requests.fetchRequests(
    request.session.email,
    offset,
    filter
  )
    .then((data) => data)
    .catch((e) => console.log(e));
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

function weekendsOff(startDate, endDate) {
  let start = new Date(startDate);
  const end = new Date(endDate);
  let days = [];
  while (start <= end) {
    let day = start.getDay(); // 6 = Domingo, 5 = Sábado
    if (day !== 5 && day !== 6) {
      days.push(new Date(start).toISOString().split('T')[0]);
    }
    start.setDate(start.getDate() + 1); // Siguiente día
  }
  return days;
}

exports.post_abscence_requests = async (request, response, next) => {
  const daysOff = weekendsOff(request.body.startDate, request.body.endDate);
  
  // Validación: si es ausencia y hay más de 3 días hábiles, debe haber evidencia
  if (
    request.body.requestType === "Absence" &&
    daysOff.length > 3 &&
    !request.body.evidence
  ) {
    // Aquí puedes redirigir o mostrar un error
    return response.status(400).send("Se requiere evidencia para ausencias mayores a 3 días hábiles.");
  }
  
  const request_register = new Requests(
    request.session.email,
    request.body.requestType,
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
            console.log(e);
            return e;
          });
        }
      })
      .catch((e) => console.log(e));

  }

  response.redirect("/requests");
};
