-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: cursedr
-- ------------------------------------------------------
-- Server version	8.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Temporary view structure for view `estadisticas`
--

DROP TABLE IF EXISTS `estadisticas`;
/*!50001 DROP VIEW IF EXISTS `estadisticas`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `estadisticas` AS SELECT 
 1 AS `id_jugador`,
 1 AS `id_partida`,
 1 AS `nombreUsuario`,
 1 AS `FechaFin`,
 1 AS `TiempoTotal`,
 1 AS `PuntuacionFinal`,
 1 AS `NivelAlcanzado`,
 1 AS `SalaAlcanzada`,
 1 AS `BiomaAlMorir`,
 1 AS `RankRestante`,
 1 AS `VidaRestante`,
 1 AS `EnemigosComunesDerrotados`,
 1 AS `EnemigosFuertesDerrotados`,
 1 AS `JefesDerrotados`,
 1 AS `TotalEnemigosEliminados`,
 1 AS `TipoFinPartida`,
 1 AS `ClaseJugador`,
 1 AS `UltimoObjetoEncontrado`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `estadisticas`
--

/*!50001 DROP VIEW IF EXISTS `estadisticas`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `estadisticas` AS select `p`.`id_jugador` AS `id_jugador`,`p`.`id_partida` AS `id_partida`,`j`.`nombreUsuario` AS `nombreUsuario`,`ultima`.`fechaLog` AS `FechaFin`,`ultima`.`tiempoPartida` AS `TiempoTotal`,`maxpuntos`.`puntuacion` AS `PuntuacionFinal`,`maxnivel`.`nivelActual` AS `NivelAlcanzado`,`maxsala`.`salaActual` AS `SalaAlcanzada`,`ultima`.`biomaActual` AS `BiomaAlMorir`,`ultima`.`rankM` AS `RankRestante`,`ultima`.`vida` AS `VidaRestante`,`ultima`.`enemigosCDerrotados` AS `EnemigosComunesDerrotados`,`ultima`.`enemigosFDerrotados` AS `EnemigosFuertesDerrotados`,`ultima`.`jefesDerrotados` AS `JefesDerrotados`,((`ultima`.`enemigosCDerrotados` + `ultima`.`enemigosFDerrotados`) + `ultima`.`jefesDerrotados`) AS `TotalEnemigosEliminados`,`ultima`.`eventoTrigger` AS `TipoFinPartida`,`primera`.`claseElegida` AS `ClaseJugador`,`objetosmax`.`objetosEncontrados` AS `UltimoObjetoEncontrado` from (((((((`partida` `p` join `jugador` `j` on((`p`.`id_jugador` = `j`.`id_jugador`))) join (select `lp`.`id_partida` AS `id_partida`,`lp`.`fechaLog` AS `fechaLog`,`lp`.`tiempoPartida` AS `tiempoPartida`,`lp`.`biomaActual` AS `biomaActual`,`lp`.`rankM` AS `rankM`,`lp`.`vida` AS `vida`,`lp`.`enemigosCDerrotados` AS `enemigosCDerrotados`,`lp`.`enemigosFDerrotados` AS `enemigosFDerrotados`,`lp`.`jefesDerrotados` AS `jefesDerrotados`,`lp`.`eventoTrigger` AS `eventoTrigger` from (`log_partida` `lp` join (select `log_partida`.`id_partida` AS `id_partida`,max(`log_partida`.`fechaLog`) AS `max_fecha` from `log_partida` group by `log_partida`.`id_partida`) `lp2` on(((`lp`.`id_partida` = `lp2`.`id_partida`) and (`lp`.`fechaLog` = `lp2`.`max_fecha`))))) `ultima` on((`p`.`id_partida` = `ultima`.`id_partida`))) join (select `lp`.`id_partida` AS `id_partida`,`lp`.`claseElegida` AS `claseElegida` from (`log_partida` `lp` join (select `log_partida`.`id_partida` AS `id_partida`,min(`log_partida`.`fechaLog`) AS `min_fecha` from `log_partida` group by `log_partida`.`id_partida`) `lp2` on(((`lp`.`id_partida` = `lp2`.`id_partida`) and (`lp`.`fechaLog` = `lp2`.`min_fecha`))))) `primera` on((`p`.`id_partida` = `primera`.`id_partida`))) join (select `log_partida`.`id_partida` AS `id_partida`,max(`log_partida`.`puntuacion`) AS `puntuacion` from `log_partida` group by `log_partida`.`id_partida`) `maxpuntos` on((`p`.`id_partida` = `maxpuntos`.`id_partida`))) join (select `log_partida`.`id_partida` AS `id_partida`,max(`log_partida`.`nivelActual`) AS `nivelActual` from `log_partida` group by `log_partida`.`id_partida`) `maxnivel` on((`p`.`id_partida` = `maxnivel`.`id_partida`))) join (select `log_partida`.`id_partida` AS `id_partida`,max(`log_partida`.`salaActual`) AS `salaActual` from `log_partida` group by `log_partida`.`id_partida`) `maxsala` on((`p`.`id_partida` = `maxsala`.`id_partida`))) left join (select `lp`.`id_partida` AS `id_partida`,`lp`.`objetosEncontrados` AS `objetosEncontrados` from (`log_partida` `lp` join (select `log_partida`.`id_partida` AS `id_partida`,max(`log_partida`.`fechaLog`) AS `max_fecha` from `log_partida` where (`log_partida`.`objetosEncontrados` is not null) group by `log_partida`.`id_partida`) `lp2` on(((`lp`.`id_partida` = `lp2`.`id_partida`) and (`lp`.`fechaLog` = `lp2`.`max_fecha`))))) `objetosmax` on((`p`.`id_partida` = `objetosmax`.`id_partida`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-03 13:18:00
