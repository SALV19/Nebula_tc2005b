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
    
    static fetchByID(id_empresa){
        return db.execute(`SELECT d.nombre_departamento FROM departamento d INNER JOIN departamento_empresa de ON d.id_departamento = de.id_departamento
                            INNER JOIN empresa e ON e.id_empresa = de.id_empresa WHERE e.id_empresa = ?
                            ORDER BY nombre_departamento ASC`, [id_empresa]);
    }
    

    static fetch(id_empresa){
        if (id_empresa){
            return Departamento.fetchByID(id_empresa);
        } else {
            return Departamento.fetchAllDep();
        }
    }
};
