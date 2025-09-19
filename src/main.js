// src/main.js
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { setupDatabase, knex } = require('./database');

// Guarda una referencia global para evitar que la ventana sea cerrada por el recolector de basura
let mainWindow;

// Crea el directorio de imágenes si no existe
const imagesDir = path.join(app.getPath('userData'), 'game_images');
if (!fs.existsSync(imagesDir)){
    fs.mkdirSync(imagesDir);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(async () => {
  await setupDatabase();
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// --- API DE DATOS (IPC HANDLERS) ---

// OBTENER TODOS LOS JUEGOS (CON BÚSQUEDA)
ipcMain.handle('get-games', async (event, searchTerm) => {
  let query = knex('videojuegos').select('*');
  if (searchTerm) {
    query = query.where('titulo', 'like', `%${searchTerm}%`)
                 .orWhere('plataforma', 'like', `%${searchTerm}%`);
  }
  return query;
});

// AGREGAR UN JUEGO
ipcMain.handle('add-game', async (event, game) => {
  const [insertedId] = await knex('videojuegos').insert(game);
  return knex('videojuegos').select('*').where('id', insertedId).first();
});

// ACTUALIZAR UN JUEGO
ipcMain.handle('update-game', async (event, game) => {
  await knex('videojuegos').where('id', game.id).update(game);
  return knex('videojuegos').select('*').where('id', game.id).first();
});

// ELIMINAR UN JUEGO
ipcMain.handle('delete-game', async (event, id) => {
  return knex('videojuegos').where('id', id).del();
});

// SELECCIONAR Y COPIAR IMAGEN
ipcMain.handle('select-image', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif', 'webp'] }]
    });

    if (result.canceled || result.filePaths.length === 0) {
        return null; // El usuario canceló la selección
    }

    const originalPath = result.filePaths[0];
    const fileName = path.basename(originalPath);
    const destinationPath = path.join(imagesDir, fileName);

    // Copia el archivo a la carpeta de datos de la app
    fs.copyFileSync(originalPath, destinationPath);
    
    // Devuelve la ruta donde se guardó la imagen para almacenarla en la BD
    return destinationPath;
});