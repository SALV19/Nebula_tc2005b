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
    return db.execute('SELECT id_colaborador, nombre, apellidos FROM colaborador')
  }

  save(password) {
    return db
      .execute(
        `INSERT INTO colaborador (id_colaborador, nombre, apellidos, fechaNacimiento,
          telefono, puesto, email, contrasena, fechaIngreso, ubicacion, modalidad, curp, rfc)
          VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          this.nombre,
          this.apellidos,
          this.fechaNacimiento,
          this.telefono,
          this.puesto,
          this.email,
          password,
          this.fechaIngreso,
          this.ubicacion,
          this.modalidad,
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
      // TO DEFINE
      return;
    } else {
      // TO DEFINE
      return;
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
        COUNT(fa.id_fa) AS FaltasAdministrativas
        FROM colaborador c
        LEFT JOIN equipo e ON e.id_colaborador = c.id_colaborador
        LEFT JOIN rol r ON r.id_rol = e.id_rol
        LEFT JOIN departamento d ON d.id_departamento = e.id_departamento
        LEFT JOIN departamento_empresa de ON de.id_departamento = d.id_departamento
        LEFT JOIN empresa em ON em.id_empresa = de.id_empresa
        LEFT JOIN fa ON fa.id_colaborador = c.id_colaborador
        GROUP BY c.id_colaborador, c.nombre, c.apellidos, 
                c.fechaNacimiento, c.telefono, c.puesto, c.email, 
                c.fechaIngreso, c.fechaSalida, c.ubicacion, 
                c.modalidad, c.foto, c.curp, c.rfc, c.estado,
                d.nombre_departamento, em.nombre_empresa
        ORDER BY c.nombre ASC
            LIMIT 10 OFFSET ?`, [offset])
    }
  }

  static async fetchCollabs(email, offset, filter = null) {
    if (email) {
      return Colaborador.fetchTeamCollabs(email, offset, filter ? filter : null);
    } else {
      return Colaborador.fetchAllCollabs(offset, filter);
    }
  }
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
  

};
