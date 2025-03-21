const db = require('../util/database')

module.exports = class Answers {
    constructor (id_pregunta, id_evaluacion, respuesta ) {
        this.preg = id_pregunta;
        this.eval = id_evaluacion;
        this.resp = respuesta;
    }

    save() {
        return db.execute(
            'INSERT INTO respuestas_pregunta(id_pregunta, id_evaluacion, respuesta) VALUES(?, ?, ?)', 
            [this.preg, this.eval, this.resp]
        );
    }
    


}