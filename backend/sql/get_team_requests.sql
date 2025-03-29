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

INSERT INTO solicitudes_falta(id_solicitud_falta, id_colaborador, estado, tipo_falta, descripcion, ubicacion) VALUES
	(18, 4, 1, 'ausencia medica', 'Me siento mal', 'Mexico'),
	(19, 6, 1, 'ausencia medica', 'Me siento mal', 'Mexico'),
	(20, 9, 1, 'ausencia medica', 'Me siento mal', 'Mexico'),
	(21, 9, 1, 'ausencia medica', 'Me siento mal', 'Mexico'),
	(22, 9, 1, 'ausencia medica', 'Me siento mal', 'Mexico'),
	(23, 9, 1, 'ausencia medica', 'Me siento mal', 'Mexico'),
	(24, 9, 1, 'ausencia medica', 'Me siento mal', 'Mexico');

INSERT INTO dias_solicitados(id_solicitud_falta, fecha) VALUES
	(18, '2025-04-17'),
	(18, '2025-04-18'),
	(19, '2025-03-17'),
	(19, '2025-03-18'),
	(19, '2025-03-19'),
	(19, '2025-03-20'),
	(20, '2025-03-20'),
	(20, '2025-03-21'),
	(21, '2025-03-20'),
	(21, '2025-04-20'),
	(21, '2025-04-21'),
	(22, '2025-03-22'),
	(22, '2025-03-23'),
	(22, '2025-03-24'),
	(22, '2025-03-25'),
	(23, '2025-03-25'),
	(23, '2025-03-26'),
	(23, '2025-03-27'),
	(24, '2025-03-29'),
	(24, '2025-03-30'),
	(24, '2025-03-31'),
	(24, '2025-03-01');


SELECT MIN(ds.fecha) AS start, MAX(ds.fecha) AS end
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
		HAVING MIN(ds.fecha) >= '2025-03-17' AND MAX(ds.fecha) <= '2025-03-17'
		ORDER BY sf.estado ASC
	LIMIT 10 OFFSET 0
