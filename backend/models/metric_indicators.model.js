const db = require('../util/database')

module.exports = class Indicators_metrics {
    constructor (id_evaluacion, id_indicador, valor_metrica ) {
        this.eval = id_evaluacion;
        this.indi = id_indicador;
        this.val = valor_metrica;
    }

    async save() {
        if (!Array.isArray(this.indi) || !Array.isArray(this.val) || this.indi.length != this.val.length){
            throw new Error("The arrays are not of the same length");
        }

        for (let i = 0; i < this.indi.length; i++){
            await db.execute(
                'INSERT INTO metrica_indicadores(id_evaluacion, id_indicador, valor_metrica) VALUES(?, ?, ?)', 
                [this.eval, this.indi[i], this.val[i]]
            );
        };
    }
    
    static fetchAll(id_evaluacion){
        const placeholders = id_evaluacion.map(() => '?').join(', ');
        
        return db.execute(
            `SELECT id_evaluacion, id_indicador, valor_metrica FROM metrica_indicadores WHERE id_evaluacion IN (${placeholders})`, id_evaluacion);
    }
}