# 🕹️ Catálogo de Videojuegos CRUD (Versión Avanzada)

Este proyecto es una aplicación de escritorio y web para gestionar una colección personal de videojuegos, desarrollada como una implementación completa de un sistema CRUD (Crear, Leer, Actualizar, Eliminar) con funcionalidades avanzadas.

---

## 🚀 Temática Elegida

La temática elegida es un **"Catálogo de Videojuegos"**. El objetivo es permitir a un usuario coleccionista gestionar su biblioteca de juegos de forma sencilla y visual.

Los campos implementados para cada registro son:
* **ID**: Identificador único (autoincremental).
* **Título**: Nombre del videojuego.
* **Plataforma**: Consola o sistema (PC, PlayStation 5, etc.).
* **Género**: Género principal del juego (Acción, RPG, etc.).
* **Año de Lanzamiento**: Año en que se publicó el juego.
* **Desarrollador**: Estudio que creó el juego.
* **Estado**: Progreso actual del usuario (Pendiente, En progreso, Completado).
* **Carátula**: Imagen de la portada del juego.

---

## ✨ Funcionalidades Avanzadas Implementadas

Este proyecto va más allá de un CRUD básico, incorporando las siguientes características:

### Aplicación de Escritorio
* **Autenticación de Usuario**: Pantalla de login que protege el acceso al catálogo.
* **Exportación de Datos**: Funcionalidad para exportar la colección completa a un archivo `.json`.
* **Panel de Estadísticas**: Muestra en tiempo real el número total de juegos y la cantidad de juegos completados.
* **Persistencia Robusta**: Usa una base de datos **SQLite** que se almacena en la carpeta de datos del usuario (`userData`), asegurando que los datos persistan entre instalaciones y actualizaciones.

### Aplicación Web
* **Base de Datos en el Navegador**: Utiliza **IndexedDB** para una persistencia de datos robusta y eficiente, superando las limitaciones de `localStorage`.
* **Gráfica Interactiva**: Muestra las estadísticas de la colección a través de un gráfico de dona dinámico, implementado con **Chart.js**.
* **Exportación Nativa**: Permite al usuario descargar su colección como un archivo `.json` generado directamente en el navegador.
* **Diseño Totalmente Responsive**: La interfaz se adapta perfectamente a dispositivos de escritorio y móviles.

---

## ⚙️ Guía de Instalación y Pruebas

Esta guía contiene todo lo necesario para configurar el entorno, instalar las dependencias, ejecutar y construir el proyecto.

### Stack Tecnológico
* **Aplicación de Escritorio**: `Electron`, `Node.js`, `SQLite`, `Knex.js`, `Electron Builder`.
* **Aplicación Web**: `HTML5`, `CSS3`, `JavaScript (Vanilla JS)`, `IndexedDB`, `Chart.js`.
* **Despliegue Web**: `Vercel`.
* **Control de Versiones**: `Git` y `GitHub`.

### Prerrequisitos del Entorno
1.  **Node.js**: Se recomienda la versión LTS. Puedes descargarlo desde [nodejs.org](https://nodejs.org/).
2.  **NPM**: Se instala automáticamente junto con Node.js.

### Guía de Ejecución (Paso a Paso)

1.  **Preparación**:
    * Descomprimir el archivo `.zip` del proyecto.
    * Abrir una terminal en la raíz de la carpeta descomprimida.

2.  **Instalar Dependencias**:
    * Este comando descarga todas las librerías necesarias (Electron, Knex, etc.).
    ```bash
    npm install
    ```

3.  **Ejecutar la App de Escritorio (Modo Desarrollo)**:
    * Lanza la aplicación en modo de prueba con acceso a herramientas de depuración.
    ```bash
    npm start
    ```

4.  **Construir el Instalador Final (`.exe`)**:
    * Empaqueta la aplicación en un instalador profesional.
    * **Nota**: En Windows, este comando puede requerir ejecutar la terminal con **privilegios de Administrador**.
    ```bash
    npm run build
    ```
    * El instalador final (`.exe`) se encontrará en la nueva carpeta `/dist`.

5.  **Probar la Versión Web**:
    * Los archivos fuente de la versión web se encuentran en la carpeta `/web`. Esta versión está desplegada y funcional en la URL proporcionada en la entrega.

---

## 🛠️ Dificultades Encontradas y Soluciones

* **Dificultad**: `git push` fallaba por timeouts y exceso de tamaño de archivo.
    * **Solución**: Se diagnosticó que se estaba incluyendo la carpeta `node_modules`. Se resolvió creando un archivo `.gitignore` y reiniciando el repositorio local para asegurar un historial limpio.

* **Dificultad**: El empaquetado (`npm run build`) fallaba en Windows por falta de privilegios.
    * **Solución**: Se resolvió ejecutando la terminal **como Administrador**, lo que otorga los permisos necesarios para crear enlaces simbólicos.

* **Dificultad**: La aplicación instalada no guardaba datos (pantalla en blanco o botones sin función).
    * **Solución**: El problema era doble:
        1.  La base de datos intentaba escribirse en la carpeta protegida `C:\Program Files\`. Se solucionó moviendo la ruta de la base de datos a la carpeta `userData` de Electron.
        2.  La carpeta `/web` no se incluía en el paquete final. Se solucionó actualizando la configuración de `files` en el `package.json`.

---
