// Función para inicializar el estado de la sesión
function inicializarSesion() {
    // Verificar si la clave 'sesionIniciada' ya existe en localStorage
    if (!localStorage.getItem('sesionIniciada')) {
        // Si no existe, establecer la clave con el valor 'no'
        localStorage.setItem('sesionIniciada', 'no');
    }
}

// Ejecutar la función cuando el contenido del documento esté completamente cargado
document.addEventListener('DOMContentLoaded', inicializarSesion);
