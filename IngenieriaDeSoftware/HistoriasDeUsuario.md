## Jugador
## Historia de usuario #1: Expandir barra de maldición

**Como** jugador  
**quiero** extender mi barra de maldición al matar a un jefe  
**para** poder aumentar mi tiempo de juego

### Validación:
- Establecer un número de puntaje, donde a partir de este se alargue la barra de la maldición.
- Verificar que cuando se alcance ese puntaje automáticamente se alargue la línea de la maldición.
- Verificar que el tiempo de vida del jugador aumente.
- Validar que la línea se mantenga extendida en las siguientes partidas.

**Prioridad:** 4  
**Estimación:** 15 hrs

---

## Historia de usuario #2: Niveles y ecosistemas

**Como** jugador  
**quiero** tener varios niveles  
**para** poder jugar en ecosistemas diferentes y aleatorios.

### Validación:
- Niveles: Mínimo 3 niveles en el juego
- Ecosistemas: Desierto, bosque y nieve
- Aleatoriedad: Los niveles (ecosistemas) se generan aleatoriamente entre los 3 niveles

**Prioridad:** 4  
**Estimación:** 20 hrs

---

## Historia de usuario #3: Elegir de clases

**Como** jugador  
**quiero** elegir mi clase al inicio del juego  
**para** poder jugar partidas con 3 formas/estrategias diferentes.

### Validación:
- Verificar que el jugador pueda elegir clases al principio de la partida
- Verificar que el jugador tenga el arma y el daño de la clase elegida
- Verificar que la interfaz muestra la clase actual

**Prioridad:** 3  
**Estimación:** 5 hrs

---

## Historia de usuario #4: Eventos aleatorios

**Como** jugador  
**quiero** enfrentarme a eventos aleatorios  
**para** poder mantener el juego impredecible y diferente.

### Validación:
- Comprobar que los eventos de cada partida cambien de manera aleatoria.
- Asegurarse de que los eventos tengan un impacto positivo y/o negativo en el jugador
- Asegurar que los eventos representen un desafío y añadan variedad al gameplay.
- Entre los eventos deben de haber cofres, una curandera y armas secundarias.

**Prioridad:** 5  
**Estimación:** 15 hrs

---

## Historia de usuario #5: Recoger y usar armas secundarias

**Como** jugador  
**quiero** armas secundarias  
**para** poder enfrentar enemigos con ellas y tener habilidades diferentes.

### Validación:
- Armas: Mínimo 3 diferentes
- Las armas aparecen aleatoriamente en lugares del mapa y al eliminar enemigos.
- Verificar que con la tecla “F” el jugador puede recoger estas armas y con la tecla “K” o con “click izquierdo” se pueda hacer daño.
- Daño: Estas armas hacen diferente daño, tienen movimientos únicos y pueden tener desventajas.
- Desventajas: De ser necesario, validar que como desventaja se afecte la barra de maldición como corresponde.

**Prioridad:** 6  
**Estimación:** 10 hrs

---

## Historia de usuario #6: Matar enemigos y aumento de maldición

**Como** jugador  
**quiero** matar a enemigos  
**para** poder aumentar mi puntaje y obtener ventajas

### Validación:
- Validar que se puede atacar a un enemigos y este recibe daño.
- Verificar que al recibir cierta cantidad de daño el enemigo muere.
- Aumentar el puntaje cuando el enemigo muere (estadísticas)
- Aumentar tiempo de maldición con enemigos y jefes (estos valores pueden adaptarse, pero deben de seguir esta mecánica):
  - Enemigos comunes: 
    - Aumento base: 30%
    - Aumento extra: 0.1 - 0.3% del tiempo restante
  - Enemigos fuertes: 
    - Aumento base: 20%
    - Aumento extra: Aumento de enemigos comunes*9
  - Jefes:
    - Aumento base: 10%
    - Aumento extra: Aumento de enemigos comunes*36

**Prioridad:** 4  
**Estimación:** 10 hrs

---

## Historia de usuario #7: Game over

**Como** jugador  
**quiero** que al morir, se reinicie el juego con el progreso que ya tenía de la barra de maldición  
**para** poder volver a intentar pasar el juego.

### Validación:
- Al morir antes de completar el último nivel, el usuario regresa al nivel 1.
- Validar que no mantenga el puntaje de la partida anterior (kills), pero sí el tamaño de la barra de maldición.
- Verificar que no mantiene armas secundarias.

**Prioridad:** 2  
**Estimación:** 10 hrs

---

## Historia de usuario #8: Moverse

**Como** jugador  
**quiero** moverme en varias direcciones  
**para** poder mejorar mi experiencia de juego y poder matar enemigos fácilmente

### Validación:
- Validar que el jugador puede moverse.
- Verificar que se puede avanzar en el eje x y eje y.
- Verificar que se mueve con las teclas w, a, s y d.

**Prioridad:** 1  
**Estimación:** 10 hrs

---

## Historia de usuario #9: Atacar enemigos

**Como** jugador  
**quiero** atacar a enemigos  
**para** poder aumentar mi puntaje y obtener ventajas

### Validación:
- Validar que al presionar una tecla se hace el movimiento para atacar a un jugador.
- Validar que al hacer el movimiento el enemigo recibe daño.
- Obtener y mantener puntaje cuando se ataque.

**Prioridad:** 2  
**Estimación:** 10 hrs

---

## Historia de usuario #10: Atacar con movimiento especial a enemigos

**Como** jugador  
**quiero** atacar a enemigos con mi ataque especial  
**para** poder hacer más daño a los enemigos y aumentar mi puntaje

### Validación:
- Validar que al presionar una tecla se hace el movimiento para atacar a un jugador.
- Validar que al hacer el movimiento el enemigo recibe daño.
- Obtener y mantener puntaje cuando se ataque.
- El ataque especial tarda en cargarse 1 segundo y 5 segundos para poder volverse a usar.

**Prioridad:** 5  
**Estimación:** 15 hrs

---

## Historia de usuario #11: Generación aleatoria de enemigos

**Como** jugador  
**quiero** que la posición y cantidad de enemigos sea aleatoria  
**para** poder agregar el elemento de aleatoriedad en el juego

### Validación:
- Validar que en cada partida la posición de los enemigos sea distinta.
- Enemigos:
  - Los esqueletos solo aparecerán en el desierto.
  - Los duendes y lagartos sólo aparecerán en el bosque.
  - Los minotauros y lobos sólo aparecerán en la nieve.
- Verificar que la cantidad de enemigos cambie cada partida.
- Validar que en cada partida, la dificultad de los enemigos y su número se mantenga en equilibrio con la dificultad.

**Prioridad:** 4  
**Estimación:** 15 hrs

---

## Historia de usuario #12: Sonidos

**Como** jugador  
**quiero** que el juego tenga música de fondo y sonidos de batalla  
**para** poder tener una mejor interacción con la historia

### Validación:
- Música de fondo: 
  - Género rock/epic
- Sonidos mínimos:
  - Golpe de espada
  - Tiro con arco
  - Disparo con la bola de fuego
  - Sonidos de golpes cargados
  - Dash
  - Sonido al correr
  - Recoger objeto/abrir cofre
  - Tomar pócima

**Prioridad:** 7  
**Estimación:** 5 hrs

---

## Historia de usuario #13: Dash

**Como** jugador  
**quiero** tener un dash  
**para** poder atacar y moverme más rápido

### Validación:
- Uso con tecla “L” o click derecho
- Tiempo de recarga: 1 segundo
- Movimiento hacia la última dirección del personaje
- Animación del movimiento

**Prioridad:** 4  
**Estimación:** 5 hrs




## Desarrollador
## Historia de usuario #1: Crear sprites
**Como** desarrollador  
**quiero** tener los sprites del videojuego  
**para** poder visualizar a los personajes del juego  

### Validación:
- Buscar sprites que se acoplen a la idea del juego.
- Validar que cumplan con el diseño del juego (animación, perspectiva, etc.).
- Guardar las imágenes para más adelante en el desarrollo del videojuego.

**Prioridad:** 1  
**Estimación:** 5 hrs

---

## Historia de usuario #2: Implementar un sistema de colisión
**Como** desarrollador  
**quiero** programar sistemas de colisión  
**para** poder tener una experiencia precisa en el juego  

### Validación:
- Establecer hitboxes en los personajes.
- Implementar colisiones con objetos y paredes.
- Asegurar que los ataques impacten precisamente a los enemigos y personajes.

**Prioridad:** 3  
**Estimación:** 10 hrs

---

## Historia de usuario #3: Pantalla de inicio
**Como** desarrollador  
**quiero** una pantalla de inicio  
**para** poder cargar una partida nueva o ya existente  

### Validación:
- Pantalla con logo del juego, música de fondo y logo del estudio.
- Opción "start" para elegir partida.
- Verificar que se pueden tener varios perfiles con progresos y estadísticas propias.
- Se puede reanudar una partida al cargar la partida.
- Se puede crear una nueva partida e ingresar el nombre del usuario.
- Cargar la partida rápidamente.

**Prioridad:** 2  
**Estimación:** 10 hrs

---

## Historia de usuario #4: Interfaz del juego
**Como** desarrollador  
**quiero** que se vea mi la barra de maldición y puntaje (enemigos eliminados)  
**para** poder llevar un seguimiento claro del progreso y tiempo restante.  

### Validación:
- **Barra de maldición:**
  - Cambio de color conforme disminuye el tiempo (25% cada color):
    - 75% - 100%: Verde
    - 50% - 75%: Amarillo
    - 25% - 50%: Naranja
    - 0% - 25%: Rojo
- **Puntaje:**
  - Total eliminados
  - Enemigos comunes derrotados
  - Enemigos fuertes derrotados
  - Jefes derrotados
- **Iconos de estado:** Notificaciones visuales que informan sobre mejoras temporales o penalizaciones activas.
- El jugador no puede avanzar a la siguiente sala hasta haber eliminado a todos los enemigos.

**Prioridad:** 1  
**Estimación:** 20 hrs

---

## Historia de usuario #5: Tener pantalla de ajustes y pausa
**Como** desarrollador  
**quiero** una pantalla de ajustes  
**para** poder ajustar el volumen, ir al menú, etc.  

### Validación:
- Poder acceder a esta pantalla presionando “Tab”.
- Verificar que se puede cambiar el volumen del juego.
- Se puede activar/desactivar el sonido (golpes, recoger objetos, etc.).
- Se puede activar/desactivar la música de fondo.

**Prioridad:** 2  
**Estimación:** 15 hrs

---

## Historia de usuario #6: Pantalla de créditos
**Como** desarrollador  
**quiero** una pantalla de créditos  
**para** poder dar agradecimientos y mencionar a los desarrolladores  

### Validación:
- Verificar que la pantalla de créditos aparece al terminar el juego.
- Incluye:
  - Nombre del estudio
  - Nombre del videojuego
  - Desarrolladores
  - Profesores
  - Referencias (si es el caso)
  - Copyright notice

**Prioridad:** 6  
**Estimación:** 10 hrs

---

## Historia de usuario #7: Transiciones
**Como** desarrollador  
**quiero** transiciones fluidas entre niveles y salas  
**para** brindarle al usuario una experiencia agradable de juego.  

### Validación:
- Verificar que al cambiar de salas, haya una transición fluida (puede ser una pantalla oscura o una transición).
- Verificar que al subir de nivel, muestre que cambió el nivel y se use una transición.

**Prioridad:** 5  
**Estimación:** 5 hrs

---

## Historia de usuario #8: Daño y alcance por clase
**Como** desarrollador  
**quiero** que las clases tengan diferente daño y alcance  
**para** poder influir en la decisión y jugabilidad del usuario.  

### Validación:
- **Daño por clase (sujeto a cambios):**
  - **Guerrero:**
    - Daño básico: 35
    - Daño cargado: 60
    - Distancia: Cuerpo a cuerpo
  - **Arquero:**
    - Daño básico: 15
    - Daño cargado: 40
    - Distancia: 40
  - **Hechicero:**
    - Daño básico: 20
    - Daño cargado: 50
    - Distancia: 20

**Prioridad:** 3  
**Estimación:** 15 hrs

---

## Historia de usuario #9: Dificultad
**Como** desarrollador  
**quiero** ajustar la dificultad de los enemigos por nivel  
**para** que el usuario tenga un reto cada vez mayor.  

### Validación:
- **Salud por tipo y nivel (puede variar, pero se busca una proporción similar):**
  - **Enemigo común:**
    - Nivel 1: 70
    - Nivel 2: 100
    - Nivel 3: 150
  - **Enemigo fuerte:**
    - Nivel 1: 200
    - Nivel 2: 350
    - Nivel 3: 500
  - **Jefe:**
    - Nivel 1: 1000
    - Nivel 2: 1500
    - Nivel 3: 2000

**Prioridad:** 4  
**Estimación:** 15 hrs



## Administrador de la Base de Datos
## Historia de usuario #1: Implementar base de datos
**Como** administrador de base de datos  
**quiero** establecer una base de datos  
**para** poder guardar datos importantes del juego  

### Validación:
- Crear una base de datos con MySQL Workbench.
- Establecer clases relacionadas con el juego.
- Dentro de estas clases crear propiedades y relaciones.

**Prioridad:** 1  
**Estimación:** 5 hrs

---

## Historia de usuario #2: Guardar el progreso del jugador
**Como** administrador de base de datos  
**quiero** que el sistema guarde el progreso del jugador  
**para** poder permitirle al jugador reanudar su partida donde la dejó  

### Validación:
- Crear una tabla que guarde datos del progreso del jugador.
- Verificar que guarde cosas como el ID del jugador, la cantidad de maldición que le queda, las armas que tiene, la clase que tiene, y en qué lugar se quedó.
- Validar que haya un autoguardado cada vez que se supera un checkpoint (ej. sala, escenario o jefe derrotado).
- Verificar que los datos se carguen correctamente al reiniciar la partida.

**Prioridad:** 4  
**Estimación:** 10 hrs

---

## Historia de usuario #3: Registrar la elección de clase al inicio de cada partida
**Como** administrador de base de datos  
**quiero** que el sistema registre la clase elegida por el jugador al inicio de la partida  
**para** que las habilidades y progresión se ajusten correctamente durante el juego.  

### Validación:
- Verificar que la clase elegida se guarde correctamente al inicio de la partida. 
- Asegurar que las habilidades y estadísticas de la clase se carguen y apliquen correctamente. 
- Confirmar que el jugador no pueda cambiar de clase durante la partida.

**Prioridad:** 1  
**Estimación:** 10 hrs

---

## Historia de usuario #4: Gestionar las habilidades obtenidas por armas
**Como** administrador de base de datos  
**quiero** que el sistema gestione el progreso de niveles y habilidades de cada clase  
**para** que el jugador desbloquee nuevas habilidades a medida que consigue nuevas armas.  

### Validación:
- Crear una tabla con los campos: armas y powerups obtenidos.
- Al conseguir una nueva arma secundaria, se desecha el arma secundaria anterior.

**Prioridad:** 3  
**Estimación:** 10 hrs

---

## Historia de usuario #5: Almacenar habilidades desbloqueadas
**Como** administrador de base de datos  
**quiero** que el sistema almacene las habilidades desbloqueadas por el jugador para cada clase  
**para** que estas estén disponibles en la partida  

### Validación:
- Crear una tabla de habilidades con el identificador único del jugador, y un identificador único de la habilidad.
- Verificar que las habilidades se inserten correctamente en la tabla de habilidades al desbloquearse. 
- Asegurar que las habilidades desbloqueadas se carguen correctamente al reanudarse la partida.

**Prioridad:** 4  
**Estimación:** 10 hrs

---

## Historia de usuario #6: Recopilar estadísticas de la partida
**Como** administrador de base de datos  
**quiero** que el sistema recopile estadísticas de las partidas (enemigos derrotados, tiempo jugado, muertes, etc.)  
**para** analizar el rendimiento del jugador y mejorar la experiencia de juego  

### Validación:
- Crear una tabla con campos que puedan interesarle al jugador para que pueda analizarlos al final de cada intento.
- Comprobar que las estadísticas se actualicen en tiempo real.
- Asegurar que los datos puedan ser accesados sin restricción alguna.

**Prioridad:** 4  
**Estimación:** 15 hrs

---

## Historia de usuario #7: Almacenar datos del enemigo
**Como** administrador de base de datos  
**quiero** que el sistema almacene los datos de los enemigos (salud, daño, posición, etc.)  
**para** que estos se generen y gestionen correctamente en cada nivel.  

### Validación:
- Crear una tabla con el identificador único del enemigo, la salud del enemigo, el daño que inflige y la posición en el nivel. 
- Verificar que los datos de los enemigos se guarden correctamente al generarse en un nivel. 
- Asegurar que los enemigos se eliminen correctamente después de ser derrotados.

**Prioridad:** 3  
**Estimación:** 10 hrs

---

## Historia de usuario #8: Gestionar el nivel de la clase elegida por el jugador
**Como** administrador de base de datos  
**quiero** que el sistema gestione la *puntuación ganada por el jugador  
**para** que esta se traduzca en habilidades desbloqueadas.  

### Validación:
- Crear un campo de *puntuación en la tabla del progreso del jugador. 
- Verificar que la *puntuación se acumule correctamente al derrotar enemigos o completar objetivos. 
- Asegurar que los niveles y habilidades se desbloqueen según la *puntuación acumulada.

**Prioridad:** 4  
**Estimación:** 15 hrs





## Desarrollo Web
## Historia de usuario #1: Crear la estructura básica de la Web
**Como** desarrollador web  
**quiero** crear la estructura básica de la página Web  
**para** que el juego tenga un espacio en donde ejecutarse  

### Validación:
- Crear una carpeta en GitHub Pages.
- Definir las subcarpetas.
- Implementar el HTML básico.
- Crear y adjuntar la hoja CSS.
- Implementar el script JS.
- Publicar y probar en Pages.

**Prioridad:** 1  
**Estimación:** 5 hrs

---

## Historia de usuario #2: Optimización de carga
**Como** desarrollador web  
**quiero** que la página cargue rápidamente  
**para** ofrecer una experiencia fluida para el jugador  

### Validación:
- Optimizar el peso de los archivos.
- Comprimir los sprites.
- Medir el rendimiento.

**Prioridad:** 5  
**Estimación:** 2 hrs

---

## Historia de usuario #3: Responsividad del juego
**Como** desarrollador web  
**quiero** que el juego se adapte a diferentes pantallas  
**para** garantizar que se vea bien en cualquier computadora  

### Validación:
- Aplicar un CSS flexible para que el canvas se escale sin distorsionarse.
- Ajustar los controles y HUD para que sean visibles y accesibles en diferentes resoluciones.
- Probar el juego en distintos tamaños de ventana y dispositivos.

**Prioridad:** 3  
**Estimación:** 3 hrs

---

## Historia de usuario #4: Diseño de la Web
**Como** desarrollador web  
**quiero** que la página tenga un diseño atractivo y accesible  
**para** poder mejorar la experiencia del usuario  

### Validación:
- Implementar un diseño visual coherente con la temática del juego.
- Usar etiquetas semánticas para mejorar la accesibilidad.
- Asegurar que los elementos sean intuitivos y fáciles de usar.
- Realizar pruebas con usuarios para verificar la experiencia.

**Prioridad:** 3  
**Estimación:** 3 hrs

---

## Historia de usuario #5: Juego en la Web
**Como** desarrollador web  
**quiero** mostrar el juego  
**para** que el usuario pueda jugar  

### Validación:
- Incluir el canvas en la página y asegurarse de que el juego se vea correctamente.
- Cargar los assets de manera eficiente sin afectar el rendimiento.
- Verificar el desempeño entre el juego y la interfaz web.

**Prioridad:** 1  
**Estimación:** 4 hrs

---

## Historia de usuario #6: Página intuitiva
**Como** desarrollador web  
**quiero** una página web fácil de entender y navegar  
**para** poder mejorar la experiencia del usuario  

### Validación:
- Implementar un menú de navegación simple.
- Usar etiquetas semánticas para mejorar la comprensión.
- Colocar textos claros y concisos.
- Utilizar elementos visuales que guíen al usuario.
- Validar su funcionamiento.

**Prioridad:** 4  
**Estimación:** 4 hrs

---

## Historia de usuario #7: Capacidad de la página
**Como** desarrollador web  
**quiero** una página web que aguante a 100 usuarios a la vez  
**para** poder garantizar una experiencia estable  

### Validación:
- Optimizar el rendimiento del servidor y del cliente.
- Monitorear el rendimiento.

**Prioridad:** 5  
**Estimación:** 2 hrs

---

## Historia de usuario #8: Configurar el entorno de desarrollo
**Como** desarrollador web  
**quiero** configurar mi entorno de desarrollo correctamente  
**para** poder desarrollar de manera eficiente y organizada  

### Validación:
- Configurar Git y GitHub Pages para la versión inicial.
- Crear un repo con una estructura de carpetas clara.
- Implementar un sistema de versiones con commits bien hechos.

**Prioridad:** 1  
**Estimación:** -1 hrs

## Total
- 13 historias de jugador
- 9 historias de desarrollador
- 8 historias de base de datos
- 8 de desarrollo web
- Total de historias: 38 historias de usuario

