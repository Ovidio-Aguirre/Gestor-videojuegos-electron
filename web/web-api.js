// web/web-api.js

// --- LÓGICA DE INDEXEDDB ---

const DB_NAME = 'VideojuegosDB';
const STORE_NAME = 'videojuegos';
let db;

// Función para inicializar la base de datos.
// Se debe llamar y esperar a que termine antes de usar la API.
function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onerror = (event) => {
            console.error('Error al abrir la base de datos:', event);
            reject('Error al abrir la base de datos');
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            console.log('Base de datos abierta exitosamente.');
            resolve();
        };

        // Este evento solo se dispara si la versión de la BD cambia (o en la creación)
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            // Creamos el "almacén de objetos" (como una tabla en SQL)
            db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            console.log('Almacén de objetos creado.');
        };
    });
}

// Función para convertir un archivo a Base64 (para las imágenes)
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}


// --- API PARA LA APLICACIÓN ---

// Exponemos las funciones en el objeto 'window' para que renderer.js las use.
// Hacemos esto para mantener la compatibilidad con la versión de Electron.
window.api = {
    getGames: (searchTerm) => {
        return new Promise((resolve, reject) => {
            if (!db) return reject('La base de datos no está inicializada.');
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();

            request.onsuccess = () => {
                let games = request.result;
                if (searchTerm) {
                    const lowerCaseSearch = searchTerm.toLowerCase();
                    games = games.filter(game =>
                        game.titulo.toLowerCase().includes(lowerCaseSearch) ||
                        game.plataforma.toLowerCase().includes(lowerCaseSearch)
                    );
                }
                resolve(games);
            };
            request.onerror = (event) => reject('Error al obtener los juegos:', event);
        });
    },

    addGame: (game) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.add(game);

            request.onsuccess = () => resolve(request.result); // Devuelve el ID del nuevo juego
            request.onerror = (event) => reject('Error al agregar el juego:', event);
        });
    },

    updateGame: (game) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.put(game);

            request.onsuccess = () => resolve();
            request.onerror = (event) => reject('Error al actualizar el juego:', event);
        });
    },

    deleteGame: (id) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = (event) => reject('Error al eliminar el juego:', event);
        });
    },

    selectImage: () => {
        return new Promise((resolve) => {
            const inputFile = document.createElement('input');
            inputFile.type = 'file';
            inputFile.accept = 'image/*';
            inputFile.onchange = async (event) => {
                const file = event.target.files[0];
                if (!file) {
                    resolve(null);
                    return;
                }
                const base64String = await fileToBase64(file);
                resolve(base64String);
            };
            inputFile.click();
        });
    },

    getImagePath: (filePath) => {
        return filePath;
    }
};

// Exponemos la función de inicialización para llamarla desde renderer.js
window.initDB = initDB;