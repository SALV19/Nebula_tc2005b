-- DROP PROCEDURE update_abscence_request;
DELIMITER //

CREATE PROCEDURE update_abscence_request (
    IN p_ID INT, 
    IN p_tipo_falta VARCHAR(250),
    IN p_descripcion VARCHAR(250),
    IN p_ubicacion VARCHAR(250),
    IN p_evidencia VARCHAR(250),
    IN p_dates VARCHAR(250)
)
BEGIN

    DECLARE value_date VARCHAR(50);
    DECLARE pos INT;

    UPDATE solicitudes_falta 
    SET estado = 0, 
        `colabAprobador` = '',
        `tipo_falta` = p_tipo_falta,
        `descripcion` = p_descripcion,
        `ubicacion` = p_ubicacion,
        `evidencia` = p_evidencia
    WHERE id_solicitud_falta = p_ID;

    DELETE FROM dias_solicitados 
    WHERE id_solicitud_falta = p_ID;

    WHILE LOCATE(',', p_dates) > 0 DO
        SET pos = LOCATE(',', p_dates);
        SET value_date = LEFT(p_dates, pos - 1);
        SET p_dates = SUBSTRING(p_dates, pos + 1);

        INSERT INTO dias_solicitados(fecha, id_solicitud_falta) 
        VALUES (value_date, p_ID);
    END WHILE;

    IF LENGTH(p_dates) > 0 THEN
        INSERT INTO dias_solicitados(fecha, id_solicitud_falta)
        VALUES (p_dates, p_ID);
    END IF;
END //

DELIMITER ; 

CALL update_abscence_request(56, 'Vacaciones', '', '', '', '2025-05-1,2025-05-02,2025-05-03');

SELECT * FROM solicitudes_falta sf
INNER JOIN dias_solicitados ds
ON ds.id_solicitud_falta = sf.id_solicitud_falta
WHERE sf.id_solicitud_falta = 56;