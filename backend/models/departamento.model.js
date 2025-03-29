const db = require('../util/database');

module.exports = class Departamento {
    constructor(id_departamento, nombre_departamento) {
        this.id_dep = id_departamento;
        this.nom_dep = nombre_departamento;
        }

    static fetchAllDep() {
        return db.execute(`SELECT DISTINCT id_departamento, nombre_departamento FROM departamento
                            ORDER BY nombre_departamento ASC`);
    }
    
};
