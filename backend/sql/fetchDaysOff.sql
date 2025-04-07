SELECT * 
FROM solicitudes_falta sf
INNER JOIN dias_solicitados ds
  ON sf.id_solicitud_falta = ds.id_solicitud_falta
INNER JOIN colaborador c
  ON c.id_colaborador = sf.id_colaborador
WHERE c.email = 'santialducin@gmail.com'
  AND sf.estado = 1;

SELECT * FROM tiene_evento;

SELECT e.* 
FROM evento e
LEFT JOIN tiene_evento te
  ON te.id_evento = e.id_evento
WHERE te.id_evento IS NULL;
