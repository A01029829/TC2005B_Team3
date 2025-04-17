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
                //alert(result.message || "Login exitoso");

                // Go to html clases
                console.log("Redirecting to clases.html");
                window.location.href = "../html/clases.html";
            }
            // If there's a specific error message from the server, show it
            else {
                switch (response.status) {
                    case 400:
                        // Bad request - validation errors
                        // alert(responseData.message || "Datos inválidos. Por favor verifique su información.");
                        alert ("Datos inválidos. Por favor verifique su información.");
                        break;
                    case 401:
                        // Unauthorized - wrong password
                        //alert(responseData.message || "Credenciales incorrectas");
                        alert ("Credenciales incorrectas");
                        break;
                    case 409:
                        // Conflict - username already exists
                        //alert(responseData.message || "El nombre de usuario o correo ya está en uso");
                        alert ("El nombre de usuario o correo ya está en uso");
                        break;
                    case 500:
                        // Server error
                        //alert(responseData.message || "Error interno del servidor. Intente más tarde.");
                        alert ("Error interno del servidor. Intente más tarde.");
                        break;
                    default:
                        // Generic error
                        //alert(responseData.message || `Error: ${response.status}`);
                        alert (`Error: ${response.status}`);
                }
            }
        }
        catch (error) {
            // Error handling JSON 
            console.error("Error processing response:", error);
            alert(`Error: ${response.statusText || "Error desconocido"}`);
        }

        // if (!response.ok) {
        //     const errorText = await response.text();
        //     console.error("Server error:", errorText);
        // }
        // if(response.ok)
        // {
        //     let results = await response.json()

        //     console.log(results)
        //     alert(results.message)


        // }
        // else{
        //     alert("Error en el inicio de sesión")
        // }

        // window.location.href = "../html/clases.html";
    }

    // document.getElementById('login').onsubmit = async (e) => {
    //     e.preventDefault();
        
    //     // Get form values
    //     const email = document.querySelector('input[name="correo"]').value;
    //     const username = document.querySelector('input[name="userID"]').value;
    //     const password = document.querySelector('input[name="password"]').value;
    
    //     if (!email || !username || !password) {
    //         alert("Por favor complete todos los campos");
    //         return false;
    //     }
    
    //     try {
    //         // Show loading indicator or disable submit button
    //         const submitButton = document.getElementById('submit');
    //         const originalButtonText = submitButton.value;
    //         submitButton.value = "Procesando...";
    //         submitButton.disabled = true;
            
    //         // Create login data object
    //         const loginData = {
    //             correo: email,
    //             nombreUsuario: username,
    //             contrasena: password
    //         };
    
    //         // Send POST request to login endpoint
    //         const response = await fetch('http://localhost:5800/api/login', {
    //             method: 'POST',
    //             headers: {'Content-Type': 'application/json'},
    //             body: JSON.stringify(loginData)
    //         });
            
    //         const result = await response.json();
            
    //         // Reset button state
    //         submitButton.value = originalButtonText;
    //         submitButton.disabled = false;
            
    //         if (response.ok) {
    //             console.log("Login/Registration successful:", result);
                
    //             // Store player data in session storage for future use
    //             sessionStorage.setItem('currentPlayerId', result.id_jugador);
    //             sessionStorage.setItem('currentPlayerName', result.nombreUsuario);
    //             sessionStorage.setItem('currentPartidaId', result.id_partida);
                
    //             // Show success message
    //             alert(result.message);
                
    //             // Close login form
    //             document.getElementById('login').classList.remove('open_login');
                
    //             // Redirect to classes page
    //             window.location.href = "../html/clases.html";
    //         } else {
    //             console.error("Login/Registration failed:", result);
    //             alert(result.message || "Error en el inicio de sesión");
    //         }
    //     } catch (error) {
    //         console.error("Error connecting to server:", error);
    //         alert("Error de conexión. Verifique que el servidor esté funcionando.");
            
    //         // Reset button state in case of error
    //         const submitButton = document.getElementById('submit');
    //         submitButton.value = "Login";
    //         submitButton.disabled = false;
    //     }
    // }
    
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

main()