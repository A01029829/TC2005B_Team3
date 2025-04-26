-- Active: 1743625010510@@127.0.0.1@3306@cursedr
USE cursedR;

DESCRIBE Log_Partida;

-- Vista de todas las estadísticas finales
SELECT * FROM estadisticas ORDER BY id_partida DESC;

-- Estadísticas de la última partida
SELECT * FROM Log_Partida WHERE id_partida = (SELECT MAX(id_partida) FROM Partida) ORDER BY fechaLog DESC;

SELECT * FROM Partida;
SELECT * FROM Jugador;

-- Clase del jugador y último objeto encontrado
SELECT 
    p.id_partida,
    p.id_jugador,
    j.nombreUsuario,
    l.claseElegida,
    l.tiempoPartida,
    l.nivelActual,
    l.salaActual,
    l.biomaActual,
    l.rankM AS maldicion,
    l.vida,
    l.puntuacion,
    l.objetosEncontrados AS ultimo_objeto
FROM 
    Partida p
JOIN 
    Jugador j ON p.id_jugador = j.id_jugador
JOIN 
    Log_Partida l ON p.id_partida = l.id_partida
WHERE 
    p.id_partida = 1
ORDER BY 
    l.fechaLog DESC
LIMIT 1;

-- Progreso de una partida específica
SELECT 
    l.fechaLog,
    l.eventoTrigger,
    l.claseElegida,
    l.tiempoPartida,
    l.nivelActual,
    l.salaActual,
    l.biomaActual,
    l.rankM AS maldicion,
    l.vida,
    l.puntuacion,
    l.enemigosCDerrotados,
    l.enemigosFDerrotados,
    l.jefesDerrotados,
    l.objetosEncontrados
FROM 
    Log_Partida l
WHERE 
    l.id_partida = 1
ORDER BY 
    l.fechaLog;

-- Resumen de todas las partidas de un jugador
SELECT 
    p.id_partida,
    p.fecha_inicio,
    p.fecha_fin,
    TIMEDIFF(p.fecha_fin, p.fecha_inicio) AS duracion_total,
    e.ClaseJugador,
    e.PuntuacionFinal,
    e.NivelAlcanzado,
    e.SalaAlcanzada,
    e.BiomaAlMorir,
    e.TipoFinPartida,
    e.UltimoObjetoEncontrado
FROM 
    Partida p
JOIN 
    Estadisticas e ON p.id_partida = e.id_partida
WHERE 
    p.id_jugador = 1
ORDER BY 
    p.fecha_inicio DESC;

-- Mejores puntuaciones de todos los jugadores
SELECT 
    j.nombreUsuario,
    e.id_partida,
    e.ClaseJugador,
    e.PuntuacionFinal,
    e.NivelAlcanzado,
    e.TipoFinPartida
FROM 
    Estadisticas e
JOIN 
    Jugador j ON e.id_jugador = j.id_jugador
ORDER BY 
    e.PuntuacionFinal DESC
LIMIT 10;

-- Enemigos derrotados por partida
SELECT 
    p.id_partida,
    j.nombreUsuario,
    MAX(l.enemigosCDerrotados) AS enemigos_comunes,
    MAX(l.enemigosFDerrotados) AS enemigos_fuertes,
    MAX(l.jefesDerrotados) AS jefes,
    MAX(l.enemigosCDerrotados + l.enemigosFDerrotados + l.jefesDerrotados) AS total_enemigos
FROM 
    Partida p
JOIN 
    Jugador j ON p.id_jugador = j.id_jugador
JOIN 
    Log_Partida l ON p.id_partida = l.id_partida
GROUP BY 
    p.id_partida, j.nombreUsuario
ORDER BY 
    total_enemigos DESC;

-- Analisis de muertes por porcentaje (maldicion y vida)
SELECT 
    TipoFinPartida,
    COUNT(*) AS cantidad,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM Estadisticas 
                             WHERE TipoFinPartida IN ('muerteMaldicion', 'muerteVida')), 2) AS porcentaje
FROM 
    Estadisticas
WHERE 
    TipoFinPartida IN ('muerteMaldicion', 'muerteVida')
GROUP BY 
    TipoFinPartida;

-- Estadisticas de progreso por nivel
SELECT 
    l.nivelActual,
    COUNT(DISTINCT l.id_partida) AS partidas_alcanzaron_nivel,
    AVG(l.puntuacion) AS puntuacion_promedio,
    AVG(l.enemigosCDerrotados) AS enemigos_comunes_promedio,
    AVG(l.enemigosFDerrotados) AS enemigos_fuertes_promedio,
    AVG(l.jefesDerrotados) AS jefes_promedio
FROM 
    Log_Partida l
GROUP BY 
    l.nivelActual
ORDER BY 
    l.nivelActual;

-- Logs de la partida 3
SELECT 
    l.fechaLog,
    l.tiempoPartida,
    l.eventoTrigger,
    l.puntuacion,
    l.nivelActual,
    l.salaActual,
    l.biomaActual,
    l.rankM,
    l.vida,
    l.enemigosCDerrotados - LAG(l.enemigosCDerrotados, 1, 0) OVER (ORDER BY l.fechaLog) AS nuevos_enemigos_comunes,
    l.enemigosFDerrotados - LAG(l.enemigosFDerrotados, 1, 0) OVER (ORDER BY l.fechaLog) AS nuevos_enemigos_fuertes,
    l.jefesDerrotados - LAG(l.jefesDerrotados, 1, 0) OVER (ORDER BY l.fechaLog) AS nuevos_jefes,
    l.objetosEncontrados
FROM 
    Log_Partida l
WHERE 
    l.id_partida = 3
ORDER BY 
    l.fechaLog;

-- Estadisticas por bioma
SELECT 
    l.biomaActual,
    COUNT(DISTINCT l.id_partida) AS partidas,
    AVG(l.puntuacion) AS puntuacion_promedio,
    AVG(l.enemigosCDerrotados) AS enemigos_comunes_promedio,
    AVG(l.enemigosFDerrotados) AS enemigos_fuertes_promedio,
    AVG(l.jefesDerrotados) AS jefes_promedio,
    SUM(CASE WHEN l.eventoTrigger IN ('muerteMaldicion', 'muerteVida') THEN 1 ELSE 0 END) AS muertes
FROM 
    Log_Partida l
GROUP BY 
    l.biomaActual
ORDER BY 
    puntuacion_promedio DESC;

-- Jugadores que han completado un nivel (nivel 3)
SELECT 
    j.nombreUsuario,
    COUNT(*) AS partidas_completadas
FROM 
    Estadisticas e
JOIN 
    Jugador j ON e.id_jugador = j.id_jugador
WHERE 
    e.NivelAlcanzado = 3
GROUP BY 
    j.nombreUsuario
ORDER BY 
    partidas_completadas DESC;

-- Tiempo promedio por sala y nivel
SELECT 
    l1.nivelActual,
    l1.salaActual,
    AVG(TIMEDIFF(l2.tiempoPartida, l1.tiempoPartida)) AS tiempo_promedio
FROM 
    Log_Partida l1
JOIN 
    Log_Partida l2 ON l1.id_partida = l2.id_partida 
                    AND l1.fechaLog < l2.fechaLog
                    AND NOT EXISTS (
                        SELECT 1 FROM Log_Partida l3 
                        WHERE l3.id_partida = l1.id_partida 
                          AND l3.fechaLog > l1.fechaLog 
                          AND l3.fechaLog < l2.fechaLog
                    )
GROUP BY 
    l1.nivelActual, l1.salaActual
ORDER BY 
    l1.nivelActual, l1.salaActual;

-- Partidas con mayor perdida de vida
SELECT 
    p.id_partida,
    j.nombreUsuario,
    MIN(l.vida) AS vida_minima,
    MAX(l.vida) AS vida_maxima,
    MAX(l.vida) - MIN(l.vida) AS perdida_vida,
    (MAX(l.vida) - MIN(l.vida))/MAX(l.vida)*100 AS porcentaje_perdida
FROM 
    Log_Partida l
JOIN 
    Partida p ON l.id_partida = p.id_partida
JOIN 
    Jugador j ON p.id_jugador = j.id_jugador
GROUP BY 
    p.id_partida, j.nombreUsuario
ORDER BY 
    porcentaje_perdida DESC;

-- Partidas en las que los jugadores tuvieron menos tiempo (maldicion) restante
SELECT 
    p.id_partida,
    j.nombreUsuario,
    MIN(l.rankM) AS maldicion_minima,
    MAX(l.rankM) AS maldicion_maxima,
    MAX(l.rankM) - MIN(l.rankM) AS perdida_maldicion,
    (MAX(l.rankM) - MIN(l.rankM))/MAX(l.rankM)*100 AS porcentaje_perdida
FROM 
    Log_Partida l
JOIN 
    Partida p ON l.id_partida = p.id_partida
JOIN 
    Jugador j ON p.id_jugador = j.id_jugador
GROUP BY 
    p.id_partida, j.nombreUsuario
HAVING 
    MIN(l.rankM) > 0  -- Sin partidas que llegaron a cero
ORDER BY 
    porcentaje_perdida DESC;

-- Puntos por minuto (eficiencia) de cada jugador
SELECT 
    j.nombreUsuario,
    p.id_partida,
    MAX(l.puntuacion) AS puntuacion_final,
    TIME_TO_SEC(MAX(l.tiempoPartida))/60 AS minutos_jugados,
    ROUND(MAX(l.puntuacion) / (TIME_TO_SEC(MAX(l.tiempoPartida))/60), 2) AS puntos_por_minuto
FROM 
    Log_Partida l
JOIN 
    Partida p ON l.id_partida = p.id_partida
JOIN 
    Jugador j ON p.id_jugador = j.id_jugador
GROUP BY 
    j.nombreUsuario, p.id_partida
HAVING 
    minutos_jugados > 0
ORDER BY 
    puntos_por_minuto DESC;

-- Numero de eventos (triggers) por partida
SELECT 
    p.id_partida,
    j.nombreUsuario,
    l.claseElegida,
    l.eventoTrigger,
    COUNT(*) AS cantidad
FROM 
    Log_Partida l
JOIN 
    Partida p ON l.id_partida = p.id_partida
JOIN 
    Jugador j ON p.id_jugador = j.id_jugador
GROUP BY 
    p.id_partida, j.nombreUsuario, l.claseElegida, l.eventoTrigger
ORDER BY 
    p.id_partida, l.eventoTrigger;

-- Partidas en curso
SELECT 
    p.id_partida,
    j.nombreUsuario,
    MAX(l.claseElegida) AS clase_elegida,
    p.fecha_inicio,
    TIMEDIFF(NOW(), p.fecha_inicio) AS tiempo_transcurrido,
    MAX(l.nivelActual) AS nivel_actual,
    MAX(l.salaActual) AS sala_actual,
    MAX(l.biomaActual) AS bioma_actual,
    MAX(l.puntuacion) AS puntuacion_actual,
    (SELECT objetosEncontrados 
     FROM Log_Partida 
     WHERE id_partida = p.id_partida 
     ORDER BY fechaLog DESC 
     LIMIT 1) AS ultimo_objeto_encontrado
FROM 
    Partida p
JOIN 
    Jugador j ON p.id_jugador = j.id_jugador
LEFT JOIN 
    Log_Partida l ON p.id_partida = l.id_partida
WHERE 
    p.fecha_fin IS NULL
GROUP BY 
    p.id_partida, j.nombreUsuario, p.fecha_inicio
ORDER BY 
    p.fecha_inicio;

-- Estadisticas por nivel
SELECT 
    e.NivelAlcanzado,
    COUNT(*) AS total_partidas,
    AVG(e.PuntuacionFinal) AS puntuacion_media,
    MIN(e.PuntuacionFinal) AS puntuacion_min,
    MAX(e.PuntuacionFinal) AS puntuacion_max,
    STDDEV(e.PuntuacionFinal) AS desviacion_estandar,
    AVG(TIME_TO_SEC(e.TiempoTotal)/60) AS minutos_promedio
FROM 
    Estadisticas e
GROUP BY 
    e.NivelAlcanzado
ORDER BY 
    e.NivelAlcanzado;

-- Mejora del jugador con el tiempo (primera y ultima partida jugada)
WITH RankedPartidas AS (
    SELECT 
        p.id_jugador,
        p.id_partida,
        p.fecha_inicio,
        e.PuntuacionFinal,
        e.NivelAlcanzado,
        e.TotalEnemigosEliminados,
        ROW_NUMBER() OVER (PARTITION BY p.id_jugador ORDER BY p.fecha_inicio) AS partida_numero,
        COUNT(*) OVER (PARTITION BY p.id_jugador) AS total_partidas_jugador
    FROM 
        Partida p
    JOIN 
        Estadisticas e ON p.id_partida = e.id_partida
)
SELECT 
    j.nombreUsuario,
    primera.PuntuacionFinal AS primera_puntuacion,
    ultima.PuntuacionFinal AS ultima_puntuacion,
    ultima.PuntuacionFinal - primera.PuntuacionFinal AS diferencia_puntuacion,
    ROUND((ultima.PuntuacionFinal - primera.PuntuacionFinal) / NULLIF(primera.PuntuacionFinal, 0) * 100, 2) AS porcentaje_mejora
FROM 
    Jugador j
JOIN 
    RankedPartidas primera ON j.id_jugador = primera.id_jugador AND primera.partida_numero = 1
JOIN 
    RankedPartidas ultima ON j.id_jugador = ultima.id_jugador AND ultima.partida_numero = ultima.total_partidas_jugador
WHERE 
    ultima.total_partidas_jugador > 1
ORDER BY 
    porcentaje_mejora DESC;