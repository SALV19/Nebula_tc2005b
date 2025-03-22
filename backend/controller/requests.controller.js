const Requests = require("../models/requests.model");

exports.get_requests = (request, response) => {
  
  //await 
  
  response.render("requests_page", {
    selectedOption: "vacations",
    permissions: request.session.permissions,
    //days_off: days_off,
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
  // console.log(requests)
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
  console.log(startDate);
  let start = new Date(startDate);
  const end = new Date(endDate);
  let days = [];
  while (start <= end) {
    let day = start.getDay(); // 0 = Domingo, 6 = Sábado
    if (day !== 5 && day !== 6) {
      console.log(day)
      days.push(new Date(start).toISOString().split('T')[0]);
    }
    start.setDate(start.getDate() + 1); // Siguiente día
  }
  console.log(days)
  return days;
}

exports.post_abscence_requests = async (request, response, next) => {
  console.log(request.body);

  const daysOff = weekendsOff(request.body.startDate, request.body.endDate);
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
