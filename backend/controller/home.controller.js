const Requests = require("../models/home.model");
const {contVac} = require("../util/contVacations")

exports.get_home = async (request, response) => {

  const {diasDisponibles,diasTotales} = await contVac(request)
  .then(({diasDisponibles,diasTotales}) => {return {diasDisponibles:diasDisponibles,diasTotales:diasTotales}
  })
  .catch(error => {console.log(error)})

  const absences = await Requests.fetchDaysApproved(request.session.email)
    .then(data => data[0])
    .catch(e => {
      console.error("Error fetching approved absences:", e);
      return [];
    });

  //console.log("Absences fetched for", request.session.email, ":", absences);

  response.render("home_page", {
    diasDisponibles,
    diasTotales,
    total_absences: absences.length,
    csrfToken: request.csrfToken(),
  });
}
