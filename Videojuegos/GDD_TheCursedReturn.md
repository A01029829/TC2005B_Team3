![tec](Images/TecLogo.png)
# **The Cursed Return**

## _Game Design Document_

---

##### **© 2025 Infinite Horizon Studios. Todos los derechos reservados.**

**"The Cursed Return"** y todos los contenidos relacionados, incluyendo pero no limitado a: diseño del juego, personajes, historia, arte, música, código fuente y documentación, son propiedad intelectual de **Infinite Horizon Studios**.

Queda estrictamente prohibida la reproducción, distribución, modificación o uso no autorizado de cualquier parte de este documento o del juego sin el consentimiento previo por escrito de **Infinite Horizon Studios**.

**Autores**
- Valentina Castilla | A01028209
- Diego de la Vega Saishio | A01420632
- Luis Emilio Veledíaz | A01029829

**Profesores**
- Esteban Castillo Juarez
- Gilberto Echerría Furió
- Octavio Navarro Hinojosa
##
## _Index_

---

1. [Index](#index)
2. [Game Design](#game-design)
    1. [Logo](#logo)
    2. [Summary](#summary)
    3. [Gameplay](#gameplay)
    4. [Mindset](#mindset)
3. [Technical](#technical)
    1. [Screens](#screens)
    2. [Controls](#controls)
    3. [Mechanics](#mechanics)
4. [Level Design](#level-design)
    1. [Themes](#themes)
    2. [Game Flow](#game-flow)
5. [Development](#development)
    1. [Abstract Classes](#abstract-classes--components)
    2. [Derived Classes](#derived-classes--component-compositions)
6. [Graphics](#graphics)
    1. [Style Attributes](#style-attributes)
    2. [Graphics Needed](#graphics-needed)
7. [Sounds/Music](#soundsmusic)
    1. [Style Attributes](#style-attributes-1)
    2. [Sounds Needed](#sounds-needed)
    3. [Music Needed](#music-needed)
8. [Schedule](#schedule)

## _Game Design_

---
### **Logo**
![Logo](Images/LogoTheCursedReturn.jpg)

### **Summary**

Desarrollado por Infinite Horizon Studios, "The Cursed Return" es un roguelite top-down de acción, aventura y supervivencia, que contiene elementos de RPG´s, en el que eres un soldado atrapado en un loop temporal creado por una hechicera que busca venganza. La guerra entre los reinos del Norte y del Sur ha terminado, pero a un costo terrible. Tras años de lucha, estás listo para regresar a casa, pero algo no está bien: el mundo a tu alrededor comienza a cambiar de maneras extrañas.

Explora niveles aleatorios, lucha contra enemigos desafiantes y toma decisiones que definirán el destino de tu personaje. Al principio de la partida elige entre guerrero, arquero y hechicero, cada uno con armas únicas y especiales, pero recuerda que cada elección tiene un costo, ya sea bueno o malo. La maldición no solo te persigue, sino que también altera la realidad, creando peligros impredecibles y enemigos cada vez más poderosos.

La maldición es el elemento distintivo de nuestro juego. La barra se agota con cada segundo que pasa, si esta llega a cero el destino está sellado, morir y empezar de nuevo. La maldición no solo te limita, genera desafíos impredecibles por lo que es indispensable adaptar tu estrategia en cada partida.

### **Gameplay**

El objetivo del juego es completar diferentes niveles, mientras el jugador intenta romper su maldición y derrotar a enemigos. En el juego, el jugador elige al inicio una de las siguientes clases: mago, arquero y guerrero. Mientras mata a los enemigos, el jugador podrá obtener ventajas como reducir el impacto de la barra de maldición o aumentar esta el tamaño de la barra. Pero, también podrá obtener desventajas como reducción de daño, reducción de vida, etc. El juego recuerda mucho a un Role-Play Game debido a que el jugador asume el papel de un personaje y avanza a través de una historia, combates y exploración. En este caso el combate es en tiempo real y el juego incluirá un sistema de progresión para cada clase.

### **Mindset**

Queremos hacer que el jugador se sienta poderoso de manera progresiva, mientras se mantiene alerta de los riesgos que su personaje corre. Queremos provocar este mindset colocando al jugador en situaciones donde deberán decidir si aumentar su poder (a un costo) o mantenerse con su poder original.
También buscamos que los jugadores se sientan aventureros mientras avanzan por los niveles en búsqueda de una manera de romper la maldición. Los diferentes entornos provocarán un sentido de aventura para el jugador, ya que explorarán zonas que siempre serán completamente diferentes.
Finalmente, queremos provocar una sensación de precaución, con la que el jugador deberá decidir de manera estratégica las acciones que realizará, para llegar lo más lejos posible antes de que la maldición lo elimine. Además deberán elegir su clase considerando los posibles peligros que se presentarán en cada nivel.


## _Technical_

---

### **Screens**

El juego contará con varias pantallas clave, cada una diseñada con una interfaz clara y funcional para mejorar la experiencia del usuario. Cada pantalla tendrá su propio propósito y navegación bien definida. A continuación se explican las pantallas más importantes, además, se mostrará un concepto muy básico de lo que se espera diseñar.

1. **Title Screen (Pantalla de Inicio)**

    Propósito: Servir como la primera impresión del juego y ofrecer acceso a las opciones principales de navegación y configuración. Se incluirá:

- *Logo del juego**: Posicionado en el centro superior de la pantalla, acompañado de una animación que lo hará destacar visualmente.
- *Botón de "Nueva Partida"*: Permite iniciar una nueva aventura desde el principio.
- *Botón de "Cargar Partida"*: Disponible sólo si existe un progreso guardado previamente.
- *Menú de Opciones*: Acceso a configuraciones avanzadas de sonido y controles.
- *Sección de Créditos*: Un apartado para reconocer al equipo de desarrollo y colaboradores.
- *Animaciones en el fondo*: Se integrarán efectos visuales.
- *Música de fond*o: Un tema de introducción envolvente que refuerce la atmósfera del juego.
- *Botón de "Salir"*: Opción para cerrar el juego de manera inmediata.

A continuación se muestra un boceto de cómo se vería:
![Menu](Images/MenuTheCursedReturn.jpg)


2. **Menú de Opciones**

    Propósito: Permitir mdificar configuraciones del juego para adaptarlo a las preferencias del jugador. Se incluirá:

- *Volumen de Efectos*: Ajuste específico para los sonidos del combate y ambiente.
- *Volumen de música*: Permite ajustar el nivel de volumen de la banda sonora.
- *Botón de "Regresar"*: Para volver al menú principal.

3. **Juego Principal**

    Propósito: Es la pantalla donde ocurre la jugabilidad, con la interfaz del usuario (UI) mostrando información relevante. Se incluirá:

- *Área central del juego*: Representa el mundo en el que el jugador se moverá e interactuará con personajes y enemigos.
- *Barra de salud*: Indica la vida restante del personaje.
- *Barra de maldición*: Representa el tiempo disponible antes de que la maldición afecte al jugador.
- *Iconos de estado*: Notificaciones visuales que informan sobre mejoras temporales o penalizaciones activas.
- *Menú de pausa*: Permite acceder a configuraciones, controles y otras opciones sin salir del juego.

A continuación se muestra una secuencia de bocetos:
![Classes](Images/ClassesTheCursedReturn.jpg)

*Las tres clases para nuestro juego, Mago, Arquero y Soldado. En ese orden*

Al inicio se tenían en cuenta otros sprites, pero esos sprites limitaban el movimiento que queríamos implementar, por lo que optamos por rediseñar nuestros sprites para facilitarnos el proceso de animación.
![OG](Images/OriginalSpritesTheCursedReturn.jpg)

*Sprites originales (no íbamos a usar todos)*

![Perspective](Images/PerspectiveDraftTheCursedReturn.jpg)

*Boceto de cómo se verían los personajes respecto a un pedazo del mapa*

![HUD](Images/HUDTheCursedReturn.jpg)

*Boceto de cómo se vería un personaje en relación a un nivel, con su heads-up display que muestra la barra de maldición (corazón morado), la barra de vida (corazón rojo) y dos apartados, uno muestra los enemigos derrotados y otro muestra el nivel de dificultad.*

4. **Créditos del juego**  

    Propósito: Mostrar el equipo de desarrollo y agradecer a los jugadores. Se incluirá:

- Nombres del equipo.
- Música de fondo.
- Opción para regresar al menú principal.
- Acreditaciones de elementos externos.


### **Controls**
El sistema de controles define cómo el jugador va a interactuar con el juego, permitiendo movimientos, ataques y acciones esenciales para la jugabilidad. A continuación se enlistan los controles para “The Cursed Return”.

1. **Movimiento del jugador**  

Teclas de dirección (WASD)
- W → Moverse hacia arriba.
- S → Moverse hacia abajo.
- A → Moverse hacia la izquierda.
- D → Moverse hacia la derecha.
- L o click derecho → Dash
 
2. **Ataques y Combate**  
- Ataque principal: K o click izquierdo → Ataque con el arma equipada.
- Diferentes armas tienen diferentes animaciones y efectos.
- Si se deja presionada la tecla/click, se hará un ataque cargado, que hará más daño.

3. **Interacciones**  
- *Interacción*: Se utiliza la misma tecla porque tiene una función de interacción en circunstancias específicas.
- *Interacción con Curandero, Armero y con Cofres*: Tecla F → Permitirá interactuar con los personajes que le proporcionarán ayuda al jugador, al igual que podrán abrir cofres que encuentren a lo largo de su run.
- *Recoger objetos (armas o pociones)*: Tecla F → Recoger los objetos del escenario.
  

4. **Navegación por el menú**  
    i. El jugador puede acceder a los menús (por ejemplo, inventario, selección de clase) usando una tecla dedicada (por ejemplo, "Tab").  
    ii. Se navegará por los menús utilizando el mouse o entradas direccionales.

### **Mechanics**  
Nuestro juego introduce una mecánica en específico que consideramos muy innovadora, que refuerza la temática de la maldición y el loop temporal. Pero algunas de las principales mecánicas son:  

1. **Barra de maldición**  
- La barra de maldición representa el tiempo que el jugador tiene para pasar las salas antes de ser víctima de la maldición y reiniciar su partida.
- Esta barra se agota de forma constante a lo largo del tiempo, pero puede regenerarse al derrotar enemigos.
- La barra de maldición comienza llena y se vacía completamente en 10 minutos si no se regenera.
- Derrotar enemigos permite regenerar un porcentaje de la barra, dependiendo del nivel y tipo de enemigo.
- Su implementación está basada en un temporizador en segundo plano.

    **Ejemplo en el Gameplay**
    
    El jugador inicia con su barra de maldición llena y debe moverse rápidamente para empezar a derrotar enemigos, si tarda demasiado en el combate, el jugador morirá y reiniciará su partida. Si derrota a un jefe final en el nivel 1, su barra se extenderá y regenerará parte de su barra, permitiéndole seguir avanzando. 

    La siguiente tabla ilustra el tiempo total de la barra al inicio del juego (sin aumentos):
    
    | Minutos | Segundos | Tiempo total |
    |---------|----------|--------------|
    | 10      | 600      | 10:00        |

    Los siguientes bocetos ilustran el progreso de cómo es que la barra de maldición va bajando con el tiempo. En el boceto, diferenciamos la barra de vida de la barra de maldición por el color del corazón al inicio de la barra, la barra de maldición tiene un corazón morado, mientras que la barra de vida tiene un corazón rojo. 

![CBF](Images/CurseBarFull.png)

*Boceto de la barra de maldición al 100%*

![CBY](Images/CurseBarYellow.png)

*Boceto de la barra de maldición entre el 50% y 75%*

![CBO](Images/CurseBarOrange.png)

*Boceto de la barra de maldición entre el 25% y 50%*

![CBR](Images/CurseBarRed.png)

*Boceto de la barra de maldición entre el 0% y 25%*

![HBF](Images/HealthBarFull.png)

*Boceto de la barra de vida entre al 100%*

2. **Generación aleatoria de niveles**

- Cada partida será diferente gracias a la generación aleatoria de mapas.
- Los niveles del juego están compuestos por habitaciones conectadas, generadas de manera aleatoria a partir de un conjunto de salas predefinidas.
- Cada nivel tiene un ecosistema temático (desierto, bosque o nieve) y contiene enemigos, cofres y elementos únicos.
- Existen 12 salas en total, divididas en 4 por ecosistema.
- Cada partida selecciona aleatoriamente salas de cualquier ecosistema para construir el nivel.
- Las salas se bloquean hasta que el jugador elimine a todos los enemigos dentro.
- El jefe del nivel siempre estará al final y será el último desafío antes de avanzar.
- Cofres y recompensas aparecen en una sala específica sin enemigos, elegida aleatoriamente dentro del nivel.
- Al iniciar la partida, el jugador tiene tres formas de salir de la sala: ganar derrotando a todos los enemigos, perder si su barra de vida llega a cero, ser eliminado por la maldición si su barra llega a cero.

    **Ejemplo en el Gameplay**
    
    El jugador entra a la sala de un nivel, observa que hay enemigos de corto y largo alcance. Decide primero atacar a los enemigos de largo alcance para evitar recibir daño constante de lejos, derrota a todos los enemigos y desbloquea la siguiente sala. El jugador continúa así hasta llegar a la sala del jefe.
 

3. **Progresión de las clases con mejoras y desventajas**

- El jugador podrá obtener diferentes mejoras y desventajas que afectarán su desempeño durante la partida.
- Pueden ser temporales o permanentes, y afectan tanto el combate como la barra de maldición.
- Existe un arma secundaria temporal, que se obtiene durante la partida y tiene una duración de 1 minuto.
- Existen mejoras temporales, que se obtienen durante la partida y sólo duran esa partida.
- Existe un aumento del tamaño de la barra de maldición, que se obtiene al derrotar a un jefe y se mantiene por el resto de partidas.
 
4. **Combate rápido y estratégico**
-   El combate es en tiempo real, con una mecánica de “dash” que permite a los jugadores esquivar ataques y adaptarse a diferentes tipos de enemigos.
-   El jugador puede realizar una evasión rápida en cualquier dirección para  evitar ataques enemigos. Se implementará con una animación de desplazamiento.
-   Cada clase comienza con un ataque básico.
-   Al obtener un arma secundaria, el ataque básico se mantiene, pero se vuelve más fuerte.
-   No existen efectos de estado como quemaduras o veneno, centrándose en el combate directo.

Cada clase tiene un estilo de combate único:
- El guerrero tiene ataques cuerpo a cuerpo con gran daño.
- El arquero tiene disparos a distancia con la mecánica de cargar el tiro para causar más daño.
- El mago tiene la habilidad de lanzar hechizos desde lejos.

A continuación se presenta una tabla ilustrativa de las diferencias de estadísticas entre las clases:

| Clase      | Guerrero | Arquero | Hechicero |
|------------|----------|---------|-----------|
| **Arma**   | Espada   | Arco    | Báculo/Bola de Fuego |
| **Ataque Básico** | 35       | 15      | 20        |
| **Ataque Cargado** | 60       | 40      | 50        |
| **Distancia** | Cuerpo a cuerpo | 40      | 20        |

Se utilizará un sistema de detección de colisiones y físicas para hacer que los ataques sean precisos y satisfactorios. Además de la generación aleatoria de niveles, la cantidad de enemigos será aleatoria, sin embargo hay unas restricciones por bioma:

- Los esqueletos solo aparecerán en el desierto.
- Los duendes y lagartos sólo aparecerán en el bosque.
- Los minotauros y lobos sólo aparecerán en la nieve.

A continuación se muestra una tabla con las vidas de los enemigos.

| Nivel    | Enemigo Común | Enemigo Fuerte | Jefes |
|----------|---------------|----------------|-------|
| **Nivel 1** | 70            | 200            | 1000  |
| **Nivel 2** | 100           | 350            | 1500  |
| **Nivel 3** | 150           | 500            | 2000  |

Aquí se asumirá que:
- Los esqueletos sin armadura serán comunes.
- Los esqueletos con armadura serán fuertes.
- Los duendes sin armas y poca armadura serán comunes.
- Los duendes con armas y armadura serán fuertes.
- Los lobos serán fuertes por defecto.
- Los minotauros serán fuertes por defecto.

*Nota: se hablará de los personajes más a fondo en las siguientes secciones.

5. **Curandero, Armero y Cofres**

A lo largo del run del jugador, este podrá encontrarse con salas que contengan uno de los siguientes:
- Armero: le dará un arma secundaria aleatoria al jugador.
- Curandero: le dará una pócima al jugador que le curará 25% de la barra de vida.
- Cofre: le dará al jugador una pócima o un arma secundaria aleatoria.

Estos elementos servirán como ventajas para el jugador ya que, el arma secundaria podrá causar más daño que el arma base de cada clase. Habrá 4 armas secundarias diferentes:
- Hacha de guerra: Un hacha que provocará gran daño, pero reduce la velocidad del jugador.
- Lanza: Una lanza que tendrá mucho daño, pero tendrá un corto alcance.
- Ballesta: Una ballesta que tendrá el daño de un arco cargado, pero un rango menor.
- Daga: Una daga que permitirá que las clases de rango lejano puedan acercarse a combate cuerpo a cuerpo.

En cuanto al armero, este podrá aparecer en una sala única que no tendrá enemigos, en el momento en el que el jugador interactúe con él, se asignará un arma temporal aleatoria al jugador.

En cuanto a la curandera, también aparecerá en una sala única que no tendrá enemigos, en el momento en el que el jugador interactúe con ella, se  le asignará una pócima al jugador, la cuál le regenerará vida, más no maldición.

A continuación se muestran bocetos de la Curandera y del Armero:

<img src="Images/CuranderaTheCursedReturn.jpg" alt="Curandera" width="600">

*Boceto de la Curandera*

![Arm](Images/ArmeroTheCursedReturn.jpg)

*Boceto del Armero*

![Cof](Images/CofreTheCursedReturn.jpg)

*Boceto de cómo se verán los cofres abiertos y cerrados respectivamente* 

6. **Armas secundarias**

Como se mencionó previamente, a lo largo del run, el jugador encontrará armas secundarias que le darán una ventaja por cierto tiempo.
Previamente ya mencionado, habrá 4 armas secundarias diferentes: 
- Hacha de guerra
- Lanza
- Ballesta
- Daga

Estas armas se activarán en el momento en el que el jugador la recoja, con una duración de 1 minuto y al terminar ese tiempo, el jugador regresará al arma que le corresponde a la clase que eligió. Esto permitirá que el jugador pueda crear nuevas maneras para pasar niveles y derrotar a enemigos, pero también lo obligará a que piense de manera más crítica.

Si el jugador ya cuenta con un arma secundaria temporal, y encuentra a otros npc o cofre que le dé otra arma secundaria temporal, el jugador deberá considerar su estrategia para lo que le queda del run y escoger el arma con la cual continuar su camino (es decir, si recoger el arma o no).


A continuación se muestra una tabla que contiene información sobre cada arma secundaria:

| Arma           | Daño Básico | Distancia       |
|----------------|-------------|-----------------|
| **Ballesta**   | 40          | 30              |
| **Hacha de guerra** | 45     | Cuerpo a cuerpo |
| **Lanza**      | 40          | 10              |
| **Daga**       | Mismo que la clase | Cuerpo a cuerpo |

7. **Puntuación**

Con la finalidad de mostrar estadísticas que inciten al jugador a continuar haciendo runs, implementaremos un sistema de puntuación, a cada enemigo
se le asignará determinada puntuación.

En el momento en el que acabe el run del jugador, ya sea porque murió por daño, murió por la maldición o terminó el juego, se desplegará una pantalla de estadísticas del run en general, donde se mostrarán estadísticas como:

- Enemigos derrotados en el run
- Jefes derrotados en el run
- Con qué clase se jugó
- Cuánto duró el run
- Puntuación del run

La puntuación se asignará de la siguiente manera:

- Enemigo común: 1 punto
- Enemigo fuerte: 3 puntos
- Jefe: 10 puntos

Para fomentar la rejugabilidad y la competencia entre jugadores, se añadirá un sistema de records personales donde el jugador podrá ver sus mejores runs en distintas categorías:

- Run más largo (en tiempo).
- Mayor cantidad de enemigos derrotados en un solo run.
- Mayor puntuación obtenida en un run. 



---

## _Level Design_

---

### **Themes**

1. Desierto
    1. Atmósfera
        1. Incómoda, calurosa, árida
        2. Se ambienta en una aldea olvidada con ruinas antiguas y restos de civilizaciones.
    2. Objetos
        1. _Ambientales_
            1. Cactus
            2. Ruinas cubiertas por arena
            3. Esqueletos y restos de armadura
        2. _Interactivo_
            1. Esqueletos (enemigo - 3 variaciones)
            2. Cofres
            3. Armas Secundarias
            4. Curandero
            5. Armero

Boceto de un nivel del desierto:

![Des](Images/DraftTheCursedReturnDESERTBLANK.png)

2. Bosque
    1. Atmósfera
        1. Misteriosa, Oscura, Tranquila
    2. Objetos
        1. _Ambiente_
            1. Árboles grandes y matorrales densos
            2. Raíces
            3. Troncos caídos
        2. _Interactivo_
            1. Duendes (enemigo - 2 variaciones)
            2. Lobos (enemigo - 1 variación)
            3. Cofres
            4. Armas Secundarias
            5. Curandero
            6. Armero

Boceto de un nivel del bosque:

![Woo](Images/DraftTheCursedReturnBlank2.png)

2. Nieve
    1. Atmósfera
        1. Fría, Hostil, Invernal
    2. Objetos
        1. _Ambiente_
            1. Paisaje cubierto de nieve
            2. Nieve cubriendo el suelo, sin afectar la movilidad del jugador.
            3. Rocas congeladas
            4. Piedras de hielo
        2. _Interactivo_
            1. Minotauros (enemigo - 1 variación)
            2. Lagartos (enemigo - 2 variaciones)
            3. Cofres
            4. Armas Secundarias
            5. Curandero
            6. Armero


Boceto de un nivel de la nieve:

![Sno](Images/DraftTheCursedReturnSNOWBLANK.png)

### **Game Flow**

*Inicio del juego*
1. Aparece un breve texto que da contexto a la historia del juego.
2. El jugador comienza en un bioma aleatorio (bosque, desierto o nieve).
3. HUD aparece: barra de vida, barra de maldición, indicador de clase seleccionada, etc.

*Exploración inicial*
1. El jugador se encuentra en la primera sala con enemigos aleatorios.
2. El jugador se da cuenta que la puerta a la siguiente sala está cerrada.
3. El jugador observa el tipo de enemigos (corta o larga distancia) y toma decisiones sobre cómo proceder.
4. El jugador observa que la barra de maldición está comenzando a bajar.
5. La batalla comienza, el jugador comienza a atacar estratégicamente.

*Movimiento entre Salas*
1. Una vez derrotados los enemigos, la puerta o entrada a la siguiente sala se desbloquea.
2. El jugador se mueve hacia la siguiente sala aleatoria (bioma aleatorio), encontrando cofres y enemigos en cada una.
3. Las mecánicas como esquivar y ataques básicos se emplean constantemente durante el avance.

*Encuentro con el Jefe*
1. El jugador lleva a la cuarta sala, donde se encontrará a un Jefe.
2. La barra de maldición está a la mitad o menos, lo que genera presión adicional para completar el nivel.
3. Se activa un corte de sonido o transición para indicar la llegada al jefe.

*Fase del Combate Final*
1. El jugador se enfrenta al jefe final en una batalla emocionante.
2. El jefe tiene mecánicas especiales, como fuerza mucho mayor o spawnear enemigos básicos,  el jugador debe adaptarse a su patrón de ataque para sobrevivir.
3. El combate sucede bajo la presión de la maldición, con el jugador viendo cómo la barra disminuye constantemente.

*Finalización del nivel*
1. Si el jugador derrota al jefe, se aumenta el tamaño y capacidad máxima de la barra de maldición, además, se desbloquea la puerta para avanzar al siguiente nivel.
2. Si el jugador pierde debido a la barra de maldición vacía o morir, se muestra una pantalla de derrota y el jugador es regresado al inicio del nivel.

*Reiniciar o Continuar*
1. Al reiniciar, el jugador comienza de nuevo, pero con una nueva generación de niveles.
2. Además, el jugador conserva el tamaño alcanzado de la barra (en dado caso de que haya eliminado a un jefe en cierto nivel).

A continuación, mostraremos unas tablas que simulan los valores de enemigos y tiempo en cada nivel (estos valores están sujetos a cambios de ser necesario y se usaron para visualizar el tiempo de sobra que le quedaría al usuario si se dedicara únicamente a eliminar enemigos):

**Nivel 1** 

Parte a): 

Es necesario recordar que se parte de un tiempo total inicial de 600 segundos:
- En esta tabla se estima un tiempo que toma en eliminar a los enemigos por su fuerza para el primer nivel.
- Posteriormente, se pone el número de enemigos máximo del nivel (este es el mismo en todos los niveles).
- Después se obtiene el tiempo total que toma eliminarlos.

Parte b)

- Tiempo base por eliminación: Posteriormente, se calcula el tiempo base que se va a recuperar por eliminación de cada enemigo (un 30% del tiempo que toma eliminarlo)
- Tiempo extra porcentaje: En esta parte se calcula un umbral (aleatorio) de recuperación extra de energía, que va desde el 0.1%-0.3% del valor inicial de la barra al iniciar el nivel (en este caso, de 600 segundos).
- Es importante mencionar que se estimó con el mejor caso (0.3%) y el peor caso (0.1%) para ver ambos escenarios.

Parte c) y d)
- Tiempo agotado: Aquí se calcula el tiempo que se perdió en el mejor y el peor caso (restando el tiempo recuperado)
- Tiempo restante total: Aquí se calcula el tiempo restante (tiempo inicial-tiempo perdido) al terminar el nivel, con los dos escenarios.
- Tiempo restante promedio: Se calcula un promedio de ambos escenarios, para utilizarlo como referencia en el calculo del siguiente nivel.

![N1](Images/TablaNivel1.jpg)

**Nivel 2** 

En esta sección se hace el mismo proceso partiendo de 533.7 segundos, lo único que cambia es:
- El tiempo de eliminación de los enemigos aumenta, debido a que se vuelven más fuertes.
- El tiempo base de recuperación pasa de 30% a 20%
- El tiempo restante final (promedio) de recuperación es de 361 segundos.

![N2](Images/TablaNivel2.jpg)

**Nivel 3**

Los cambios son:
- El tiempo de eliminación de los enemigos.
- El tiempo base de recuperación pasa de 20% a 10%.
- El tiempo restante estimado al terminar el juego sería de 80 segundos.

![N3](Images/TablaNivel3.jpg)

## _Development_

---

El desarrollo del juego se estructurará en una serie de clases base y clases derivadas que encapsulan las mecánicas principales del juego.

### **Abstract Classes / Components**

Estas clases proporcionan la estructura más fundamental y básica del juego, se definirán las propiedades y métodos que van a ser heredados por clases más específicas.

1. PersonajeBase
- JugadorBase (Tiene movimiento, ataques y ataque cargado)
- EnemigoBase (Ataca al jugador con distinto daño dependiendo del tipo)
- NPCBase (Ofrecen objetos al jugador)
2. ObjetoBase
- ObjetoArmaSecundaria (Son temporales y ofrecen ventajas)
3. ObstaculoBase
4. ElementosUIBase

### **Derived Classes / Component Compositions**

1. JugadorBase
- Soldado (Cuerpo a cuerpo y daño alto)
- Arquero (Rango de ataque alto y daño bajo)
- Hechizero (Rango de ataque moderado y daño moderado)
2. EnemigoBase
- EnemigoEsqueleto (Comunes y fuertes)
- EnemigoDuende (Comunes y fuertes)
- EnemigoLagarto (Comunes y fuertes)
- EnemigoMinotauro (Fuertes)
- EnemigoLobo (Fuertes)
3. NPCBase
- NPCCurandera (Ofrece una poción al jugador)
- NPCCArmero (Ofrece un arma secundaria al jugador)
4. ObjetoBase
- ObjectoCofre (Ofrece un arma secundaria o una poción al jugador)
- Objeto pócima (Regenera vida al jugador)
5. ObjetoArmaSecundaria
- ArmaHacha (Daño, alcance, velocidad)
- ArmaLanza(Daño, alcance, velocidad)
- ArmaBallesta (Daño, alcance, velocidad)
- ArmaDaga (Daño, alcance, velocidad)
6. ObstaculoBase
- ObstaculoPared (Previene que el jugador salga del nivel)
- ObstaculoPuerta (Previene que el jugador salga de la sala hasta que mate a todos los enemigos)
7. UIBase
- BarraMaldicion (Muestra el tiempo restante antes de que la maldición consuma al jugador)
- BarraVida (Muestra la vida del jugador)
- Iconos (Muestran la clase del jugador y si es el caso el arma secundaria)
- Puntaje (Muestra los enemigos eliminados)
- BotonMenu (Pausa el juego y abre los ajustes)




## _Graphics_

---

### **Style Attributes**

El juego utiliza una paleta de colores variada pero que al final del día permite diferenciar biomas y personajes sin dejar de tener sentido en cuanto a lo visual. A pesar de que no seguiremos una paleta de colores limitada, los tonos terrosos, fríos, o cálidos se emplean según el entorno para mantener una ambientación correcta y cómoda. 

Los colores presentan sombreados y contrastes que aportan profundidad pero mantienen un estilo pixel art característico. No aplicaremos un post-procesado HSV, pero los escenarios estarán diseñados para ser reconocibles sin necesidad de aplicar filtros o correcciones adicionales.

Algunos colores que utilizaremos son los siguientes:
- Para el soldado: #726b7e y #867e7f
- Para el arquero: #64a42c y #0b5c2f
- Para el hechicero: #3c49ad y #322d6a
- Para el bioma del bosque: #a0b12a y #4d8051
- Para el bioma del desierto: #d7bd4e y #ba8b4a
- Para el bioma de nieve: #a6b5b5 y #8cadb4

El estilo gráfico es en pixel art en 2D, con una resolución aproximada de 32x32 píxeles por personaje. Queremos que las armas y vestimentas tengan un toque semi-realista. Para los personajes vamos a utilizar contornos negros además de contrastes de color para definir las siluetas y sombras. 

Para tener una retroalimentación visual efectiva, incorporaremos diferentes efectos, por ejemplo, cuando el jugador o un enemigo recibe daño, se mostrará un frame rojo en el sprite. Al igual que con el jugador, los enemigos también mostrarán un frame rojo en su sprite. 

Los cofres y armas secundarias contarán con sus propios efectos y animaciones, también se implementarán animaciones en la barra de vida y maldición, al igual que colocar íconos por si el jugador obtiene el arma secundaria.

### **Graphics Needed**

**Personajes**

**1. Humanos (jugador)**
1. *Arquero*: No tendrá variación, y solo cambiará de arma en caso de encontrar un arma secundaria temporal.
   - Idle (cuatro direcciones)
   - Caminar (cuatro direcciones)
   - Atacar con arma principal (cuatro direcciones)
   - Atacar con arma secundaria (cuatro direcciones)
   - Dash (cuatro direcciones)
   - Recibir daño (cuatro direcciones)
   - Morir (una dirección)
   
3. *Soldado*: No tendrá variación, y solo cambiará de arma en caso de encontrar un arma secundaria temporal.
   - Idle (cuatro direcciones)
   - Caminar (cuatro direcciones)
   - Atacar con arma principal (cuatro direcciones)
   - Atacar con arma secundaria (cuatro direcciones)
   - Dash (cuatro direcciones)
   - Recibir daño (cuatro direcciones)
   - Morir (una dirección)

4. *Mago*: No tendrá variación, y solo cambiará de arma en caso de encontrar un arma secundaria temporal.
   - Idle (cuatro direcciones)
   - Caminar (cuatro direcciones)
   - Atacar con arma principal (cuatro direcciones)
   - Atacar con arma secundaria (cuatro direcciones)
   - Dash (cuatro direcciones)
   - Recibir daño (cuatro direcciones)
   - Morir (una dirección)

5. *Curandera y Armero*: No tendrá variación, y su diseño será diferente a todos los demás personajes, a su vez, este diseño será exclusivo para cada personaje.
   - Idle (cuatro direcciones)
   - Interacción con el jugador (una dirección)

**2. Enemigos Semi-Humanos**

1. *Esqueletos*: Habrá tres variaciones en el diseño, que serán cambios en su armadura, los que tienen más armadura harán más daño y tendrán más vida, los que tienen menos armadura son los “comunes” con menos fuerza y menos vida.
   - Idle (cuatro direcciones)
   - Caminar (cuatro direcciones)
   - Atacar (cuatro direcciones)
   - Recibir daño (cuatro direcciones)
   - Morir (una dirección)

2. *Duendes*: Habrá tres variaciones en el diseño, que serán cambios en su armadura, los que tienen más armadura harán más daño y tendrán más vida, los que tienen menos armadura son los “comunes” con menos fuerza y menos vida.
   - Idle (cuatro direcciones)
   - Caminar (cuatro direcciones)
   - Atacar (cuatro direcciones)
   - Recibir daño (cuatro direcciones)
   - Morir (una dirección)
  
3. *Minotauro*: No tendrá variación, el daño que tiene es fijo.
   - Idle (cuatro direcciones)
   - Caminar (cuatro direcciones)
   - Atacar (cuatro direcciones)
   - Recibir daño (cuatro direcciones)
   - Morir (una dirección)

**3. Enemigos No-Humanos**

1. *Lagartos*: Habrá tres variaciones en el diseño, que serán cambios en su armadura, los que tienen más armadura harán más daño y tendrán más vida, los que tienen menos armadura son los “comunes” con menos fuerza y menos vida.
   - Idle (cuatro direcciones)
   - Caminar (cuatro direcciones)
   - Atacar (cuatro direcciones)
   - Recibir daño (cuatro direcciones)
   - Morir (una dirección)
  
2. *Lobo*: No tendrá variación, el daño que tiene es fijo.
   - Idle (cuatro direcciones)
   - Caminar (cuatro direcciones)
   - Atacar (cuatro direcciones)
   - Recibir daño (cuatro direcciones)
   - Morir (una dirección)

**Tiles y Bloques**

Cada bioma tendrá su propio tileset, organizados en 12 salas distribuidas en 3 niveles. Los tilesets estarán prehechos y se generarán aleatoriamente. Cabe aclarar que todos los tilesets tendrán bordes en los extremos del nivel, para funcionar como muro de colisión para el jugador

1. *Bosque*
   - Pasto
   - Camino de tierra
   - Rocas
   - Flores
   - Árboles
   - Lagunas (zonas con agua)

2. *Desierto*
   - Arena
   - Ruinas de piedra
   - Restos de estructuras
   - Cactus
   - Armaduras tiradas
   - Esqueletos (decoración)

3. *Nieve*
   - Suelo Nevado
   - Bloques de hielo
   - Rocas cubiertas de nieve
   - Árboles nevados
   - Huellas
   - Lagos Congelados

Además de estos elementos en los tilesets, planeamos agregar decoraciones que no tengan ningún otro propósito más que ser utilizados como decoración para ayudar a ambientalizar la zona. No tendrán interacción alguna con el personaje.

**Ambiente**
   - Hierba Alta
   - Huesos en el suelo
   - Picos de hielo
   - Columnas rotas (ruinas)
   - Estatuas dañadas (ruinas)
   - Raíces que salen de los árboles
   - Árboles
   - Arbustos

**Other**
   - Cofres
   - Camino que indica la salida al siguiente nivel
   - Zonas donde estarán los NPC´s (Curandero y Armero)

## _Sounds/Music_

---

### **Style Attributes**

La banda sonora de “The Cursed Return” se basará en un estilo orquestal ambiental que evoque una sensación de estar en una aventura legendaria, pero sin encasillarse en una interpretación medieval o similar al género de nuestros personajes e historia. Deseamos utilizar instrumentos orquestales como cuerdas, metales, percusión, y coros para reforzar la sensación de grandeza y peligro, por lo que también es prudente utilizar un tempo que sea rápido, uno ideal sería 165 BPM, que puede dar pauta a coros sombríos o armonías épicas.

El tono general de la música será tenso y opresivo, ya que la mecánica de la maldición genera una presión constante sobre el jugador, esto se puede reflejar con composiciones que tengan:
- Ritmos y progresiones armónicas que transmiten urgencia y peligro
- Crescendos dinámicos en combate para aumentar la tensión
- Uso de cuerdas en secciones más tranquilas para dar un respiro y una sensación de “calma” antes de regresar a los combates.
- Capas musicales progresivas, que vayan añadiendo más instrumentos conforme el jugador va llegando más lejos.

A la hora de decidir una generación de biomas aleatoria, se deben evitar choques en la música de los biomas, por ello, se optará utilizar una banda sonora unificada, osea, una misma base musical que se reproduzca en todos los niveles, pero que progresivamente vaya evolucionando conforme el jugador también evoluciona, haciéndose más épica con la incorporación de más instrumentos.



### **Sounds Needed**

**Effects**

Los efectos de sonido serán retros y estilizados, en lugar de ser realistas, para que así puedan encajar con la identidad visual del juego, ya que si se agregan efectos realistas, el diseño visual del juego no encajará con el realismo que el audio proporciona. Los efectos tendrán una estética similar a los sonidos clásicos de 16 bits, con un diseño de audio claro y fácil de identificar, de esta manera, la inmersión que se proporcionará será mucho mejor a una donde los efectos y sonidos no encajan con lo que uno ve.

**Efectos de sonidos por interacción**

*Movimientos*
- Paso sobre tierra
- Paso sobre piedra
- Paso sobre pasto
- Paso sobre nieve
- Paso sobre arena
- Desplazamiento rápido (dash)

*Interacción*
- Cofre abriéndose
- Sonido de alguien bebiendo (pócima)
- Armadura chocando contra el suelo

*Armas*
- Espada cortando
- Hacha impactando
- Lanza perforando
- Daga apuñalando
- Cargando tiro de arco
- Flecha disparada desde un arco
- Cargando tiro con ballesta
- Ballesta disparando
- Báculo canalizando energía
- Disparo de energía

*Combate*
- Sonido de impacto al golpear un enemigo
- Sonido de impacto al recibir daño
- Sonido de muerte de enemigos
- Sonido de muerte del jugador


**Feedback**

Para reforzar el feedback sin depender de elementos visuales únicamente, implementaremos sonidos como golpes secos para indicar que el jugador fue golpeado. Al morir, se reproducirá un sonido impactante y fuerte, seguido de un breve silencio para recalcar la derrota antes del reinicio del loop. Al derrotar al jefe final, habrá un sonido especial para resaltar el suceso.

### **Music Needed**

Como los niveles serán generados de manera aleatoria, conforme el jugador avanza y cambiarán entre biomas, también aleatorios, la música será unificada, con una sola pista general que va escalando conforme el juego avanza, hasta llegar a un punto máximo donde es una canción con una intensidad muy grande.

1. Estructura musical
- Inicio (exploración temprana)
- Sonidos de cuerdas y vientos suaves.
- Bajo volumen y una sensación de inseguridad.

2. Media partida (mayor dificultad)
- Se añaden percusiones para aumentar la tensión.
- La melodía base evoluciona con la inclusión de nuevos instrumentos.

3. Final (Zona de mayor peligro y jefe final)
- Uso de coros épicos y metales pesados.
- Ritmo más acelerado para representar la urgencia y tensión del momento final del juego.

*Sonidos Ambientales*
Los sonidos ambientales serán mínimos, con una ligera presencia de sonidos como viento en ciertas áreas para reforzar la atmósfera. No se planea incluir efectos de sonidos adicionales en los escenarios, para evitar una saturación de efectos.

Por el momento no sabemos de dónde obtendremos la música y los efectos pero se están tomando en cuenta las referencias y sitios que el Profesor Gilberto nos proporcionó:

- http://www.freesound.org/
- https://www.freesfx.co.uk/
- http://dig.ccmixter.org/
- https://www.playonloop.com/
- https://www.bensound.com/
- http://www.newgrounds.com/audio
- https://felgo.com/game-resources/free-music-for-games
- https://www.dl-sounds.com/
- https://www.youtube.com/audiolibrary/music?nv=1


## _Schedule_

---

El desarrollo del juego estará organizado en 7 sprints de una semana cada uno, comenzando con el primer sprint la semana del 10 de Abril, y terminando en un deadline de 7 semanas. Cada sprint estará enfocado en áreas específicas dependiendo de los issues que se realicen en GitHub Projects, para así construir progresivamente todos los sistemas del juego, asegurando que las mecánicas, gráficos, sonidos, bases de datos, scripts y todos los aspectos del proyecto sean implementados de manera eficiente.

Dado que el equipo está conformado por tres estudiantes y no tenemos experiencia previa en el desarrollo de videojuegos, es muy importante que el cronograma mantenga una estructura clara y organizada, asignando mayor prioridad a los elementos esenciales y dejando fases de pulido y ajuste para las últimas semanas. En el equipo buscamos siempre realizar pruebas y ajustes durante los sprints para así evitar una acumulación de errores al final del desarrollo.

A continuación se detalla el cronograma del desarrollo, es importante aclarar y hacer mucho énfasis en que este cronograma NO es el oficial y que se puede ir cambiando durante el proceso de desarrollo del proyecto.

1. Desarrollar Clases Base
    1. Definir entidad base
        1. Jugador Base
        2. Enemigo Base
        3. Bloques para obstáculos
  2. Estado Base del juego
        1. Mundo del Juego
        2. Mundo del Menú
2. Desarrollar Clases del Jugador y Bloques Básicos
    1. Físicas / Colisiones
3. Refinar Controles / Física
4. Desarrollar Otras Clases Derivadas
    1. Bloques
    2. Enmigos
5. Diseñar Niveles
    1. Implementar Movimiento
    2. Introducir Ataques
    3. Introducir al arquero y al armero
6. Buscar Efectos de Sonido
7. Buscar la música
