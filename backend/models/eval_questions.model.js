const db = require('../util/database')

module.exports = class Evaluation {
    static fetchAllQuestions(){
        return db.execute('SELECT * FROM preguntas_evaluacion');
    }
}