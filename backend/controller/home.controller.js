const {contVac} = require("../util/contVacations")

exports.get_home = async (request, response, next) => {
    
    const contadorVacations = await contVac(request)
    .then(data => {
        console.log(data)
        return data
        response.render("home_page", {diasDisponibles,diasTotales})
    })
    
    .catch(error => {console.log(error)})

    console.log(contadorVacations)
};
