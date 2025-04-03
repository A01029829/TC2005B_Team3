-- Active: 1743625010510@@127.0.0.1@3306@cursedr
-- Creación del esquema
DROP SCHEMA IF EXISTS cursedR;
CREATE SCHEMA cursedR;
USE cursedR;

-- Tabla Recompensas (nueva)
CREATE TABLE Recompensas(
    id_recompensa INT AUTO_INCREMENT PRIMARY KEY,
    tipoR ENUM('vida', 'arma', 'pocima') NOT NULL,
    valorR VARCHAR(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla Clases (actualizada)
CREATE TABLE Clases(
    id_clase INT AUTO_INCREMENT PRIMARY KEY,
    nombreClase ENUM('Guerrero', 'Arquero', 'Hechicero') NOT NULL,
    danoBasico TINYINT NOT NULL,
    danoCargado TINYINT NOT NULL,
    alcanceClase TINYINT NOT NULL,
    CONSTRAINT chk_danoBasico CHECK (danoBasico IN (35, 15, 20)),
    CONSTRAINT chk_danoCargado CHECK (danoCargado IN (60, 40, 50)),
    CONSTRAINT chk_alcance CHECK (alcanceClase IN (0, 10, 20, 40))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla Enemigo (mejorada)
CREATE TABLE Enemigo(
    id_enemigo INT AUTO_INCREMENT PRIMARY KEY,
    nombreEnemigo ENUM('esqueleto', 'duende', 'lagarto', 'lobo', 'minotauro') NOT NULL,
    tipoEnemigo ENUM('comun', 'fuerte', 'jefe') NOT NULL,
    bioma ENUM('desierto', 'bosque', 'nieve') NOT NULL,
    nivel TINYINT DEFAULT 1 NOT NULL,
    HP SMALLINT NOT NULL,
    CONSTRAINT chk_HP_bioma CHECK (
        (bioma = 'desierto' AND nombreEnemigo = 'esqueleto' AND (
            (nivel = 1 AND HP = 70) OR
            (nivel = 2 AND HP = 100) OR
            (nivel = 3 AND HP = 150)
        )) OR
        (bioma = 'bosque' AND nombreEnemigo IN ('duende', 'lagarto') AND (
            (tipoEnemigo = 'comun' AND HP = 70) OR
            (tipoEnemigo = 'fuerte' AND HP = 200)
        )) OR
        (bioma = 'nieve' AND nombreEnemigo IN ('lobo', 'minotauro') AND HP = 200) OR
        (tipoEnemigo = 'jefe' AND (
            (nivel = 1 AND HP = 1000) OR
            (nivel = 2 AND HP = 1500) OR
            (nivel = 3 AND HP = 2000)
        ))
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla Armas (actualizada)
CREATE TABLE Armas(
    id_arma INT AUTO_INCREMENT PRIMARY KEY,
    nombreArma VARCHAR(20) NOT NULL,
    danoArma TINYINT NULL,
    distanciaArma TINYINT NOT NULL,
    efectoArma ENUM('timeAttack/2', 'ninguno') DEFAULT 'ninguno',
    duracionArma TINYINT DEFAULT 60,
    usaDanoClase BOOLEAN DEFAULT FALSE,
    CONSTRAINT chk_duracionArma CHECK (duracionArma = 60),
    CONSTRAINT chk_danoArma CHECK (
        (usaDanoClase = FALSE AND danoArma IN (40, 45)) OR
        (usaDanoClase = TRUE AND danoArma IS NULL)
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla Objetos (mejorada)
CREATE TABLE Objetos(
    id_objeto INT AUTO_INCREMENT PRIMARY KEY,
    tipoObjeto ENUM('curandero', 'armero', 'cofre') NOT NULL,
    id_recompensa INT NOT NULL,
    FOREIGN KEY (id_recompensa) REFERENCES Recompensas(id_recompensa)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla Jugador
CREATE TABLE Jugador(
    id_jugador INT AUTO_INCREMENT PRIMARY KEY,
    nombreUsuario VARCHAR(20) NOT NULL,
    correo VARCHAR(255) NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    fechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_nombreUsuario CHECK (nombreUsuario REGEXP '^[a-zA-Z0-9._]{3,20}$'),
    CONSTRAINT chk_correo CHECK (correo REGEXP '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
    CONSTRAINT chk_contrasena CHECK (contrasena REGEXP '^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla Partida (central)
CREATE TABLE Partida(
    id_partida INT AUTO_INCREMENT PRIMARY KEY,
    id_jugador INT NOT NULL,
    id_clase INT NOT NULL,
    tiempoPartida TIME NOT NULL,
    nivelActual TINYINT DEFAULT 1 NOT NULL,
    salaActual TINYINT DEFAULT 1 NOT NULL,
    longitudMaldicion DECIMAL(5,2) NOT NULL,
    FOREIGN KEY (id_jugador) REFERENCES Jugador(id_jugador),
    FOREIGN KEY (id_clase) REFERENCES Clases(id_clase)
    -- Restricciones CHECK permanecen igual
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tablas Intermedias (mejoradas)
CREATE TABLE Partida_Enemigo(
    id_partida INT NOT NULL,
    id_enemigo INT NOT NULL,
    EneGenerados TINYINT DEFAULT 0,
    EneDerrotados TINYINT DEFAULT 0,
    PRIMARY KEY (id_partida, id_enemigo),
    FOREIGN KEY (id_partida) REFERENCES Partida(id_partida),
    FOREIGN KEY (id_enemigo) REFERENCES Enemigo(id_enemigo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE Partida_Enemigo 
ADD puntos TINYINT DEFAULT 0;

-- Luego crear trigger para actualizarla
DELIMITER //
CREATE TRIGGER calcular_puntos_enemigo
BEFORE INSERT ON Partida_Enemigo
FOR EACH ROW
BEGIN
    DECLARE tipo_e VARCHAR(10);
    
    -- Obtener el tipo de enemigo
    SELECT tipoEnemigo INTO tipo_e
    FROM Enemigo
    WHERE id_enemigo = NEW.id_enemigo;
    
    -- Calcular puntos basados en el tipo y número de enemigos derrotados
    IF tipo_e = 'comun' THEN
        SET NEW.puntos = NEW.EneDerrotados * 10;
    ELSEIF tipo_e = 'fuerte' THEN
        SET NEW.puntos = NEW.EneDerrotados * 30;
    ELSEIF tipo_e = 'jefe' THEN
        SET NEW.puntos = NEW.EneDerrotados * 100;
    END IF;
END //
DELIMITER ;

-- También necesitamos un trigger para UPDATE
DELIMITER //
CREATE TRIGGER actualizar_puntos_enemigo
BEFORE UPDATE ON Partida_Enemigo
FOR EACH ROW
BEGIN
    DECLARE tipo_e VARCHAR(10);
    
    -- Obtener el tipo de enemigo
    SELECT tipoEnemigo INTO tipo_e
    FROM Enemigo
    WHERE id_enemigo = NEW.id_enemigo;
    
    -- Recalcular puntos si cambia el número de enemigos derrotados
    IF NEW.EneDerrotados != OLD.EneDerrotados THEN
        IF tipo_e = 'comun' THEN
            SET NEW.puntos = NEW.EneDerrotados * 10;
        ELSEIF tipo_e = 'fuerte' THEN
            SET NEW.puntos = NEW.EneDerrotados * 30;
        ELSEIF tipo_e = 'jefe' THEN
            SET NEW.puntos = NEW.EneDerrotados * 100;
        END IF;
    END IF;
END //
DELIMITER ;

-- Esta tabla deberá tener un trigger en el futuro para evitar que se generen más de 1 objeto por sala y
-- 2 por nivel
CREATE TABLE Partida_Objetos(
    id_partida INT NOT NULL,
    id_objeto INT NOT NULL,
    ObjGenerados TINYINT DEFAULT 0,
    PRIMARY KEY (id_partida, id_objeto),
    FOREIGN KEY (id_partida) REFERENCES Partida(id_partida),
    FOREIGN KEY (id_objeto) REFERENCES Objetos(id_objeto)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE Partida_Armas(
    id_partida INT NOT NULL,
    id_arma INT NOT NULL,
    tiempoArma TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_partida, id_arma),
    FOREIGN KEY (id_partida) REFERENCES Partida(id_partida),
    FOREIGN KEY (id_arma) REFERENCES Armas(id_arma)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Vista de Puntuaciones
CREATE VIEW Puntuaciones AS
SELECT 
    p.id_partida,
    j.nombreUsuario,
    SUM(pe.puntos) AS puntuacion_total
FROM Partida p
JOIN Jugador j ON p.id_jugador = j.id_jugador
JOIN Partida_Enemigo pe ON p.id_partida = pe.id_partida
GROUP BY p.id_partida, j.nombreUsuario;