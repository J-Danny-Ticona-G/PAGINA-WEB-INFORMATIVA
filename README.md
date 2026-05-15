# Sistema de Gestión para el Ecosistema Cultural de La Paz

## 1. Introducción y Propósito
Este proyecto surge como una solución tecnológica a la fragmentación de la información cultural en la ciudad de La Paz. El objetivo principal es proporcionar una plataforma centralizada, robusta y escalable que permita la administración eficiente de espacios culturales, tales como museos y teatros, garantizando que el ciudadano tenga acceso a datos actualizados y verificados.

---

## 2. Arquitectura del Sistema (Arquitectura de N-Capas)
El sistema implementa una arquitectura desacoplada basada en el stack MERN, lo que permite que cada componente funcione de manera independiente:

* **Capa de Presentación (Frontend):** Construida con **React.js**. Se enfoca en una experiencia de usuario (UX) fluida, con un diseño responsivo que utiliza una paleta institucional en dorado y blanco, evocando la identidad cultural paceña.
* **Capa de Lógica de Negocio (Backend):** Desarrollada con **Node.js y Express**. Actúa como un servidor API REST que gestiona las peticiones del cliente, aplica validaciones de seguridad y coordina la comunicación con la base de datos.
* **Capa de Datos (Persistencia):** Utiliza **PostgreSQL**. A diferencia de las bases de datos NoSQL, elegimos PostgreSQL por su integridad referencial y su robustez para manejar relaciones complejas entre activos culturales.
* **Infraestructura y Despliegue:** Todo el stack está **Dockerizado**. Esto garantiza que el software funcione idénticamente en la computadora del desarrollador y en la del tribunal evaluador, eliminando el problema de "en mi máquina sí funciona".

---

## 3. Guía de Despliegue (Dockerización)
Para facilitar la revisión del tribunal, se ha automatizado el despliegue mediante contenedores.

### Requisitos
* Docker Desktop instalado y en ejecución.

### Pasos para el levantamiento:
1.  Abrir una terminal en el directorio raíz del proyecto.
2.  Ejecutar el comando de orquestación:
    ```bash
    docker-compose up --build
    ```
3.  **¿Qué sucede internamente?** Docker lee el archivo `docker-compose.yml`, levanta una instancia de PostgreSQL, configura las variables de entorno, instala las dependencias de Node y compila el proyecto React, todo dentro de una red privada virtualizada.

---

## 4. Funcionalidades de Administración (Módulo CRUD)
El sistema separa las vistas públicas de las administrativas mediante un protocolo de autenticación local.

* **Puntos de Acceso:**
    * **Vista Pública:** `http://localhost:3000` (Consulta de museos y teatros).
    * **Panel Administrativo:** `http://localhost:3000/login` (Gestión de datos).
* **Credenciales de Exposición:**
    * **Usuario:** `juandaniel`
    * **Contraseña:** `19992026`

### Capacidades Administrativas:
* **Create (Crear):** Registro de nuevos espacios culturales con descripción y ubicación.
* **Read (Leer):** Visualización dinámica de los registros existentes desde la base de datos.
* **Update (Actualizar):** Modificación de datos en tiempo real para mantener la información vigente.
* **Delete (Eliminar):** Remoción lógica y física de registros obsoletos.

---

## 5. Estructura de Directorios para Revisión de Código
* `/frontend`: Lógica de componentes, estados de React y estilos CSS.
* `/backend`: Rutas de la API, controladores de lógica y configuración del Pool de conexión.
* `docker-compose.yml`: Definición de los servicios (db, backend, frontend), puertos y redes.

---
**Postulante:** Juan Daniel Ticona Gutierrez  
**Carrera:** Ingeniería de Sistemas - Universidad Salesiana de Bolivia  
**Gestión:** 2026

## Requisitos previos para hacer correr (PARA LA REVISION)

### Opción  — Con Docker 
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado
- Git

### Opción  — Docker (una sola vez)

# 1. Clonar el repositorio
opcion 1: git clone https://github.com/J-Danny-Ticona-G/PAGINA-WEB-INFORMATIVA.git
opcion 2: tambien se subio toda la carpeta del proyecto comprimido, descomprimir y seguir con los pasos

# 2. Levantar todo el sistema
dentro de la carpeta principal abrir git y ejecutar el siguiente comando

docker-compose up --build

# 3. Esperar ~2 minutos mientras se construye y luego abrir:
#    http://localhost:3000

### Opcion - .ZIP

# 1. Descomprimir el archivo .zip

descomprimir en el escritorio con winrar

# 2. Abrir con VS code

- Abrir la carpeta y en la direccion poner:

cmd

- Se abrira la terminal, ahi poner el comando 

code .

(se abrira el proyecto en vscode)

# 3. Correr el proyecto

- abrir la terminar del VScode y poner esto en la terminal

docker-compose up --build

# 3. Esperar ~2 minutos mientras se construye y luego abrir:
#    http://localhost:3000