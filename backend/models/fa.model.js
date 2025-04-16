const db = require('../util/database');

module.exports = class FaltaAdministrativa {
  constructor(id_colaborador, motivo, fecha, link = null) {
    this.id_colaborador = id_colaborador;
    this.motivo = motivo;
    this.fecha = fecha;
    this.link = link;
  }

  save() {
    return db.execute(`INSERT INTO fa
                    VALUES(?, ?, ?, ?)`, [this.id_colaborador, this.motivo, this.fecha, this.link])
  }

  // UPDATE del campo `Link` para una falta existente
  static updateLink(id_fa, link) {
    return db.execute(
      `UPDATE fa SET link = ? WHERE id_fa = ?`,
      [link, id_fa]
    );
  }
};
