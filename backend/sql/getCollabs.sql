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


SELECT DISTINCT e.nombre_empresa, e.id_empresa, d.id_departamento, d.nombre_departamento
FROM departamento d
INNER JOIN departamento_empresa de
  ON de.id_departamento = d.id_departamento
INNER JOIN empresa e
  ON e.id_empresa = de.id_empresa
ORDER BY nombre_empresa ASC;

SELECT  c.email, c.nombre, c.apellidos, sf.*, MIN(ds.fecha) AS start, MAX(ds.fecha) AS end
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
                            WHERE c.email = 'a01707122@tec.mx'
                          )
                           AND c.email != 'a01707122@tec.mx'
                        GROUP BY sf.id_solicitud_falta
                        ORDER BY sf.estado ASC, ds.fecha ASC