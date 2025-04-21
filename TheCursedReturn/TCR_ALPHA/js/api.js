function main()
{
    document.getElementById('login').onsubmit = async (e) => 
    {
        e.preventDefault();

        const correo = document.querySelector('input[name="correo"]').value;
        const nombreUsuario = document.querySelector('input[name="nombreUsuario"]').value;
        const contrasena = document.querySelector('input[name="contrasena"]').value;

        if (!correo || !nombreUsuario || !contrasena) {
            alert("Por favor complete todos los campos");
            return false;
        }

        // Email validation 
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(correo)) {
            alert("Por favor ingrese un correo electrónico válido.");
            return;
        }

        // Username validation 
        const usernameRegex = /^[a-zA-Z0-9._]{3,20}$/;
        if (!usernameRegex.test(nombreUsuario)) {
            alert("El nombre de usuario debe tener entre 3 y 20 caracteres y solo puede contener letras, números, puntos y guiones bajos.");
            return;
        }

        // Password validation (example: at least 8 characters, 1 uppercase, 1 lowercase, 1 digit, 1 special character)
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(contrasena)) {
            alert("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.");
            return;
        }

        // Proceed with the fetch request
        const dataObj = { correo, nombreUsuario, contrasena };


        let response = await fetch('http://localhost:5800/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataObj),
        });

        try {
            // Handle JSON response
            const result = await response.json();

            // If response is OK, show success message
            if (response.ok) {
                console.log(result);

                // Go to html clases
                console.log("Redirecting to clases.html");
                window.location.href = "../html/clases.html";
            }
            // If there's a specific error message from the server, show it
            else {
                switch (response.status) {
                    case 400:
                        // Invalid data
                        alert ("Datos inválidos. Por favor verifique su información.");
                        break;
                    case 401:
                        // Wrong password
                        alert ("Credenciales incorrectas");
                        break;
                    case 409:
                        // Username or email already exists
                        alert ("El nombre de usuario o correo ya está en uso");
                        break;
                    case 500:
                        // Server error
                        alert ("Error interno del servidor. Intente más tarde.");
                        break;
                    default:
                        // Generic error
                        alert (`Error: ${response.status}`);
                }
            }
        }
        catch (error) {
            // Error handling JSON 
            console.error("Error processing response:", error);
            alert(`Error: ${response.statusText || "Error desconocido"}`);
        }
    }

    // Function to load the leaderboard when the page loads
    async function loadLeaderboard() {
        try {
            let response = await fetch('http://localhost:5800/api/leaderboard', {
                method: 'GET'
            });
            
            if (response.ok) {
                let results = await response.json();
                
                if (results.length > 0) {
                    displayLeaderboard(results);
                } else {
                    const container = document.getElementById('getResultsID');
                    container.innerHTML = '<p class="no-data">No leaderboard data available.</p>';
                }
            } else {
                document.getElementById('getResultsID').innerHTML = `Error: ${response.status}`;
            }
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            document.getElementById('getResultsID').innerHTML = `Error fetching leaderboard data: ${error.message}`;
        }
    }

    // Function to display the leaderboard data
    function displayLeaderboard(data) {
        const container = document.getElementById('getResultsID');
        container.innerHTML = '';
        
        // Create table
        const table = document.createElement('table');
        table.className = 'leaderboard-table';
        
        // Create header row
        const headerRow = table.insertRow(-1);
        headerRow.className = 'header-row';
        
        // Define headers we want to display
        const headers = [
            'Usuario', 
            'Puntuación'
        ];
        
        // Add header cells
        headers.forEach(headerText => {
            const headerCell = document.createElement('th');
            headerCell.innerHTML = headerText;
            headerRow.appendChild(headerCell);
        });
        
        // Add data rows
        data.forEach((player, index) => {
            const row = table.insertRow(-1);
            
            // Add rank cell (position in leaderboard)
            const rankCell = row.insertCell(-1);
            rankCell.innerHTML = index + 1;
            
            // Add player data cells
            addCell(row, player.nombreUsuario);
            addCell(row, player.PuntuacionFinal);
            
            // Add class to highlight the first place
            if (index === 0) {
                row.className = 'first-place';
            }
        });
        
        // Add table to the container
        container.appendChild(table);
    }
    
    // Helper function to add a cell to a row
    function addCell(row, content) {
        const cell = row.insertCell(-1);
        cell.innerHTML = content;
    }

    // Load the leaderboard when the page loads
    loadLeaderboard();
    
    // document.getElementById('formSelectUser').onsubmit = async (e) =>
    // {
    //     e.preventDefault()

    //     const data = new FormData(formSelectUser)
    //     const dataObj = Object.fromEntries(data.entries())

    //     let response = await fetch(`http://localhost:5800/api/Jugador/${dataObj['id_jugador']}`,{
    //         method: 'GET'
    //     })
        
    //     if(response.ok)
    //     {
    //         let results = await response.json()
        
    //         if(results.length > 0)
    //         {
    //             const headers = Object.keys(results[0])
    //             const values = Object.values(results)
    
    //             let table = document.createElement("table")
    
    //             let tr = table.insertRow(-1)                  
    
    //             for(const header of headers)
    //             {
    //                 let th = document.createElement("th")     
    //                 th.innerHTML = header
    //                 tr.appendChild(th)
    //             }
    
    //             for(const row of values)
    //             {
    //                 let tr = table.insertRow(-1)
    
    //                 for(const key of Object.keys(row))
    //                 {
    //                     let tabCell = tr.insertCell(-1)
    //                     tabCell.innerHTML = row[key]
    //                 }
    //             }
    
    //             const container = document.getElementById('getResultsID')
    //             container.innerHTML = ''
    //             container.appendChild(table)
    //         }
    //         else
    //         {
    //             const container = document.getElementById('getResultsID')
    //             container.innerHTML = 'No results to show.'
    //         }
    //     }
    //     else{
    //         getResults.innerHTML = response.status
    //     }
    // }

    // document.getElementById('formInsert').onsubmit = async(e)=>
    // {
    //     e.preventDefault()

    //     const data = new FormData(formInsert)
    //     const dataObj = Object.fromEntries(data.entries())

    //     let response = await fetch('http://localhost:5800/api/Jugador',{
    //         method: 'POST',
    //         headers: {'Content-Type': 'application/json'},
    //         body: JSON.stringify(dataObj)
    //     })
        
    //     if(response.ok)
    //     {
    //         let results = await response.json()
        
    //         console.log(results)
    //         postResults.innerHTML = results.message + ' id: ' + results.id
    //     }
    //     else{
    //         postResults.innerHTML = response.status
    //     }
    // }

    // document.getElementById('formUpdate').onsubmit = async(e)=>
    // {
    //     e.preventDefault()

    //     const data = new FormData(formUpdate)
    //     const dataObj = Object.fromEntries(data.entries())

    //     let response = await fetch('http://localhost:5800/api/Jugador',{
    //         method: 'PUT',
    //         headers: {'Content-Type': 'application/json'},
    //         body: JSON.stringify(dataObj)
    //     })
        
    //     if(response.ok)
    //     {
    //         let results = await response.json()
        
    //         console.log(results)
    //         putResults.innerHTML = results.message
    //     }
    //     else{
    //         putResults.innerHTML = response.status
    //     }
    // }

    // document.getElementById('formDelete').onsubmit = async(e)=>
    // {
    //     e.preventDefault()

    //     const data = new FormData(formDelete)
    //     const dataObj = Object.fromEntries(data.entries())

    //     let response = await fetch(`http://localhost:5800/api/Jugador/${dataObj['id_jugador']}`,{
    //         method: 'DELETE'
    //     })
        
    //     if(response.ok)
    //     {
    //         let results = await response.json()
        
    //         deleteResults.innerHTML = results.message
    //     }
    //     else
    //     {
    //         deleteResults.innerHTML = `Error!\nStatus: ${response.status} Message: ${results.message}`
    //     }
    // }
}
// Run the main function when the page loads
//document.addEventListener('DOMContentLoaded', main);
main()