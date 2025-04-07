const db = require('../util/database')

module.exports = class Evaluation {
    constructor (id_collab, schedule_date, id_eval, note ) {
        this.collab = id_collab;
        this.date = schedule_date;
        this.id_eval = id_eval;
        this.note = note;
    }
    static default(id_collab, schedule_date) {
        return new Evaluation(id_collab, schedule_date, null, null)
    }
    static createNote(id_eval, note) {
        return new Evaluation(null, null, id_eval, note)
    }

    // Esperamos a que la consulta termine antes de continuar con la ejecución
    async save() {
        const [result] = await db.query(
            'INSERT INTO evaluaciones_de_seguimiento (id_colaborador, fechaAgendada) VALUES (?, ?)',
            [this.collab, this.date]
        );

        return result.insertId;
    }

    save_note() {
        return db.execute(`
                UPDATE evaluaciones_de_seguimiento 
                SET notas = ? 
                WHERE id_evaluacion = ?
            `, [this.note, this.id_eval])
    }

    static fetchAllQuestions(){
        return db.execute('SELECT * FROM preguntas_evaluacion');
    }

    static fetchAllInfo(idColaborador){
        return db.execute(`SELECT id_evaluacion, fechaAgendada, notas FROM evaluaciones_de_seguimiento 
                            WHERE id_colaborador = ?
                            ORDER BY fechaAgendada DESC`,idColaborador);
    }

}