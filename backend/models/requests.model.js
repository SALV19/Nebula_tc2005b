const db = require("../util/database");

module.exports = class Requests {
  constructor() {

  }
  static async fetchTeamRequests(email, offset, filter=null) {
    if (!filter) {
      return db.execute(`SELECT c.nombre, c.apellidos, sf.*, MIN(ds.fecha) AS start, MAX(ds.fecha) AS end
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
                        GROUP BY sf.id_solicitud_falta
                        ORDER BY sf.estado ASC
                        LIMIT 10 OFFSET ?
                        `, [email, offset])
    }
    else {
      let query =`SELECT c.nombre, c.apellidos, sf.*, MIN(ds.fecha) AS start, MAX(ds.fecha) AS end
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
                  `
      if (filter.pending) {
        query += `AND sf.estado = 0 `
        if (filter.accepted) {
          query += `OR sf.estado = 1 `
        }
        if (filter.denied) {
          query += `OR sf.estado = 2 `
        }
      }
      else if (filter.accepted) {
        query += `AND sf.estado = 1 `
        if (filter.denied) {
          query += `OR sf.estado = 2 `
        }
      }
      else if (filter.denied) {
        query += `AND sf.estado = 2 `
      }
      query += 'GROUP BY sf.id_solicitud_falta '
      if (filter.start_date) {
        query += `HAVING MIN(ds.fecha) >= '${filter.start_date}' `
        if (filter.end_date) {
          query += `AND MAX(ds.fecha) <= '${filter.end_date}' `
        }
      }
      else if (filter.end_date) {
        query += `HAVING MAX(ds.fecha) > '${filter.start_date}' `
      }
      query += `ORDER BY sf.estado ASC
                LIMIT 10 OFFSET ?`
      
      return db.execute(query, [email, offset])
    }
  }
  static async fetchAllRequests(offset, filter=null) {
    if (!filter) {
      return db.execute(`SELECT c.nombre, c.apellidos, sf.*, MIN(ds.fecha) AS start, MAX(ds.fecha) AS end
                          FROM solicitudes_falta sf
                          JOIN dias_solicitados ds
                            ON ds.id_solicitud_falta = sf.id_solicitud_falta
                          JOIN colaborador c
                            ON c.id_colaborador = sf.id_colaborador
                          JOIN equipo e 
                            ON e.id_colaborador = c.id_colaborador
                          JOIN departamento d
                            ON d.id_departamento = e.id_departamento
                          GROUP BY sf.id_solicitud_falta
                          LIMIT 10 OFFSET ?
                          ORDER BY sf.estado ASC`, [offset ?? 0])
    }
  }

  static async fetchRequests(email, offset, filter=null) {
    if (email) {
      return Requests.fetchTeamRequests(email, offset, filter? filter: null)
    }
    else {
      return Requests.fetchAllRequests(offset, filter)
    }
  }
}