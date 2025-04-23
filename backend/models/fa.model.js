const db = require('../util/database');

module.exports = class FaltaAdministrativa {
  constructor(id_colaborador, motivo, fecha, link = null) {
    this.id_colaborador = id_colaborador;
    this.motivo = motivo;
    this.fecha = fecha;
    this.link = link;
  }

  save() {
    return db.execute(`INSERT INTO fa(id_colaborador, motivo, fecha, link)
                    VALUES(?, ?, ?, ?)`, [this.id_colaborador, this.motivo, this.fecha, this.link])
  }

  // UPDATE del campo `Link` para una falta existente
  static updateLink(id_fa, link) {
    return db.execute(
      `UPDATE fa SET link = ? WHERE id_fa = ?`,
      [link, id_fa]
    );
  }
  static async count_faults(id_colaborador){
    const collab = await db.execute(`
      SELECT COUNT(*) AS count, c.nombre
      FROM fa as f, colaborador as c
      WHERE f.id_colaborador = ?
      AND f.id_colaborador = c.id_colaborador
      `,[id_colaborador]
    );
      
    return collab[0][0];
  }
  static async deactivate_collab(id_colaborador){
    const deactivate = await db.execute(`
      UPDATE colaborador 
      SET estado = 0
      WHERE id_colaborador = ?
    `, [id_colaborador])
    return deactivate[0];
  }
};
