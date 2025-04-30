const db = require('../util/database')

module.exports = class Evaluation {
    static fetchAllQuestions(){
        return db.execute('SELECT * FROM preguntas_evaluacion');
    }

    static async deleteEval(id_eval){
        const result = await db.execute(`
            DELETE e, mi, rp
            FROM evaluaciones_de_seguimiento e
            JOIN metrica_indicadores mi ON e.id_evaluacion = mi.id_evaluacion
            JOIN respuestas_pregunta rp ON e.id_evaluacion = rp.id_evaluacion
            WHERE e.id_evaluacion = ?;
        `, [id_eval]);
        return result
    }
}
