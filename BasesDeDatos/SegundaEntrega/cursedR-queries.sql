USE cursedR;

-- Estado de la partida
SELECT p.id_partida, p.tiempoPartida, p.nivelActual, p.salaActual, p.longitudMaldicion, 
       c.nombreClase, c.danoBasico, c.danoCargado, c.alcanceClase
FROM Partida p
JOIN Clases c ON p.id_clase = c.id_clase
WHERE p.id_partida = 3;

-- Enemigos generados en el nivel actual
SELECT e.nombreEnemigo, e.tipoEnemigo, e.nivel, e.HP, pe.EneDerrotados, pe.EneGenerados 
FROM Partida_Enemigo pe
JOIN Enemigo e ON pe.id_enemigo = e.id_enemigo
JOIN Partida p ON pe.id_partida = p.id_partida
WHERE pe.id_partida = 3
AND e.nivel = (SELECT nivelActual FROM Partida WHERE id_partida = 3)
ORDER BY e.tipoEnemigo;

-- Enemigos restantes en la sala actual
SELECT e.id_enemigo, e.nombreEnemigo, e.tipoEnemigo, e.nivel, e.HP, 
       pe.EneGenerados - pe.EneDerrotados AS enemigos_restantes
FROM Partida_Enemigo pe
JOIN Enemigo e ON pe.id_enemigo = e.id_enemigo
WHERE pe.id_partida = 1
AND e.bioma = 'desierto'
AND pe.EneGenerados > pe.EneDerrotados
ORDER BY e.tipoEnemigo;

-- Armas secundarias disponibles
SELECT a.nombreArma, a.danoArma, a.distanciaArma, a.efectoArma, a.duracionArma, 
       a.usaDanoClase, pa.tiempoArma
FROM Partida_Armas pa
JOIN Armas a ON pa.id_arma = a.id_arma
WHERE pa.id_partida = 1
ORDER BY pa.tiempoArma DESC;

-- Consulta que nos permite generar nuevos enemigos
SELECT e.id_enemigo, e.nombreEnemigo, e.tipoEnemigo, e.bioma, e.nivel, e.HP
FROM Enemigo e
WHERE e.nivel = (
    SELECT nivelActual + 1 
    FROM Partida 
    WHERE id_partida = 3
)
AND e.bioma = 'bosque'
ORDER BY RAND()
LIMIT 5;

-- Puntuacion total de la partida
SELECT SUM(pe.puntos) AS puntuacion_total
FROM Partida_Enemigo pe
WHERE pe.id_partida = 3;

-- Enemigos restantes en la partida 3
SELECT 
    SUM(pe.EneGenerados) AS total_generados,
    SUM(pe.EneDerrotados) AS total_derrotados,
    SUM(pe.EneGenerados-pe.EneDerrotados) AS total_restantes
FROM Partida_Enemigo pe
WHERE pe.id_partida = 3;

-- Cantidad de enemigos por tipo en la partida 5
SELECT e.tipoEnemigo, COUNT(*) AS cantidad, SUM(pe.EneDerrotados) AS derrotados
FROM Partida_Enemigo pe
JOIN Enemigo e ON pe.id_enemigo = e.id_enemigo
JOIN Partida p ON pe.id_partida = p.id_partida
WHERE pe.id_partida = 5
AND e.nivel = p.nivelActual
GROUP BY e.tipoEnemigo;

-- Verificar si todos los jefes han sido derrotados en la partida 3
SELECT 
    CASE 
        WHEN COUNT(*) = 0 THEN 'No hay jefes en este nivel'
        WHEN SUM(CASE WHEN pe.EneDerrotados > 0 THEN 1 ELSE 0 END) = COUNT(*) 
        THEN 'Todos los jefes derrotados'
        ELSE 'Faltan jefes por derrotar'
    END AS estado_jefes
FROM Partida_Enemigo pe
JOIN Enemigo e ON pe.id_enemigo = e.id_enemigo
JOIN Partida p ON pe.id_partida = p.id_partida
WHERE pe.id_partida = 3
AND e.nivel = p.nivelActual
AND e.tipoEnemigo = 'jefe';

