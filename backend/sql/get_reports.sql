SELECT i.indicador, AVG(m.valor_metrica)
                        FROM evaluaciones_de_seguimiento es
                        INNER JOIN metrica_indicadores m
                          ON m.id_evaluacion = es.id_evaluacion
                        INNER JOIN indicador i
                          ON i.id_indicador = m.id_indicador
                        WHERE es.'fechaAgendada' 
                        BETWEEN ? AND ?
                        GROUP BY i.id_indicador;

SELECT i.indicador, em.nombre_empresa, AVG(m.valor_metrica)
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
WHERE em.nombre_empresa = 'Nuclea'
OR em.nombre_empresa = 'Moca'
AND es.`fechaAgendada` BETWEEN '2025-01-01' AND '2025-05-01'
GROUP BY i.id_indicador, em.nombre_empresa;