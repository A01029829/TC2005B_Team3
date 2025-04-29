"use strict"

// Importing modules
import express from 'express'

// The mysql2/promise module is used to connect to the MySQL database. The promise version of the module is used to avoid the use of callbacks and instead use the async/await syntax.
import mysql from 'mysql2/promise'
import fs from 'fs'

// import cors from 'cors';
// app.use(cors());

const app = express()
const port = 5800

app.use(express.json())
app.use(express.static('../'))

// Function to connect to the MySQL database
async function connectToDB()
{
    return await mysql.createConnection({
        host:'localhost',
        user:'cursedUser',
        password:'cursedR123',
        database:'cursedR'
    })
}

// Routes definition and handling
app.get('/', (request,response)=>{
    fs.readFile('../html/inicio.html', 'utf8', (err, html)=>{
        if(err) response.status(500).send('There was an error: ' + err)
        console.log('Loading page...')
        response.send(html)
    })
})

// Get the top 5 players with highest puntuacion from the Estadisticas view
app.get('/api/leaderboard', async (request, response) => {
    let connection = null
    console.log("Fetching leaderboard data...")
    
    try {
        connection = await connectToDB()
        
        // Query to get top 5 players with highest scores
        const [results, fields] = await connection.execute(`
            SELECT nombreUsuario, PuntuacionFinal
            FROM Estadisticas
            ORDER BY PuntuacionFinal DESC
            LIMIT 5
        `)

        console.log(`${results.length} leaderboard rows returned`)
        console.log(results)

        response.json(results)
    }
    catch(error) {
        response.status(500)
        response.json(error)
        console.log(error)
    }
    finally {
        if(connection !== null) {
            connection.end()
            console.log("Connection closed successfully!")
        }
    }
})

// Show the game stats for a specific user
app.get('/api/user-stats/:nombreUsuario', async (request, response) => {
    let connection = null
    console.log(`Fetching game stats for user: ${request.params.nombreUsuario}`)
    
    try {
        connection = await connectToDB()
        
        // Query to get the user's game stats
        const [results, fields] = await connection.execute(`
            SELECT 
                e.nombreUsuario,
                e.FechaFin,
                e.TiempoTotal,
                e.PuntuacionFinal,
                e.NivelAlcanzado,
                e.SalaAlcanzada,
                e.BiomaAlMorir,
                e.RankRestante,
                e.VidaRestante,
                e.EnemigosComunesDerrotados,
                e.EnemigosFuertesDerrotados,
                e.JefesDerrotados,
                e.TotalEnemigosEliminados,
                e.TipoFinPartida,
                e.ClaseJugador,
                e.UltimoObjetoEncontrado
            FROM Estadisticas e
            WHERE e.nombreUsuario = ?
            ORDER BY e.FechaFin DESC
        `, [request.params.nombreUsuario])

        console.log(`${results.length} game logs returned for user ${request.params.nombreUsuario}`)
        
        // If the user has no game logs, return a 404 error
        if (results.length === 0) {
            response.status(404).json({
                success: false,
                message: "No se encontraron estadísticas para este usuario"
            })
        } else {
            response.json(results)
        }
    }
    catch(error) {
        response.status(500)
        response.json(error)
        console.log(error)
    }
    finally {
        if(connection !== null) {
            connection.end()
            console.log("Connection closed successfully!")
        }
    }
})

app.get("/api/class", async (request, response) => {
    let connection = null;
  
    try {
      connection = await connectToDB();
  
      const [results, fields] = await connection.query(
        "SELECT claseElegida, COUNT(id_partida) AS Elecciones FROM Log_Partida GROUP BY claseElegida;"
      );
  
      console.log("Sending data correctly.");
      response.status(200);
      response.json(results);
    } catch (error) {
      response.status(500);
      response.json(error);
      console.log(error);
    } finally {
      if (connection !== null) {
        connection.end();
        console.log("Connection closed succesfully!");
      }
    }
  });

  app.get("/api/playersLevel", async (request, response) => {
    let connection = null;
  
    try {
      connection = await connectToDB();
  
      const [results, fields] = await connection.query(
        "SELECT  NivelAlcanzado AS Nivel, COUNT(*) AS CantidadJugadores, ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM Estadisticas)), 2) AS PorcentajeDelTotal FROM Estadisticas GROUP BY NivelAlcanzado ORDER BY Nivel;"
      );
  
      console.log("Sending data correctly.");
      response.status(200);
      response.json(results);
    } catch (error) {
      response.status(500);
      response.json(error);
      console.log(error);
    } finally {
      if (connection !== null) {
        connection.end();
        console.log("Connection closed succesfully!");
      }
    }
  });

  app.get("/api/deaths", async (request, response) => {
    let connection = null;
  
    try {
      connection = await connectToDB();
  
      const [results, fields] = await connection.query(
        "SELECT TipoFinPartida AS TipoDeMuerte, COUNT(*) AS CantidadJugadores FROM Estadisticas WHERE TipoFinPartida IN ('muerteVida', 'muerteMaldicion') GROUP BY TipoFinPartida ORDER BY CantidadJugadores DESC;"
      );
  
      console.log("Sending data correctly.");
      response.status(200);
      response.json(results);
    } catch (error) {
      response.status(500);
      response.json(error);
      console.log(error);
    } finally {
      if (connection !== null) {
        connection.end();
        console.log("Connection closed succesfully!");
      }
    }
  });

app.get('/api/users/:id', async (request, response)=>
    {
        let connection = null
    
        try
        {
            connection = await connectToDB()
    
            const [results_user, _] = await connection.query('select * from users where id_users= ?', [request.params.id])
            
            console.log(`${results_user.length} rows returned`)
            response.json(results_user)
        }
        catch(error)
        {
            response.status(500)
            response.json(error)
            console.log(error)
        }
        finally
        {
            if(connection!==null) 
            {
                connection.end()
                console.log("Connection closed succesfully!")
            }
        }
    })

app.post('/api/login', async (request, response) => {

    let connection = null;

    try 
    {
        connection = await connectToDB();

        const { correo, nombreUsuario, contrasena } = request.body;

        // Check if user exists with this email or username
        const [existingUsers] = await connection.query(
            'SELECT * FROM Jugador WHERE correo = ? OR nombreUsuario = ?',
            [correo, nombreUsuario]
        );
        console.log(existingUsers);

        if (existingUsers.length > 0) {
            const user = existingUsers[0];
            
            // Check if username exists but doesn't match the email
            if (user.nombreUsuario === nombreUsuario && user.correo !== correo) {
                console.log("Username exists but email doesn't match");
                return response.status(409).json({
                    success: false,
                    message: "El nombre de usuario ya está en uso"
                });
            }
            
            // Check if email exists but doesn't match the username
            if (user.correo === correo && user.nombreUsuario !== nombreUsuario) {
                return response.status(409).json({
                    success: false,
                    message: "El correo ya está registrado con otro nombre de usuario"
                });
            }
            
            // Email and username match, check password
            if (user.contrasena === contrasena) {
                // User exists and password matches - create a new game session
                const [partidaResult] = await connection.query(
                    'INSERT INTO Partida (id_jugador) VALUES (?)',
                    [user.id_jugador]
                );
                
                return response.json({
                    success: true,
                    message: "Inicio de sesión exitoso",
                    id_jugador: user.id_jugador,
                    nombreUsuario: user.nombreUsuario,
                    id_partida: partidaResult.insertId
                });
            } else {
                // Password doesn't match
                return response.status(401).json({
                    success: false,
                    message: "Correo o contraseña incorrectos"
                });
            }
        } else {
            // User doesn't exist, create new account
            try {
                const [result] = await connection.query(
                    'INSERT INTO Jugador set ?',
                    request.body
                );
                
                // Create a new game session
                const [partidaResult] = await connection.query(
                    'INSERT INTO Partida (id_jugador) VALUES (?)',
                    [result.insertId]
                );
                
                return response.status(201).json({
                    success: true,
                    message: "Cuenta creada con éxito",
                    id_jugador: result.insertId,
                    nombreUsuario: nombreUsuario,
                    id_partida: partidaResult.insertId
                });
            } catch (err) {
                // Handle duplicate error in DB
                console.error("Database error:", err);
                if (err.code === 'ER_DUP_ENTRY') {
                    return response.status(409).json({
                        success: false,
                        message: "El nombre de usuario o correo ya está en uso"
                    });
                    // Follow DB constraints
                } else if (err.code === 'ER_CHECK_CONSTRAINT_VIOLATED') {
                    return response.status(400).json({
                        success: false,
                        message: "Los datos ingresados no cumplen con los requisitos"
                    });
                } else {
                    throw err; 
                }
            }
        }

    }
    catch(error)
    {
        console.error("Server error:", error);
        response.status(500).json({
            success: false,
            message: "Error del servidor",
            error: error.message
        });
    }
    finally
    {
        if(connection!==null) 
        {
            connection.end()
            console.log("Connection closed succesfully!")
        }
    }
})

// Endpoint for registering game events
app.post('/api/game-event', async (request, response) => {
    let connection = null;

    try {

        connection = await connectToDB();
        
        // Get data from request body
        const {
            id_partida,
            eventoTrigger,
            claseElegida,
            tiempoPartida,
            puntuacion,
            nivelActual,
            salaActual,
            biomaActual,
            rankM,
            vida,
            enemigosCDerrotados,
            enemigosFDerrotados,
            jefesDerrotados,
            objetosEncontrados
        } = request.body;

        // Basic validation
        if (!id_partida || !eventoTrigger || !claseElegida) {
            console.error("API: Faltan datos requeridos:", { id_partida, eventoTrigger, claseElegida });
            return response.status(400).json({
                success: false,
                message: "Faltan datos requeridos para registrar el evento"
            });
        }

        console.log(`API: Intentando insertar evento ${eventoTrigger} para partida ${id_partida}`);
        
        // Insert the event into the database
        const [result] = await connection.query(
            'INSERT INTO Log_Partida (id_partida, fechaLog, eventoTrigger, claseElegida, tiempoPartida, puntuacion, nivelActual, salaActual, biomaActual, rankM, vida, enemigosCDerrotados, enemigosFDerrotados, jefesDerrotados, objetosEncontrados) VALUES (?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                id_partida,
                eventoTrigger,
                claseElegida,
                tiempoPartida || '00:00:00',
                puntuacion || 0,
                nivelActual || 1,
                salaActual || 1,
                biomaActual || 'bosque',
                rankM !== undefined ? rankM : 100.00,
                vida !== undefined ? vida: 100.00,
                enemigosCDerrotados || 0,
                enemigosFDerrotados || 0,
                jefesDerrotados || 0,
                objetosEncontrados || 'cofre'
            ]
        );
        
        console.log(`API: ✅ Evento ${eventoTrigger} registrado con éxito, ID: ${result.insertId}`);
        
        // Return success response
        response.status(201).json({
            success: true,
            message: "Evento registrado correctamente",
            id_log: result.insertId
        });
    } catch (error) {
        console.error(`API: ❌ ERROR registrando ${request.body.eventoTrigger}:`, error);
        response.status(500).json({
            success: false,
            message: "Error al registrar evento",
            error: error.message
        });
    } finally {
        if (connection !== null) {
            connection.end();
            console.log("API: 🔒 Conexión cerrada");
        }
    }
});

app.listen(port, ()=>
{
    console.log(`App listening at http://localhost:${port}`)
})