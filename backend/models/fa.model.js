const bodyParser = require('body-parser');
const db = require('../util/database');
const { google } = require('googleapis');

module.exports = class FaltaAdministrativa {
  constructor(id_colaborador, motivo, fecha, link = null) {
    this.id_colaborador = id_colaborador;
    this.motivo = motivo;
    this.fecha = fecha;
    this.link = link;
  }

  // UPDATE del campo `Link` para una falta existente
  static updateLink(id_fa, link) {
    return db.execute(
      `UPDATE fa SET link = ? WHERE id_fa = ?`,
      [link, id_fa]
    );
  }
};
