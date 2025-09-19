// src/preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getGames: (searchTerm) => ipcRenderer.invoke('get-games', searchTerm),
  addGame: (game) => ipcRenderer.invoke('add-game', game),
  updateGame: (game) => ipcRenderer.invoke('update-game', game),
  deleteGame: (id) => ipcRenderer.invoke('delete-game', id),
  selectImage: () => ipcRenderer.invoke('select-image'),
  
  // Exponemos una función para obtener la ruta de la imagen de forma segura
  getImagePath: (filePath) => `file://${filePath}`
});