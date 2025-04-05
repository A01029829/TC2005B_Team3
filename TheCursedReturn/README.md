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
- 'F': Interactuar con la curandera.

## Mecánicas del Juego

- Para avanzar al siguiente nivel, el jugador debe llegar al extremo derecho de la pantalla.
- Si hay enemigos en el nivel, es necesario eliminarlos a todos antes de poder continuar.
- El combate actual es únicamente cuerpo a cuerpo: el jugador debe acercarse al enemigo y presionar `K` para infligir daño.
- Los enemigos detectan al jugador a cierta distancia y lo persiguen, al hacer contacto, infligen daño.
- El daño recibido se representa en la barra de vida y con un breve efecto visual de pantalla roja.
- Cuatro salas representan un nivel. Al final de cada nivel (última sala), un jefe aparecerá, el jefe (lobo) causa más daño y aparecerá con duendes que también atacarán al jugador.

> Actualmente se está desarrollando el sistema de ataque a distancia para las clases **Arquero** y **Hechicero**.
> Adicionalmente, y por cuestiones de tiempo, la interacción con la curandera no es la que deseamos, pero buscábamos agregar un objeto interactivo para la entrega.
> Esencialmente, el combate está disponible para las tres clases, sin embargo, como el ataque a distancia aún no está implementado, la mejor clase para probar **The Cursed Return** es el **caballero**

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

## ¿En qué escena comienza el prototipo? 

- El prototipo comienza después de un breve contexto (por añadir en futuras versiones), donde el personaje principal debe regresar a su reino, trss una guerra que duró mucho tiempo.
- El personaje comenzará en la primera sala que formó parte de su viaje durante la guerra, pero estos irán alternándose debido a la maldición.

## ¿Qué funcionalidades ya está terminada?
- Las mecánicas de movimiento y colisión para el jugador están completados.
- El sistema de generación de mapas aleatoria está terminado. Esto junto con la función para bloquear las salas hasta que el jugador "limpia" la sala.
- Las mecánicas de combate y de persecución de los enemigos están completas y listas para ser implementadas con otros spritesheets.
- La carga de pantallas a lo largo del juego (pantalla de inicio hasta pantalla de victoria) están completas y funcionan en su totalidad.
- El sistema de maldición y el manejo de vida también están completas, y están a la espera de ser tener los valores "oficiales" implementados.
- La generación de enemigos en posiciones aleatorias también está completada, y en futuras versiones se implementará con diferentes enemigos.

## ¿Qué funcionalidades aún están en desarrollo?
- El ataque a distancia para el **Hechicero** y el **Arquero** aún está en desarrollo, las animaciones ya funcionan, solo falta implementar un sistema de proyectiles.
- La generación aleatoria de enemigos por nivel (4 salas) está por implementarse, por ahora solo aparece un número establecido y enemigos determinados.
- La implementación de la API y la conexión con base de datos aún falta por implementarse.
- La generación aleatoria de objetos (armas secundarias temporales o pócimas) o npc's como la Curandera o el Hechicero están en espera a ser implementados, en esta entrega existe una versión muy temprana de la Curandera.
- La implementación de música y efectos de sonido aún está en desarrollo.
- El contenido de la página de "Créditos" está por completarse, ya que necesitamos encontrar la música para poder citar todo como se debe.
- La implementación del "Dash" está en desarrollo, y por temas logísticos no logró desarrollarse a tiempo para esta entrega.
