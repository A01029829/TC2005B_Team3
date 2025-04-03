"use strict"

// Importing modules
import express from 'express'

// The mysql2/promise module is used to connect to the MySQL database. The promise version of the module is used to avoid the use of callbacks and instead use the async/await syntax.
import mysql from 'mysql2/promise'
import fs from 'fs'

const app = express()
const port = 5500

app.use(express.json())
app.use(express.static('./public'))

// Function to connect to the MySQL database
async function connectToDB()
{
    return await mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'&Soobintxt43.',
        database:'api_game_db'
    })
}

// Routes definition and handling
app.get('/', (request,response)=>{
    fs.readFile('./public/html/mysqlUseCases.html', 'utf8', (err, html)=>{
        if(err) response.status(500).send('There was an error: ' + err)
        console.log('Loading page...')
        response.send(html)
    })
})