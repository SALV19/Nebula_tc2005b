const db = require('../util/database')

module.exports = class FollowUp {

    static fetchAllQuestions(){
        return db.execute('SELECT * FROM preguntas_evaluacion')
    }
}