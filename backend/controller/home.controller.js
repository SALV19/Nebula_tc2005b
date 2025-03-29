const Requests = require("../models/home.model");
const {contVac} = require("../util/contVacations")

exports.get_home = async (request, response, next) => {
  const absences = await Requests.fetchDaysApproved(request.session.email)
  .then(data => data[0])
  .catch(e => {
    console.error("Error fetching approved absences:", e);
    return [];
  });
    contVac(request)
    .then(({diasDisponibles,diasTotales, error}) => {
        response.render("home_page", {
          diasDisponibles,
          diasTotales,
          error,
          permissions: request.session.permissions,
          total_absences: absences.length,
          csrfToken: request.csrfToken(),
        })
    })
    .catch(error => {console.error(error)})

};
