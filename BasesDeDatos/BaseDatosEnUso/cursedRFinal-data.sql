-- Active: 1743625010510@@127.0.0.1@3306@cursedr

-- Nota: Estos inserts fueron solo de referencia, los correctos se harán directamente
-- desde el front-end, pero se dejan aquí para pruebas y ejemplos.
USE cursedR;

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

INSERT INTO Partida (id_partida, id_jugador) VALUES
(1),
(2),
(3),
(4),
(5),
(6),
(7),
(8),
(9),
(10),
(11);

INSERT INTO Log_Partida 
(id_partida, fechaLog, eventoTrigger, claseElegida, tiempoPartida, puntuacion, 
nivelActual, salaActual, biomaActual, rankM, vida, 
enemigosCDerrotados, enemigosFDerrotados, jefesDerrotados, objetosEncontrados) VALUES
(1, '2025-03-15 10:00:00', 'inicio', 'guerrero', '00:00:00', 0, 1, 1, 'bosque', 100.00, 120.00, 0, 0, 0, 'cofre'),
(1, '2025-03-15 10:05:15', 'checkpoints', 'guerrero', '00:05:15', 50, 1, 2, 'bosque', 90.50, 85.50, 3, 1, 0, 'armero'),
(1, '2025-03-15 10:10:30', 'checkpoints', 'guerrero', '00:10:30', 120, 1, 3, 'bosque', 80.25, 70.00, 5, 2, 0, 'curandero'),
(1, '2025-03-15 10:15:30', 'muerteVida', 'guerrero', '00:15:30', 175, 1, 4, 'bosque', 75.10, 0.00, 7, 3, 0, 'cofre');

INSERT INTO Log_Partida 
(id_partida, fechaLog, eventoTrigger, claseElegida, tiempoPartida, puntuacion, 
nivelActual, salaActual, biomaActual, rankM, vida, 
enemigosCDerrotados, enemigosFDerrotados, jefesDerrotados, objetosEncontrados) VALUES
(2, '2025-03-16 15:30:00', 'inicio', 'arquero', '00:00:00', 0, 1, 1, 'nieve', 100.00, 90.00, 0, 0, 0, 'armero'),
(2, '2025-03-16 15:35:10', 'checkpoints', 'arquero', '00:05:10', 60, 1, 2, 'nieve', 88.75, 80.00, 4, 1, 0, 'curandero'),
(2, '2025-03-16 15:40:05', 'checkpoints', 'arquero', '00:10:05', 130, 1, 3, 'nieve', 75.50, 65.25, 6, 2, 0, 'cofre'),
(2, '2025-03-16 15:45:15', 'checkpoints', 'arquero', '00:15:15', 200, 1, 4, 'nieve', 68.30, 50.75, 8, 3, 1, 'armero');

INSERT INTO Log_Partida 
(id_partida, fechaLog, eventoTrigger, claseElegida, tiempoPartida, puntuacion, 
nivelActual, salaActual, biomaActual, rankM, vida, 
enemigosCDerrotados, enemigosFDerrotados, jefesDerrotados, objetosEncontrados) VALUES
(3, '2025-03-17 09:45:00', 'inicio', 'hechicero', '00:00:00', 0, 1, 1, 'desierto', 100.00, 80.00, 0, 0, 0, 'curandero'),
(3, '2025-03-17 09:50:05', 'checkpoints', 'hechicero', '00:05:05', 55, 1, 2, 'desierto', 92.25, 85.50, 3, 1, 0, 'cofre'),
(3, '2025-03-17 09:55:15', 'checkpoints', 'hechicero', '00:10:15', 125, 1, 3, 'desierto', 85.75, 70.25, 5, 2, 0, 'armero'),
(3, '2025-03-17 10:00:20', 'checkpoints', 'hechicero', '00:15:20', 180, 1, 4, 'desierto', 75.50, 60.00, 7, 3, 1, 'curandero'),
(3, '2025-03-17 10:05:20', 'muerteMaldicion', 'hechicero', '00:20:20', 250, 2, 1, 'bosque', 0.00, 85.00, 8, 3, 1, 'cofre');

INSERT INTO Log_Partida 
(id_partida, fechaLog, eventoTrigger, claseElegida, tiempoPartida, puntuacion, 
nivelActual, salaActual, biomaActual, rankM, vida, 
enemigosCDerrotados, enemigosFDerrotados, jefesDerrotados, objetosEncontrados) VALUES
(4, '2025-03-17 17:30:00', 'inicio', 'guerrero', '00:00:00', 0, 1, 1, 'bosque', 100.00, 120.00, 0, 0, 0, 'armero'),
(4, '2025-03-17 17:35:15', 'checkpoints', 'guerrero', '00:05:15', 60, 1, 2, 'bosque', 92.00, 80.50, 4, 1, 0, 'curandero'),
(4, '2025-03-17 17:40:30', 'checkpoints', 'guerrero', '00:10:30', 140, 1, 4, 'bosque', 83.50, 65.25, 7, 2, 1, 'cofre'),
(4, '2025-03-17 17:45:45', 'pausa', 'guerrero', '00:15:45', 200, 2, 2, 'nieve', 95.00, 90.00, 10, 3, 1, 'armero'),
(4, '2025-03-17 17:50:30', 'checkpoints', 'guerrero', '00:20:30', 275, 2, 4, 'nieve', 85.75, 75.50, 12, 4, 2, 'curandero'),
(4, '2025-03-17 17:55:05', 'checkpoints', 'guerrero', '00:25:05', 350, 3, 3, 'desierto', 80.00, 60.25, 15, 6, 3, 'cofre');

INSERT INTO Log_Partida 
(id_partida, fechaLog, eventoTrigger, claseElegida, tiempoPartida, puntuacion, 
nivelActual, salaActual, biomaActual, rankM, vida, 
enemigosCDerrotados, enemigosFDerrotados, jefesDerrotados, objetosEncontrados) VALUES
(5, '2025-03-18 12:00:00', 'inicio', 'arquero', '00:00:00', 0, 1, 1, 'nieve', 100.00, 90.00, 0, 0, 0, 'cofre'),
(5, '2025-03-18 12:05:20', 'checkpoints', 'arquero', '00:05:20', 40, 1, 2, 'nieve', 85.25, 70.50, 2, 1, 0, 'armero'),
(5, '2025-03-18 12:10:30', 'checkpoints', 'arquero', '00:10:30', 70, 1, 3, 'nieve', 60.00, 35.25, 4, 2, 0, 'curandero'),
(5, '2025-03-18 12:15:45', 'checkpoints', 'arquero', '00:15:45', 90, 1, 4, 'nieve', 30.50, 15.00, 5, 2, 0, 'cofre'),
(5, '2025-03-18 12:18:45', 'muerteVida', 'arquero', '00:18:45', 100, 1, 4, 'nieve', 25.75, 0.00, 6, 2, 0, 'curandero');

INSERT INTO Log_Partida 
(id_partida, fechaLog, eventoTrigger, claseElegida, tiempoPartida, puntuacion, 
nivelActual, salaActual, biomaActual, rankM, vida, 
enemigosCDerrotados, enemigosFDerrotados, jefesDerrotados, objetosEncontrados) VALUES
(6, '2025-03-18 18:00:00', 'inicio', 'hechicero', '00:00:00', 0, 1, 1, 'desierto', 100.00, 80.00, 0, 0, 0, 'armero'),
(6, '2025-03-18 18:03:10', 'pausa', 'hechicero', '00:03:10', 20, 1, 1, 'desierto', 95.50, 90.25, 1, 0, 0, 'armero'),
(6, '2025-03-18 18:06:20', 'checkpoints', 'hechicero', '00:06:20', 50, 1, 2, 'desierto', 90.00, 80.50, 3, 1, 0, 'curandero'),
(6, '2025-03-18 18:09:45', 'pausa', 'hechicero', '00:09:45', 80, 1, 3, 'desierto', 82.75, 70.00, 5, 2, 0, 'cofre'),
(6, '2025-03-18 18:12:30', 'checkpoints', 'hechicero', '00:12:30', 110, 1, 4, 'desierto', 75.50, 60.25, 7, 3, 0, 'curandero'),
(6, '2025-03-18 18:15:30', 'muerteMaldicion', 'hechicero', '00:15:30', 150, 1, 4, 'desierto', 0.00, 55.75, 8, 3, 1, 'armero');

INSERT INTO Log_Partida 
(id_partida, fechaLog, eventoTrigger, claseElegida, tiempoPartida, puntuacion, 
nivelActual, salaActual, biomaActual, rankM, vida, 
enemigosCDerrotados, enemigosFDerrotados, jefesDerrotados, objetosEncontrados) VALUES
(7, '2025-03-19 08:15:00', 'inicio', 'guerrero', '00:00:00', 0, 1, 1, 'bosque', 100.00, 120.00, 0, 0, 0, 'cofre'),
(7, '2025-03-19 08:20:15', 'checkpoints', 'guerrero', '00:05:15', 55, 1, 2, 'bosque', 92.50, 85.00, 3, 1, 0, 'armero'),
(7, '2025-03-19 08:25:30', 'pausa', 'guerrero', '00:10:30', 100, 1, 3, 'bosque', 85.25, 75.50, 5, 2, 0, 'curandero');

INSERT INTO Log_Partida 
(id_partida, fechaLog, eventoTrigger, claseElegida, tiempoPartida, puntuacion, 
nivelActual, salaActual, biomaActual, rankM, vida, 
enemigosCDerrotados, enemigosFDerrotados, jefesDerrotados, objetosEncontrados) VALUES
(8, '2025-03-19 13:30:00', 'inicio', 'arquero', '00:00:00', 0, 1, 1, 'nieve', 100.00, 90.00, 0, 0, 0, 'curandero'),
(8, '2025-03-19 13:35:10', 'checkpoints', 'arquero', '00:05:10', 50, 1, 2, 'nieve', 90.00, 80.00, 3, 1, 0, 'cofre'),
(8, '2025-03-19 13:40:20', 'checkpoints', 'arquero', '00:10:20', 110, 1, 4, 'nieve', 75.50, 50.25, 6, 2, 1, 'armero'),
(8, '2025-03-19 13:45:30', 'checkpoints', 'arquero', '00:15:30', 180, 2, 2, 'desierto', 95.00, 90.00, 8, 3, 1, 'curandero'),
(8, '2025-03-19 13:50:45', 'checkpoints', 'arquero', '00:20:45', 210, 2, 3, 'desierto', 70.25, 40.50, 10, 4, 1, 'cofre'),
(8, '2025-03-19 13:55:00', 'muerteMaldicion', 'arquero', '00:25:00', 220, 2, 3, 'desierto', 0.00, 38.25, 10, 4, 1, 'armero');

INSERT INTO Log_Partida 
(id_partida, fechaLog, eventoTrigger, claseElegida, tiempoPartida, puntuacion, 
nivelActual, salaActual, biomaActual, rankM, vida, 
enemigosCDerrotados, enemigosFDerrotados, jefesDerrotados, objetosEncontrados) VALUES
(9, '2025-03-20 10:00:00', 'inicio', 'hechicero', '00:00:00', 0, 1, 1, 'bosque', 100.00, 80.00, 0, 0, 0, 'armero'),
(9, '2025-03-20 10:05:10', 'checkpoints', 'hechicero', '00:05:10', 60, 1, 2, 'bosque', 90.50, 85.00, 4, 1, 0, 'curandero'),
(9, '2025-03-20 10:10:25', 'checkpoints', 'hechicero', '00:10:25', 130, 1, 3, 'bosque', 80.75, 70.50, 7, 2, 0, 'cofre'),
(9, '2025-03-20 10:15:40', 'checkpoints', 'hechicero', '00:15:40', 170, 1, 4, 'bosque', 70.00, 55.25, 9, 3, 0, 'armero'),
(9, '2025-03-20 10:20:33', 'checkpoints', 'hechicero', '00:20:33', 200, 1, 4, 'bosque', 60.25, 40.50, 10, 4, 1, 'curandero');

INSERT INTO Log_Partida 
(id_partida, fechaLog, eventoTrigger, claseElegida, tiempoPartida, puntuacion, 
nivelActual, salaActual, biomaActual, rankM, vida, 
enemigosCDerrotados, enemigosFDerrotados, jefesDerrotados, objetosEncontrados) VALUES
(10, '2025-03-20 15:15:00', 'inicio', 'guerrero', '00:00:00', 0, 1, 1, 'nieve', 100.00, 120.00, 0, 0, 0, 'cofre'),
(10, '2025-03-20 15:20:10', 'checkpoints', 'guerrero', '00:05:10', 60, 1, 3, 'nieve', 90.50, 80.00, 4, 1, 0, 'armero'),
(10, '2025-03-20 15:25:20', 'checkpoints', 'guerrero', '00:10:20', 140, 1, 4, 'nieve', 80.75, 65.50, 7, 2, 1, 'curandero'),
(10, '2025-03-20 15:30:35', 'checkpoints', 'guerrero', '00:15:35', 230, 2, 3, 'desierto', 95.00, 90.25, 12, 4, 1, 'cofre'),
(10, '2025-03-20 15:35:47', 'checkpoints', 'guerrero', '00:20:47', 400, 3, 1, 'bosque', 88.50, 75.00, 20, 8, 3, 'armero');

INSERT INTO Log_Partida 
(id_partida, fechaLog, eventoTrigger, claseElegida, tiempoPartida, puntuacion, 
nivelActual, salaActual, biomaActual, rankM, vida, 
enemigosCDerrotados, enemigosFDerrotados, jefesDerrotados, objetosEncontrados) VALUES
(11, '2025-03-20 11:00:00', 'inicio', 'arquero', '00:00:00', 0, 1, 1, 'bosque', 100.00, 90.00, 0, 0, 0, 'armero'),
(11, '2025-03-20 11:05:10', 'checkpoints', 'arquero', '00:05:10', 45, 1, 2, 'bosque', 95.00, 90.50, 3, 0, 0, 'curandero'),
(11, '2025-03-20 11:10:25', 'checkpoints', 'arquero', '00:10:25', 100, 1, 3, 'bosque', 85.50, 75.25, 6, 1, 0, 'cofre'),
(11, '2025-03-20 11:15:40', 'checkpoints', 'arquero', '00:15:40', 135, 1, 4, 'bosque', 75.75, 60.00, 8, 2, 0, 'armero'),
(11, '2025-03-20 11:20:33', 'muerteVida', 'arquero', '00:20:33', 160, 1, 4, 'bosque', 65.50, 0.00, 9, 2, 1, 'curandero');