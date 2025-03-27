const db = require('../util/database')

module.exports = class Collab {
    constructor(complete_name){
        this.name = complete_name;
    }

    static fetchAllCompleteName(){
        return db.execute('SELECT id_colaborador, nombre, apellidos FROM colaborador ORDER BY nombre ASC')
    }

    static fetchEmail (id_colaborador) {
        return db.execute('SELECT email FROM colaborador WHERE id_colaborador = (?) ', [id_colaborador]);
    }
}