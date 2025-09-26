const knex = require('knex');
let db;

// Función para inicializar la conexión a la base de datos
function initDatabase(dbPath) {
  if (db) {
    return;
  }
  
  console.log(`Inicializando base de datos en: ${dbPath}`);
  db = knex({
    client: 'sqlite3',
    connection: {
      filename: dbPath
    },
    useNullAsDefault: true
  });
}

// Función para crear la tabla si no existe
async function setupDatabase() {
  if (!db) {
    throw new Error("La base de datos no ha sido inicializada. Llama a initDatabase() primero.");
  }
  
  try {
    const tableExists = await db.schema.hasTable('videojuegos');
    if (!tableExists) {
      console.log('Creando la tabla "videojuegos"...');
      await db.schema.createTable('videojuegos', (table) => {
        table.increments('id').primary();
        table.string('titulo').notNullable();
        table.string('plataforma');
        table.string('genero');
        table.integer('ano_lanzamiento');
        table.string('desarrollador');
        table.string('estado');
        table.string('imagen_path');
      });
      console.log('Tabla "videojuegos" creada exitosamente.');
    } else {
      console.log('La tabla "videojuegos" ya existe.');
    }
  } catch (error) {
    console.error('Error al configurar la base de datos:', error);
  }
}

// Exportamos el objeto db (que será una función para obtener la instancia) y las funciones
module.exports = { 
  get knex() {
    if (!db) {
      throw new Error("La base de datos no ha sido inicializada.");
    }
    return db;
  },
  initDatabase,
  setupDatabase 
};