const db = require('../util/database')

module.exports = class Indicators {
    constructor(indicator){
        this.indicators = indicator;
    }

    static fetchAllindicators(){
        return db.execute('SELECT * FROM indicador')
    }
}