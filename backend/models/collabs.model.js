const bodyParser = require('body-parser');
const db = require('../util/database')
module.exports = class Colaborador {
  constructor(
    colab_nombre,
    colab_apellidos,
    colab_fechaNacimiento,
    colab_telefono,
    colab_puesto,
    colab_email,
    colab_fechaIngreso,
    colab_ubicacion,
    colab_modalidad,
    colab_curp,
    colab_rfc
  ) {
    this.nombre = colab_nombre;
    this.apellidos = colab_apellidos;
    this.fechaNacimiento = colab_fechaNacimiento;
    this.telefono = colab_telefono;
    this.puesto = colab_puesto;
    this.email = colab_email;
    this.fechaIngreso = colab_fechaIngreso;
    this.ubicacion = colab_ubicacion;
    this.modalidad = colab_modalidad;
    this.curp = colab_curp;
    this.rfc = colab_rfc;
  }

  static fetchAllCompleteName(){
    return db.execute(`SELECT c.id_colaborador, c.nombre, c.apellidos, d.id_departamento 
                      FROM colaborador c
                      INNER JOIN equipo e
                        ON e.id_colaborador = c.id_colaborador
                      INNER JOIN departamento d
                        ON d.id_departamento = e.id_departamento
                      GROUP BY c.id_colaborador, c.nombre, c.apellidos, d.id_departamento
                      `)
  }


  save(hashedPassword, foto) {
    return db
      .execute(
        `INSERT INTO colaborador (id_colaborador, nombre, apellidos, fechaNacimiento,
          telefono, puesto, email, contrasena, fechaIngreso, ubicacion, modalidad, foto, curp, rfc)
          VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          this.nombre,
          this.apellidos,
          this.fechaNacimiento,
          this.telefono,
          this.puesto,
          this.email,
          hashedPassword,
          this.fechaIngreso,
          this.ubicacion,
          this.modalidad,
          foto,
          this.curp,
          this.rfc,
        ]
      )
      .then(() => {
        return db.execute(
          "SELECT id_colaborador FROM colaborador WHERE email = ?",
          [this.email]
        );
      });
  }

  static fetchAllColabPues() {
    return db.execute(`SELECT DISTINCT puesto FROM colaborador
                      ORDER BY puesto ASC`);
  }
  
  static fetchEmail(id_colaborador) {
    return db.execute(`SELECT email FROM colaborador WHERE id_colaborador = ?`, [id_colaborador]);
  }

  static fetchAllColabMod() {
    return db.execute(`SELECT DISTINCT modalidad FROM colaborador
                      ORDER BY modalidad ASC`);
  }
  static fetchById(idColaborador) {
    return db.execute(
      `SELECT id_colaborador from colaborador WHERE id_colaborador = ?`,
      [idColaborador]
    );
  }
  static fetchColabVac(idColaborador) {
    return db.execute(
      `SELECT sf.id_solicitud_falta, COUNT(ds.fecha) AS diasTomados
      FROM solicitudes_falta sf
      JOIN dias_solicitados ds ON ds.id_solicitud_falta = sf.id_solicitud_falta
      WHERE sf.id_colaborador = ? AND sf.estado = "1"
      GROUP BY sf.id_solicitud_falta`,
      [idColaborador]
    );
  }
  static async fetchTeamCollabs(email, offset, filter = null) {
    if (!filter) {
      return db.execute(`SELECT  c.id_colaborador, c.nombre, c.apellidos, 
        c.fechaNacimiento, c.telefono, c.puesto, c.email, 
        c.fechaIngreso, c.fechaSalida, c.ubicacion, 
        c.modalidad, c.foto, c.curp, c.rfc, c.estado,
        d.nombre_departamento, em.nombre_empresa,
        r.tipo_rol,
        COUNT(DISTINCT fa.id_fa) AS FaltasAdministrativas
        FROM colaborador c
        LEFT JOIN equipo e ON e.id_colaborador = c.id_colaborador
        LEFT JOIN rol r ON r.id_rol = e.id_rol
        LEFT JOIN departamento d ON d.id_departamento = e.id_departamento
        LEFT JOIN departamento_empresa de ON de.id_departamento = d.id_departamento
        LEFT JOIN empresa em ON em.id_empresa = de.id_empresa
        LEFT JOIN fa ON fa.id_colaborador = c.id_colaborador
        WHERE c.estado = 1
        AND d.id_departamento = (
          SELECT d.id_departamento
          FROM departamento d
          INNER JOIN equipo e
            ON e.id_departamento = d.id_departamento
          INNER JOIN colaborador c
            ON c.id_colaborador = e.id_colaborador
          WHERE c.email = ?
        )
        GROUP BY c.id_colaborador, c.nombre, c.apellidos, 
                c.fechaNacimiento, c.telefono, c.puesto, c.email, 
                c.fechaIngreso, c.fechaSalida, c.ubicacion, 
                c.modalidad, c.foto, c.curp, c.rfc, c.estado,
                d.nombre_departamento
        ORDER BY c.nombre ASC
            LIMIT 10 OFFSET ?`, [email, offset])
    } else {
      return db.execute(`SELECT  c.id_colaborador, c.nombre, c.apellidos, 
        c.fechaNacimiento, c.telefono, c.puesto, c.email, 
        c.fechaIngreso, c.fechaSalida, c.ubicacion, 
        c.modalidad, c.foto, c.curp, c.rfc, c.estado,
        d.nombre_departamento, em.nombre_empresa,
        r.tipo_rol,
        COUNT(DISTINCT fa.id_fa) AS FaltasAdministrativas
        FROM colaborador c
        LEFT JOIN equipo e ON e.id_colaborador = c.id_colaborador
        LEFT JOIN rol r ON r.id_rol = e.id_rol
        LEFT JOIN departamento d ON d.id_departamento = e.id_departamento
        LEFT JOIN departamento_empresa de ON de.id_departamento = d.id_departamento
        LEFT JOIN empresa em ON em.id_empresa = de.id_empresa
        LEFT JOIN fa ON fa.id_colaborador = c.id_colaborador
        WHERE c.estado = 1
        AND d.id_departamento = (
          SELECT d.id_departamento
          FROM departamento d
          INNER JOIN equipo e
            ON e.id_departamento = d.id_departamento
          INNER JOIN colaborador c
            ON c.id_colaborador = e.id_colaborador
          WHERE c.email = ?
        )
        AND c.nombre LIKE ?
        OR c.apellidos LIKE ?
        GROUP BY c.id_colaborador, c.nombre, c.apellidos, 
                c.fechaNacimiento, c.telefono, c.puesto, c.email, 
                c.fechaIngreso, c.fechaSalida, c.ubicacion, 
                c.modalidad, c.foto, c.curp, c.rfc, c.estado,
                d.nombre_departamento
        ORDER BY c.nombre ASC
            LIMIT 10 OFFSET ?`, [email,`%${filter}%`, `%${filter}%`, offset])
    }
  }
  static async fetchAllCollabs(offset, filter = null) {
    if (!filter) {
      return db.execute(`SELECT  c.id_colaborador, c.nombre, c.apellidos, 
        c.fechaNacimiento, c.telefono, c.puesto, c.email, 
        c.fechaIngreso, c.fechaSalida, c.ubicacion, 
        c.modalidad, c.foto, c.curp, c.rfc, c.estado,
        d.nombre_departamento, em.nombre_empresa,
        r.tipo_rol,
        COUNT(DISTINCT fa.id_fa) AS FaltasAdministrativas
        FROM colaborador c
        LEFT JOIN equipo e ON e.id_colaborador = c.id_colaborador
        LEFT JOIN rol r ON r.id_rol = e.id_rol
        LEFT JOIN departamento d ON d.id_departamento = e.id_departamento
        LEFT JOIN departamento_empresa de ON de.id_departamento = d.id_departamento
        LEFT JOIN empresa em ON em.id_empresa = de.id_empresa
        LEFT JOIN fa ON fa.id_colaborador = c.id_colaborador
        WHERE c.estado = 1
        GROUP BY c.id_colaborador, c.nombre, c.apellidos, 
                c.fechaNacimiento, c.telefono, c.puesto, c.email, 
                c.fechaIngreso, c.fechaSalida, c.ubicacion, 
                c.modalidad, c.foto, c.curp, c.rfc, c.estado,
                d.nombre_departamento
        ORDER BY c.nombre ASC
            LIMIT 10 OFFSET ?`, [offset])
    } else {
      return db.execute(`SELECT  c.id_colaborador, c.nombre, c.apellidos, 
        c.fechaNacimiento, c.telefono, c.puesto, c.email, 
        c.fechaIngreso, c.fechaSalida, c.ubicacion, 
        c.modalidad, c.foto, c.curp, c.rfc, c.estado,
        d.nombre_departamento, em.nombre_empresa,
        r.tipo_rol,
        COUNT(DISTINCT fa.id_fa) AS FaltasAdministrativas
        FROM colaborador c
        LEFT JOIN equipo e ON e.id_colaborador = c.id_colaborador
        LEFT JOIN rol r ON r.id_rol = e.id_rol
        LEFT JOIN departamento d ON d.id_departamento = e.id_departamento
        LEFT JOIN departamento_empresa de ON de.id_departamento = d.id_departamento
        LEFT JOIN empresa em ON em.id_empresa = de.id_empresa
        LEFT JOIN fa ON fa.id_colaborador = c.id_colaborador
        WHERE c.estado = 1
        AND c.nombre LIKE ?
        OR c.apellidos LIKE ?
        GROUP BY c.id_colaborador, c.nombre, c.apellidos, 
                c.fechaNacimiento, c.telefono, c.puesto, c.email, 
                c.fechaIngreso, c.fechaSalida, c.ubicacion, 
                c.modalidad, c.foto, c.curp, c.rfc, c.estado,
                d.nombre_departamento
        ORDER BY c.nombre ASC
            LIMIT 10 OFFSET ?`, [`%${filter}%`, `%${filter}%`, offset])
    }
  }
  static async fetchInactiveTeamCollabs(email, offset, filter = null) {
    if (!filter) {
      return db.execute(`SELECT  c.id_colaborador, c.nombre, c.apellidos, 
        c.fechaNacimiento, c.telefono, c.puesto, c.email, 
        c.fechaIngreso, c.fechaSalida, c.ubicacion, 
        c.modalidad, c.foto, c.curp, c.rfc, c.estado,
        d.nombre_departamento, em.nombre_empresa,
        r.tipo_rol,
        COUNT(DISTINCT fa.id_fa) AS FaltasAdministrativas
        FROM colaborador c
        LEFT JOIN equipo e ON e.id_colaborador = c.id_colaborador
        LEFT JOIN rol r ON r.id_rol = e.id_rol
        LEFT JOIN departamento d ON d.id_departamento = e.id_departamento
        LEFT JOIN departamento_empresa de ON de.id_departamento = d.id_departamento
        LEFT JOIN empresa em ON em.id_empresa = de.id_empresa
        LEFT JOIN fa ON fa.id_colaborador = c.id_colaborador
        WHERE c.estado = 0
        AND d.id_departamento = (
          SELECT d.id_departamento
          FROM departamento d
          INNER JOIN equipo e
            ON e.id_departamento = d.id_departamento
          INNER JOIN colaborador c
            ON c.id_colaborador = e.id_colaborador
          WHERE c.email = ?
        )
        GROUP BY c.id_colaborador, c.nombre, c.apellidos, 
                c.fechaNacimiento, c.telefono, c.puesto, c.email, 
                c.fechaIngreso, c.fechaSalida, c.ubicacion, 
                c.modalidad, c.foto, c.curp, c.rfc, c.estado,
                d.nombre_departamento
        ORDER BY c.nombre ASC
            LIMIT 10 OFFSET ?`, [email, offset])
    } else {
      return db.execute(`SELECT  c.id_colaborador, c.nombre, c.apellidos, 
        c.fechaNacimiento, c.telefono, c.puesto, c.email, 
        c.fechaIngreso, c.fechaSalida, c.ubicacion, 
        c.modalidad, c.foto, c.curp, c.rfc, c.estado,
        d.nombre_departamento, em.nombre_empresa,
        r.tipo_rol,
        COUNT(DISTINCT fa.id_fa) AS FaltasAdministrativas
        FROM colaborador c
        LEFT JOIN equipo e ON e.id_colaborador = c.id_colaborador
        LEFT JOIN rol r ON r.id_rol = e.id_rol
        LEFT JOIN departamento d ON d.id_departamento = e.id_departamento
        LEFT JOIN departamento_empresa de ON de.id_departamento = d.id_departamento
        LEFT JOIN empresa em ON em.id_empresa = de.id_empresa
        LEFT JOIN fa ON fa.id_colaborador = c.id_colaborador
        WHERE c.estado = 0
        AND d.id_departamento = (
          SELECT d.id_departamento
          FROM departamento d
          INNER JOIN equipo e
            ON e.id_departamento = d.id_departamento
          INNER JOIN colaborador c
            ON c.id_colaborador = e.id_colaborador
          WHERE c.email = ?
        )
        AND c.nombre LIKE ?
        OR c.apellidos LIKE ?
        GROUP BY c.id_colaborador, c.nombre, c.apellidos, 
                c.fechaNacimiento, c.telefono, c.puesto, c.email, 
                c.fechaIngreso, c.fechaSalida, c.ubicacion, 
                c.modalidad, c.foto, c.curp, c.rfc, c.estado,
                d.nombre_departamento
        ORDER BY c.nombre ASC
            LIMIT 10 OFFSET ?`, [email, `%${filter}%`, `%${filter}%`, offset])
    }
  }
  static async fetchInactiveAllCollabs(offset, filter = null) {
    if (!filter) {
      return db.execute(`SELECT  c.id_colaborador, c.nombre, c.apellidos, 
        c.fechaNacimiento, c.telefono, c.puesto, c.email, 
        c.fechaIngreso, c.fechaSalida, c.ubicacion, 
        c.modalidad, c.foto, c.curp, c.rfc, c.estado,
        d.nombre_departamento, em.nombre_empresa,
        r.tipo_rol,
        COUNT(DISTINCT fa.id_fa) AS FaltasAdministrativas
        FROM colaborador c
        LEFT JOIN equipo e ON e.id_colaborador = c.id_colaborador
        LEFT JOIN rol r ON r.id_rol = e.id_rol
        LEFT JOIN departamento d ON d.id_departamento = e.id_departamento
        LEFT JOIN departamento_empresa de ON de.id_departamento = d.id_departamento
        LEFT JOIN empresa em ON em.id_empresa = de.id_empresa
        LEFT JOIN fa ON fa.id_colaborador = c.id_colaborador
        WHERE c.estado = 0
        GROUP BY c.id_colaborador, c.nombre, c.apellidos, 
                c.fechaNacimiento, c.telefono, c.puesto, c.email, 
                c.fechaIngreso, c.fechaSalida, c.ubicacion, 
                c.modalidad, c.foto, c.curp, c.rfc, c.estado,
                d.nombre_departamento
        ORDER BY c.nombre ASC
            LIMIT 10 OFFSET ?`, [offset])
    }
    else {
      return db.execute(`SELECT  c.id_colaborador, c.nombre, c.apellidos, 
        c.fechaNacimiento, c.telefono, c.puesto, c.email, 
        c.fechaIngreso, c.fechaSalida, c.ubicacion, 
        c.modalidad, c.foto, c.curp, c.rfc, c.estado,
        d.nombre_departamento, em.nombre_empresa,
        r.tipo_rol,
        COUNT(DISTINCT fa.id_fa) AS FaltasAdministrativas
        FROM colaborador c
        LEFT JOIN equipo e ON e.id_colaborador = c.id_colaborador
        LEFT JOIN rol r ON r.id_rol = e.id_rol
        LEFT JOIN departamento d ON d.id_departamento = e.id_departamento
        LEFT JOIN departamento_empresa de ON de.id_departamento = d.id_departamento
        LEFT JOIN empresa em ON em.id_empresa = de.id_empresa
        LEFT JOIN fa ON fa.id_colaborador = c.id_colaborador
        WHERE c.estado = 0
        AND c.nombre LIKE ?
        OR c.apellidos LIKE ?
        GROUP BY c.id_colaborador, c.nombre, c.apellidos, 
                c.fechaNacimiento, c.telefono, c.puesto, c.email, 
                c.fechaIngreso, c.fechaSalida, c.ubicacion, 
                c.modalidad, c.foto, c.curp, c.rfc, c.estado,
                d.nombre_departamento
        ORDER BY c.nombre ASC
            LIMIT 10 OFFSET ?`, [`%${filter}%`, `%${filter}%`, 0])
    }
  }

  static async fetchEmails(id_colaborador) {
    return db.execute(`SELECT email FROM colaborador WHERE email != ?`, [id_colaborador]);
  }

  static async fetchPersonalInfo(id_colaborador) {
    return db.execute(`SELECT c.nombre, c.apellidos, r.tipo_rol, c.ubicacion, c.puesto, d.nombre_departamento, c.email, c.foto  
                        FROM colaborador as c, rol as r, departamento as d, equipo as e
                        WHERE c.id_colaborador = e.id_colaborador
                        AND e.id_rol = r.id_rol
                        AND e.id_departamento = d.id_departamento 
                        AND c.id_colaborador = ?` , [id_colaborador]);
  }

  static async fetchCollabs(email, offset, filter = null) {
    if (email) {
      return Colaborador.fetchTeamCollabs(email, offset, filter ? filter : null);
    } else {
      return Colaborador.fetchAllCollabs(offset, filter);
    }
  }

  static async fetchInactiveCollabs(email, offset, filter = null) {
    if (email) {
      return Colaborador.fetchInactiveTeamCollabs(email, offset, filter ? filter : null);
    } else {
      return Colaborador.fetchInactiveAllCollabs(offset, filter);
    }
  }

  static fetchBasicInfoNoti(id_colaborador) {
    return db.execute(
        `SELECT nombre, telefono FROM colaborador WHERE id_colaborador = ?`, 
        [id_colaborador]
    );
  }

  static fetchFaultNoti(id_colaborador) {
    return db.execute(
        `SELECT c.nombre, c.apellidos, 
          (SELECT telefono FROM colaborador WHERE email = 'contenido1@nuclea.solutions' LIMIT 1) AS telefono
          FROM colaborador c WHERE c.id_colaborador = ?`, 
          [id_colaborador]
    );
  }C

  static fetchColabVac(idColaborador){
      return db.execute (`SELECT id_colaborador, fechaIngreso FROM colaborador
                          WHERE id_colaborador = ?`,[idColaborador]);
  }

  static fetchCollabById(id) {
    return db.execute(
      `SELECT * FROM colaborador WHERE id_colaborador = ?`,
      [id]
    );
  }


  updateById(id) {
    return db
      .execute(
        `UPDATE colaborador SET 
        nombre = ?, 
        apellidos = ?, 
        fechaNacimiento = ?, 
        telefono = ?, 
        puesto = ?, 
        email = ?, 
        fechaIngreso = ?, 
        ubicacion = ?, 
        modalidad = ?, 
        curp = ?, 
        rfc = ? 
      WHERE id_colaborador = ?`,
        [
          this.nombre,
          this.apellidos,
          this.fechaNacimiento,
          this.telefono,
          this.puesto,
          this.email,
          this.fechaIngreso,
          this.ubicacion,
          this.modalidad,
          this.curp,
          this.rfc,
          id
        ]
      )
  }

  static async fetchAllFaults(){
    const [faults] = await db.execute(`
      SELECT * from fa
      `)
    
      return faults;
  }

  static async fetchPaginatedCollabIds(offset, filter = null) {
    if (!filter?.length > 0) {
      const [ids] = await db.execute(`
        SELECT DISTINCT c.id_colaborador
        FROM colaborador c
        INNER JOIN fa f ON f.id_colaborador = c.id_colaborador
        WHERE c.estado = 1
        ORDER BY c.nombre ASC
        LIMIT 10 OFFSET ?`, [offset]);
  
      const map = ids.map(row => row.id_colaborador);
      return map;
    } else {
      const [ids] = await db.execute(`
        SELECT DISTINCT c.id_colaborador
        FROM colaborador c
        INNER JOIN fa f ON f.id_colaborador = c.id_colaborador
        WHERE (c.nombre LIKE ? OR c.apellidos LIKE ?)
        AND c.estado = 1
        ORDER BY c.nombre ASC
        LIMIT 10 OFFSET ?`, [`%${filter}%`, `%${filter}%`, offset]);
  
      const map = ids.map(row => row.id_colaborador);
      return map;
    }
  }
  
  static fetchDepartmentCollabs(id_departments) {
    if (id_departments.length <= 0) {
      return []
    }
    let query = `SELECT c.id_colaborador, c.nombre, c.apellidos, d.nombre_departamento, d.id_departamento
                FROM colaborador c
                INNER JOIN equipo e
                  ON e.id_colaborador = c.id_colaborador
                INNER JOIN departamento d
                  ON d.id_departamento = e.id_departamento
                WHERE ( d.id_departamento = ? \n`
      for (let i = 1; i < id_departments.length; i++) {
        query += `OR d.id_departamento = ? \n`
      }
      query += ') GROUP BY c.id_colaborador, c.nombre, c.apellidos, d.nombre_departamento, d.id_departamento;'
      return db.execute(query, [...id_departments])
  }

  static async fetchFaultsCollabsByIds(ids) {
    if (ids.length === 0) return [];

    const placeholders = ids.map(() => '?').join(',');
    const [rows] = await db.execute(`
      SELECT 
        c.id_colaborador,
        c.nombre,
        c.apellidos,
        c.puesto,
        d.nombre_departamento,
        em.nombre_empresa,
        COUNT(f.id_fa) AS total_faltas_colaborador
      FROM colaborador c
        LEFT JOIN equipo e ON e.id_colaborador = c.id_colaborador
        LEFT JOIN departamento d ON e.id_departamento = d.id_departamento
        LEFT JOIN departamento_empresa de ON de.id_departamento = d.id_departamento
        LEFT JOIN empresa em ON de.id_empresa = em.id_empresa
        INNER JOIN fa f ON f.id_colaborador = c.id_colaborador
      AND em.id_empresa = (
        SELECT MIN(de2.id_empresa)
        FROM departamento_empresa de2
        WHERE de2.id_departamento = d.id_departamento
      )
      GROUP BY 
        c.id_colaborador,
        c.nombre,
        c.apellidos,
        c.puesto,
        d.nombre_departamento,
        em.nombre_empresa
      ORDER BY c.nombre, d.nombre_departamento ASC
    `, ids);
    return rows;
  }
  static fetchCollabsName(email) {
    return db.execute(`SELECT nombre, apellidos, id_colaborador
                      FROM colaborador
                      WHERE email <> ?
                      AND estado = 1
        `, [email])
  }

  static async deleteCollab(id_colaborador){
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 10);
    const result = await db.execute(`
        UPDATE colaborador
        SET estado = 0, 
        fechaSalida = ?
        WHERE id_colaborador = ?
    `, [formattedDate, id_colaborador]);
    return result
  }
  static async reactivate_Collab(id_colaborador){
    const result = await db.execute(`
        UPDATE colaborador
        SET estado = 1, fechaIngreso = CURRENT_DATE
        WHERE id_colaborador = ?
    `, [id_colaborador]);
    return result[0]
  }
};
