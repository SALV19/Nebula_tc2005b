SELECT nombre_permiso
  FROM colaborador c
  JOIN equipo e ON e.id_colaborador = c.id_colaborador
  JOIN rol r ON r.id_rol = e.id_rol
  JOIN rol_permisos rp ON rp.id_rol = r.id_rol
  WHERE c.email = (?);