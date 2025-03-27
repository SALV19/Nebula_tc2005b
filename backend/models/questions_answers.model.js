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

    static fetchAnswers(id_preguntas, id_evaluacion){
        const placeholdersPreguntas = id_preguntas.map(() => '?').join(', ');
        const placeholdersEvaluaciones = id_evaluacion.map(() => '?').join(', ');

        const values = [...id_preguntas, ...id_evaluacion];

        const sql = `
            SELECT id_pregunta, id_evaluacion, respuesta 
            FROM respuestas_pregunta 
            WHERE id_pregunta IN (${placeholdersPreguntas}) 
            AND id_evaluacion IN (${placeholdersEvaluaciones})
        `;

        return db.execute(sql, values);
    }
}