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
