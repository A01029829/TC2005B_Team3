function main() 
{
    // Function to load the leaderboard when the page loads
    async function loadLeaderboard() {
        try {
            let response = await fetch('http://localhost:5800/api/leaderboard', {
                method: 'GET'
            });
            
            if (response.ok) {
                let results = await response.json();
                console.log("results", results);
                
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
            'Posición',
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

    // Function to load data for an specific user
    async function loadUserStats(username) {
        try {
            const userStatsContainer = document.getElementById('userStatsResults');
            userStatsContainer.innerHTML = '<p>Cargando datos del usuario...</p>';
            
            let response = await fetch(`http://localhost:5800/api/user-stats/${username}`, {
                method: 'GET'
            });
            
            if (response.ok) {
                let results = await response.json();
                
                // If the user has no stats, show no data text
                // If the user has stats, display them
                if (results.length > 0) {
                    displayUserStats(results);
                } else {
                    userStatsContainer.innerHTML = '<p class="no-data">No se encontraron estadísticas para este usuario.</p>';
                }
                // If response is not found, show no data text
            } else if (response.status === 404) {
                userStatsContainer.innerHTML = '<p class="no-data">No se encontraron estadísticas para este usuario.</p>';
            } else {
                userStatsContainer.innerHTML = `Error: ${response.status}`;
            }
        } catch (error) {
            // Show error message
            console.error('Error fetching user stats:', error);
            document.getElementById('userStatsResults').innerHTML = `Error al cargar estadísticas: ${error.message}`;
        }
    }

    // Function to display user stats
    function displayUserStats(data) {
        const container = document.getElementById('userStatsResults');
        container.innerHTML = '';
        
        // Create table
        const table = document.createElement('table');
        table.className = 'user-stats-table';
        
        // Create header row
        const headerRow = table.insertRow(-1);
        headerRow.className = 'header-row';
        
        // Define headers we want to display
        const headers = [
            'Fecha',
            'Tiempo Total', 
            'Puntuación',
            'Nivel',
            'Sala',
            'Bioma',
            'Rank',
            'Vida',
            'Enemigos',
            'Clase',
            'Fin Partida'
        ];
        
        // Add header cells
        headers.forEach(headerText => {
            const headerCell = document.createElement('th');
            headerCell.innerHTML = headerText;
            headerRow.appendChild(headerCell);
        });
        
        // Add data rows
        data.forEach(gameStats => {
            // -1 to insert at the end
            const row = table.insertRow(-1);
            
            // Format date
            // Changes standar ISO date format for better readability
            // Example: 2023-10-01T12:00:00Z to 01/10/2023 12:00
            const date = new Date(gameStats.FechaFin);
            const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
            
            // Add cells
            addCell(row, formattedDate);
            addCell(row, gameStats.TiempoTotal);
            addCell(row, gameStats.PuntuacionFinal);
            addCell(row, gameStats.NivelAlcanzado);
            addCell(row, gameStats.SalaAlcanzada);
            addCell(row, gameStats.BiomaAlMorir);
            addCell(row, gameStats.RankRestante);
            addCell(row, gameStats.VidaRestante);
            addCell(row, gameStats.TotalEnemigosEliminados);
            addCell(row, gameStats.ClaseJugador);
            addCell(row, gameStats.TipoFinPartida);
        });
        
        // Add table to the container
        container.appendChild(table);
        
        // Add detailed stats for the most recent game
        if (data.length > 0) {
            const latestGame = data[0];
            
            const detailsDiv = document.createElement('div');
            detailsDiv.className = 'game-details';
            detailsDiv.innerHTML = `
                <h3>Detalles de la última partida</h3>
                <p><strong>Usuario:</strong> ${latestGame.nombreUsuario}</p>
                <p><strong>Clase:</strong> ${latestGame.ClaseJugador}</p>
                <p><strong>Puntuación:</strong> ${latestGame.PuntuacionFinal}</p>
                <p><strong>Enemigos Comunes Derrotados:</strong> ${latestGame.EnemigosComunesDerrotados}</p>
                <p><strong>Enemigos Fuertes Derrotados:</strong> ${latestGame.EnemigosFuertesDerrotados}</p>
                <p><strong>Jefes Derrotados:</strong> ${latestGame.JefesDerrotados}</p>
                <p><strong>Total Enemigos Eliminados:</strong> ${latestGame.TotalEnemigosEliminados}</p>
                <p><strong>Último Objeto Encontrado:</strong> ${latestGame.UltimoObjetoEncontrado || 'Ninguno'}</p>
            `;
            
            container.appendChild(detailsDiv);
        }
    }

    async function loadGraphs() {
        // Graphs
        /**
         * @param {number} alpha Indicated the transparency of the color
         * @returns {string} A string of the form 'rgba(240, 50, 123, 1.0)' that represents a color
         */

        const colors = ["rgba(154, 60, 60, 1.0)", "rgba(44, 62, 80, 1.0)", "rgba(179, 192, 164, 1.0)", "rgba(172, 146, 166, 1.0)", "rgba(247, 146, 86, 1.0)"]

        // function random_color(alpha=1.0)
        // {
        //     const r_c = () => Math.round(Math.random() * 255)
        //     return `rgba(${r_c()}, ${r_c()}, ${r_c()}, ${alpha}`
        // }

        Chart.defaults.font.size = 16;

        // Graph 1
        // To plot data from an API, we first need to fetch a request, and then process the data.
        try {
            const class_response = await fetch('http://localhost:5800/api/class', { method: 'GET' })

            if (class_response.ok) {
                console.log('Response is ok. Converting to JSON.')

                let results = await class_response.json()

                console.log(results)
                console.log('Data converted correctly. Plotting chart.')

                // In this case, we just separate the data into different arrays using the map method of the values array. This creates new arrays that hold only the data that we need.
                const class_names = results.map(e => e['claseElegida']) // Nombre columna
                console.log("level", class_names)
                const class_borders = results.map(e => 'rgba(0, 0, 0, 0.8)')
                const class_election = results.map(e => e['Elecciones'])

                const ctx_class1 = document.getElementById('apiChart1').getContext('2d');
                const levelChart1 = new Chart(ctx_class1,
                    {
                        type: 'pie',
                        data: {
                            labels: class_names,
                            datasets: [
                                {
                                    label: 'Veces Elegido',
                                    backgroundColor: colors,
                                    borderColor: class_borders,
                                    data: class_election
                                }
                            ]
                        }
                    })
            }
        }
        catch (error) {
            console.log(error)
        }

        // Graph 2
        // To plot data from an API, we first need to fetch a request, and then process the data.
        try {
            const class_response = await fetch('http://localhost:5800/api/playersLevel', { method: 'GET' })

            if (class_response.ok) {
                console.log('Response is ok. Converting to JSON.')

                let results = await class_response.json()

                console.log(results)
                console.log('Data converted correctly. Plotting chart.')

                // In this case, we just separate the data into different arrays using the map method of the values array. This creates new arrays that hold only the data that we need.
                const class_names = results.map(e => e['Nivel']) // Nombre columna
                const class_borders = results.map(e => 'rgba(0, 0, 0, 0.8)')
                const class_election = results.map(e => e['PorcentajeDelTotal'])

                    const ctx_class2 = document.getElementById('apiChart2').getContext('2d');
                    const levelChart2 = new Chart(ctx_class2,
                        {
                            type: 'line',
                            data: {
                                labels: class_names,
                                datasets: [
                                    {
                                        label: 'Porcentaje que alcanzo el nivel',
                                        backgroundColor: colors,
                                        pointRadius: 10,
                                        data: class_election
                                    }
                                ]
                            }
                        })
                
            }
        }
        catch (error) {
            console.log(error)
        }

        // Graph 3
        // To plot data from an API, we first need to fetch a request, and then process the data.
        try {
            const class_response = await fetch('http://localhost:5800/api/deaths', { method: 'GET' })

            if (class_response.ok) {
                console.log('Response is ok. Converting to JSON.')

                let results = await class_response.json()

                console.log(results)
                console.log('Data converted correctly. Plotting chart.')

                // In this case, we just separate the data into different arrays using the map method of the values array. This creates new arrays that hold only the data that we need.
                const class_names = results.map(e => e['TipoDeMuerte']) // Nombre columna
                console.log("level", class_names)
                const class_borders = results.map(e => 'rgba(0, 0, 0, 0.8)')
                const class_election = results.map(e => e['CantidadJugadores'])

                const ctx_class3 = document.getElementById('apiChart3').getContext('2d');
                const levelChart3 = new Chart(ctx_class3,
                    {
                        type: 'bar',
                        data: {
                            labels: class_names,
                            datasets: [
                                {
                                    label: 'Núm Muertes',
                                    backgroundColor: colors,
                                    borderColor: class_borders,
                                    borderWidth: 2,
                                    data: class_election
                                }
                            ]
                        }
                    })
                
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    // Add a cell to a row function
    function addCell(row, content) {
        const cell = row.insertCell(-1);
        cell.innerHTML = content;
    }

    // Load the leaderboard when the page loads
    loadLeaderboard();

    // Add event listener for the user stats form
    document.getElementById('formSelectUser').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('input_user').value.trim();
        
        if (username) {
            loadUserStats(username);
        }
    });

    loadGraphs();

}

document.addEventListener('DOMContentLoaded', main);