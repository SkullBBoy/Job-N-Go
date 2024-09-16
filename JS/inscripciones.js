document.addEventListener('DOMContentLoaded', function () {
    // Obtener la sesión iniciada desde localStorage
    const sesionIniciada = JSON.parse(localStorage.getItem('sesionIniciada')); 
    const dniUsuario = sesionIniciada ? sesionIniciada.dni : null;
    const cerrarSesionBtn = document.getElementById('cerrarSesion');
    
    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener('click', function() {
            const nuevaSesion = { estado: 'no', dni: '', rol: '' };
            localStorage.setItem('sesionIniciada', JSON.stringify(nuevaSesion));
            window.location.href = 'login.html';
        });
    }
    if (!dniUsuario) {
        mostrarError("Error: No se encontró el usuario en la sesión.");
        return;
    }

    // Obtener las inscripciones del usuario usando la clave dinámica en localStorage
    const inscripcionesKey = `inscripciones_${dniUsuario}`;
    const usuarioInscripciones = JSON.parse(localStorage.getItem(inscripcionesKey));

    if (usuarioInscripciones) {
        // Mostrar las inscripciones por estado
        mostrarInscripciones('aprobadas', usuarioInscripciones.aprobadas);
        mostrarInscripciones('pendientes', usuarioInscripciones.pendientes);
        mostrarInscripciones('rechazadas', usuarioInscripciones.rechazadas);
    } else {
        mostrarError("No tienes inscripciones registradas.");
    }

    // Función para mostrar las inscripciones por estado (aprobadas, pendientes, rechazadas)
    function mostrarInscripciones(estado, listaInscripciones) {
        const contenedor = document.getElementById(estado);
        // No limpiar el contenido aquí para evitar borrar los títulos
        if (listaInscripciones && listaInscripciones.length > 0) {
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
            contenedor.innerHTML += `<p>No hay inscripciones ${estado}.</p>`;
        }
    }

    // Función para mostrar mensajes de error en una sección dedicada
    function mostrarError(mensaje) {
        const errorContainer = document.createElement('div');
        errorContainer.classList.add('error-message');
        errorContainer.innerHTML = `<p>${mensaje}</p>`;
        
        // Añadir el mensaje de error en el contenedor principal
        document.body.appendChild(errorContainer);
    }
});
