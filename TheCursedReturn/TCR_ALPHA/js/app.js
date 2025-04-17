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
    // fs.readFile('../html/api.html', 'utf8', (err, html)=>{
    //     if(err) response.status(500).send('There was an error: ' + err)
    //     console.log('Loading page...')
    //     response.send(html)
    // })
    fs.readFile('../html/inicio.html', 'utf8', (err, html)=>{
        if(err) response.status(500).send('There was an error: ' + err)
        console.log('Loading page...')
        response.send(html)
    })
})

// Get all Jugador from the database and return them as a JSON object
app.get('/api/Jugador', async (request, response)=>{
    let connection = null

    try
    {
        connection = await connectToDB()
        const [results, fields] = await connection.execute('select * from Jugador')

        console.log(`${results.length} rows returned`)
        console.log(results)
        response.json(results)
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

// Get a specific user from the database and return it as a JSON object
app.get('/api/Jugador/:id_jugador', async (request, response)=>
{
    let connection = null

    try
    {
        connection = await connectToDB()

        const [results_user, _] = await connection.query('select * from Jugador where id_jugador= ?', [request.params.id_jugador])
        
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

// // Create a new account
// app.post('/api/login', async (request, response) => {
//     let connection = null;

//     try 
//     {
//         connection = await connectToDB();

//         const { correo, nombreUsuario, contrasena } = request.body;

//         // Input validation based on database constraints
//         // Check email format
//         const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//         if (!emailRegex.test(correo)) {
//             return response.status(400).json({
//                 success: false,
//                 message: "Formato de correo inválido."
//             });
//         }

//         // Check username format (3-20 alphanumeric chars, dots, and underscores)
//         const usernameRegex = /^[a-zA-Z0-9._]{3,20}$/;
//         if (!usernameRegex.test(nombreUsuario)) {
//             return response.status(400).json({
//                 success: false,
//                 message: "El nombre de usuario debe tener entre 3 y 20 caracteres alfanuméricos, puntos o guiones bajos."
//             });
//         }

//         // Check password strength (min 8 chars, at least 1 uppercase, 1 lowercase, 1 digit, 1 special char)
//         const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//         if (!passwordRegex.test(contrasena)) {
//             return response.status(400).json({
//                 success: false,
//                 message: "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial."
//             });
//         }

//         // First check if user already exists with this email
//         const [existingUsersByEmail] = await connection.query(
//             'SELECT * FROM Jugador WHERE correo = ?', 
//             [correo]
//         );

//         // Also check if username is taken
//         const [existingUsersByName] = await connection.query(
//             'SELECT * FROM Jugador WHERE nombreUsuario = ?', 
//             [nombreUsuario]
//         );

//         if (existingUsersByEmail.length > 0) {
//             // Email exists, verify password
//             const user = existingUsersByEmail[0];
//             if (user.contrasena === contrasena) {
//                 // Password matches, login successful
//                 // Create a new game session (Partida)
//                 const [partidaResult] = await connection.query(
//                     'INSERT INTO Partida (id_jugador) VALUES (?)',
//                     [user.id_jugador]
//                 );
                
//                 response.json({
//                     success: true,
//                     message: "Login successful",
//                     id_jugador: user.id_jugador,
//                     nombreUsuario: user.nombreUsuario,
//                     id_partida: partidaResult.insertId
//                 });
//             } else {
//                 // Password doesn't match
//                 response.status(401).json({
//                     success: false,
//                     message: "Correo o contraseña incorrectos"
//                 });
//             }
//         } else if (existingUsersByName.length > 0) {
//             // Username exists but email doesn't match
//             response.status(409).json({
//                 success: false,
//                 message: "El nombre de usuario ya está en uso"
//             });
//         } else {
//             // User doesn't exist, create new account
//             try {
//                 const [result] = await connection.query(
//                     'INSERT INTO Jugador (nombreUsuario, correo, contrasena) VALUES (?, ?, ?)',
//                     [nombreUsuario, correo, contrasena]
//                 );
                
//                 // Create a new game session (Partida)
//                 const [partidaResult] = await connection.query(
//                     'INSERT INTO Partida (id_jugador) VALUES (?)',
//                     [result.insertId]
//                 );
                
//                 console.log(`New player created with ID: ${result.insertId}, Partida ID: ${partidaResult.insertId}`);
//                 response.status(201).json({
//                     success: true,
//                     message: "Cuenta creada con éxito",
//                     id_jugador: result.insertId,
//                     nombreUsuario: nombreUsuario,
//                     id_partida: partidaResult.insertId
//                 });
//             } catch (err) {
//                 // Handle database constraint errors
//                 console.error("Database error:", err);
//                 if (err.code === 'ER_CHECK_CONSTRAINT_VIOLATED') {
//                     response.status(400).json({
//                         success: false,
//                         message: "Los datos ingresados no cumplen con los requisitos"
//                     });
//                 } else {
//                     throw err; // Re-throw for the outer catch block
//                 }
//             }
//         }
//     } catch (error) {
//         console.error("Server error:", error);
//         response.status(500).json({
//             success: false,
//             message: "Error del servidor",
//             error: error.message
//         });
//     } finally {
//         if (connection !== null) {
//             connection.end();
//             console.log("Connection closed successfully!");
//         }
//     }
// });

// Insert a new user into the database and return a JSON object with the id of the new user
app.post('/api/Jugador', async (request, response)=>{

    let connection = null

    try
    {    
        connection = await connectToDB()

        const [results, fields] = await connection.query('insert into Jugador set ?', request.body)
        
        console.log(`${results.affectedRows} row inserted`)
        response.status(201).json({'message': "Data inserted correctly.", "id_jugador": results.insertId})
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

// Update a user in the database and return a JSON object with the number of rows updated
app.put('/api/Jugador', async (request, response)=>{

    let connection = null

    try{
        connection = await connectToDB()

        const [results, fields] = await connection.query('update Jugador set nombreUsuario = ?, correo = ?, contrasena=? where id_jugador= ?', 
            [request.body['nombreUsuario'], request.body['correo'], request.body['contrasena'], request.body['id_jugador']])
        
        console.log(`${results.affectedRows} rows updated`)
        response.json({'message': `Data updated correctly: ${results.affectedRows} rows updated.`})
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

// Delete a user from the database and return a JSON object with the number of rows deleted
app.delete('/api/Jugador/:id_jugador', async (request, response)=>{

    let connection = null

    try
    {
        connection = await connectToDB()

        const [results, fields] = await connection.query('delete from Jugador where id_jugador= ?', [request.params.id_jugador])
        
        console.log(`${results.affectedRows} row deleted`)
        response.json({'message': `Data deleted correctly: ${results.affectedRows} rows deleted.`})
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

app.listen(port, ()=>
{
    console.log(`App listening at http://localhost:${port}`)
})