const db = require('../util/database');

module.exports = class Empresa {
    constructor(id_empresa, nombre_empresa) {
        this.id_emp = id_empresa;
        this.nom_emp = nombre_empresa;
        }

    static fetchAllEmp() {
        return db.execute(`SELECT DISTINCT nombre_empresa FROM empresa
                            ORDER BY nombre_empresa ASC`);
    }
};