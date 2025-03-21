const db = require('../util/database')

module.exports = class Event {
  constructor() {

  }
  static fetchEvents() {
    return db.execute('SELECT * FROM evento e WHERE e.tipo = `Feriado Oficial`')
  }
}