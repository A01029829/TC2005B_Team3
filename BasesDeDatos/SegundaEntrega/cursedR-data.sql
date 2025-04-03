USE cursedR;

INSERT INTO Recompensas (tipoR, valorR) VALUES
('vida', '50'),
('vida', '100'),
('arma', 'Ballesta'),
('arma', 'Lanza'),
('arma', 'HachaDeGuerra'),
('arma', 'Daga'),
('pocima', 'Velocidad'),
('pocima', 'Fuerza'),
('pocima', 'Resistencia'),
('pocima', 'Invisibilidad');

-- Inserción de Clases (respetando los valores permitidos)
INSERT INTO Clases (nombreClase, danoBasico, danoCargado, alcanceClase) VALUES
('Guerrero', 35, 60, 0),    -- Cuerpo a cuerpo (distancia 0)
('Arquero', 15, 40, 40),     -- Distancia 40
('Hechicero', 20, 50, 20);   -- Distancia 20

-- Inserción de Enemigos corregida para cumplir con las restricciones de HP por bioma
INSERT INTO Enemigo (nombreEnemigo, tipoEnemigo, bioma, nivel, HP) VALUES
-- Desierto - Esqueletos (común)
('esqueleto', 'comun', 'desierto', 1, 70),    -- Nivel 1 común
('esqueleto', 'comun', 'desierto', 2, 100),   -- Nivel 2 común
('esqueleto', 'comun', 'desierto', 3, 150),   -- Nivel 3 común
('esqueleto', 'jefe', 'desierto', 1, 1000),   -- Jefe nivel 1
('esqueleto', 'jefe', 'desierto', 2, 1500),   -- Jefe nivel 2 
('esqueleto', 'jefe', 'desierto', 3, 2000),   -- Jefe nivel 3
('duende', 'comun', 'bosque', 1, 70),        -- Común (HP=70 fijo)
('duende', 'fuerte', 'bosque', 1, 200),      -- Fuerte (HP=200 fijo)
('duende', 'jefe', 'bosque', 1, 1000),       -- Jefe nivel 1
('duende', 'jefe', 'bosque', 2, 1500),       -- Jefe nivel 2
('duende', 'jefe', 'bosque', 3, 2000),       -- Jefe nivel 3
('lagarto', 'comun', 'bosque', 1, 70),       -- Común (HP=70 fijo)
('lagarto', 'fuerte', 'bosque', 1, 200),     -- Fuerte (HP=200 fijo)
('lagarto', 'jefe', 'bosque', 1, 1000),      -- Jefe nivel 1
('lagarto', 'jefe', 'bosque', 2, 1500),      -- Jefe nivel 2
('lagarto', 'jefe', 'bosque', 3, 2000),      -- Jefe nivel 3
('lobo', 'comun', 'nieve', 1, 200),          -- HP=200 fijo para nieve
('lobo', 'jefe', 'nieve', 1, 1000),          -- Jefe nivel 1
('lobo', 'jefe', 'nieve', 2, 1500),          -- Jefe nivel 2
('lobo', 'jefe', 'nieve', 3, 2000),          -- Jefe nivel 3
('minotauro', 'comun', 'nieve', 1, 200),     -- HP=200 fijo para nieve
('minotauro', 'jefe', 'nieve', 1, 1000),     -- Jefe nivel 1
('minotauro', 'jefe', 'nieve', 2, 1500),     -- Jefe nivel 2
('minotauro', 'jefe', 'nieve', 3, 2000);     -- Jefe nivel 3

-- Corrección: Solo insertar las 4 armas que existen en el esquema
INSERT INTO Armas (nombreArma, danoArma, distanciaArma, efectoArma, duracionArma, usaDanoClase) VALUES
('Ballesta', 40, 30, 'ninguno', 60, FALSE),
('HachaDeGuerra', 45, 0, 'ninguno', 60, FALSE),
('Lanza', 40, 10, 'ninguno', 60, FALSE),
('Daga', NULL, 0, 'ninguno', 60, TRUE);

-- Inserción de Objetos
INSERT INTO Objetos (tipoObjeto, id_recompensa) VALUES
('curandero', 1),
('curandero', 2),
('armero', 3),
('armero', 4),
('armero', 5),
('armero', 6),
('cofre', 7),
('cofre', 8),
('cofre', 9),
('cofre', 10);

-- Inserción de Jugadores con contraseñas que cumplen con la expresión regular
INSERT INTO Jugador (nombreUsuario, correo, contrasena) VALUES
('Juanito23', 'juanito23@gmail.com', 'Juanito123$'),  -- Añadido $ como carácter especial
('Carlos_45', 'carlos45@hotmail.com', 'Carlos45&!'),   -- Añadido ! para tener 8+ caracteres
('Maria.gamer', 'maria_gamer@yahoo.com', 'MariaG123!'), -- Ya es válida
('Pro_Player99', 'proplayer@outlook.com', 'ProPlay99$'), -- Añadido $ como carácter especial
('Game_Master42', 'gamemaster42@gmail.com', 'Master42!$'), -- Añadido $ para tener más variedad
('Dark_Knight', 'darkknight@hotmail.com', 'Knight123%'), -- Ya es válida
('Dragon.Slayer', 'dragonslayer@gmail.com', 'Dragon99!$'), -- Añadido $ como carácter adicional
('Magic_User', 'magicuser@outlook.com', 'MagicU123!'), -- Ya es válida
('Archer_King', 'archerking@yahoo.com', 'Archer44$!'), -- Ya es válida
('Ninja_Shadow', 'ninjashadow@gmail.com', 'Shadow123?@'); -- Añadido @ como carácter adicional

-- Inserción de Partidas (cada jugador tiene 3 partidas diferentes)
INSERT INTO Partida (id_jugador, id_clase, tiempoPartida, nivelActual, salaActual, longitudMaldicion) VALUES
-- Partidas del jugador 1 (Juanito23)
(1, 1, '00:01:30', 1, 1, 0.25),
(1, 2, '00:02:15', 1, 3, 0.22),
(1, 3, '00:03:20', 2, 2, 0.18),
(1, 2, '00:08:05', 3, 1, 0.05),

-- Partidas del jugador 2 (Carlos_45)
(2, 2, '00:03:45', 1, 2, 0.20),
(2, 3, '00:04:30', 2, 1, 0.18),
(2, 1, '00:05:10', 2, 3, 0.15),
(2, 3, '00:09:00', 3, 2, 0.10),
(2, 1, '00:10:00', 3, 3, 0.08),

-- Partidas del jugador 3 (Maria.gamer)
(3, 3, '00:05:20', 2, 1, 0.15),
(3, 1, '00:06:45', 2, 3, 0.14),
(3, 2, '00:07:30', 3, 2, 0.12),
(3, 1, '00:08:50', 3, 1, 0.09),
(3, 2, '00:09:40', 3, 3, 0.06),

-- Partidas del jugador 4 (Pro_Player99)
(4, 1, '00:06:15', 2, 2, 0.12),
(4, 2, '00:08:20', 3, 2, 0.09),
(4, 3, '00:09:10', 3, 3, 0.07),

-- Partidas del jugador 5 (Game_Master42)
(5, 2, '00:07:10', 3, 1, 0.10),
(5, 3, '00:09:50', 3, 3, 0.04),
(5, 1, '00:10:30', 3, 2, 0.01),
(5, 2, '00:11:00', 3, 1, 0.02);

-- Inserción en Partida_Enemigo (con datos para probar la generación del mapa)
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

-- Actualizar las inserciones para incluir nivel y sala
INSERT INTO Partida_Objetos (id_partida, id_objeto, ObjGenerados, nivel, sala) VALUES
(1, 1, 1, 1, 1),
(1, 3, 1, 1, 2),
(2, 2, 1, 1, 1),
(2, 4, 1, 1, 2),
(3, 5, 1, 2, 1),
(3, 7, 1, 2, 2),
(4, 6, 1, 2, 1),
(4, 8, 1, 2, 2),
(5, 9, 1, 3, 1),
(5, 10, 1, 3, 2),
(6, 1, 1, 3, 1),
(7, 2, 1, 3, 2),
(8, 3, 1, 3, 1),
(8, 4, 1, 3, 2),
(9, 5, 1, 3, 1),
(9, 6, 1, 3, 2),
(10, 7, 1, 3, 1),
(10, 8, 1, 3, 2);

-- Corrección: Partida_Armas solo con referencias válidas (solo hay 4 armas: ids 1-4)
INSERT INTO Partida_Armas (id_partida, id_arma, tiempoArma) VALUES
(1, 1, '2025-03-15 10:30:45'),
(1, 3, '2025-03-15 11:45:20'),
(2, 2, '2025-03-16 14:22:10'),
(2, 1, '2025-03-16 15:38:55'),  -- Cambiado id_arma de 5 a 1
(3, 3, '2025-03-17 09:15:32'),
(3, 4, '2025-03-17 10:27:14'),  -- Cambiado id_arma de 7 a 4
(4, 4, '2025-03-17 16:40:18'),
(4, 2, '2025-03-17 17:52:36'),  -- Cambiado id_arma de 9 a 2
(5, 1, '2025-03-18 11:05:27'),  -- Cambiado id_arma de 5 a 1
(5, 1, '2025-03-18 12:18:49'),
(6, 3, '2025-03-18 18:12:39'),  -- Cambiado id_arma de 6 a 3
(7, 4, '2025-03-19 08:30:21'),  -- Cambiado id_arma de 7 a 4
(8, 2, '2025-03-19 13:45:56'),  -- Cambiado id_arma de 8 a 2
(9, 1, '2025-03-20 10:10:33'),  -- Cambiado id_arma de 9 a 1
(10, 3, '2025-03-20 15:25:47'), -- Cambiado id_arma de 10 a 3
(11, 2, '2025-03-21 09:05:12'),
(12, 4, '2025-03-21 14:18:30'),
(13, 1, '2025-03-22 11:33:44'), -- Cambiado id_arma de 6 a 1
(14, 3, '2025-03-22 16:42:10'), -- Cambiado id_arma de 8 a 3
(15, 2, '2025-03-23 10:15:23'); -- Cambiado id_arma de 10 a 2