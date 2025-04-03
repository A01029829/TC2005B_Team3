-- Active: 1743625010510@@127.0.0.1@3306@cursedr
DROP SCHEMA IF EXISTS cursedR;
CREATE SCHEMA cursedR;
USE cursedR;

CREATE TABLE Enemigo(
  id_enemigo INT AUTO_INCREMENT,
  tipoEnemigo ENUM('comun', 'fuerte', 'jefe'),
  bioma ENUM('desierto', 'bosque', 'nieve'),
  HP SMALLINT,

  PRIMARY KEY (id_enemigo),
  CONSTRAINT chk_HP CHECK (HP BETWEEN 0 AND 2000)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE Armas(
  id_arma INT AUTO_INCREMENT,
  nombre VARCHAR(20),
  dano TINYINT,
  distancia TINYINT NOT NULL,
  efecto ENUM('timeAttack/2',''),
  duracion TINYINT DEFAULT 60,
  
  PRIMARY KEY (id_arma),
  CONSTRAINT chk_duracion CHECK (duracion = 60)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE Clases(
  id_clase INT AUTO_INCREMENT,
  nombreClase ENUM('Guerrero', 'Arquero', 'Hechicero'),
  danoBasico TINYINT NOT NULL,
  danoCargado TINYINT NOT NULL,
  alcance TINYINT NOT NULL,

  PRIMARY KEY (id_clase),
  CONSTRAINT chk_danoBasico CHECK (danoBasico IN (35, 15, 20, 40, 45)), -- incluye los valores que se actualizaran al recoger armas
  CONSTRAINT chk_danoCargado CHECK (danoCargado IN (60, 40, 50)),
  CONSTRAINT chk_alcance CHECK (alcance IN (0, 10, 20, 30, 40))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE Partida(
  id_partida INT AUTO_INCREMENT,
  id_clase INT,

  tiempo TIME,
  puntuacion TINYINT DEFAULT 0,
  nivelActual TINYINT DEFAULT 1,
  salaActual TINYINT DEFAULT 1,
  longitudMaldicion DECIMAL(5,2),
  -- objetoPsala TINYINT,
  -- enemigosCDerrotados TINYINT,
  -- enemigosFDerrotados TINYINT,
  -- jefesDerrotados TINYINT,
  
  PRIMARY KEY (id_partida),
  FOREIGN KEY (id_clase) REFERENCES Clases(id_clase),

  CONSTRAINT chk_tiempo CHECK (tiempo BETWEEN '00:00:00' AND '00:10:00'),
  CONSTRAINT chk_puntuacion CHECK (puntuacion BETWEEN 0 AND 10200),
  CONSTRAINT chk_nivelActual CHECK (nivelActual BETWEEN 1 AND 3),
  CONSTRAINT chk_salaActual CHECK (salaActual BETWEEN 1 AND 4),
  CONSTRAINT chk_longitudMaldicion CHECK (longitudMaldicion BETWEEN 0.00 AND 1.00)
  -- CONSTRAINT chk_objetoPsala CHECK (objetoPsala BETWEEN 0 AND 6),
  -- CONSTRAINT chk_enemigosCDerrotados CHECK (enemigosCDerrotados BETWEEN 0 AND 45),
  -- CONSTRAINT chk_enemigosFDerrotados CHECK (enemigosFDerrotados BETWEEN 0 AND 9),
  -- CONSTRAINT chk_jefesDerrotados CHECK (jefesDerrotados BETWEEN 0 AND 3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE Objetos(
  id_objeto INT AUTO_INCREMENT,
  tipoObjeto ENUM('curandero', 'armero', 'cofre'),
  recompensa ENUM('vida', 'armaSec', 'pocimaOarma'),

  PRIMARY KEY (id_objeto)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE Partida_Objetos(
  id_partida INT,
  id_objeto INT,
  ObjGenerados TINYINT DEFAULT 0,

  PRIMARY KEY (id_partida, id_objeto),
  FOREIGN KEY (id_partida) REFERENCES Partida(id_partida),
  FOREIGN KEY (id_objeto) REFERENCES Objetos(id_objeto)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE Partida_Enemigo(
  id_partida INT,
  id_enemigo INT,
  EneGenerados TINYINT DEFAULT 0,
  EneDerrotados TINYINT DEFAULT 0,

  PRIMARY KEY (id_partida, id_enemigo),
  FOREIGN KEY (id_partida) REFERENCES Partida(id_partida),
  FOREIGN KEY (id_enemigo) REFERENCES Enemigo(id_enemigo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE Partida_Armas(
  id_partida INT,
  id_arma INT,
  tiempoArma TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id_partida, id_arma),
  FOREIGN KEY (id_partida) REFERENCES Partida(id_partida),
  FOREIGN KEY (id_arma) REFERENCES Armas(id_arma)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE Jugador(
    id_jugador INT AUTO_INCREMENT,

    nombreUsuario VARCHAR(20) NOT NULL,
    correo VARCHAR(255) NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    fechaRegistro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_nombreUsuario CHECK (nombreUsuario REGEXP '^[a-zA-Z0-9._]{3,20}$'),
    CONSTRAINT chk_correo CHECK (correo REGEXP '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
    CONSTRAINT chk_contrasena CHECK (contrasena REGEXP '^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'),

    PRIMARY KEY (id_jugador)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE Partida
ADD id_jugador INT,
ADD FOREIGN KEY (id_jugador) REFERENCES Jugador(id_jugador);
