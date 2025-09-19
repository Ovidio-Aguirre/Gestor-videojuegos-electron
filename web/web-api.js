// src/web-api.js

// --- SIMULACIÓN DE LA API DE ELECTRON CON LOCALSTORAGE ---

// Función para obtener los juegos desde localStorage
function getGamesFromStorage() {
    const games = localStorage.getItem('videojuegos');
    return games ? JSON.parse(games) : [];
}

// Función para guardar los juegos en localStorage
function saveGamesToStorage(games) {
    localStorage.setItem('videojuegos', JSON.stringify(games));
}

// Creamos el objeto 'api' que nuestro renderer.js espera encontrar
window.api = {
    getGames: (searchTerm) => {
        console.log("Usando API web para getGames");
        let games = getGamesFromStorage();
        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            games = games.filter(game => 
                game.titulo.toLowerCase().includes(lowerCaseSearch) ||
                game.plataforma.toLowerCase().includes(lowerCaseSearch)
            );
        }
        return Promise.resolve(games); // Devolvemos una promesa para imitar el comportamiento async
    },

    addGame: (game) => {
        console.log("Usando API web para addGame");
        const games = getGamesFromStorage();
        // Simulamos un ID autoincremental
        const newId = games.length > 0 ? Math.max(...games.map(g => g.id)) + 1 : 1;
        const newGame = { ...game, id: newId };
        games.push(newGame);
        saveGamesToStorage(games);
        return Promise.resolve(newGame);
    },

    updateGame: (updatedGame) => {
        console.log("Usando API web para updateGame");
        let games = getGamesFromStorage();
        games = games.map(game => game.id === updatedGame.id ? updatedGame : game);
        saveGamesToStorage(games);
        return Promise.resolve(updatedGame);
    },

    deleteGame: (id) => {
        console.log("Usando API web para deleteGame");
        let games = getGamesFromStorage();
        games = games.filter(game => game.id !== parseInt(id));
        saveGamesToStorage(games);
        return Promise.resolve();
    },

    // La selección de imágenes no es posible de la misma forma en la web.
    // Devolvemos null para que no se rompa la lógica.
    selectImage: () => {
        alert("La selección de imágenes locales no está disponible en la versión web.");
        return Promise.resolve(null);
    },

    // Esta función no es necesaria en la web, ya que las rutas serán URLs o no existirán.
    getImagePath: (filePath) => {
        return filePath;
    }
};