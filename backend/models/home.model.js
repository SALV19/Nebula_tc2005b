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
}

