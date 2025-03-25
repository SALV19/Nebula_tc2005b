const {contVac} = require("../util/contVacations")

exports.get_home = (request, response, next) => {
    
    contVac(request)
    .then(({diasDisponibles,diasTotales}) => {
        response.render("home_page", {diasDisponibles,diasTotales})
    })
    .catch(error => {console.log(error)})

};
