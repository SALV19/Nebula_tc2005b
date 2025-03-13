-- SQLBook: Code
SELECT nombre_departamento
FROM colaborador c
INNER JOIN equipo e
	ON c.id_colaborador = e.id_colaborador
INNER JOIN departamento d
	ON d.id_departamento = e.id_departamento
WHERE c.email = "santialducin@gmail.com"