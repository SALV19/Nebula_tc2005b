const db = require('../util/database');

module.exports = class SolicitudFalta {
    constructor(id_solicitdFalta, tipo_falta, estado) {
        this.id = id_solicitdFalta;
        this.tipo = tipo_falta; 
        this.estado = estado; 

        }

    static fetchAll(idColaborador){
        return db.execute(`SELECT id_solicitud_falta, tipo_falta, estado FROM solicitudes_falta 
        WHERE id_colaborador = ?
        AND tipo_falta = "Vacation"
        AND estado = 1`, 
        [idColaborador]);
    }
};