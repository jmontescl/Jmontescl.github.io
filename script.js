const ADMIN_KEY = 'jmontes2004';
const adminSection = document.getElementById('admin-section');
const loginContainer = document.getElementById('login-container');
const adminPanel = document.getElementById('admin-panel');
const adminKeyInput = document.getElementById('admin-key');
const categorySelect = document.getElementById('category-select');
const playerNameInput = document.getElementById('player-name');
const pointsInput = document.getElementById('points-input');
const pointsDisplay = document.getElementById('points-display');

// Referencia a la base de datos de Firebase
const database = firebase.database();
const playersRef = database.ref('players');

// Cargar datos en tiempo real desde Firebase
playersRef.on('value', (snapshot) => {
    const players = snapshot.val() || {};
    displayPlayers(players);
});

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
    const pointsToAdd = parseInt(pointsInput.value);

    if (playerName === '' || isNaN(pointsToAdd) || pointsToAdd <= 0) {
        alert('Por favor, ingresa un nombre de jugador y una cantidad de puntos válida.');
        return;
    }

    const categoryRef = playersRef.child(category);

    categoryRef.once('value', (snapshot) => {
        const playersInCategory = snapshot.val() || {};
        let playerKeyToUpdate = null;

        // Buscar si el jugador ya existe en la categoría
        for (let key in playersInCategory) {
            if (playersInCategory[key].name.toLowerCase() === playerName.toLowerCase()) {
                playerKeyToUpdate = key;
                break;
            }
        }

        if (playerKeyToUpdate) {
            // El jugador ya existe, actualiza los puntos
            const newPoints = playersInCategory[playerKeyToUpdate].points + pointsToAdd;
            categoryRef.child(playerKeyToUpdate).update({ points: newPoints });
        } else {
            // Si el jugador no existe, crea uno nuevo
            categoryRef.push({
                name: playerName,
                points: pointsToAdd
            });
        }
    });

    // Limpiar campos
    playerNameInput.value = '';
    pointsInput.value = '';
    alert(`Se han otorgado ${pointsToAdd} puntos a ${playerName} en la categoría ${category}.`);
}

function displayPlayers(players) {
    pointsDisplay.innerHTML = '';
    
    // Obtener las categorías del objeto de jugadores
    const categories = Object.keys(players);
    
    categories.forEach(category => {
        const categoryHeader = document.createElement('h3');
        categoryHeader.textContent = `Categoría: ${category.charAt(0).toUpperCase() + category.slice(1)}`;
        pointsDisplay.appendChild(categoryHeader);

        // Convertir el objeto de jugadores en un array y ordenarlo
        const playersArray = Object.values(players[category]);
        const sortedPlayers = playersArray.sort((a, b) => b.points - a.points);

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

// Inicialmente, mostrar solo la sección de login
adminSection.style.display = 'block';
