const db = require('../util/database')

module.exports = class Collab {
    constructor(complete_name){
        this.name = complete_name;
    }

    static fetchAllCompleteName(){
        return db.execute('SELECT id_colaborador, nombre, apellidos FROM colaborador ORDER BY nombre ASC')
    }

    static async fetchEmail(id_colaborador) {
        const [rows] = await db.execute('SELECT email FROM colaborador WHERE id_colaborador = (?) ', [id_colaborador]);
        return rows.length > 0 ? rows[0].email : null;
    }

    static fetchBasicInfoNoti(id_colaborador) {
        return db.execute(
            `SELECT nombre, telefono FROM colaborador WHERE id_colaborador = ?`, 
            [id_colaborador]
        );
    }
}