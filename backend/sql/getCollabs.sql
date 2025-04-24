SELECT  c.id_colaborador, c.nombre, c.apellidos, 
        c.fechaNacimiento, c.telefono, c.puesto, c.email, 
        c.fechaIngreso, c.fechaSalida, c.ubicacion, 
        c.modalidad, c.foto, c.curp, c.rfc, c.estado,
        d.nombre_departamento, em.nombre_empresa,
        r.tipo_rol,
        COUNT(fa.id_fa) AS FaltasAdministrativas
        FROM colaborador c
        LEFT JOIN equipo e ON e.id_colaborador = c.id_colaborador
        LEFT JOIN rol r ON r.id_rol = e.id_rol
        LEFT JOIN departamento d ON d.id_departamento = e.id_departamento
        LEFT JOIN empresa em ON em.id_empresa = d.id_empresa
        LEFT JOIN fa ON fa.id_colaborador = c.id_colaborador
        GROUP BY c.id_colaborador, c.nombre, c.apellidos, 
                c.fechaNacimiento, c.telefono, c.puesto, c.email, 
                c.fechaIngreso, c.fechaSalida, c.ubicacion, 
                c.modalidad, c.foto, c.curp, c.rfc, c.estado,
                d.nombre_departamento, em.nombre_empresa
        ORDER BY c.nombre ASC;

SELECT s.*, MIN(ds.fecha), MAX(ds.fecha) FROM dias_solicitados ds 
        JOIN solicitudes_falta s 
        WHERE ds.id_solicitud_falta = s.id_solicitud_falta
        AND s.id_solicitud_falta = 54
        GROUP BY s.id_solicitud_falta;
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
                  HAVING MIN(ds.fecha) >= '2025-03-20' 
                  ORDER BY sf.estado ASC, MIN(ds.fecha) ASC;

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
                  HAVING MIN(ds.fecha) >= '2025-03-20' 
                  ORDER BY sf.estado ASC, MIN(ds.fecha) ASC


SELECT  c.id_colaborador, c.nombre, c.apellidos, 
        c.fechaNacimiento, c.telefono, c.puesto, c.email, 
        c.fechaIngreso, c.fechaSalida, c.ubicacion, 
        c.modalidad, c.foto, c.curp, c.rfc, c.estado,
        d.nombre_departamento, em.nombre_empresa,
        r.tipo_rol,
        COUNT(fa.id_fa) AS FaltasAdministrativas
        FROM colaborador c
        LEFT JOIN equipo e ON e.id_colaborador = c.id_colaborador
        LEFT JOIN rol r ON r.id_rol = e.id_rol
        LEFT JOIN departamento d ON d.id_departamento = e.id_departamento
        LEFT JOIN departamento_empresa de ON de.id_departamento = d.id_departamento
        LEFT JOIN empresa em ON em.id_empresa = de.id_empresa
        LEFT JOIN fa ON fa.id_colaborador = c.id_colaborador
        WHERE c.nombre LIKE '%sa%'
        GROUP BY c.id_colaborador, c.nombre, c.apellidos, 
                c.fechaNacimiento, c.telefono, c.puesto, c.email, 
                c.fechaIngreso, c.fechaSalida, c.ubicacion, 
                c.modalidad, c.foto, c.curp, c.rfc, c.estado,
                d.nombre_departamento
        ORDER BY c.nombre ASC;

SELECT i.indicador, em.nombre_empresa, AVG(m.valor_metrica) as average
      FROM evaluaciones_de_seguimiento es
      INNER JOIN metrica_indicadores m ON m.id_evaluacion = es.id_evaluacion
      INNER JOIN indicador i ON i.id_indicador = m.id_indicador
      INNER JOIN equipo e ON e.id_colaborador = es.id_colaborador
      INNER JOIN departamento d ON d.id_departamento = e.id_departamento
      INNER JOIN departamento_empresa de ON de.id_departamento = d.id_departamento
      INNER JOIN empresa em ON em.id_empresa = de.id_empresa
      WHERE (
        em.nombre_empresa = 'Maya'
 OR em.nombre_empresa = 'Moca'
 OR em.nombre_empresa ='Nuclea'
 OR em.nombre_empresa = 'WePage'
 OR em.nombre_empresa = 'ZigZag'
)
      AND es.fechaAgendada BETWEEN '2025-2-01' AND '2025-3-31'
      GROUP BY i.id_indicador, em.nombre_empresa;

SELECT i.indicador, em.nombre_empresa, d.nombre_departamento, c.nombre, c.apellidos, AVG(m.valor_metrica) as average
        FROM evaluaciones_de_seguimiento es
        INNER JOIN metrica_indicadores m ON m.id_evaluacion = es.id_evaluacion
        INNER JOIN indicador i ON i.id_indicador = m.id_indicador
        INNER JOIN colaborador c ON es.id_colaborador = c.id_colaborador
        INNER JOIN equipo e ON e.id_colaborador = c.id_colaborador
        INNER JOIN departamento d ON d.id_departamento = e.id_departamento
        INNER JOIN departamento_empresa de ON de.id_departamento = d.id_departamento
        INNER JOIN empresa em ON em.id_empresa = de.id_empresa
        WHERE (
                em.nombre_empresa = 'Maya'
                OR em.nombre_empresa = 'Moca'
                OR em.nombre_empresa ='Nuclea'
                OR em.nombre_empresa = 'WePage'
                OR em.nombre_empresa = 'ZigZag'
        )
        AND es.fechaAgendada BETWEEN '2025-01-01' AND '2025-05-31'
        GROUP BY i.id_indicador, em.nombre_empresa, d.nombre_departamento, c.id_colaborador;


SELECT * FROM colaborador;

SELECT c.nombre, c.apellidos, d.nombre_departamento
FROM colaborador c
INNER JOIN equipo e
  ON e.id_colaborador = c.id_colaborador
INNER JOIN departamento d
  ON d.id_departamento = e.id_departamento
GROUP BY c.nombre, c.apellidos, d.nombre_departamento



SELECT  c.id_colaborador, c.nombre, c.apellidos, 
        c.fechaNacimiento, c.telefono, c.puesto, c.email, 
        c.fechaIngreso, c.fechaSalida, c.ubicacion, 
        c.modalidad, c.foto, c.curp, c.rfc, c.estado,
        d.nombre_departamento, em.nombre_empresa,
        r.tipo_rol,
        COUNT(DISTINCT fa.id_fa) AS FaltasAdministrativas
        FROM colaborador c
        LEFT JOIN equipo e ON e.id_colaborador = c.id_colaborador
        LEFT JOIN rol r ON r.id_rol = e.id_rol
        LEFT JOIN departamento d ON d.id_departamento = e.id_departamento
        LEFT JOIN departamento_empresa de ON de.id_departamento = d.id_departamento
        LEFT JOIN empresa em ON em.id_empresa = de.id_empresa
        LEFT JOIN fa ON fa.id_colaborador = c.id_colaborador
        WHERE c.estado = 1
        GROUP BY c.id_colaborador, c.nombre, c.apellidos, 
                c.fechaNacimiento, c.telefono, c.puesto, c.email, 
                c.fechaIngreso, c.fechaSalida, c.ubicacion, 
                c.modalidad, c.foto, c.curp, c.rfc, c.estado,
                d.nombre_departamento
        ORDER BY c.nombre ASC
            LIMIT 10 OFFSET



SELECT  c.id_colaborador, c.nombre, c.apellidos, 
        c.fechaNacimiento, c.telefono, c.puesto, c.email, 
        c.fechaIngreso, c.fechaSalida, c.ubicacion, 
        c.modalidad, c.foto, c.curp, c.rfc, c.estado,
        d.nombre_departamento, em.nombre_empresa,
        r.tipo_rol,
        fa.id_fa AS FaltasAdministrativas
        FROM colaborador c
        LEFT JOIN equipo e ON e.id_colaborador = c.id_colaborador
        LEFT JOIN rol r ON r.id_rol = e.id_rol
        LEFT JOIN departamento d ON d.id_departamento = e.id_departamento
        LEFT JOIN departamento_empresa de ON de.id_departamento = d.id_departamento
        LEFT JOIN empresa em ON em.id_empresa = de.id_empresa
        LEFT JOIN fa ON fa.id_colaborador = c.id_colaborador
        WHERE c.estado = 1
        GROUP BY c.id_colaborador, c.nombre, c.apellidos, 
                c.fechaNacimiento, c.telefono, c.puesto, c.email, 
                c.fechaIngreso, c.fechaSalida, c.ubicacion, 
                c.modalidad, c.foto, c.curp, c.rfc, c.estado,
                d.nombre_departamento
        ORDER BY c.nombre ASC
            LIMIT 10;

UPDATE colaborador
  SET estado = 1, fechaSalida = NULL
  WHERE id_colaborador = '11a74e4e-0e9b-11f0-ae3b-7af62ad273cc';

SELECT * FROM colaborador WHERE id_colaborador = 1;

DESCRIBE colaborador;

SELECT id_fa, id_colaborador, COUNT(id_colaborador) 
FROM fa 
HAVING COUNT(id_colaborador) > 3;
SELECT * FROM fa WHERE id_colaborador = '11a74e4e-0e9b-11f0-ae3b-7af62ad273cc';
SELECT * FROM fa
ORDER BY id_colaborador;

DELETE FROM fa WHERE id_fa = 62;
DELETE FROM fa WHERE id_fa = 61;
DELETE FROM fa WHERE id_fa = 60;