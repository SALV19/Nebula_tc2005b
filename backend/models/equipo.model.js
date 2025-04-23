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
        return db.execute(`
        SELECT * FROM equipo eq
        INNER JOIN departamento d 
        ON eq.id_departamento = d.id_departamento
        INNER JOIN departamento_empresa de
        ON de.id_departamento = d.id_departamento
        INNER JOIN empresa e
        ON e.id_empresa = de.id_empresa
        WHERE id_colaborador = ? `,
        [id]
        );
    }

    static fetchRolByEmail(email) {
        return db.execute(`
            SELECT r.id_rol
            FROM equipo e
            JOIN colaborador c ON c.id_colaborador = e.id_colaborador
            JOIN rol r ON r.id_rol = e.id_rol
            WHERE c.email = ?
        `, [email]);
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