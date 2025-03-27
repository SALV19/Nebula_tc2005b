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

exports.contVac = (request, responsem, next) => {
    const idColaborador = request.session.id_colaborador;
    let diasTotales; 
    let cantDiasSol = 0;  // Iniciar en 0 para acumular todos los días solicitados
    let diasDisponibles; 
    
    return Colaborador.fetchColabVac(idColaborador)
        .then(([colabVac]) => {
            const fechaIngresoFormato = new Date(colabVac[0].fechaIngreso).toISOString().slice(0, 10);
            const fechaActualFormato = new Date().toISOString().slice(0, 10);
    
            const fechaIngresoDate = new Date(fechaIngresoFormato); 
            const fechaActualDate = new Date(fechaActualFormato);   
    
            const antiguedad = fechaActualDate.getFullYear() - fechaIngresoDate.getFullYear();
            diasTotales = calcularDiasVacaciones(antiguedad); 
            console.log("colabVac:", colabVac);

            return SolicitudFalta.fetchAll(idColaborador);
        })
        .then((solFalt) => {
            if (solFalt[0].length <= 0) {
                // Si no hay solicitudes, retornar solo los días totales disponibles
                return { diasDisponibles: diasTotales, diasTotales };
            }
            const solicitudes = solFalt[0];
            const promises = solicitudes.map(solicitud => {
                return DiasSolicitados.fetchAll(solicitud.id_solicitud_falta)
                    .then((diasSol) => {
                        cantDiasSol += diasSol[0][0].totalDias;  // Acumular los días solicitados
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

