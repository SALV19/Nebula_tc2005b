INSERT INTO nebula.permisos (nombre_permiso, descripcion) VALUES
  ('accept_requests', 'Accept requests of abscences from all collaborators'),
  ('accept_requests_team', 'Accept requests of abscences from collaborators');

INSERT INTO nebula.rol (tipo_rol) VALUES
  ('Colaborador'),
  ('SuperAdmin');

INSERT INTO nebula.rol_permisos (id_rol, nombre_permiso) VALUES
  (3, 'accept_requests'),
  (1, 'accept_requests_team');
