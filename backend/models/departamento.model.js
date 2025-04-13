const db = require('../util/database');

module.exports = class Departamento {
    constructor(id_departamento, nombre_departamento) {
        this.id_dep = id_departamento;
        this.nom_dep = nombre_departamento;
        }

    static fetchAllDep() {
        return db.execute(`SELECT DISTINCT e.nombre_empresa, e.id_empresa, d.id_departamento, d.nombre_departamento
                            FROM departamento d
                            INNER JOIN departamento_empresa de
                            ON de.id_departamento = d.id_departamento
                            INNER JOIN empresa e
                            ON e.id_empresa = de.id_empresa
                            ORDER BY nombre_empresa, nombre_departamento ASC;`);
    }

};
