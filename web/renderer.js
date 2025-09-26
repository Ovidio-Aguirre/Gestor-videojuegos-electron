document.addEventListener('DOMContentLoaded', () => {
    // --- REFERENCIAS A ELEMENTOS DEL DOM ---
    const mainView = document.getElementById('main-view');
    const formView = document.getElementById('form-view');
    const detailView = document.getElementById('detail-view');
    const gamesTableBody = document.getElementById('games-table-body');
    const searchInput = document.getElementById('search-input');
    
    const showAddFormBtn = document.getElementById('show-add-form-btn');
    const backToMainBtn = document.getElementById('back-to-main-btn');
    const backFromDetailBtn = document.getElementById('back-from-detail-btn');
    const exportBtn = document.getElementById('export-btn');

    const totalGamesStat = document.getElementById('total-games-stat');
    const completedGamesStat = document.getElementById('completed-games-stat');
    const chartCanvas = document.getElementById('statsChart');

    const gameForm = document.getElementById('game-form');
    const formTitle = document.getElementById('form-title');
    const gameIdInput = document.getElementById('game-id');
    let imagePath = null;
    
    const selectImageBtn = document.getElementById('select-image-btn');
    const imagePreview = document.getElementById('image-preview');
    const deleteBtn = document.getElementById('delete-btn');

    // --- ESTADO DE LA APP ---
    let editingGameId = null;
    let statsChart = null;

    // --- NAVEGACIÓN ---
    const showMainView = () => {
        formView.classList.add('hidden');
        detailView.classList.add('hidden');
        mainView.classList.remove('hidden');
        resetForm();
    };

    const showFormView = () => {
        mainView.classList.add('hidden');
        detailView.classList.add('hidden');
        formView.classList.remove('hidden');
    };

    // --- RENDERIZADO DE DATOS ---
    const renderGames = (games) => {
        gamesTableBody.innerHTML = '';
        games.forEach(game => {
            const row = document.createElement('tr');
            row.style.cursor = 'pointer';
            row.innerHTML = `
                <td data-label="ID">${game.id}</td>
                <td data-label="Título">${game.titulo}</td>
                <td data-label="Plataforma">${game.plataforma}</td>
                <td data-label="Género">${game.genero}</td>
                <td data-label="Año">${game.ano_lanzamiento || ''}</td>
                <td data-label="Desarrollador">${game.desarrollador || ''}</td>
                <td data-label="Estado">${game.estado}</td>
                <td data-label="Acciones" class="action-buttons-cell">
                    <button class="edit-btn" data-id="${game.id}">✏️</button>
                    <button class="delete-btn" data-id="${game.id}">🗑️</button>
                </td>
            `;
            
            row.addEventListener('click', (event) => {
                if (!event.target.closest('button')) {
                    showDetailView(game);
                }
            });

            gamesTableBody.appendChild(row);
        });

        document.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', (e) => { e.stopPropagation(); handleEdit(btn.dataset.id); }));
        document.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', (e) => { e.stopPropagation(); handleDelete(btn.dataset.id); }));
    };
    
    const showDetailView = (game) => {
        document.getElementById('detail-title').textContent = game.titulo;
        document.getElementById('detail-plataforma').textContent = game.plataforma;
        document.getElementById('detail-genero').textContent = game.genero;
        document.getElementById('detail-ano').textContent = game.ano_lanzamiento || 'No especificado';
        document.getElementById('detail-desarrollador').textContent = game.desarrollador || 'No especificado';
        document.getElementById('detail-estado').textContent = game.estado;
        const detailImage = document.getElementById('detail-image');
        if (game.imagen_path) {
            detailImage.src = window.api.getImagePath(game.imagen_path);
        } else {
            detailImage.src = '';
        }
        mainView.classList.add('hidden');
        formView.classList.add('hidden');
        detailView.classList.remove('hidden');
    };

    // --- LÓGICA DE DATOS Y ESTADÍSTICAS ---
    function renderStatsChart(games) {
        const completed = games.filter(g => g.estado === 'Completado').length;
        const inProgress = games.filter(g => g.estado === 'En progreso').length;
        const pending = games.filter(g => g.estado === 'Pendiente').length;

        const data = {
            labels: ['Completado', 'En Progreso', 'Pendiente'],
            datasets: [{
                label: 'Estado de Juegos',
                data: [completed, inProgress, pending],
                backgroundColor: ['rgba(29, 185, 84, 0.7)', 'rgba(41, 121, 255, 0.7)', 'rgba(179, 179, 179, 0.7)'],
                borderColor: ['#1DB954', '#2979FF', '#B3B3B3'],
                borderWidth: 1
            }]
        };

        if (statsChart) {
            statsChart.destroy();
        }

        statsChart = new Chart(chartCanvas, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { color: '#EAEAEA' }
                    }
                }
            }
        });
    }

    async function updateStats(games) {
        const completedGames = games.filter(game => game.estado === 'Completado').length;
        totalGamesStat.textContent = games.length;
        completedGamesStat.textContent = completedGames;
        renderStatsChart(games);
    }

    const loadGames = async (searchTerm = '') => {
        try {
            const games = await window.api.getGames(searchTerm);
            renderGames(games);
            await updateStats(games);
        } catch (error) {
            console.error("Error al cargar juegos:", error);
        }
    };

    const handleEdit = async (id) => {
        const games = await window.api.getGames();
        const gameToEdit = games.find(g => g.id == id);
        if (!gameToEdit) return;
        editingGameId = id;
        formTitle.textContent = 'Editar Juego';
        gameIdInput.value = gameToEdit.id;
        document.getElementById('titulo').value = gameToEdit.titulo;
        document.getElementById('plataforma').value = gameToEdit.plataforma;
        document.getElementById('genero').value = gameToEdit.genero;
        document.getElementById('ano_lanzamiento').value = gameToEdit.ano_lanzamiento;
        document.getElementById('desarrollador').value = gameToEdit.desarrollador;
        document.getElementById('estado').value = gameToEdit.estado;
        imagePath = gameToEdit.imagen_path;
        imagePreview.src = imagePath ? window.api.getImagePath(imagePath) : '';
        deleteBtn.classList.remove('hidden');
        showFormView();
    };

    const handleDelete = async (id) => {
        const confirmDelete = confirm('¿Estás seguro de que quieres eliminar este videojuego?');
        if (confirmDelete) {
            await window.api.deleteGame(parseInt(id));
            loadGames();
        }
    };

    const resetForm = () => {
        gameForm.reset();
        editingGameId = null;
        imagePath = null;
        imagePreview.src = '';
        formTitle.textContent = 'Agregar Juego';
        deleteBtn.classList.add('hidden');
    };

    // --- EVENT LISTENERS ---
    showAddFormBtn.addEventListener('click', () => {
        resetForm();
        showFormView();
    });
    
    backToMainBtn.addEventListener('click', showMainView);
    backFromDetailBtn.addEventListener('click', showMainView);
    document.getElementById('cancel-btn').addEventListener('click', showMainView);

    exportBtn.addEventListener('click', async () => {
        try {
            const games = await window.api.getGames();
            if (games.length === 0) {
                alert('No hay juegos en el catálogo para exportar.');
                return;
            }
            const jsonData = JSON.stringify(games, null, 2);
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `catalogo-videojuegos-${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error al exportar datos:', error);
            alert('Ocurrió un error al exportar los datos.');
        }
    });

    selectImageBtn.addEventListener('click', async () => {
        const newPath = await window.api.selectImage();
        if(newPath) {
            imagePath = newPath;
            imagePreview.src = window.api.getImagePath(newPath);
        }
    });

    gameForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const gameData = {
            titulo: document.getElementById('titulo').value,
            plataforma: document.getElementById('plataforma').value,
            genero: document.getElementById('genero').value,
            ano_lanzamiento: document.getElementById('ano_lanzamiento').value,
            desarrollador: document.getElementById('desarrollador').value,
            estado: document.getElementById('estado').value,
            imagen_path: imagePath
        };

        if (editingGameId) {
            gameData.id = editingGameId;
            await window.api.updateGame(gameData);
        } else {
            await window.api.addGame(gameData);
        }
        loadGames();
        showMainView();
    });

    deleteBtn.addEventListener('click', () => handleDelete(editingGameId));

    searchInput.addEventListener('keyup', () => {
        loadGames(searchInput.value);
    });

    // --- CARGA INICIAL ---
    async function main() {
        try {
            await window.initDB();
            await loadGames();
        } catch (error) {
            console.error("Error en la inicialización:", error);
            alert("No se pudo inicializar la base de datos.");
        }
    }

    main();
});