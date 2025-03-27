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
    let cantDiasSol; 
    let diasDisponibles; 
    
    const espera =
    Colaborador.fetchColabVac(idColaborador).then(([colabVac]) => {
        const fechaIngresoFormato = new Date(colabVac[0].fechaIngreso).toISOString().slice(0, 10);
        const fechaActualFormato = new Date().toISOString().slice(0, 10);
    
        const fechaIngresoDate = new Date(fechaIngresoFormato); 
        const fechaActualDate = new Date(fechaActualFormato);   
    
        const antiguedad = fechaActualDate.getFullYear() - fechaIngresoDate.getFullYear();
        diasTotales = calcularDiasVacaciones(antiguedad); 
        // console.log("colabVac:",colabVac);

    }).then(() => {
        return SolicitudFalta.fetchAll(idColaborador).then((solFalt) => {
            const idSolFalt = solFalt[0].map(solicitud => solicitud.id_solicitud_falta);
            if (idSolFalt.length <= 0){
                // console.log(diasTotales);
                return({diasDisponibles: diasTotales, diasTotales});
            }
            // console.log("solFatT: ",solFalt);

            return DiasSolicitados.fetchAll(idSolFalt[0]).then((diasSol) => {
                cantDiasSol = diasSol[0][0].totalDias;
                diasDisponibles = diasTotales - cantDiasSol;
                // console.log("diasSol:",diasSol);
                // console.log("DD: ", {diasDisponibles,diasTotales})
                return({diasDisponibles,diasTotales});

            }).catch((error) => {
                console.log(error);
            });
        }).catch((error) => {
            console.log(error);
        });
    }).catch((error) => {
        console.log(error);
    });
    // console.log("espera: ",espera)
    return espera
}
