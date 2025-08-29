const ADMIN_KEY = 'jmontes2004';
const adminSection = document.getElementById('admin-section');
const loginContainer = document.getElementById('login-container');
const adminPanel = document.getElementById('admin-panel');
const adminKeyInput = document.getElementById('admin-key');
const categorySelect = document.getElementById('category-select');
const playerNameInput = document.getElementById('player-name');
const pointsInput = document.getElementById('points-input');
const pointsDisplay = document.getElementById('points-display');

// Cargar datos al inicio
let players = JSON.parse(localStorage.getItem('players')) || {};
displayPlayers();

function loginAdmin() {
    if (adminKeyInput.value === ADMIN_KEY) {
        loginContainer.style.display = 'none';
        adminPanel.style.display = 'block';
        alert('Acceso de administrador concedido');
    } else {
        alert('Clave incorrecta. Acceso denegado.');
    }
}

function addPoints() {
    const category = categorySelect.value;
    const playerName = playerNameInput.value.trim();
    const points = parseInt(pointsInput.value);

    if (playerName === '' || isNaN(points) || points <= 0) {
        alert('Por favor, ingresa un nombre de jugador y una cantidad de puntos válida.');
        return;
    }

    if (!players[category]) {
        players[category] = [];
    }

    // Buscar si el jugador ya existe en la categoría
    const existingPlayer = players[category].find(p => p.name.toLowerCase() === playerName.toLowerCase());
    
    if (existingPlayer) {
        existingPlayer.points += points;
    } else {
        players[category].push({
            name: playerName,
            points: points
        });
    }

    // Guardar en localStorage
    localStorage.setItem('players', JSON.stringify(players));

    // Limpiar campos y actualizar la visualización
    playerNameInput.value = '';
    pointsInput.value = '';
    displayPlayers();
    alert(`Se han otorgado ${points} puntos a ${playerName} en la categoría ${category}.`);
}

function displayPlayers() {
    pointsDisplay.innerHTML = '';
    
    // Convertir el objeto de jugadores en un array de categorías
    const categories = Object.keys(players);
    
    categories.forEach(category => {
        const categoryHeader = document.createElement('h3');
        categoryHeader.textContent = `Categoría: ${category.charAt(0).toUpperCase() + category.slice(1)}`;
        pointsDisplay.appendChild(categoryHeader);

        // Ordenar los jugadores por puntos (de mayor a menor)
        const sortedPlayers = players[category].sort((a, b) => b.points - a.points);

        sortedPlayers.forEach(player => {
            const card = document.createElement('div');
            card.className = 'player-card';
            card.innerHTML = `
                <h4>${player.name}</h4>
                <p>Puntos: ${player.points}</p>
                <p>Valor: $${player.points * 200} COP</p>
            `;
            pointsDisplay.appendChild(card);
        });
    });
}

// Inicialmente, mostrar la sección de administración para el login
adminSection.style.display = 'block';
