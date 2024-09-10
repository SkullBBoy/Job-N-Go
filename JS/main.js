// Función para inicializar el estado de la sesión
function inicializarSesion() {
    // Verificar si la clave 'sesionIniciada' ya existe en localStorage
    const sesion = JSON.parse(localStorage.getItem('sesionIniciada'));
    
    if (sesion && sesion.estado === 'si') {
        // Si la sesión está iniciada, redirigir a la página correspondiente
        window.location.href = './HTML/ofertasLaborales.html'; // Cambia 'paginaPrincipal.html' por la URL correcta
    } else if (!sesion) {
        // Si no existe, establecer la clave con el valor 'no' y el DNI vacío
        const nuevaSesion = {
            estado: 'no',  // No hay sesión iniciada
            dni: '',      // DNI vacío
            rol: ''        // Rol vacío
        };
        localStorage.setItem('sesionIniciada', JSON.stringify(nuevaSesion));
    }
}

// Ejecutar la función cuando el contenido del documento esté completamente cargado
document.addEventListener('DOMContentLoaded', inicializarSesion);
