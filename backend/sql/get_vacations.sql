SELECT sf.*, MIN(ds.fecha), MAX(ds.fecha)
FROM solicitudes_falta sf
INNER JOIN colaborador c
  ON c.id_colaborador = sf.id_colaborador
INNER JOIN dias_solicitados ds
  ON sf.id_solicitud_falta = ds.id_solicitud_falta
WHERE sf.tipo_falta <> 'Vacation'
-- AND sf.id_colaborador = 'a2f46ad1-0b8f-11f0-a4b2-8091337d895a'
GROUP BY sf.id_solicitud_falta;

SELECT * 
FROM solicitudes_falta sf;