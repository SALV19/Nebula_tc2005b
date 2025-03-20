const db = require('../util/database')

module.exports = class Collab {
    constructor(complete_name){
        this.name = complete_name;
    }

    static fetchAllCompleteName(){
        return db.execute('SELECT nombre, apellidos FROM colaborador')
    }
}