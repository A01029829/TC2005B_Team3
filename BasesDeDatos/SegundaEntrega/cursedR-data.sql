-- Active: 1743625010510@@127.0.0.1@3306@cursedr
USE cursedR;

-- Catálogo de recompensas
INSERT INTO Recompensas (tipoR, valorR) VALUES
('vida', '25'),
('arma', 'Ballesta'),
('arma', 'Lanza'),
('arma', 'HachaDeGuerra'),
('arma', 'Daga'),
('arma', 'Ballesta'),
('arma', 'Lanza'),
('arma', 'HachaDeGuerra'),
('arma', 'Daga'),
('vida', '25');

-- Catálogo de daño por clase
INSERT INTO Clases (nombreClase, danoBasico, danoCargado, alcanceClase) VALUES
('Guerrero', 35, 60, 0),
('Arquero', 15, 40, 40),
('Hechicero', 20, 50, 20);

-- Catálogo de enemigos
-- FALTA AGREGAR DAÑO DE LOS ENEMIGOS
INSERT INTO Enemigo (nombreEnemigo, tipoEnemigo, bioma, nivel, HP, puntos) VALUES
('esqueleto', 'comun', 'desierto', 1, 70, 10),
('esqueleto', 'comun', 'desierto', 2, 100, 20),
('esqueleto', 'comun', 'desierto', 3, 150, 30),
('esqueleto', 'fuerte', 'desierto', 1, 200, 30),
('esqueleto', 'fuerte', 'desierto', 2, 350, 40),
('esqueleto', 'fuerte', 'desierto', 3, 500, 50),
('esqueleto', 'jefe', 'desierto', 1, 1000, 100),
('esqueleto', 'jefe', 'desierto', 2, 1500, 100),
('esqueleto', 'jefe', 'desierto', 3, 2000, 100),

('duende', 'comun', 'bosque', 1, 70, 10),
('duende', 'comun', 'bosque', 2, 100, 20),
('duende', 'comun', 'bosque', 3, 150, 30),
('duende', 'fuerte', 'bosque', 1, 200, 30),
('duende', 'fuerte', 'bosque', 2, 350, 40),
('duende', 'fuerte', 'bosque', 3, 500, 50),
('duende', 'jefe', 'bosque', 1, 1000, 100),
('duende', 'jefe', 'bosque', 2, 1500, 100),
('duende', 'jefe', 'bosque', 3, 2000, 100),

('lagarto', 'comun', 'bosque', 1, 70, 10),
('lagarto', 'comun', 'bosque', 2, 100, 20),
('lagarto', 'comun', 'bosque', 3, 150, 30),
('lagarto', 'fuerte', 'bosque', 1, 200, 30),
('lagarto', 'fuerte', 'bosque', 2, 350, 40),
('lagarto', 'fuerte', 'bosque', 3, 500, 50),
('lagarto', 'jefe', 'bosque', 1, 1000, 100),
('lagarto', 'jefe', 'bosque', 2, 1500, 100),
('lagarto', 'jefe', 'bosque', 3, 2000, 100),

('lobo', 'fuerte', 'nieve', 1, 200, 30),
('lobo', 'fuerte', 'nieve', 2, 350, 40),
('lobo', 'fuerte', 'nieve', 3, 500, 50),
('lobo', 'jefe', 'nieve', 1, 1000, 100),
('lobo', 'jefe', 'nieve', 2, 1500, 100),
('lobo', 'jefe', 'nieve', 3, 2000, 100),

('minotauro', 'fuerte', 'nieve', 1, 200, 30),
('minotauro', 'fuerte', 'nieve', 2, 350, 40),
('minotauro', 'fuerte', 'nieve', 3, 500, 50),
('minotauro', 'jefe', 'nieve', 1, 1000, 100),
('minotauro', 'jefe', 'nieve', 2, 1500, 100),
('minotauro', 'jefe', 'nieve', 3, 2000, 100);

-- Armas no sujetas a cambios
INSERT INTO Armas (nombreArma, danoArma, distanciaArma, efectoArma, duracionArma, usaDanoClase) VALUES
('Ballesta', 40, 30, 'ninguno', 60, FALSE),
('HachaDeGuerra', 45, 0, 'ninguno', 60, FALSE),
('Lanza', 40, 10, 'ninguno', 60, FALSE),
('Daga', NULL, 0, 'ninguno', 60, TRUE);

INSERT INTO Objetos (tipoObjeto, id_recompensa) VALUES
('curandero', 1),
('armero', 2),
('armero', 3),
('armero', 4),
('armero', 5),
('cofre', 6),
('cofre', 7),
('cofre', 8),
('cofre', 9),
('cofre', 10);

INSERT INTO Jugador (nombreUsuario, correo, contrasena) VALUES
('Juanito23', 'juanito23@gmail.com', 'Juanito123$'),
('Carlos_45', 'carlos45@hotmail.com', 'Carlos45&!'),
('Maria.gamer', 'maria_gamer@yahoo.com', 'MariaG123!'),
('Pro_Player99', 'proplayer@outlook.com', 'ProPlay99$'),
('Game_Master42', 'gamemaster42@gmail.com', 'Master42!$'),
('Dark_Knight', 'darkknight@hotmail.com', 'Knight123%'),
('Dragon.Slayer', 'dragonslayer@gmail.com', 'Dragon99!$'),
('Magic_User', 'magicuser@outlook.com', 'MagicU123!'),
('Archer_King', 'archerking@yahoo.com', 'Archer44$!'),
('Ninja_Shadow', 'ninjashadow@gmail.com', 'Shadow123?@');

INSERT INTO Partida (id_jugador, id_clase, tiempoPartida, nivelActual, salaActual, longitudMaldicion) VALUES
(1, 1, '00:01:30', 1, 1, 0.25),
(1, 2, '00:02:15', 1, 3, 0.22),
(1, 3, '00:03:20', 2, 2, 0.18),
(1, 2, '00:08:05', 3, 1, 0.05),
(2, 2, '00:03:45', 1, 2, 0.20),
(2, 3, '00:04:30', 2, 1, 0.18),
(2, 1, '00:05:10', 2, 3, 0.15),
(2, 3, '00:09:00', 3, 2, 0.10),
(2, 1, '00:10:00', 3, 3, 0.08),
(3, 3, '00:05:20', 2, 1, 0.15),
(3, 1, '00:06:45', 2, 3, 0.14),
(3, 2, '00:07:30', 3, 2, 0.12),
(3, 1, '00:08:50', 3, 1, 0.09),
(3, 2, '00:09:40', 3, 3, 0.06),
(4, 1, '00:06:15', 2, 2, 0.12),
(4, 2, '00:08:20', 3, 2, 0.09),
(4, 3, '00:09:10', 3, 3, 0.07),
(5, 2, '00:07:10', 3, 1, 0.10),
(5, 3, '00:09:50', 3, 3, 0.04),
(5, 1, '00:10:30', 3, 2, 0.01),
(5, 2, '00:11:00', 3, 1, 0.02);

-- Inserción en Partida_Enemigo sin la columna puntos (que ya no existe en la tabla)
INSERT INTO Partida_Enemigo (id_partida, id_enemigo, EneGenerados, EneDerrotados) VALUES
(1, 1, 5, 2),
(1, 2, 1, 0),
(2, 1, 10, 7),
(2, 4, 5, 3),
(3, 5, 3, 1),
(3, 6, 8, 5),
(4, 7, 4, 2),
(4, 10, 1, 1),
(5, 8, 7, 4),
(5, 9, 3, 2),
(6, 11, 1, 0),
(7, 1, 15, 10),
(7, 12, 1, 1),
(8, 4, 12, 9),
(8, 5, 6, 4),
(9, 6, 9, 7),
(9, 7, 5, 3),
(10, 8, 14, 12),
(10, 10, 2, 2),
(11, 1, 6, 3),
(12, 4, 8, 5),
(13, 9, 4, 2),
(14, 12, 1, 0),
(15, 11, 1, 1);

-- ObjGenerados tiene un máximo de 1 por nivel (solo puedo limitarlo por partida, cómo le hago para limitarlo por sala)
INSERT INTO Partida_Objetos (id_partida, id_objeto, ObjGenerados) VALUES
(1, 1, 1),
(1, 3, 1),
(2, 2, 1),
(2, 4, 1),
(3, 5, 1),
(3, 7, 1),
(4, 6, 1),
(4, 8, 1),
(5, 9, 1),
(5, 10, 1),
(6, 1, 1),
(7, 2, 1),
(8, 3, 1),
(8, 4, 1),
(9, 5, 1),
(9, 6, 1),
(10, 7, 1),
(10, 8, 1),
(11, 1, 1),
(12, 2, 1),
(13, 3, 1),
(14, 4, 1),
(15, 5, 1);

INSERT INTO Partida_Armas (id_partida, id_arma, tiempoArma) VALUES
(1, 1, '2025-03-15 10:30:45'),
(2, 1, '2025-03-16 15:38:55'),
(3, 4, '2025-03-17 10:27:14'),
(4, 2, '2025-03-17 17:52:36'),
(5, 1, '2025-03-18 12:18:49'),
(6, 3, '2025-03-18 18:12:39'),
(7, 4, '2025-03-19 08:30:21'),
(8, 2, '2025-03-19 13:45:56'),
(9, 1, '2025-03-20 10:10:33'),
(10, 3, '2025-03-20 15:25:47'),
(11, 2, '2025-03-21 09:05:12'),
(12, 4, '2025-03-21 14:18:30'),
(13, 1, '2025-03-22 11:33:44'),
(14, 3, '2025-03-22 16:42:10'),
(15, 2, '2025-03-23 10:15:23');