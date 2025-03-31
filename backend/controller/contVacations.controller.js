const {contVac} = require("../util/contvacations")

exports.get_vacationDays = async (request, response, next) => {
    
    const contadorVacations = await contVac(request)
    .then(data=>{
        console.log(data)
        response.render("home_page", {diasDisponibles:1,diasTotales:2})
    })
    
    .catch(error => {console.log(error)})
};

