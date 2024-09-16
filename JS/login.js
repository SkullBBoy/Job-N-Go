// Función para inicializar el estado de la sesión
function inicializarSesion() {
    // Verificar si la clave 'sesionIniciada' ya existe en localStorage
    const sesion = JSON.parse(localStorage.getItem('sesionIniciada'));
    
    if (sesion && sesion.estado === 'si') {
        // Si la sesión está iniciada, redirigir a la página correspondiente
        if (sesion.rol === 'reclutador') {
            window.location.href = 'yoReclutador.html'; // Cambia 'yoReclutador.html' por la URL correcta
        } else {
            window.location.href = 'yo.html'; // Cambia 'yo.html' por la URL correcta
        }
    } else if (!sesion) {
        // Si no existe, establecer la clave con el valor 'no', DNI vacío, y sin rol
        const nuevaSesion = {
            estado: 'no',  // No hay sesión iniciada
            dni: '',       // DNI vacío
            rol: '',       // Rol vacío
            empresa: ''    // Empresa vacía
        };
        localStorage.setItem('sesionIniciada', JSON.stringify(nuevaSesion));
    }
}

// Ejecutar la función cuando el contenido del documento esté completamente cargado
document.addEventListener('DOMContentLoaded', inicializarSesion);


// Función para mostrar/ocultar contraseñas
function togglePasswordVisibility(id) {
    const input = document.getElementById(id);
    const button = input.nextElementSibling;
    input.type = input.type === 'password' ? 'text' : 'password';
    button.textContent = input.type === 'password' ? 'Mostrar' : 'Ocultar';
}

// Agregar manejador de eventos para el formulario de inicio de sesión
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    const dni = document.getElementById('dni').value.trim();
    const contraseña = document.getElementById('contraseña').value.trim();

    // Obtener los datos almacenados en localStorage
    const profesionales = JSON.parse(localStorage.getItem('profesionales')) || [];
    const reclutadores = JSON.parse(localStorage.getItem('reclutadores')) || [];

    // Buscar en los profesionales
    const profesional = profesionales.find(p => p.dni === dni && p.contraseña === contraseña);
    
    // Buscar en los reclutadores
    const reclutador = reclutadores.find(r => r.dni === dni && r.contraseña === contraseña);

    if (profesional) {
        // Autenticado como profesional
        alert('Inicio de sesión exitoso como profesional');
        // Establecer la clave de sesión iniciada con el DNI y el rol de profesional
        localStorage.setItem('sesionIniciada', JSON.stringify({ estado: 'si', dni: profesional.dni, rol: 'profesional', empresa: '' }));
        // Redireccionar a la página de perfil del profesional
        window.location.href = 'yo.html'; // Cambia 'yo.html' por la URL correcta
    } else if (reclutador) {
        // Autenticado como reclutador
        alert('Inicio de sesión exitoso como reclutador');
        // Establecer la clave de sesión iniciada con el DNI, el rol de reclutador y la empresa
        localStorage.setItem('sesionIniciada', JSON.stringify({ estado: 'si', dni: reclutador.dni, rol: 'reclutador', empresa: reclutador.empresa }));
        // Redireccionar a la página de perfil del reclutador
        window.location.href = 'yoReclutador.html'; // Cambia 'yoReclutador.html' por la URL correcta
    } else {
        // Credenciales incorrectas
        document.getElementById('dniFeedback').textContent = 'DNI o contraseña incorrectos';
        document.getElementById('contraseñaFeedback').textContent = 'DNI o contraseña incorrectos';
    }
});
