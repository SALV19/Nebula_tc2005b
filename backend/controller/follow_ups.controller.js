const {contVac} = require("../util/contVacations")

exports.get_follow_ups = (request, response) => {
    contVac(request)
    .then(({diasDisponibles,diasTotales}) => {
        response.render("home_page", {diasDisponibles,diasTotales})
    })
    .catch(error => {console.log(error)})
  };
  