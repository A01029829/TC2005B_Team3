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
    eventoTrigger ENUM('pausa', 'checkpoints', 'inicio', 'muerteMaldicion', 'muerteVida', 'salida') NOT NULL,
    claseElegida ENUM('guerrero', 'arquero', 'hechicero') NOT NULL,
    tiempoPartida TIME NOT NULL,
    puntuacion INT DEFAULT 0,
    nivelActual TINYINT DEFAULT 1 NOT NULL CHECK (nivelActual<=3 AND nivelActual>=1),
    salaActual TINYINT DEFAULT 1 NOT NULL CHECK (salaActual<=13 AND salaActual>=1),
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

-- Creacion de indices: Estos se usan automáticamente por la base de datos cuando es necesario
CREATE INDEX idx_log_partida_fecha ON Log_Partida(id_partida, fechaLog);
CREATE INDEX idx_log_fechaLog ON Log_Partida(fechaLog);
CREATE INDEX idx_log_objetosEncontrados ON Log_Partida(objetosEncontrados);

DROP TRIGGER IF EXISTS save_trigger;
DELIMITER //

-- Trigger que al actualizar el log de la partida, actualiza la fecha de inicio/fin de la partida
CREATE TRIGGER save_trigger
AFTER INSERT ON Log_Partida
FOR EACH ROW
BEGIN
    -- Evento de inicio: Resetea la fecha fin
    IF NEW.eventoTrigger = 'inicio' THEN
        UPDATE Partida 
        SET fecha_fin = NULL
        WHERE id_partida = NEW.id_partida;
    END IF;
    
    -- Evento de salida o muerte: Se actualiza fecha_fin
    IF NEW.eventoTrigger IN ('salida', 'muerteMaldicion', 'muerteVida') THEN
        UPDATE Partida 
        SET fecha_fin = CURRENT_TIMESTAMP
        WHERE id_partida = NEW.id_partida AND fecha_fin IS NULL;
    END IF;
END 
//DELIMITER ;