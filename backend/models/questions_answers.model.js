const db = require('../util/database')

module.exports = class Answers {
    constructor (id_pregunta, id_evaluacion, respuesta ) {
        this.preg = id_pregunta;
        this.eval = id_evaluacion;
        this.resp = respuesta;
    }

    async save() {


        if (!Array.isArray(this.preg) || !Array.isArray(this.resp) || this.preg.length != this.resp.length){
            throw new Error("The arrays are not of the same length");
        }

        for (let i = 0; i < this.preg.length; i++){
            await db.execute(
                'INSERT INTO respuestas_pregunta(id_pregunta, id_evaluacion, respuesta) VALUES(?, ?, ?)', 
                [this.preg[i], this.eval, this.resp[i]]
            );
        };
        

    }
    


}