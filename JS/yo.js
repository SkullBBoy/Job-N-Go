document.addEventListener('DOMContentLoaded', function() {
    // Función para cerrar sesión
    const cerrarSesionBtn = document.getElementById('cerrarSesion');

    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener('click', function() {
            const nuevaSesion = {
                estado: 'no',  // No hay sesión iniciada
                dni: '',       // DNI vacío
                rol: ''        // Rol vacío
            };
            localStorage.setItem('sesionIniciada', JSON.stringify(nuevaSesion));
            window.location.href = 'login.html';
        });
    }

    // Obtener la sesión actual
    const sesion = JSON.parse(localStorage.getItem('sesionIniciada'));
    
    if (sesion && sesion.estado === 'si' && sesion.rol === 'profesional') {
        const profesionales = JSON.parse(localStorage.getItem('profesionales')) || [];
        const reclutadores = JSON.parse(localStorage.getItem('reclutadores')) || [];
        const profesional = profesionales.find(p => p.dni === sesion.dni);

        if (profesional) {
            // Mostrar la información del profesional
            document.getElementById('nombre').value = profesional.nombre;
            document.getElementById('dni').textContent = profesional.dni; // Mostrar DNI
            document.getElementById('email').value = profesional.email;
            document.getElementById('puntos').textContent = profesional.puntos; // Mostrar Puntos
            document.getElementById('telefono').value = profesional.telefono; // Mostrar Teléfono
            mostrarExperiencia(profesional.experiencia);

            // Mostrar la foto de perfil
            const fotoPerfil = document.getElementById('fotoPerfil');
            fotoPerfil.src = profesional.foto || '../IMG/defaultProfile.png'; // Imagen por defecto si no tiene foto

            // Función para cambiar la foto de perfil
            const inputFotoPerfil = document.getElementById('inputFotoPerfil');
            inputFotoPerfil.addEventListener('change', function(event) {
                const reader = new FileReader();
                const file = event.target.files[0];

                if (file) {
                    reader.readAsDataURL(file);
                    reader.onload = function(e) {
                        const nuevaFoto = e.target.result;
                        fotoPerfil.src = nuevaFoto; // Mostrar la nueva foto

                        // Guardar la foto en el objeto profesional y en localStorage
                        profesional.foto = nuevaFoto;
                        localStorage.setItem('profesionales', JSON.stringify(profesionales));
                        alert('Foto de perfil actualizada correctamente.');
                    };
                }
            });

            // Función para editar solo el nombre, email y teléfono con verificación
            document.getElementById('editarBtn').addEventListener('click', function() {
                const nuevoNombre = document.getElementById('nombre').value.trim();
                const nuevoEmail = document.getElementById('email').value.trim();
                const nuevoTelefono = document.getElementById('telefono').value.trim();

                // Verificar si el teléfono es válido
                const telefonoValido = /^\d{10}$/.test(nuevoTelefono);

                if (!telefonoValido) {
                    alert('El teléfono debe contener exactamente 10 dígitos numéricos.');
                    return;
                }

                // Verificar si el nuevo email y teléfono ya existen en los arrays de profesionales o reclutadores
                const emailExisteEnProfesionales = profesionales.some(p => p.email === nuevoEmail && p.dni !== profesional.dni);
                const emailExisteEnReclutadores = reclutadores.some(r => r.email === nuevoEmail);
                const telefonoExisteEnProfesionales = profesionales.some(p => p.telefono === nuevoTelefono && p.dni !== profesional.dni);
                const telefonoExisteEnReclutadores = reclutadores.some(r => r.telefono === nuevoTelefono);

                if (emailExisteEnProfesionales || emailExisteEnReclutadores) {
                    alert('El email ya está registrado en otro usuario.');
                } else if (telefonoExisteEnProfesionales || telefonoExisteEnReclutadores) {
                    alert('El teléfono ya está registrado en otro usuario.');
                } else {
                    // Si el email y el teléfono son únicos, actualizar los datos
                    profesional.nombre = nuevoNombre;
                    profesional.email = nuevoEmail;
                    profesional.telefono = nuevoTelefono;

                    localStorage.setItem('profesionales', JSON.stringify(profesionales));
                    alert('Información actualizada correctamente.');
                }
            });

            // Función para agregar experiencia laboral
            document.getElementById('agregarExperienciaBtn').addEventListener('click', function() {
                const empresa = document.getElementById('empresa').value.trim();
                const años = document.getElementById('años').value.trim();
                const puesto = document.getElementById('puesto').value.trim();

                if (empresa && años && puesto) {
                    // Buscar la empresa en el array de experiencia
                    let empresaExistente = profesional.experiencia.find(exp => exp.empresa === empresa);

                    if (empresaExistente) {
                        // Verificar si el puesto ya existe en la empresa
                        const puestoExistente = empresaExistente.puestos.some(p => p.puesto === puesto);

                        if (puestoExistente) {
                            alert('Ya has añadido una experiencia laboral con ese puesto en la misma empresa.');
                        } else {
                            empresaExistente.puestos.push({ años, puesto });
                            localStorage.setItem('profesionales', JSON.stringify(profesionales));
                            mostrarExperiencia(profesional.experiencia);
                            alert('Experiencia laboral añadida correctamente.');
                        }
                    } else {
                        // Si la empresa no existe, agregarla
                        profesional.experiencia.push({ empresa, puestos: [{ años, puesto }] });
                        localStorage.setItem('profesionales', JSON.stringify(profesionales));
                        mostrarExperiencia(profesional.experiencia);
                        alert('Experiencia laboral añadida correctamente.');
                    }

                    // Verificar si el usuario ya ha recibido los 15 puntos por agregar experiencia
                    if (!profesional.puntosExperienciaOtorgados) {
                        profesional.puntos += 50;  // Sumar 50 puntos
                        profesional.puntosExperienciaOtorgados = true;  // Marcar que ya se le otorgaron los puntos
                        localStorage.setItem('profesionales', JSON.stringify(profesionales));
                        document.getElementById('puntos').textContent = profesional.puntos;  // Actualizar los puntos en la interfaz
                        alert('¡Has ganado 50 puntos por agregar tu primera experiencia laboral!');
                    }
                } else {
                    alert('Por favor, complete todos los campos de experiencia laboral.');
                }
            });

            // Función para eliminar experiencia laboral
            document.getElementById('eliminarExperienciaBtn').addEventListener('click', function() {
                const empresaEliminar = document.getElementById('empresaEliminar').value.trim();
                const puestoEliminar = document.getElementById('puestoEliminar').value.trim();

                if (empresaEliminar && puestoEliminar) {
                    // Buscar la empresa en el array de experiencia
                    let empresaExistente = profesional.experiencia.find(exp => exp.empresa === empresaEliminar);

                    if (empresaExistente) {
                        // Encontrar el índice del puesto para eliminarlo
                        const puestoIndex = empresaExistente.puestos.findIndex(p => p.puesto === puestoEliminar);

                        if (puestoIndex !== -1) {
                            empresaExistente.puestos.splice(puestoIndex, 1);
                            // Si no quedan puestos en la empresa, eliminar la empresa
                            if (empresaExistente.puestos.length === 0) {
                                const empresaIndex = profesional.experiencia.indexOf(empresaExistente);
                                profesional.experiencia.splice(empresaIndex, 1);
                            }

                            localStorage.setItem('profesionales', JSON.stringify(profesionales));
                            mostrarExperiencia(profesional.experiencia);
                            alert('Experiencia laboral eliminada correctamente.');
                        } else {
                            alert('El puesto especificado no existe en la empresa.');
                        }
                    } else {
                        alert('La empresa especificada no existe en tu experiencia laboral.');
                    }
                } else {
                    alert('Por favor, complete todos los campos para eliminar experiencia laboral.');
                }
            });
        } else {
            alert('No se encontró el perfil del profesional.');
            window.location.href = 'login.html';
        }
    } else {
        alert('No hay sesión iniciada o el usuario no es profesional.');
        window.location.href = 'login.html';
    }
});

// Función para mostrar la experiencia laboral del profesional
function mostrarExperiencia(experiencia) {
    const experienciaContainer = document.getElementById('experienciaContainer');
    experienciaContainer.innerHTML = '';  // Limpiar contenido previo

    experiencia.forEach(exp => {
        exp.puestos.forEach(p => {
            const expElement = document.createElement('p');
            expElement.textContent = `Empresa: ${exp.empresa}, Años: ${p.años}, Puesto: ${p.puesto}`;
            experienciaContainer.appendChild(expElement);
        });
    });
}

