const Colaborador = require('../models/collabs.model'); 
const SolicitudFalta = require('../models/solicitud_falta.model'); 
const DiasSolicitados = require('../models/dias_solicitados.model'); 

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

exports.contVac = (request, responsem, colab_id=null) => {
    
    const idColaborador = request?.session.id_colaborador ?? colab_id;
    let diasTotales; 
    let cantDiasSol = 0;
    let diasDisponibles; 
    
    return Colaborador.fetchColabVac(idColaborador)
        .then(([colabVac]) => {
            const fechaIngreso = new Date(colabVac[0].fechaIngreso);
            const fechaActual = new Date();

            let antiguedad = fechaActual.getFullYear() - fechaIngreso.getFullYear();

            const mesActual = fechaActual.getMonth();
            const mesIngreso = fechaIngreso.getMonth();
            const diaActual = fechaActual.getDate();
            const diaIngreso = fechaIngreso.getDate();

            if (mesActual < mesIngreso || (mesActual === mesIngreso && diaActual < diaIngreso)) {
                antiguedad--; 
            }

            diasTotales = calcularDiasVacaciones(antiguedad); 

            return SolicitudFalta.fetchAll(idColaborador);
        })
        .then((solFalt) => {
            if (solFalt[0].length <= 0) {
                return { diasDisponibles: diasTotales, diasTotales };
            }
            const solicitudes = solFalt[0];
            const promises = solicitudes.map(solicitud => {
                return DiasSolicitados.fetchAll(solicitud.id_solicitud_falta)
                    .then((diasSol) => {
                        cantDiasSol += diasSol[0][0].totalDias; 
                    });
            });
            return Promise.all(promises).then(() => {
                diasDisponibles = diasTotales - cantDiasSol;
                console.log("DD: ", { diasDisponibles, diasTotales });
                return { diasDisponibles, diasTotales };
            });
        })
        .catch((error) => {
            console.log(error);
        });
};
