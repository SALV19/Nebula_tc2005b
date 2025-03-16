const db = require("../util/database");

module.exports = class Requests {
  constructor() {

  }

  static async fetchTeamRequests(email) {
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
              WHERE c.email = (?)
            )
            GROUP BY sf.id_solicitud_falta`, [email])
  }
}