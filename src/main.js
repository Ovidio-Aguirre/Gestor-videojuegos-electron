// src/main.js
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const dbManager = require('./database');

// --- CONFIGURACIÓN DE RUTAS ---
const userDataPath = app.getPath('userData');
const dbPath = path.join(userDataPath, 'catalog.sqlite');
dbManager.initDatabase(dbPath);

const imagesDir = path.join(userDataPath, 'game_images');
if (!fs.existsSync(imagesDir)){
    fs.mkdirSync(imagesDir);
}

// --- LÓGICA DE VENTANAS ---
let loginWindow;
let mainWindow;

function createLoginWindow() {
  loginWindow = new BrowserWindow({
    width: 500,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  });
  loginWindow.loadFile(path.join(__dirname, 'login.html'));
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  });
  mainWindow.loadFile(path.join(__dirname, '../web/index.html'));
}

// --- MANEJO DE EVENTOS DE LA APP ---
app.whenReady().then(async () => {
  await dbManager.setupDatabase();
  createLoginWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createLoginWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// --- MANEJO DE COMUNICACIÓN (IPC) ---
ipcMain.on('login-success', () => {
  console.log('Login exitoso recibido. Abriendo la ventana principal.');
  createMainWindow();
  loginWindow.close();
});

ipcMain.handle('get-games', async (event, searchTerm) => {
  let query = dbManager.knex('videojuegos').select('*');
  if (searchTerm) {
    query = query.where('titulo', 'like', `%${searchTerm}%`)
                 .orWhere('plataforma', 'like', `%${searchTerm}%`);
  }
  return query;
});

ipcMain.handle('add-game', async (event, game) => {
  const [insertedId] = await dbManager.knex('videojuegos').insert(game);
  return dbManager.knex('videojuegos').select('*').where('id', insertedId).first();
});

ipcMain.handle('update-game', async (event, game) => {
  await dbManager.knex('videojuegos').where('id', game.id).update(game);
  return dbManager.knex('videojuegos').select('*').where('id', game.id).first();
});

ipcMain.handle('delete-game', async (event, id) => {
  return dbManager.knex('videojuegos').where('id', id).del();
});

ipcMain.handle('select-image', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif', 'webp'] }]
    });

    if (result.canceled || result.filePaths.length === 0) {
        return null;
    }

    const originalPath = result.filePaths[0];
    const fileName = path.basename(originalPath);
    const destinationPath = path.join(imagesDir, fileName);

    fs.copyFileSync(originalPath, destinationPath);
    
    return destinationPath;
});

ipcMain.handle('export-data', async () => {
  try {
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'Exportar Catálogo a JSON',
      defaultPath: `catalogo-videojuegos-${Date.now()}.json`,
      filters: [{ name: 'JSON Files', extensions: ['json'] }]
    });

    if (canceled) {
      return { success: false, error: 'Exportación cancelada' };
    }

    const games = await dbManager.knex('videojuegos').select('*');
    const jsonData = JSON.stringify(games, null, 2);
    fs.writeFileSync(filePath, jsonData);

    return { success: true };
  } catch (error) {
    console.error('Error al exportar los datos:', error);
    return { success: false, error: error.message };
  }
});

// NUEVO HANDLER PARA ESTADÍSTICAS
ipcMain.handle('get-stats', async () => {
  try {
    const totalResult = await dbManager.knex('videojuegos').count({ count: '*' }).first();
    const completedResult = await dbManager.knex('videojuegos').where({ estado: 'Completado' }).count({ count: '*' }).first();
    
    const stats = {
      total: totalResult.count,
      completed: completedResult.count
    };
    return stats;
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return { total: 0, completed: 0 };
  }
});