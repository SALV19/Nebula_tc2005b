const db = require("../util/database");

module.exports = class Requests {
  constructor(colab_email, type, dates, location, reason, evidence, request_id) {
    this.colab_email = colab_email;
    this.type = type;
    this.dates = dates;
    this.location = location;
    this.reason = reason;
    this.evidence = evidence;
    this.request_id = request_id
  }
  static postConstructor(colab_email, type, dates, location, reason, evidence) {
    return new Requests(colab_email, type, dates, location, reason, evidence, null)
  }
  static updateConstructor(colab_email, type, dates, location, reason, evidence, request_id) {
    return new Requests(colab_email, type, dates, location, reason, evidence, request_id)
  }

  // Save the main request
  save(estado) {
    return db.execute(
      `INSERT INTO solicitudes_falta(id_colaborador, estado, tipo_falta, descripcion, ubicacion, evidencia) 
        VALUES((
          SELECT id_colaborador 
          FROM colaborador 
          WHERE email = ?
        ), ?, ?, ?, ?, ?)`,
      [
        this.colab_email,
        estado,
        this.type,
        this.reason,
        this.location,
        this.evidence
      ]
    );
  }

  update() {
    const dates = this.dates.join(',')
    console.log(this.request_id, this.type, this.reason, this.location, this.evidence, dates)
    return db.execute(
      `CALL update_abscence_request(?, ?, ?, ?, ?, ?)`,
      [this.request_id, this.type, this.reason, this.location, this.evidence, dates]
    )
  }

  // Save each individual date of the request
  saveDates(id, idx) {
    return db.execute(
      `INSERT INTO dias_solicitados(id_solicitud_falta, fecha)
                      VALUES (?, ?)`,
      [id, this.dates[idx]]
    );
  }

  // Approved days (no specific type)
  static async fetchDaysApproved(email) {
    return db.execute(
      `SELECT ds.fecha
                        FROM solicitudes_falta sf
                        INNER JOIN dias_solicitados ds
                          ON sf.id_solicitud_falta = ds.id_solicitud_falta
                        INNER JOIN colaborador c
                          ON c.id_colaborador = sf.id_colaborador
                        WHERE c.email = ? AND sf.estado = 1;
                      `,
      [email]
    );
  }

    // pending days (no specific type)
    static async fetchDaysPending(email) {
      return db.execute(
        `SELECT ds.fecha
                          FROM solicitudes_falta sf
                          INNER JOIN dias_solicitados ds
                            ON sf.id_solicitud_falta = ds.id_solicitud_falta
                          INNER JOIN colaborador c
                            ON c.id_colaborador = sf.id_colaborador
                          WHERE c.email = ? AND sf.estado = 0;
                        `,
        [email]
      );
    }

  // Get approved vacation days
  static async fetchApprovedVacationDays(email) {
    return db.execute(`
      SELECT ds.fecha
      FROM solicitudes_falta sf
      JOIN dias_solicitados ds ON sf.id_solicitud_falta = ds.id_solicitud_falta
      JOIN colaborador c ON c.id_colaborador = sf.id_colaborador
      WHERE c.email = ? AND sf.estado = 1 AND sf.tipo_falta = 'Vacation'
    `, [email]);
  }

  // Get pending vacation days
  static async fetchPendingVacationDays(email) {
    return db.execute(`
      SELECT ds.fecha
      FROM solicitudes_falta sf
      JOIN dias_solicitados ds ON sf.id_solicitud_falta = ds.id_solicitud_falta
      JOIN colaborador c ON c.id_colaborador = sf.id_colaborador
      WHERE c.email = ? AND sf.estado = 0 AND sf.tipo_falta = 'Vacation'
    `, [email]);
  }

  static async fetchTeamRequests(email, offset, filter = null) {
    if (!filter) {
      return db.execute(
        `SELECT c.nombre, c.apellidos, sf.*, MIN(ds.fecha) AS start, MAX(ds.fecha) AS end
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
                        ORDER BY sf.estado ASC, ds.fecha ASC
                        LIMIT 10 OFFSET ?
                        `,
        [email, offset]
      );
    } else {
      let query = `SELECT c.nombre, c.apellidos, sf.*, MIN(ds.fecha) AS start, MAX(ds.fecha) AS end
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
                  `;
      if (filter.pending) {
        query += `AND sf.estado = 0 `;
        if (filter.accepted) {
          query += `OR sf.estado = 1 `;
        }
        if (filter.denied) {
          query += `OR sf.estado = 2 `;
        }
      } else if (filter.accepted) {
        query += `AND sf.estado = 1 `;
        if (filter.denied) {
          query += `OR sf.estado = 2 `;
        }
      } else if (filter.denied) {
        query += `AND sf.estado = 2 `;
      }
      query += "GROUP BY sf.id_solicitud_falta ";
      if (filter.start_date) {
        query += `HAVING MIN(ds.fecha) >= '${filter.start_date}' `;
        if (filter.end_date) {
          query += `AND MAX(ds.fecha) <= '${filter.end_date}' `;
        }
      } else if (filter.end_date) {
        query += `HAVING MAX(ds.fecha) <= '${filter.end_date}' `;
      }
      query += `ORDER BY sf.estado ASC, ds.fecha ASC
                LIMIT 10 OFFSET ?`;
      return db.execute(query, [email, offset]);
    }
  }
  static async fetchAllRequests(offset, filter = null) {
    if (!filter) {
      return db.execute(
        `SELECT c.nombre, c.apellidos, sf.*, MIN(ds.fecha) AS start, MAX(ds.fecha) AS end
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
                        ORDER BY sf.estado ASC, ds.fecha ASC
                        LIMIT 10 OFFSET ?`,
        [offset || 0]
      );
    } else {
      let query = `SELECT c.nombre, c.apellidos, sf.*, MIN(ds.fecha) AS start, MAX(ds.fecha) AS end
                  FROM solicitudes_falta sf
                  JOIN dias_solicitados ds
                    ON ds.id_solicitud_falta = sf.id_solicitud_falta
                  JOIN colaborador c
                    ON c.id_colaborador = sf.id_colaborador
                  JOIN equipo e 
                    ON e.id_colaborador = c.id_colaborador
                  JOIN departamento d
                    ON d.id_departamento = e.id_departamento
                  `;
      if (filter.pending) {
        query += `AND sf.estado = 0 `;
        if (filter.accepted) {
          query += `OR sf.estado = 1 `;
        }
        if (filter.denied) {
          query += `OR sf.estado = 2 `;
        }
      } else if (filter.accepted) {
        query += `AND sf.estado = 1 `;
        if (filter.denied) {
          query += `OR sf.estado = 2 `;
        }
      } else if (filter.denied) {
        query += `AND sf.estado = 2 `;
      }
      query += "GROUP BY sf.id_solicitud_falta ";
      if (filter.start_date) {
        query += `HAVING MIN(ds.fecha) >= '${filter.start_date}' `;
        if (filter.end_date) {
          query += `AND MAX(ds.fecha) <= '${filter.end_date}' `;
        }
      } else if (filter.end_date) {
        query += `HAVING MAX(ds.fecha) > '${filter.start_date}' `;
      }
      query += `ORDER BY sf.estado ASC, ds.fecha ASC
                LIMIT 10 OFFSET ?`;

      return db.execute(query, [offset]);
    }
  }

  static async fetchRequests(email, offset, filter = null) {
    if (email) {
      return Requests.fetchTeamRequests(email, offset, filter ? filter : null);
    } else {
      return Requests.fetchAllRequests(offset, filter);
    }
  }

  static async save_State(estado, id_solicitud_falta, colabAprobador) {
    try {
      const [result] = await db.execute(
        `UPDATE solicitudes_falta 
         SET estado = ?, colabAprobador = ? 
         WHERE id_solicitud_falta = ?`,
        [estado, colabAprobador, id_solicitud_falta]
      );
      return result;
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      throw error;
    }
  }

  static async getNotificationData(id_solicitud_falta) {
    try {
      const [rows] = await db.execute(
        `SELECT c.nombre, c.telefono, sf.tipo_falta, MIN(ds.fecha) AS start_date
         FROM solicitudes_falta sf
         JOIN colaborador c ON c.id_colaborador = sf.id_colaborador
         JOIN dias_solicitados ds ON ds.id_solicitud_falta = sf.id_solicitud_falta
         WHERE sf.id_solicitud_falta = ?
         GROUP BY c.nombre, c.telefono, sf.tipo_falta`,
        [id_solicitud_falta]
      );
      return rows[0];
    } catch (error) {
      console.error("Error al obtener datos para notificación:", error);
      throw error;
    }
  }

  static fetchVacations(collab_id, offset, filter = null) {
    return db.execute(`SELECT sf.*, MIN(ds.fecha) AS start, MAX(ds.fecha) AS end
                      FROM solicitudes_falta sf
                      INNER JOIN colaborador c
                        ON c.id_colaborador = sf.id_colaborador
                      INNER JOIN dias_solicitados ds
                        ON sf.id_solicitud_falta = ds.id_solicitud_falta
                      WHERE sf.tipo_falta = 'Vacation'
                      AND sf.id_colaborador = ?
                      GROUP BY sf.id_solicitud_falta;`, [collab_id]);
  }
  static fetchAbscences(collab_id, offset, filter = null) {
    return db.execute(`SELECT sf.*, MIN(ds.fecha) AS start, MAX(ds.fecha) AS end
                      FROM solicitudes_falta sf
                      INNER JOIN colaborador c
                        ON c.id_colaborador = sf.id_colaborador
                      INNER JOIN dias_solicitados ds
                        ON sf.id_solicitud_falta = ds.id_solicitud_falta
                      WHERE sf.tipo_falta <> 'Vacation'
                      AND sf.id_colaborador = ?
                      GROUP BY sf.id_solicitud_falta;`, [collab_id]);
  }

  
  
};
