// src/preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Funciones para la App Principal
  getGames: (searchTerm) => ipcRenderer.invoke('get-games', searchTerm),
  addGame: (game) => ipcRenderer.invoke('add-game', game),
  updateGame: (game) => ipcRenderer.invoke('update-game', game),
  deleteGame: (id) => ipcRenderer.invoke('delete-game', id),
  selectImage: () => ipcRenderer.invoke('select-image'),
  getImagePath: (filePath) => `file://${filePath}`,

  // Función para el Login
  loginSuccess: () => ipcRenderer.send('login-success'),

  // Función para Exportar
  exportData: () => ipcRenderer.invoke('export-data'),
  
  // Nueva función para Estadísticas
  getStats: () => ipcRenderer.invoke('get-stats')
});