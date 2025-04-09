-- SQLBook: Code
SELECT c.nombre, c.apellidos, sf.*, MIN(ds.fecha), MAX(ds.fecha)
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
AND c.email <> 'santialducin@gmail.com'
GROUP BY sf.id_solicitud_falta;

SELECT * FROM solicitudes_falta;

INSERT INTO solicitudes_falta(id_solicitud_falta, id_colaborador, estado, tipo_falta, descripcion, ubicacion) VALUES
	(51, 4, 14, 'ausencia medica', 'Me siento mal', 'Mexico'),
	(52, 4, 14, 'ausencia medica', 'Me siento mal', 'Mexico'),
	(33, 6, 14, 'ausencia medica', 'Me siento mal', 'Mexico'),
	(34, 9, 14, 'ausencia medica', 'Me siento mal', 'Mexico'),
	(35, 9, 14, 'ausencia medica', 'Me siento mal', 'Mexico'),
	(36, 9, 14, 'ausencia medica', 'Me siento mal', 'Mexico'),
	(37, 9, 14, 'ausencia medica', 'Me siento mal', 'Mexico'),
	(38, 9, 14, 'ausencia medica', 'Me siento mal', 'Mexico');

INSERT INTO dias_solicitados(id_solicitud_falta, fecha) VALUES
	(54, '2025-04-17'),
	(31, '2025-04-18'),
	(31, '2025-03-17'),
	(31, '2025-03-18'),
	(31, '2025-03-19'),
	(32, '2025-03-20'),
	(32, '2025-03-20'),
	(32, '2025-03-21'),
	(33, '2025-03-20'),
	(33, '2025-04-20'),
	(33, '2025-04-21'),
	(34, '2025-03-22'),
	(34, '2025-03-23'),
	(35, '2025-03-24'),
	(35, '2025-03-25'),
	(36, '2025-03-25'),
	(36, '2025-03-26'),
	(36, '2025-03-27'),
	(37, '2025-03-29'),
	(37, '2025-03-30'),
	(37, '2025-03-31'),
	(37, '2025-03-01');

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
		GROUP BY sf.id_solicitud_falta 
		ORDER BY sf.estado ASC, MIN(ds.fecha) ASC
	LIMIT 10 OFFSET 0;


SELECT c.nombre, c.apellidos, sf.*, MIN(ds.fecha) AS start, MAX(ds.fecha) AS end
                        FROM solicitudes_falta sf
                        JOIN dias_solicitados ds
                          ON ds.id_solicitud_falta = sf.id_solicitud_falta
                        JOIN colaborador c
                          ON c.id_colaborador = sf.id_colaborador
                        JOIN equipo e 
                          ON e.id_colaborador = c.id_colaborador
                        JOIN departamento d
                          ON d.id_departamento = e.id_departamento
                        GROUP BY sf.id_solicitud_falta
                        ORDER BY sf.estado ASC, ds.fecha ASC
                        LIMIT 10 OFFSET 0;

SELECT sf.*, MIN(ds.fecha) AS start, MAX(ds.fecha) AS end
                      FROM solicitudes_falta sf
                      INNER JOIN colaborador c
                        ON c.id_colaborador = sf.id_colaborador
                      INNER JOIN dias_solicitados ds
                        ON sf.id_solicitud_falta = ds.id_solicitud_falta
                      WHERE sf.tipo_falta = 'Vacation'
                      GROUP BY sf.id_solicitud_falta;



UPDATE solicitudes_falta SET estado = 2;
