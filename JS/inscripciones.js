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

document.addEventListener('DOMContentLoaded', function () {
    const sesionIniciada = JSON.parse(localStorage.getItem('sesionIniciada')); // Obtener los datos de la sesión iniciada
    const dniUsuario = sesionIniciada.dni;
    const profesionales = JSON.parse(localStorage.getItem('profesionales')) || [];
    
    // Buscar al profesional actual en el array de profesionales
    const profesional = profesionales.find(prof => prof.dni === dniUsuario);

    if (profesional) {
        // Obtener la fecha de la última conexión guardada en localStorage
        const ultimaConexion = localStorage.getItem('ultimaConexion_' + dniUsuario);
        const hoy = new Date().toLocaleDateString();

        // Verificar si es un nuevo día
        if (ultimaConexion !== hoy) {
            // Es un nuevo día, sumar 10 puntos
            profesional.puntos += 10;

            // Guardar la nueva fecha de conexión
            localStorage.setItem('ultimaConexion_' + dniUsuario, hoy);

            // Actualizar el array de profesionales con los nuevos puntos
            localStorage.setItem('profesionales', JSON.stringify(profesionales));

            // Mostrar alerta de puntos ganados
            alert('¡Felicidades! Has ganado 10 puntos por conectarte hoy.');

            console.log(`Recibiste 10 puntos por conectarte hoy`);
        }
    }
});


document.addEventListener('DOMContentLoaded', function () {
    const sesionIniciada = JSON.parse(localStorage.getItem('sesionIniciada')); // Obtener los datos de la sesión
    const dniUsuario = sesionIniciada.dni;
    const inscripciones = JSON.parse(localStorage.getItem('inscripciones')) || [];
    
    // Buscar las inscripciones del usuario
    const usuarioInscripciones = inscripciones.find(insc => insc.dni === dniUsuario);

    if (usuarioInscripciones) {
        mostrarInscripciones('aprobadas', usuarioInscripciones.aprobadas);
        mostrarInscripciones('pendientes', usuarioInscripciones.pendientes);
        mostrarInscripciones('rechazadas', usuarioInscripciones.rechazadas);
    } else {
        document.getElementById('inscripciones-container').innerHTML = "<p>No tienes inscripciones registradas.</p>";
    }
});

// Función para mostrar las inscripciones por estado (aprobadas, pendientes, rechazadas)
function mostrarInscripciones(estado, listaInscripciones) {
    const contenedor = document.getElementById(estado);
    contenedor.innerHTML = ''; // Limpiar el contenido anterior

    if (listaInscripciones.length > 0) {
        listaInscripciones.forEach(inscripcion => {
            const inscripcionDiv = document.createElement('div');
            inscripcionDiv.classList.add('inscripcion');

            inscripcionDiv.innerHTML = `
                <p>Empresa: ${inscripcion.empresa}</p>
                <p>Puesto: ${inscripcion.puesto}</p>
            `;
            contenedor.appendChild(inscripcionDiv);
        });
    } else {
        contenedor.innerHTML = `<p>No hay inscripciones ${estado}.</p>`;
    }
}






















































