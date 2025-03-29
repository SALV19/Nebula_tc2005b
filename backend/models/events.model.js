const db = require('../util/database')

module.exports = class Event {
  constructor() {

  }
  static async fetchEvents() {
    return db.execute(`SELECT e.* 
                      FROM evento e
                      LEFT JOIN tiene_evento te
                        ON te.id_evento = e.id_evento
                      WHERE te.id_evento IS NULL;`)
  }
}