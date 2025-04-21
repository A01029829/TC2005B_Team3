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
    
    // Helper function to add a cell to a row
    function addCell(row, content) {
        const cell = row.insertCell(-1);
        cell.innerHTML = content;
    }

    // Load the leaderboard when the page loads
    loadLeaderboard();
}

document.addEventListener('DOMContentLoaded', main);