const Requests = require("../models/home.model");
const Events = require("../models/events.model")

const absenceCount = await Requests.fetchAbsenceCount(request.session.email);

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

exports.get_home = async (request, response) => {
  response.render("home_page");
};

