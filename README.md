Catálogo de Videojuegos CRUD

Este proyecto es una aplicación de escritorio y web para gestionar una colección personal de videojuegos, desarrollada como una implementación completa de un sistema CRUD (Crear, Leer, Actualizar, Eliminar).

Temática Elegida
La temática elegida es un "Catálogo de Videojuegos". El objetivo es permitir a un usuario coleccionista gestionar su biblioteca de juegos de forma sencilla y visual.

Los campos implementados para cada registro son:

ID: Identificador único (autoincremental).

Título: Nombre del videojuego.

Plataforma: Consola o sistema (PC, PlayStation 5, etc.).

Género: Género principal del juego (Acción, RPG, etc.).

Año de Lanzamiento: Año en que se publicó el juego.

Desarrollador: Estudio que creó el juego.

Estado: Progreso actual del usuario (Pendiente, En progreso, Completado).

Carátula: Imagen de la portada del juego.

Decisiones de Diseño Tomadas
Se tomó la decisión de unificar los requerimientos de "aplicación de escritorio" y "aplicación web" en un solo codebase para maximizar la reutilización de código y la eficiencia.

Arquitectura General
Aplicación de Escritorio: Se desarrolló utilizando Electron, un framework que permite empaquetar aplicaciones web (HTML, CSS, JS) como aplicaciones de escritorio nativas y multiplataforma.

Aplicación Web: Se adaptó el front-end de la aplicación de Electron para que pudiera funcionar de forma independiente en cualquier navegador web, desplegándola en la plataforma Vercel a través de un repositorio de GitHub.

Stack Tecnológico
Aplicación de Escritorio:

Framework: Electron.

Front-end: HTML5, CSS3 y JavaScript puro (Vanilla JS), sin frameworks adicionales para mantener la simplicidad.

Back-end (Proceso Principal): Node.js, para la gestión de ventanas, archivos y la base de datos.

Base de Datos: Se eligió SQLite por su naturaleza serverless y portable (un solo archivo), ideal para una aplicación de escritorio. Se utilizó el query builder Knex.js para interactuar con la base de datos de forma segura y estructurada.

Empaquetado: Se usó Electron Builder para generar los instaladores finales (.exe para Windows).

Aplicación Web:

Persistencia de Datos: Debido a las limitaciones de seguridad del navegador, se reemplazó SQLite por el localStorage del navegador. Se implementó un patrón de diseño "Adapter" (web-api.js) que simula la API del back-end de Electron, permitiendo que el mismo código front-end (renderer.js) funcione en ambos entornos sin modificaciones.

Gestión de Imágenes: La selección de archivos locales se adaptó para convertir las imágenes a formato Base64, permitiendo almacenarlas como texto dentro del localStorage.

Por Qué la Versión Web Tiene Menos Archivos?
Al comparar las carpetas src (para la app de escritorio) y web, es evidente que la versión de escritorio requiere más archivos. Esto se debe a una diferencia fundamental en su arquitectura:

La aplicación de escritorio es un programa autónomo y completo. Es como un food truck: tiene que llevar consigo su propia cocina (main.js), su propio sistema de almacenamiento de ingredientes (database.js y catalog.sqlite) y su propio motor (Electron).

La aplicación web, en cambio, es un cliente ligero. Es como una persona que se sienta en un restaurante: no necesita traer su propia cocina, simplemente usa la infraestructura que el restaurante (el navegador web) ya le ofrece. Su único sistema de almacenamiento es su "billetera" (localStorage).

Detalle de los Archivos
Archivos Exclusivos de la App de Escritorio (src/)
Estos archivos constituyen el "motor" y el "cerebro" de la aplicación de escritorio, algo que la versión web no necesita porque el navegador se encarga de esas funciones.

main.js: Es el proceso principal de Electron, el verdadero back-end de la aplicación. Gestiona las ventanas, la comunicación con el sistema operativo y las operaciones de la base de datos.

preload.js: Actúa como un puente de comunicación seguro entre el front-end (renderer.js) y el back-end (main.js).

database.js: Contiene toda la lógica para conectarse y operar con la base de datos SQLite.

package.json / node_modules: Definen y contienen todas las dependencias del proyecto, incluyendo Electron, Electron Builder y Knex.js, que son el corazón de la aplicación de escritorio.

Archivo Exclusivo de la App Web (web/)
La versión web solo necesita un archivo adicional para funcionar.

web-api.js: Este es un "adaptador" o "traductor" creado específicamente para la versión web. Imita el comportamiento del preload.js de Electron, pero en lugar de comunicarse con un back-end de Node.js, realiza todas las operaciones de guardado y lectura de datos en el localStorage del navegador.

En resumen, la versión de escritorio incluye su propio entorno de servidor y base de datos, mientras que la versión web delega toda esa responsabilidad al navegador, resultando en una aplicación mucho más ligera.

Instrucciones para Compilar y Ejecutar
Requisitos Previos
Tener instalado Node.js (que incluye npm).

Instalación
Clona o descarga el repositorio.

Abre una terminal en la raíz del proyecto.

Instala todas las dependencias necesarias:

Bash

npm install
Ejecutar la Aplicación de Escritorio
Modo Desarrollo (con consola y herramientas de depuración):

Bash

npm start
Crear el Instalador (.exe):

Bash

npm run build
El instalador final se encontrará en la carpeta /dist.

Acceder a la Aplicación Web
La versión en línea está disponible en la siguiente URL:

https://<tu-proyecto>.vercel.app (reemplazar con la URL de tu despliegue en Vercel).

Dificultades Encontradas y Cómo se Resolvieron
A lo largo del desarrollo, surgieron varios desafíos técnicos que fueron resueltos de la siguiente manera:

Dificultad: Error al subir el proyecto a GitHub.

Problema: Los primeros intentos de git push fallaban con errores de timeout (HTTP 408) y de límite de tamaño de archivo de GitHub.

Solución: Se diagnosticó que el comando git add . estaba incluyendo la carpeta node_modules, que es extremadamente pesada. La solución fue reiniciar el repositorio local desde cero, creando primero un archivo .gitignore para excluir node_modules antes de realizar el primer commit.

Dificultad: Fallo al empaquetar la aplicación de escritorio.

Problema: El comando npm run build fallaba en Windows con el error El cliente no dispone de un privilegio requerido al intentar crear enlaces simbólicos.

Solución: El problema se debía a que en Windows se necesitan permisos de administrador para crear enlaces simbólicos. La solución fue cerrar la terminal y ejecutarla como Administrador para realizar el proceso de empaquetado.

Dificultad: La aplicación instalada no guardaba los datos.

Problema: La versión instalada (.exe) no guardaba los cambios en la base de datos, aunque en modo desarrollo sí funcionaba.

Solución: La causa era que la aplicación intentaba escribir el archivo de la base de datos en la carpeta C:\Program Files\, que es de solo lectura. Se solucionó refactorizando el código para que la base de datos se guardara en la carpeta userData de la aplicación, una ubicación segura y con permisos de escritura que Electron provee.

Dificultad: La aplicación empaquetada se cerraba al iniciar.

Problema: La aplicación mostraba un error de JavaScript "La base de datos no ha sido inicializada" y se cerraba.

Solución: Se encontró un error de "timing" en el código: se intentaba acceder al objeto de la base de datos antes de que este fuera inicializado. Se corrigió la lógica en main.js para asegurar que la inicialización de la base de datos siempre ocurriera antes de cualquier intento de acceso.