const db = require('../util/database')

module.exports = class Evaluation {
    constructor (id_collab, schedule_date ) {
        this.collab = id_collab;
        this.date = schedule_date;
    }

    // Esperamos a que la consulta termine antes de continuar con la ejecución
    async save() {
        const [result] = await db.query(
            'INSERT INTO evaluaciones_de_seguimiento (id_colaborador, fechaAgendada) VALUES (?, ?)',
            [this.collab, this.date]
        );

        return result.insertId;
    }

    static fetchAllQuestions(){
        return db.execute('SELECT * FROM preguntas_evaluacion');
    }

    static fetchAllInfo(idColaborador){
        return db.execute(`SELECT id_evaluacion, fechaAgendada FROM evaluaciones_de_seguimiento 
                            WHERE id_colaborador = ?
                            ORDER BY fechaAgendada DESC`,idColaborador);
    }

}