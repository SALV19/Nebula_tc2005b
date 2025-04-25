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
            return db.execute(`
                SELECT ds.fecha
                FROM solicitudes_falta sf
                INNER JOIN dias_solicitados ds
                    ON sf.id_solicitud_falta = ds.id_solicitud_falta
                INNER JOIN colaborador c
                    ON c.id_colaborador = sf.id_colaborador
                WHERE c.email = ? AND sf.estado = 1 AND tipo_falta != 'Vacation' ;
            `, [email])
        }
        else {
            return db.execute(`
                SELECT ds.fecha
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
        const [rows] = await db.execute(`
        SELECT sf.id_solicitud_falta, sf.id_colaborador, sf.estado, MIN(ds.fecha) AS fecha
        FROM solicitudes_falta sf, dias_solicitados ds
        WHERE sf.id_solicitud_falta = ds.id_solicitud_falta
        GROUP BY sf.id_solicitud_falta, sf.estado
        ORDER BY fecha DESC
        LIMIT 8 OFFSET ?`, [offset]);
        return rows;
    }

    static async fetchTeamRequests(email, offset) {
        const [rows] = await db.execute(`
                SELECT  c.email, c.nombre, c.apellidos, sf.*, MIN(ds.fecha) as fecha
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
                GROUP BY sf.id_solicitud_falta, sf.estado
                ORDER BY fecha DESC
                LIMIT 8 OFFSET ?`, [email, email, offset]);
        return rows;
    }

    static async fetchByLoggedColab(offset, id_colaborador) {
        const rows = await db.execute(`
            SELECT sf.id_solicitud_falta, sf.id_colaborador, sf.estado, MIN(ds.fecha) AS fecha
            FROM solicitudes_falta sf
            JOIN dias_solicitados ds
            ON sf.id_solicitud_falta = ds.id_solicitud_falta
            WHERE sf.id_colaborador = ?
            GROUP BY sf.id_solicitud_falta, sf.estado 
            ORDER BY fecha DESC
            LIMIT 8 OFFSET ?
            `,
            [id_colaborador, offset]
        );
        return rows[0];
    }

    static async fetchAdmsFaults(id_colaborador){
        return db.execute(`SELECT COUNT(id_fa) AS FaltasAdministrativas 
                        FROM fa WHERE id_colaborador = ?`, [id_colaborador]);
    }

    static async metric_month(){
        const counter = await db.execute(`
            SELECT 
                (
                    (
                        SELECT COUNT(*) 
                        FROM colaborador c 
                        WHERE fechaSalida BETWEEN CURRENT_DATE - INTERVAL 1 MONTH AND CURRENT_DATE 
                        AND fechaSalida IS NOT NULL
                    ) 
                    / 
                    (
                        (
                            SELECT COUNT(*) 
                            FROM colaborador c 
                            WHERE fechaIngreso <= CURRENT_DATE - INTERVAL 1 MONTH 
                            AND (fechaSalida IS NULL OR fechaSalida > CURRENT_DATE - INTERVAL 1 MONTH)
                        )
                        +
                        (
                            SELECT COUNT(*) 
                            FROM colaborador c 
                            WHERE fechaIngreso <= CURRENT_DATE 
                            AND (fechaSalida IS NULL OR fechaSalida > CURRENT_DATE)
                        )
                    ) / 2.0
                ) * 100 AS indice_rotacion;
        `)
        return counter[0];
    }
    static async metric_trimester(){
        const counter = await db.execute(`
            SELECT 
                (
                    (
                        SELECT COUNT(*) 
                        FROM colaborador c 
                        WHERE fechaSalida BETWEEN CURRENT_DATE - INTERVAL 3 MONTH AND CURRENT_DATE 
                        AND fechaSalida IS NOT NULL
                    ) 
                    / 
                    (
                        (
                            SELECT COUNT(*) 
                            FROM colaborador c 
                            WHERE fechaIngreso <= CURRENT_DATE - INTERVAL 3 MONTH 
                            AND (fechaSalida IS NULL OR fechaSalida > CURRENT_DATE - INTERVAL 3 MONTH)
                        )
                        +
                        (
                            SELECT COUNT(*) 
                            FROM colaborador c 
                            WHERE fechaIngreso <= CURRENT_DATE 
                            AND (fechaSalida IS NULL OR fechaSalida > CURRENT_DATE)
                        )
                    ) / 2.0
                ) * 100 AS indice_rotacion;
            `)
        return counter[0];
    }

    static async metric_semester(){
        const counter = await db.execute(`
            SELECT 
            (
                (
                    SELECT COUNT(*) 
                    FROM colaborador c 
                    WHERE fechaSalida BETWEEN CURRENT_DATE - INTERVAL 6 MONTH AND CURRENT_DATE 
                    AND fechaSalida IS NOT NULL
                ) 
                / 
                (
                        (
                            SELECT COUNT(*) 
                            FROM colaborador c 
                            WHERE fechaIngreso <= CURRENT_DATE - INTERVAL 6 MONTH 
                            AND (fechaSalida IS NULL OR fechaSalida > CURRENT_DATE - INTERVAL 6 MONTH)
                        )
                        +
                        (
                            SELECT COUNT(*) 
                            FROM colaborador c 
                            WHERE fechaIngreso <= CURRENT_DATE 
                            AND (fechaSalida IS NULL OR fechaSalida > CURRENT_DATE)
                        )
                ) / 2.0
            ) * 100 AS indice_rotacion;
        `)        
        return counter[0];                                      
    }
    static async metric_anually(){
        const counter = await db.execute(`
            SELECT 
                (
                    (
                        SELECT COUNT(*) 
                        FROM colaborador c 
                        WHERE fechaSalida BETWEEN CURRENT_DATE - INTERVAL 12 MONTH AND CURRENT_DATE 
                        AND fechaSalida IS NOT NULL
                    ) 
                    / 
                    (
                            (
                                SELECT COUNT(*) 
                                FROM colaborador c 
                                WHERE fechaIngreso <= CURRENT_DATE - INTERVAL 12 MONTH 
                                AND (fechaSalida IS NULL OR fechaSalida > CURRENT_DATE - INTERVAL 12 MONTH)
                            )
                            +
                            (
                                SELECT COUNT(fechaIngreso) AS total_colaboradores_activos 
                                FROM colaborador c 
                                WHERE fechaSalida IS NULL
                            )
                    ) / 2.0
                ) * 100 AS indice_rotacion;
        `)
        return counter[0];
    }

    static async h_Rate_M(){
        const percentage = await db.execute(`
        SELECT 
            AVG(porcentaje_colaborador)  as percentage
        FROM (
            SELECT  
                es.id_colaborador AS collab,
                COUNT(es.id_evaluacion) AS eval,
                ((AVG(mi.valor_metrica) / 5) * 100)  AS porcentaje_colaborador
            FROM 
                evaluaciones_de_seguimiento es
            INNER JOIN  
                metrica_indicadores mi ON es.id_evaluacion = mi.id_evaluacion
            WHERE  
                es.fechaAgendada BETWEEN CURRENT_DATE - INTERVAL 1 MONTH AND CURRENT_DATE
            GROUP BY es.id_colaborador
        ) AS promedios;
        `)
        return percentage[0];
    }
    static async h_rate_T(){
        const percentage = await db.execute(`
            SELECT 
                AVG(porcentaje_colaborador)  as percentage
            FROM (
                SELECT  
                    es.id_colaborador AS collab,
                    COUNT(es.id_evaluacion) AS eval,
                    ((AVG(mi.valor_metrica) / 5) * 100) AS porcentaje_colaborador
                FROM 
                    evaluaciones_de_seguimiento es
                INNER JOIN  
                    metrica_indicadores mi ON es.id_evaluacion = mi.id_evaluacion
                WHERE  
                    es.fechaAgendada BETWEEN CURRENT_DATE - INTERVAL 3 MONTH AND CURRENT_DATE
                GROUP BY es.id_colaborador
            ) AS promedios;
        `)
        return percentage[0];
    }
    static async h_Rate_S(){
        const percentage = await db.execute(`
            SELECT 
                AVG(porcentaje_colaborador)  as percentage
            FROM (
                SELECT  
                    es.id_colaborador AS collab,
                    COUNT(es.id_evaluacion) AS eval,
                    ((AVG(mi.valor_metrica) / 5) * 100)  AS porcentaje_colaborador
                FROM 
                    evaluaciones_de_seguimiento es
                INNER JOIN  
                    metrica_indicadores mi ON es.id_evaluacion = mi.id_evaluacion
                WHERE  
                    es.fechaAgendada BETWEEN CURRENT_DATE - INTERVAL 6 MONTH AND CURRENT_DATE
                GROUP BY es.id_colaborador
            ) AS promedios;


        `)
        return percentage[0];
    }
    static async h_Rate_Y(){
        const percentage = await db.execute(`
           SELECT 
                AVG(porcentaje_colaborador)  as percentage
            FROM (
                SELECT  
                    es.id_colaborador AS collab,
                    COUNT(es.id_evaluacion) AS eval,
                    ((AVG(mi.valor_metrica) / 5) * 100) AS porcentaje_colaborador
                FROM 
                    evaluaciones_de_seguimiento es
                INNER JOIN  
                    metrica_indicadores mi ON es.id_evaluacion = mi.id_evaluacion
                WHERE  
                    es.fechaAgendada BETWEEN CURRENT_DATE - INTERVAL 12 MONTH AND CURRENT_DATE
                GROUP BY es.id_colaborador
            ) AS promedios;
        `)
        return percentage[0];
    }
}

