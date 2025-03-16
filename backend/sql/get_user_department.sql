-- SQLBook: Code
SELECT c.nombre, c.apellidos sf.*, MIN(ds.fecha), MAX(ds.fecha)
FROM solicitudes_falta sf
JOIN dias_solicitados ds
	ON ds.id_solicitud_falta = sf.id_solicitud_falta
JOIN colaborador c
	ON c.id_colaborador = sf.id_colaborador
JOIN equipo e 
	ON e.id_colaborador = c.id_colaborador
JOIN departamento d
	ON d.id_departamento = e.id_departamento
WHERE d.nombre_departamento = (
	SELECT nombre_departamento
	FROM colaborador c
	INNER JOIN equipo e
		ON c.id_colaborador = e.id_colaborador
	INNER JOIN departamento d
		ON d.id_departamento = e.id_departamento
	WHERE c.email = 'santialducin@gmail.com'
)
GROUP BY sf.id_solicitud_falta

SELECT s.id_solicitud_falta, MAX(d.fecha), MIN(d.fecha)
FROM solicitudes_falta s, dias_solicitados d
WHERE s.id_solicitud_falta = d.id_solicitud_falta
GROUP BY s.id_solicitud_falta