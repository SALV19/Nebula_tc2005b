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

        const result = await Colaborador.fetchColabVac(idColaborador).then(e=>e).catch(e=>console.log(e))
        const colaborador = result[0]; 
        // console.log(idColaborador)
        // if (!colaborador) {
        //     return request.status(404).send('Colaborador no encontrado');
        // }

        // const fechaIngreso = new Date(colaborador.fechaIngreso);
        // const fechaActual = new Date();

        // const antiguedad = fechaActual.getFullYear() - fechaIngreso.getFullYear();

        // const totalDiasVacaciones = calcularDiasVacaciones(antiguedad);

        // console.log(totalDiasVacaciones);
        
        // const [solicitudes] = await Colaborador.fetchColabVac(idColaborador);

        // let diasTomados = 0;
        // solicitudes.forEach(solicitud => {
        //     diasTomados += solicitud.diasTomados; // Asume que hay una columna 'diasTomados' o similar
        // });

        // const diasRestantes = totalDiasVacaciones - diasTomados;

        // response.render('home_page', {
        //     available_days: diasRestantes,
        //     total_days: totalDiasVacaciones
        // });
    } catch (error) {
        console.log(error);
    }
};
