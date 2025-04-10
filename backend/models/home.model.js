const db = require("../util/database");

module.exports = class Requests {
    constructor(colab_email, type, dates, location, reason, evidence) {
        this.colab_email = colab_email;
        this.type = type
        this.dates = dates
        this.location = location
        this.reason = reason
        this.evidence = evidence
    }

    static async fetchDaysApproved(email, id=null) {
        if(email) {
            return db.execute(`SELECT ds.fecha
                                FROM solicitudes_falta sf
                                INNER JOIN dias_solicitados ds
                                    ON sf.id_solicitud_falta = ds.id_solicitud_falta
                                INNER JOIN colaborador c
                                    ON c.id_colaborador = sf.id_colaborador
                                WHERE c.email = ? AND sf.estado = 1 AND tipo_falta != 'Vacation' ;
                            `, [email])
        }
        else {
            return db.execute(`SELECT ds.fecha
                FROM solicitudes_falta sf
                INNER JOIN dias_solicitados ds
                    ON sf.id_solicitud_falta = ds.id_solicitud_falta
                INNER JOIN colaborador c
                    ON c.id_colaborador = sf.id_colaborador
                WHERE c.id_colaborador = ? AND sf.estado = 1 AND tipo_falta != 'Vacation' ;
            `, [id])
        }
    }

    static async fetchRequests(id_collab, offset){
        return db.execute(`
            SELECT sf.id_colaborador, sf.fecha, sf.estado
            FROM solicitudes_falta sf, dias_solicitados ds, colaborador c
            INNER JOIN dias_solicitados ds
                ON ds.id_solicitud_falta = sf.id_solicitud_falta
            INNER JOIN solicitades_falta sf
                ON sf.id_colaborador = c.id_colaborador
            WHERE sf.id_colaborador = ?
            LIMIT 7 OFFSET ?`, [id_collab, offset])
    }
}

