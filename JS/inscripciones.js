// Asegúrate de que el contenido del documento esté completamente cargado antes de agregar el evento
document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar el botón de cerrar sesión por su ID
    const cerrarSesionBtn = document.getElementById('cerrarSesion');

    if (cerrarSesionBtn) {
        // Agregar el evento de click al botón de cerrar sesión
        cerrarSesionBtn.addEventListener('click', function() {
            // Actualizar la clave 'sesionIniciada' en localStorage
            const nuevaSesion = {
                estado: 'no',  // No hay sesión iniciada
                dni: '',       // DNI vacío
                rol: ''        // Rol vacío
            };
            localStorage.setItem('sesionIniciada', JSON.stringify(nuevaSesion));

            // Redirigir a la página de login
            window.location.href = 'login.html';
        });
    }
});
