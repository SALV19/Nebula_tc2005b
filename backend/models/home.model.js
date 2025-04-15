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
    
    static async fetchReqHome(offset) {
        const [rows] = await db.execute(`SELECT sf.id_solicitud_falta, sf.id_colaborador, sf.estado, ds.fecha
        FROM solicitudes_falta sf, dias_solicitados ds
        WHERE sf.id_solicitud_falta = ds.id_solicitud_falta
        ORDER BY fecha DESC
        LIMIT 8 OFFSET ?`, [offset]);
    
        console.log("Requests: ", rows); // Log the result to verify
        return rows; // Return the rows directly
    }

    static async fetchTeamRequests(email, offset) {
        console.log("Email",email);
        console.log("offset",offset);
        const [rows] = await db.execute(
            `SELECT  c.email, c.nombre, c.apellidos, sf.*, ds.fecha
                FROM solicitudes_falta sf
                JOIN dias_solicitados ds
                ON ds.id_solicitud_falta = sf.id_solicitud_falta
                JOIN colaborador c
                ON c.id_colaborador = sf.id_colaborador
                JOIN equipo e 
                ON e.id_colaborador = c.id_colaborador
                JOIN departamento d
                ON d.id_departamento = e.id_departamento
                WHERE d.nombre_departamento = (
                    SELECT nombre_departamento
                    FROM colaborador c
                    INNER JOIN equipo e
                    ON c.id_colaborador = e.id_colaborador
                    INNER JOIN departamento d
                    ON d.id_departamento = e.id_departamento
                    WHERE c.email = ?
                )
                AND e.id_rol = 1
                AND c.email != ?
                GROUP BY sf.id_solicitud_falta
                ORDER BY sf.estado ASC, ds.fecha ASC
                LIMIT 8 OFFSET ?`, [email, email, offset]);
        console.log("Row:",rows);
        return rows;
    }

    static async fetchByLoggedColab(offset, id_colaborador) {
        const [rows] = await db.execute(
          `SELECT sf.id_solicitud_falta, sf.id_colaborador, sf.estado, MIN(ds.fecha) AS fecha
            FROM solicitudes_falta sf
            JOIN dias_solicitados ds
            ON sf.id_solicitud_falta = ds.id_solicitud_falta
            WHERE sf.id_colaborador = ?
            GROUP BY sf.id_solicitud_falta
            ORDER BY fecha DESC
            LIMIT 8 OFFSET ?
            `,
          [id_colaborador, offset]
        );
        console.log("Rows: ", rows);
        return rows;
    }
}

