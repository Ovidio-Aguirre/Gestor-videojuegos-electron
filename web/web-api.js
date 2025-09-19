// web/web-api.js

// --- SIMULACIÓN DE LA API DE ELECTRON CON LOCALSTORAGE Y BASE64 PARA IMÁGENES ---

// Función para obtener los juegos desde localStorage
function getGamesFromStorage() {
    const games = localStorage.getItem('videojuegos');
    return games ? JSON.parse(games) : [];
}

// Función para guardar los juegos en localStorage
function saveGamesToStorage(games) {
    localStorage.setItem('videojuegos', JSON.stringify(games));
}

// Función para convertir un archivo de imagen a un string Base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Creamos el objeto 'api' que nuestro renderer.js espera encontrar
window.api = {
    getGames: (searchTerm) => {
        let games = getGamesFromStorage();
        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            games = games.filter(game => 
                game.titulo.toLowerCase().includes(lowerCaseSearch) ||
                game.plataforma.toLowerCase().includes(lowerCaseSearch)
            );
        }
        return Promise.resolve(games);
    },

    addGame: (game) => {
        const games = getGamesFromStorage();
        const newId = games.length > 0 ? Math.max(...games.map(g => g.id)) + 1 : 1;
        const newGame = { ...game, id: newId };
        games.push(newGame);
        saveGamesToStorage(games);
        return Promise.resolve(newGame);
    },

    updateGame: (updatedGame) => {
        let games = getGamesFromStorage();
        games = games.map(game => game.id === updatedGame.id ? updatedGame : game);
        saveGamesToStorage(games);
        return Promise.resolve(updatedGame);
    },

    deleteGame: (id) => {
        let games = getGamesFromStorage();
        games = games.filter(game => game.id !== parseInt(id));
        saveGamesToStorage(games);
        return Promise.resolve();
    },

    // --- ¡AQUÍ ESTÁ LA MAGIA! ---
    // Esta es la nueva función para seleccionar imágenes en la web
    selectImage: () => {
        return new Promise((resolve) => {
            // Creamos un input de tipo "file" invisible
            const inputFile = document.createElement('input');
            inputFile.type = 'file';
            inputFile.accept = 'image/*';

            // Cuando el usuario selecciona un archivo, lo procesamos
            inputFile.onchange = async (event) => {
                const file = event.target.files[0];
                if (!file) {
                    resolve(null);
                    return;
                }
                
                // Convertimos la imagen a Base64 y la devolvemos
                const base64String = await fileToBase64(file);
                resolve(base64String);
            };
            
            // Hacemos clic en el input invisible para abrir el diálogo de selección de archivo
            inputFile.click();
        });
    },

    // Esta función ahora solo devuelve la misma ruta, ya que la ruta es el dato Base64
    getImagePath: (filePath) => {
        return filePath;
    }
};