# 🕹️ Catálogo de Videojuegos CRUD

Este proyecto es una aplicación de escritorio y web para gestionar una colección personal de videojuegos, desarrollada como una implementación completa de un sistema CRUD (Crear, Leer, Actualizar, Eliminar).

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

## 🏛️ Decisiones de Diseño Tomadas

Se tomó la decisión de unificar los requerimientos de "aplicación de escritorio" y "aplicación web" en un solo codebase para maximizar la reutilización de código y la eficiencia.

### Arquitectura General
* **Aplicación de Escritorio**: Se desarrolló utilizando **Electron**, un framework que permite empaquetar aplicaciones web (HTML, CSS, JS) como aplicaciones de escritorio nativas y multiplataforma.
* **Aplicación Web**: Se adaptó el front-end de la aplicación de Electron para que pudiera funcionar de forma independiente en cualquier navegador web, desplegándola en la plataforma **Vercel** a través de un repositorio de **GitHub**.

### Stack Tecnológico

#### Aplicación de Escritorio:
* **Framework**: `Electron`.
* **Front-end**: HTML5, CSS3 y JavaScript puro (Vanilla JS).
* **Back-end (Proceso Principal)**: `Node.js`.
* **Base de Datos**: `SQLite`, gestionada con el query builder **Knex.js**.
* **Empaquetado**: `Electron Builder` para generar los instaladores finales.

#### Aplicación Web:
* **Persistencia de Datos**: Se utilizó el **`localStorage`** del navegador. Se implementó un patrón de diseño "Adapter" (`web-api.js`) para simular la API del back-end de Electron.
* **Gestión de Imágenes**: Se implementó una conversión a **Base64** para almacenar imágenes dentro del `localStorage`.

---

## ⚙️ Instrucciones para Compilar y Ejecutar

### Requisitos Previos
* Tener instalado [Node.js](https://nodejs.org/) (que incluye npm).

### Instalación
1.  Clona o descarga el repositorio.
2.  Abre una terminal en la raíz del proyecto.
3.  Instala todas las dependencias:
    ```bash
    npm install
    ```

### Ejecutar la Aplicación de Escritorio
* **Modo Desarrollo:**
    ```bash
    npm start
    ```
* **Crear el Instalador (`.exe`):**
    ```bash
    npm run build
    ```
    El instalador final se encontrará en la carpeta `/dist`.

### Acceder a la Aplicación Web
La versión en línea está disponible en la siguiente URL:

`https://<tu-proyecto>.vercel.app` (reemplazar con la URL de tu despliegue en Vercel).

---

## 🛠️ Dificultades Encontradas y Cómo se Resolvieron

1.  **Dificultad: Error al subir el proyecto a GitHub.**
    * **Problema**: `git push` fallaba con errores de timeout (`HTTP 408`) y límite de tamaño de archivo.
    * **Solución**: Se diagnosticó que se estaba incluyendo la carpeta `node_modules`. La solución fue reiniciar el repositorio local, creando primero un archivo **`.gitignore`** para excluir dicha carpeta.

2.  **Dificultad: Fallo al empaquetar la aplicación de escritorio.**
    * **Problema**: `npm run build` fallaba en Windows con un error de privilegios (`Cannot create symbolic link`).
    * **Solución**: El problema se debía a que se necesitan permisos de administrador. La solución fue **ejecutar la terminal como Administrador**.

3.  **Dificultad: La aplicación instalada no guardaba los datos.**
    * **Problema**: La versión instalada no guardaba los cambios en la base de datos.
    * **Solución**: La app intentaba escribir en la carpeta `C:\Program Files\`, que es de solo lectura. Se solucionó guardando la base de datos en la carpeta **`userData`**, una ubicación segura y con permisos de escritura.

---
## 🤔 ¿Por Qué la Versión Web Tiene Menos Archivos?

La **aplicación de escritorio** es un programa autónomo que incluye su propio back-end (`main.js`), base de datos (`database.js`) y entorno (`Electron`).

La **aplicación web**, en cambio, es un cliente ligero que delega toda esa responsabilidad al navegador, utilizando el **`localStorage`** para la persistencia de datos a través de un "adaptador" llamado `web-api.js`.
