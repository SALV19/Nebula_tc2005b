const db = require('../util/database')

module.exports = class Reports {
  constructor() {

  }

  static fetchGeneral(start, end) {
    return db.execute(`SELECT i.indicador, AVG(m.valor_metrica)
                        FROM evaluaciones_de_seguimiento es
                        INNER JOIN metrica_indicadores m
                          ON m.id_evaluacion = es.id_evaluacion
                        INNER JOIN indicador i
                          ON i.id_indicador = m.id_indicador
                        WHERE es.'fechaAgendada' 
                        BETWEEN ? AND ?
                        GROUP BY i.id_indicador;`, [start, end])
  }

  static fetchCompany(empresas, start, end) {
    let query = `SELECT i.indicador, em.nombre_empresa, AVG(m.valor_metrica)
                        FROM evaluaciones_de_seguimiento es
                        INNER JOIN metrica_indicadores m
                          ON m.id_evaluacion = es.id_evaluacion
                        INNER JOIN indicador i
                          ON i.id_indicador = m.id_indicador
                        INNER JOIN equipo e
                          ON e.id_colaborador = es.id_colaborador
                        INNER JOIN departamento d
                          ON d.id_departamento = e.id_departamento
                        INNER JOIN departamento_empresa de
                          ON de.id_departamento = d.id_departamento
                        INNER JOIN empresa em
                          ON em.id_empresa = de.id_empresa
                        WHERE em.nombre_empresa = ? \n`
    for (let i = 1; i < empresas; i++) {
      query += 'OR em.nombre_empresa = ? \n'
    }
    query += `AND e.'fechaAgendada' BETWEEN ? AND ?
                        GROUP BY i.id_indicador, em.nombre_empresa;`
                        
    return db.execute(query, [...empresas, start, end])
  }
}