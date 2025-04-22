const db = require('../util/database')

module.exports = class Reports {
  constructor() {

  }

  static fetchCompany(empresas, start, end) {
    let query = `
      SELECT i.indicador, em.nombre_empresa, AVG(m.valor_metrica) as average
      FROM evaluaciones_de_seguimiento es
      INNER JOIN metrica_indicadores m ON m.id_evaluacion = es.id_evaluacion
      INNER JOIN indicador i ON i.id_indicador = m.id_indicador
      INNER JOIN equipo e ON e.id_colaborador = es.id_colaborador
      INNER JOIN departamento d ON d.id_departamento = e.id_departamento
      INNER JOIN departamento_empresa de ON de.id_departamento = d.id_departamento
      INNER JOIN empresa em ON em.id_empresa = de.id_empresa
      WHERE (
        em.nombre_empresa = ?\n`;
  
    for (let i = 1; i < empresas.length; i++) {
      query += ' OR em.nombre_empresa = ?\n';
    }
  
    query += `)
      AND es.fechaAgendada BETWEEN ? AND ?
      GROUP BY i.id_indicador, em.nombre_empresa;`;
  
    console.log(query, [...empresas, start, end]);
    return db.execute(query, [...empresas, start, end]);
  }

  static fetchDepartments(empresas, departamentos, start, end) {
    let query = `SELECT i.indicador, em.nombre_empresa, d.nombre_departamento, AVG(m.valor_metrica) as average
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
                        WHERE (em.nombre_empresa = ? \n`
    for (let i = 1; i < empresas.length; i++) {
      query += 'OR em.nombre_empresa = ? \n'
    }
    query += ') AND (d.nombre_departamento = ? \n'
    for (let i = 1; i < departamentos.length; i++) {
      query += 'OR d.nombre_departamento = ? \n'
    }
    query += ")"
    query += `AND es.fechaAgendada BETWEEN ? AND ? 
                        GROUP BY i.id_indicador, em.nombre_empresa, d.nombre_departamento;`
                        
    return db.execute(query, [...empresas, ...departamentos, start, end])
  }

  static fetchCollaborators(colaboradores, start, end) {
    let query = `
      SELECT i.indicador, em.nombre_empresa, d.nombre_departamento, c.nombre, c.apellidos, AVG(m.valor_metrica) as average
        FROM evaluaciones_de_seguimiento es
        INNER JOIN metrica_indicadores m ON m.id_evaluacion = es.id_evaluacion
        INNER JOIN indicador i ON i.id_indicador = m.id_indicador
        INNER JOIN colaborador c ON es.id_colaborador = c.id_colaborador
        INNER JOIN equipo e ON e.id_colaborador = c.id_colaborador
        INNER JOIN departamento d ON d.id_departamento = e.id_departamento
        INNER JOIN departamento_empresa de ON de.id_departamento = d.id_departamento
        INNER JOIN empresa em ON em.id_empresa = de.id_empresa
        WHERE (c.id_colaborador = ?`
      for (let i = 1; i < colaboradores.length; i++) {
        query += `OR c.id_colaborador = ?`
      }
        `) AND es.fechaAgendada BETWEEN ? AND ?
        GROUP BY i.id_indicador, em.nombre_empresa, d.nombre_departamento, c.id_colaborador;`
  
    const params = [...colaboradores, start, end];
    return db.execute(query, params);
  }
  
}
