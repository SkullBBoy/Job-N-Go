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
        // Establecer la clave de sesión iniciada
        localStorage.setItem('sesionIniciada', 'si');
        // Redireccionar a la página de perfil del profesional
        window.location.href = 'perfilProfesional.html'; // Cambia 'perfilProfesional.html' por la URL correcta
    } else if (reclutador) {
        // Autenticado como reclutador
        alert('Inicio de sesión exitoso como reclutador');
        // Establecer la clave de sesión iniciada
        localStorage.setItem('sesionIniciada', 'si');
        // Redireccionar a la página de perfil del reclutador
        window.location.href = 'perfilReclutador.html'; // Cambia 'perfilReclutador.html' por la URL correcta
    } else {
        // Credenciales incorrectas
        document.getElementById('dniFeedback').textContent = 'DNI o contraseña incorrectos';
        document.getElementById('contraseñaFeedback').textContent = 'DNI o contraseña incorrectos';
    }
});
