-- SQLBook: Code
INSERT INTO nebula.departamento (id_departamento, id_empresa, nombre_departamento) VALUES(1, 1, 'Nuclea');
INSERT INTO nebula.rol (id_rol, tipo_rol) VALUES(1, 'Lider');
INSERT INTO nebula.permisos(nombre_permiso, descripcion) VALUES('view_collabs', 'ver colaboradores del equipo');
INSERT INTO nebula.rol_permisos(nombre_permiso, id_rol) VALUES('view_collabs', 1);
INSERT INTO nebula.equipo(id_colaborador, id_departamento, id_rol) VALUES('7bfc173a-002b-11f0-9aa8-5811223b90cc', 1, 1);

-- SQLBook: Code
SELECT nombre_permiso
  FROM colaborador c
  JOIN equipo e ON e.id_colaborador = c.id_colaborador
  JOIN rol r ON r.id_rol = e.id_rol
  JOIN rol_permisos rp ON rp.id_rol = r.id_rol
  WHERE c.email = (?);
-- SQLBook: Code
INSERT INTO nebula.empresa(id_empresa, nombre_empresa)VALUES (1, 'Fixtec');
-- SQLBook: Code
SELECT nombre_permiso
  FROM colaborador c
  JOIN equipo e ON e.id_colaborador = c.id_colaborador
  JOIN rol r ON r.id_rol = e.id_rol
  JOIN rol_permisos rp ON rp.id_rol = r.id_rol
  WHERE c.email = (?);
-- SQLBook: Code
SELECT nombre_permiso
  FROM colaborador c
  JOIN equipo e ON e.id_colaborador = c.id_colaborador
  JOIN rol r ON r.id_rol = e.id_rol
  JOIN rol_permisos rp ON rp.id_rol = r.id_rol
  WHERE c.email = (?);