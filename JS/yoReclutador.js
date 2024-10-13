document.addEventListener('DOMContentLoaded', function() {
    // Función para cerrar sesión
    const cerrarSesionBtn = document.getElementById('cerrarSesion');

    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener('click', function() {
            const nuevaSesion = { estado: 'no', dni: '', rol: '' };
            localStorage.setItem('sesionIniciada', JSON.stringify(nuevaSesion));
            window.location.href = 'login.html';
        });
    }

    // Obtener la sesión actual
    const sesion = JSON.parse(localStorage.getItem('sesionIniciada'));

    if (sesion && sesion.estado === 'si' && sesion.rol === 'reclutador') {
        const reclutadores = JSON.parse(localStorage.getItem('reclutadores')) || [];
        const reclutador = reclutadores.find(r => r.dni === sesion.dni);

        if (reclutador) {
            // Mostrar la información del reclutador
            document.getElementById('nombre').value = reclutador.nombre;
            document.getElementById('empresa').value = reclutador.empresa;
            document.getElementById('dni').textContent = reclutador.dni; // No editable
            document.getElementById('email').value = reclutador.email;
            document.getElementById('fotoPerfil').src = reclutador.foto || '../IMG/defaultProfile.png'; // Imagen por defecto si no tiene foto

            // Función para cambiar la foto de perfil
            document.getElementById('inputFotoPerfil').addEventListener('change', function(event) {
                const reader = new FileReader();
                const file = event.target.files[0];

                if (file) {
                    reader.readAsDataURL(file);
                    reader.onload = function(e) {
                        const nuevaFoto = e.target.result;
                        document.getElementById('fotoPerfil').src = nuevaFoto;
                        reclutador.foto = nuevaFoto; // Guardar la foto
                        localStorage.setItem('reclutadores', JSON.stringify(reclutadores));
                        alert('Foto de perfil actualizada correctamente.');
                    };
                }
            });

            // Función para guardar cambios en nombre y email
            document.getElementById('editarBtn').addEventListener('click', function() {
                const nuevoNombre = document.getElementById('nombre').value.trim();
                const nuevoEmail = document.getElementById('email').value.trim();

                // Verificar si el email ya existe en otro reclutador
                const emailExiste = reclutadores.some(r => r.email === nuevoEmail && r.dni !== reclutador.dni);

                if (emailExiste) {
                    alert('El email ya está registrado en otro reclutador.');
                } else {
                    reclutador.nombre = nuevoNombre;
                    reclutador.email = nuevoEmail;
                    localStorage.setItem('reclutadores', JSON.stringify(reclutadores));
                    alert('Información actualizada correctamente.');
                }
            });

        } else {
            alert('No se encontró el perfil del reclutador.');
            window.location.href = 'login.html';
        }
    } else {
        alert('No hay sesión iniciada o el usuario no es reclutador.');
        window.location.href = 'login.html';
    }
});
