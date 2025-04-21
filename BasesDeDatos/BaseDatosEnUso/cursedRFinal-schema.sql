-- Active: 1743625010510@@127.0.0.1@3306@cursedr
DROP SCHEMA IF EXISTS cursedR;
CREATE SCHEMA cursedR;
USE cursedR;

CREATE TABLE Jugador(
    id_jugador INT AUTO_INCREMENT PRIMARY KEY,
    nombreUsuario VARCHAR(20) NOT NULL UNIQUE,
    correo VARCHAR(255) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    fechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_nombreUsuario CHECK (nombreUsuario REGEXP '^[a-zA-Z0-9._]{3,20}$'),
    CONSTRAINT chk_correo CHECK (correo REGEXP '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
    CONSTRAINT chk_contrasena CHECK (contrasena REGEXP '^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE Partida(
    id_partida INT AUTO_INCREMENT PRIMARY KEY,
    id_jugador INT NOT NULL,
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_fin TIMESTAMP NULL,
    FOREIGN KEY (id_jugador) REFERENCES Jugador(id_jugador)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Los constraints en su mayoría ya están limitados por el front-end
CREATE TABLE Log_Partida(
    id_log INT AUTO_INCREMENT PRIMARY KEY,
    id_partida INT NOT NULL,
    fechaLog TIMESTAMP NOT NULL,
    eventoTrigger ENUM('pausa', 'checkpoints', 'inicio', 'muerteMaldicion', 'muerteVida') NOT NULL,
    claseElegida ENUM('guerrero', 'arquero', 'hechicero') NOT NULL,
    tiempoPartida TIME NOT NULL,
    puntuacion INT DEFAULT 0,
    nivelActual TINYINT DEFAULT 1 NOT NULL CHECK (nivelActual<=3 AND nivelActual>=1),
    salaActual TINYINT DEFAULT 1 NOT NULL CHECK (salaActual<=4 AND salaActual>=1),
    biomaActual ENUM('bosque','nieve','desierto') NOT NULL,
    rankM DECIMAL(5,2) DEFAULT 100.00 NOT NULL, -- Valor maximo de 999.99
    vida DECIMAL(6,2) NOT NULL, -- Valor maximo de 9999.99, no hay default pq variara por clase
    enemigosCDerrotados TINYINT DEFAULT 0,
    enemigosFDerrotados TINYINT DEFAULT 0,
    jefesDerrotados TINYINT DEFAULT 0 CHECK (jefesDerrotados<=3 and jefesDerrotados>=0), -- Se agrega este constraint, pero ya está limitado por el front
    objetosEncontrados ENUM('curandero', 'armero', 'cofre') NOT NULL,
    FOREIGN KEY (id_partida) REFERENCES Partida(id_partida)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Primero eliminamos la vista existente
DROP VIEW IF EXISTS Estadisticas;

-- Creamos la vista con los nuevos atributos
CREATE VIEW Estadisticas AS
SELECT 
    p.id_jugador,
    p.id_partida,
    j.nombreUsuario,
    ultima.fechaLog AS FechaFin,
    ultima.tiempoPartida AS TiempoTotal,
    maxPuntos.puntuacion AS PuntuacionFinal,
    maxNivel.nivelActual AS NivelAlcanzado,
    maxSala.salaActual AS SalaAlcanzada,
    ultima.biomaActual AS BiomaAlMorir,
    ultima.rankM AS RankRestante,
    ultima.vida AS VidaRestante,
    ultima.enemigosCDerrotados AS EnemigosComunesDerrotados,
    ultima.enemigosFDerrotados AS EnemigosFuertesDerrotados,
    ultima.jefesDerrotados AS JefesDerrotados,
    (ultima.enemigosCDerrotados + ultima.enemigosFDerrotados + ultima.jefesDerrotados) AS TotalEnemigosEliminados,
    ultima.eventoTrigger AS TipoFinPartida,
    primera.claseElegida AS ClaseJugador,
    objetosMax.objetosEncontrados AS UltimoObjetoEncontrado
FROM 
    Partida p
JOIN 
    Jugador j ON p.id_jugador = j.id_jugador
JOIN 
    -- Subconsulta para obtener el último registro de cada partida
    (SELECT 
        lp.id_partida,
        lp.fechaLog,
        lp.tiempoPartida,
        lp.biomaActual,
        lp.rankM,
        lp.vida,
        lp.enemigosCDerrotados,
        lp.enemigosFDerrotados,
        lp.jefesDerrotados,
        lp.eventoTrigger
     FROM 
        Log_Partida lp
     JOIN 
        (SELECT id_partida, MAX(fechaLog) AS max_fecha
         FROM Log_Partida
         GROUP BY id_partida) lp2 
     ON lp.id_partida = lp2.id_partida AND lp.fechaLog = lp2.max_fecha
    ) ultima ON p.id_partida = ultima.id_partida
JOIN 
    -- Subconsulta para obtener el primer registro (con la clase elegida)
    (SELECT 
        lp.id_partida,
        lp.claseElegida
     FROM 
        Log_Partida lp
     JOIN 
        (SELECT id_partida, MIN(fechaLog) AS min_fecha
         FROM Log_Partida
         GROUP BY id_partida) lp2 
     ON lp.id_partida = lp2.id_partida AND lp.fechaLog = lp2.min_fecha
    ) primera ON p.id_partida = primera.id_partida
JOIN 
    -- Subconsulta para obtener la puntuación máxima de cada partida
    (SELECT 
        id_partida, 
        MAX(puntuacion) AS puntuacion
     FROM 
        Log_Partida
     GROUP BY 
        id_partida
    ) maxPuntos ON p.id_partida = maxPuntos.id_partida
JOIN 
    -- Subconsulta para obtener el nivel máximo alcanzado en cada partida
    (SELECT 
        id_partida, 
        MAX(nivelActual) AS nivelActual
     FROM 
        Log_Partida
     GROUP BY 
        id_partida
    ) maxNivel ON p.id_partida = maxNivel.id_partida
JOIN 
    -- Subconsulta para obtener la sala máxima alcanzada en cada partida
    (SELECT 
        id_partida, 
        MAX(salaActual) AS salaActual
     FROM 
        Log_Partida
     GROUP BY 
        id_partida
    ) maxSala ON p.id_partida = maxSala.id_partida
LEFT JOIN
    -- Subconsulta para obtener el último objeto encontrado
    (SELECT
        lp.id_partida,
        lp.objetosEncontrados
     FROM
        Log_Partida lp
     JOIN
        (SELECT id_partida, MAX(fechaLog) AS max_fecha
         FROM Log_Partida
         WHERE objetosEncontrados IS NOT NULL
         GROUP BY id_partida) lp2
     ON lp.id_partida = lp2.id_partida AND lp.fechaLog = lp2.max_fecha
    ) objetosMax ON p.id_partida = objetosMax.id_partida;

-- Primero eliminamos el trigger existente
DROP TRIGGER IF EXISTS muerte_detector;

-- Creamos el trigger actualizado
DELIMITER //

CREATE TRIGGER muerte_detector
AFTER INSERT ON Log_Partida
FOR EACH ROW
BEGIN
    -- Variables para detectar si es necesario crear un registro de muerte
    DECLARE necesita_registro_muerte BOOLEAN DEFAULT FALSE;
    DECLARE tipo_muerte VARCHAR(15);
    DECLARE ultimo_log TIMESTAMP;
    DECLARE ultimo_evento VARCHAR(15);
    DECLARE clase_jugador ENUM('guerrero', 'arquero', 'hechicero');
    DECLARE ultimo_objeto_encontrado ENUM('curandero', 'armero', 'cofre');
    
    -- Obtener la clase elegida para esta partida (del primer registro)
    SELECT claseElegida INTO clase_jugador
    FROM Log_Partida
    WHERE id_partida = NEW.id_partida
    ORDER BY fechaLog ASC
    LIMIT 1;
    
    -- Obtener el último objeto encontrado
    SELECT objetosEncontrados INTO ultimo_objeto_encontrado
    FROM Log_Partida
    WHERE id_partida = NEW.id_partida AND objetosEncontrados IS NOT NULL
    ORDER BY fechaLog DESC
    LIMIT 1;
    
    -- Buscar el último registro para esta partida (versión corregida)
    SELECT fechaLog, eventoTrigger INTO ultimo_log, ultimo_evento
    FROM Log_Partida
    WHERE id_partida = NEW.id_partida
    ORDER BY fechaLog DESC
    LIMIT 1;
    
    -- Verificar si el nuevo registro tiene rankM = 0 (muerte por maldición) 
    -- o vida = 0 (muerte por vida) pero no es un evento de muerte
    IF NEW.rankM = 0 AND NEW.eventoTrigger != 'muerteMaldicion' THEN
        SET necesita_registro_muerte = TRUE;
        SET tipo_muerte = 'muerteMaldicion';
    ELSEIF NEW.vida = 0 AND NEW.eventoTrigger != 'muerteVida' THEN
        SET necesita_registro_muerte = TRUE;
        SET tipo_muerte = 'muerteVida';
    END IF;
    
    -- Si se necesita un registro de muerte y el último registro no es un evento de muerte
    IF necesita_registro_muerte = TRUE AND 
       ultimo_evento NOT IN ('muerteMaldicion', 'muerteVida') THEN
        
        -- Insertar un nuevo registro con el evento de muerte correspondiente
        -- Ahora incluimos los nuevos campos
        INSERT INTO Log_Partida
        (id_partida, fechaLog, eventoTrigger, claseElegida, tiempoPartida, 
         puntuacion, nivelActual, salaActual, biomaActual, rankM, vida,
         enemigosCDerrotados, enemigosFDerrotados, jefesDerrotados,
         objetosEncontrados)
        VALUES
        (NEW.id_partida, 
         CURRENT_TIMESTAMP, -- Fecha actual
         tipo_muerte, -- El tipo de muerte detectado
         clase_jugador, -- Clase del jugador (obtenida del primer registro)
         NEW.tiempoPartida, 
         NEW.puntuacion,
         NEW.nivelActual,
         NEW.salaActual,
         NEW.biomaActual,
         NEW.rankM,
         NEW.vida,
         NEW.enemigosCDerrotados,
         NEW.enemigosFDerrotados,
         NEW.jefesDerrotados,
         ultimo_objeto_encontrado); -- Último objeto encontrado
         
        -- También actualizar la fecha_fin en la tabla Partida
        UPDATE Partida 
        SET fecha_fin = CURRENT_TIMESTAMP
        WHERE id_partida = NEW.id_partida AND fecha_fin IS NULL;
    END IF;
END 
//DELIMITER;

-- Creacion de indices: Estos se usan automáticamente por la base de datos cuando es necesario
CREATE INDEX idx_log_partida_fecha ON Log_Partida(id_partida, fechaLog);
CREATE INDEX idx_log_fechaLog ON Log_Partida(fechaLog);
CREATE INDEX idx_log_objetosEncontrados ON Log_Partida(objetosEncontrados);