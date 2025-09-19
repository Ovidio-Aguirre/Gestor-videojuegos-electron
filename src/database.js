// src/database.js
const path = require('path');

// Configuración de Knex para usar SQLite3
const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    // __dirname es la ruta del directorio actual. La BD se guardará en la raíz del proyecto.
    filename: path.join(__dirname, '../catalog.sqlite')
  },
  useNullAsDefault: true
});

// Función para crear la tabla si no existe
async function setupDatabase() {
  try {
    const tableExists = await knex.schema.hasTable('videojuegos');
    if (!tableExists) {
      console.log('Creando la tabla "videojuegos"...');
      await knex.schema.createTable('videojuegos', (table) => {
        table.increments('id').primary(); // ID autoincremental y clave primaria
        table.string('titulo').notNullable();
        table.string('plataforma');
        table.string('genero');
        table.integer('ano_lanzamiento');
        table.string('desarrollador');
        table.string('estado');
        table.string('imagen_path'); // Ruta a la carátula del juego
      });
      console.log('Tabla "videojuegos" creada exitosamente.');
    } else {
      console.log('La tabla "videojuegos" ya existe.');
    }
  } catch (error) {
    console.error('Error al configurar la base de datos:', error);
  }
}

// Exportamos knex para usarlo en otros archivos y la función de setup
module.exports = { knex, setupDatabase };