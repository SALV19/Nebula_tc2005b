const db = require('../util/database');

module.exports = class DiasSolicitados {
    constructor(fecha) {
        this.fecha = fecha;
        }

    static fetchAll(id_solicitud_falta){
        return db.execute(`SELECT COUNT(fecha) AS totalDias FROM dias_solicitados WHERE id_solicitud_falta = ?`, [id_solicitud_falta]);
    }
};