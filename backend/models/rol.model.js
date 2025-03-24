const db = require('../util/database');

module.exports = class Rol {
    constructor(id_rol, tipo_rol) {
        this.id_r = id_rol;
        this.tipo_r = tipo_rol; 
        }

    static fetchAllRol() {
        return db.execute(`SELECT DISTINCT id_rol FROM rol
                            ORDER BY id_rol ASC`);
    }
};