-- Active: 1743625010510@@127.0.0.1@3306@cursedr
DROP SCHEMA IF EXISTS cursedR;
CREATE SCHEMA cursedR;
USE cursedR;

CREATE TABLE Partida(
    id_partida INT AUTO_INCREMENT PRIMARY KEY,
    id_jugador INT NOT NULL,
    id_clase INT NOT NULL,
    tiempoPartida TIME NOT NULL,
    nivelActual TINYINT DEFAULT 1 NOT NULL,
    salaActual TINYINT DEFAULT 1 NOT NULL,
    longitudMaldicion DECIMAL(5,2) NOT NULL,
    puntajeTotal INT DEFAULT 0,
    FOREIGN KEY (id_jugador) REFERENCES Jugador(id_jugador),
    FOREIGN KEY (id_clase) REFERENCES Clases(id_clase)
    -- Restricciones CHECK permanecen igual
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;