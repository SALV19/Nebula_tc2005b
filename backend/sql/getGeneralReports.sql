SELECT e.nombre_empresa, i.indicador, AVG(m.valor_metrica)
FROM empresa e
INNER JOIN departamento_empresa de
  ON e.id_empresa = de.id_empresa
INNER JOIN departamento d
  ON d.id_departamento = de.id_departamento
INNER JOIN equipo eq
  ON eq.id_departamento = d.id_departamento
INNER JOIN colaborador c
  ON c.id_colaborador = eq.id_colaborador
INNER JOIN evaluaciones_de_seguimiento es
  ON es.id_colaborador = c.id_colaborador
INNER JOIN metrica_indicadores m
  ON m.id_evaluacion = es.id_evaluacion
INNER JOIN indicador i
  ON i.id_indicador = m.id_indicador
-- WHERE es.`fechaAgendada` BETWEEN '2025-01-01' AND '2025-03-01'
GROUP BY e.nombre_empresa, i.indicador
ORDER BY e.nombre_empresa;

SELECT e.nombre_empresa, d.nombre_departamento, i.indicador, AVG(m.valor_metrica)
FROM empresa e
INNER JOIN departamento_empresa de
  ON e.id_empresa = de.id_empresa
INNER JOIN departamento d
  ON d.id_departamento = de.id_departamento
INNER JOIN equipo eq
  ON eq.id_departamento = d.id_departamento
INNER JOIN colaborador c
  ON c.id_colaborador = eq.id_colaborador
INNER JOIN evaluaciones_de_seguimiento es
  ON es.id_colaborador = c.id_colaborador
INNER JOIN metrica_indicadores m
  ON m.id_evaluacion = es.id_evaluacion
INNER JOIN indicador i
  ON i.id_indicador = m.id_indicador
WHERE e.nombre_empresa = 'Nuclea'
OR e.nombre_empresa = 'Maya'
GROUP BY e.nombre_empresa, d.nombre_departamento, i.indicador
ORDER BY e.nombre_empresa;

SELECT e.nombre_empresa, d.nombre_departamento, i.indicador, AVG(m.valor_metrica)
FROM empresa e
INNER JOIN departamento_empresa de
  ON e.id_empresa = de.id_empresa
INNER JOIN departamento d
  ON d.id_departamento = de.id_departamento
INNER JOIN equipo eq
  ON eq.id_departamento = d.id_departamento
INNER JOIN colaborador c
  ON c.id_colaborador = eq.id_colaborador
INNER JOIN evaluaciones_de_seguimiento es
  ON es.id_colaborador = c.id_colaborador
INNER JOIN metrica_indicadores m
  ON m.id_evaluacion = es.id_evaluacion
INNER JOIN indicador i
  ON i.id_indicador = m.id_indicador
WHERE e.nombre_empresa = 'Nuclea'
OR e.nombre_empresa = 'Maya'
AND d.nombre_departamento = "Human Resources"
GROUP BY e.nombre_empresa, d.nombre_departamento, i.indicador
ORDER BY e.nombre_empresa;

SELECT e.nombre_empresa, d.nombre_departamento, i.indicador, AVG(m.valor_metrica)
FROM empresa e
INNER JOIN departamento_empresa de
  ON e.id_empresa = de.id_empresa
INNER JOIN departamento d
  ON d.id_departamento = de.id_departamento
INNER JOIN equipo eq
  ON eq.id_departamento = d.id_departamento
INNER JOIN colaborador c
  ON c.id_colaborador = eq.id_colaborador
INNER JOIN evaluaciones_de_seguimiento es
  ON es.id_colaborador = c.id_colaborador
INNER JOIN metrica_indicadores m
  ON m.id_evaluacion = es.id_evaluacion
INNER JOIN indicador i
  ON i.id_indicador = m.id_indicador
WHERE e.nombre_empresa = 'Nuclea'
OR e.nombre_empresa = 'Maya'
AND d.nombre_departamento = "Human Resources"
AND c.nombre = 'Santiago'
AND c.apellidos = 'Alducin Villaseñor'
GROUP BY e.nombre_empresa, d.nombre_departamento, i.indicador
ORDER BY e.nombre_empresa;
