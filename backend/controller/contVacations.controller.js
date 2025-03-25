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

exports.get_vacationDays = (request, response, next) => {
    const idColaborador = request.session.id_colaborador;
    let diasTotales; 
    let cantDiasSol; 
    let diasDisponibles; 
    
    Colaborador.fetchColabVac(idColaborador).then(([colabVac]) => {
        const fechaIngresoFormato = new Date(colabVac[0].fechaIngreso).toISOString().slice(0, 10);
        const fechaActualFormato = new Date().toISOString().slice(0, 10);

        const fechaIngresoDate = new Date(fechaIngresoFormato); 
        const fechaActualDate = new Date(fechaActualFormato);   

        const antiguedad = fechaActualDate.getFullYear() - fechaIngresoDate.getFullYear();
        diasTotales = calcularDiasVacaciones(antiguedad); 
    }).then(() => {
        SolicitudFalta.fetchAll(idColaborador).then((solFalt) => {
            const idSolFalt = solFalt[0].map(solicitud => solicitud.id_solicitud_falta);

            DiasSolicitados.fetchAll(idSolFalt[0]).then((diasSol) => {
                cantDiasSol = diasSol[0][0].totalDias;
                diasDisponibles = diasTotales - cantDiasSol;

                response.render('home_page', {
                    diasDisponibles: diasDisponibles,
                    diasTotales: diasTotales,
                });
            }).catch((error) => {
                console.log(error);
            });
        }).catch((error) => {
            console.log(error);
        });
    }).catch((error) => {
        console.log(error);
    });
};

