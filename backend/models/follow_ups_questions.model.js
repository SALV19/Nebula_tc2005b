const db = require('../util/database')

module.exports = class FollowUp {
    constructor(questions){
        this.question = questions;
    }

    static fetchAllQuestions(){
        return db.execute('SELECT pregunta FROM preguntas_evaluacion')
    }
}