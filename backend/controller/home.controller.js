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
    .then(({diasDisponibles,diasTotales}) => {
        response.render("home_page", {
          diasDisponibles,
          diasTotales,
          total_absences: absences.length,
          csrfToken: request.csrfToken(),
        })
    })
    .catch(error => {console.log(error)})

};
