# Descripción del Juego

El juego se encuentra en la carpeta `TheCursedReturn` del repositorio. El prototipo esta en `TCR_ALPHA` y el juego se corre abriendo el archivo HTML llamado `inicio.html` dentro de la carpera `html`. 

En esta página se presentan tres botones principales:

- **Nueva partida**: Lleva a una nueva página donde se puede elegir una clase e iniciar la partida.
- **Cargar partida**: Este botón permitirá al jugador retomar una partida anterior.  
  Sin embargo, como aún no se cuenta con una API funcional, actualmente recuerda la clase elegida previamente en “Nueva partida” y lleva al juego.  
  Si no se ha iniciado una partida antes, se selecciona por defecto la clase **Caballero**.
- **Créditos**: Redirige a una página donde se pueden ver los créditos del juego.

## Controles Implementados

Los controles disponibles hasta el momento se muestran al iniciar el juego:

- `W`, `A`, `S`, `D`: Movimiento del personaje.
- `Esc`: Abre el menú de pausa.
- `K`: Ataque cuerpo a cuerpo.

## Mecánicas del Juego

- Para avanzar al siguiente nivel, el jugador debe llegar al extremo derecho de la pantalla.
- Si hay enemigos en el nivel, es necesario eliminarlos a todos antes de poder continuar.
- El combate actual es únicamente cuerpo a cuerpo: el jugador debe acercarse al enemigo y presionar `K` para infligir daño.
- Los enemigos detectan al jugador a cierta distancia y lo persiguen, al hacer contacto, infligen daño.
- El daño recibido se representa en la barra de vida y con un breve efecto visual de pantalla roja.

> Actualmente se está desarrollando el sistema de ataque a distancia para las clases **Arquero** y **Hechicero**.

## Sistema de Maldición

- La **maldición** comienza junto con la partida.
- En el prototipo actual, su duración es de aproximadamente **2 minutos**.
- Si la barra de vida o la de maldición se vacía, se muestra una pantalla de **Game Over** con opciones para reiniciar o volver al inicio.

## Menú de Pausa

Presionando `Esc` durante la partida se accede al menú de pausa, que contiene los siguientes botones:

- **Sonido**: Permitirá modificar el volumen del juego (actualmente en desarrollo).
- **Estadísticas**: Se implementará una vez que la API esté disponible.
- **Guardar y salir**: Guardará los datos actuales en la base de datos a través de la API y regresará al menú principal.
- **Regresar**: Regresa a la partida actual.

## Colisiones

- El jugador respeta las colisiones del mapa.
- En futuras actualizaciones, se implementará este comportamiento también para los enemigos.
