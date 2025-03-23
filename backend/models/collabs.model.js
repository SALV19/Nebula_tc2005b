const db = require('../util/database');

module.exports = class Colaborador {
    constructor(colab_nombre, colab_apellidos, colab_fechaNacimiento, colab_telefono, 
        colab_puesto, colab_email, colab_fechaIngreso, 
        colab_ubicacion, colab_modalidad,colab_curp, colab_rfc) {

        this.nombre = colab_nombre;
        this.apellidos = colab_apellidos;
        this.fechaNacimiento = colab_fechaNacimiento;
        this.telefono = colab_telefono;
        this.puesto = colab_puesto;
        this.email = colab_email;
        this.fechaIngreso = colab_fechaIngreso 
        this.ubicacion = colab_ubicacion;
        this.modalidad = colab_modalidad;
        this.curp = colab_curp;
        this.rfc = colab_rfc;
        }

        save(password) {
            return db.execute(`INSERT INTO colaborador (id_colaborador, nombre, apellidos, fechaNacimiento,
                telefono, puesto, email, contrasena, fechaIngreso, ubicacion, modalidad, curp, rfc)
                VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                [this.nombre, this.apellidos, this.fechaNacimiento, this.telefono,
                this.puesto, this.email, password, this.fechaIngreso, this.ubicacion,
                this.modalidad, this.curp, this.rfc])
            .then(() => {
                return db.execute('SELECT id_colaborador FROM colaborador WHERE email = ?', [this.email]);
            });
        }
        

    static fetchAllColabPues() {
        return db.execute(`SELECT DISTINCT puesto FROM colaborador
                            ORDER BY puesto ASC`);
    }

    static fetchAllColabMod() {
        return db.execute(`SELECT DISTINCT modalidad FROM colaborador
                            ORDER BY modalidad ASC`);
    }
    
};