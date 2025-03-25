const Colaborador = require('../models/collabs.model'); 

function calcularDiasVacaciones(antiguedad) {
    if (antiguedad >= 31) return 32;
    if (antiguedad >= 26) return 30;
    if (antiguedad >= 21) return 28;
    if (antiguedad >= 16) return 26;
    if (antiguedad >= 11) return 24;
    if (antiguedad >= 6) return 22;
    if (antiguedad >= 5) return 20;
    if (antiguedad >= 4) return 18;
    if (antiguedad >= 3) return 16;
    if (antiguedad >= 2) return 14;
    return 12;
}

exports.get_vacationsLeft = async (request, response) => {
    try {
        const idColaborador = request.session.id_colaborador || request.body.id_colaborador;

        const result = await Colaborador.fetchColabVac(idColaborador).then(e=>e).catch(e=>console.error(e))
        const colaborador = result[0]; 
        
    } catch (error) {
        console.error(error);
    }
};
