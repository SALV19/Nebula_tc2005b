const db = require('../util/database');

module.exports = class Equipo {
    constructor(id_departamento, id_rol) {
        this.id_dep = id_departamento;
        this.id_r = id_rol;
        }

        save(id_colaborador) {
            return db.execute('INSERT INTO equipo (id_colaborador, id_rol, id_departamento) VALUES(?,?,?)',
                                [id_colaborador, this.id_r, this.id_dep])
        }

    static fetchEquipoById(id) {
        return db.execute(
        `SELECT id_rol, id_departamento FROM equipo WHERE id_colaborador = ?`,
        [id]
        );
    }

    updateById(id_colaborador) {
        return db.execute(
        `UPDATE equipo 
        SET id_departamento = ?, id_rol = ? 
        WHERE id_colaborador = ?`,
        [this.id_dep, this.id_r, id_colaborador]
        );
    }
};