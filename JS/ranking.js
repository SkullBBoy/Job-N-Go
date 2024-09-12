document.addEventListener('DOMContentLoaded', function() {
    const cerrarSesionBtn = document.getElementById('cerrarSesion');
    
    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener('click', function() {
            const nuevaSesion = { estado: 'no', dni: '', rol: '' };
            localStorage.setItem('sesionIniciada', JSON.stringify(nuevaSesion));
            window.location.href = 'login.html';
        });
    }

    const sesionIniciada = JSON.parse(localStorage.getItem('sesionIniciada'));
    const profesionales = JSON.parse(localStorage.getItem('profesionales')) || [];

    if (sesionIniciada && sesionIniciada.estado === 'si') {
        const dniUsuario = sesionIniciada.dni;

        // Actualizar puntos por conexión diaria
        const profesional = profesionales.find(prof => prof.dni === dniUsuario);
        if (profesional) {
            const ultimaConexion = localStorage.getItem('ultimaConexion_' + dniUsuario);
            const hoy = new Date().toLocaleDateString();

            if (ultimaConexion !== hoy) {
                profesional.puntos += 10;
                localStorage.setItem('ultimaConexion_' + dniUsuario, hoy);
                localStorage.setItem('profesionales', JSON.stringify(profesionales));
                alert('¡Felicidades! Has ganado 10 puntos por conectarte hoy.');
            }
        }

        // Ordenamos a los profesionales por puntos en orden descendente
        const ranking = profesionales.sort((a, b) => b.puntos - a.puntos);

        // Encontramos al usuario logueado en el ranking
        const usuario = ranking.find(profesional => profesional.dni === dniUsuario);
        const posicionUsuario = ranking.findIndex(profesional => profesional.dni === dniUsuario) + 1;

        // Mostramos la información del usuario logueado
        const userDetailsDiv = document.getElementById('user-details');
        if (usuario) {
            userDetailsDiv.innerHTML = `
                <img src="${usuario.foto}" alt="Foto de perfil">
                <p><strong>${usuario.nombre}</strong></p>
                <p>Puntos: ${usuario.puntos}</p>
                <p>Posición: #${posicionUsuario}</p>
            `;
        }

        // Mostramos el ranking de profesionales
        const rankingDiv = document.getElementById('ranking');
        rankingDiv.innerHTML = ''; // Limpiar el ranking antes de volver a agregar elementos
        ranking.forEach((profesional, index) => {
            const posicion = index + 1;
            rankingDiv.innerHTML += `
                <div class="ranking-item">
                    <img src="${profesional.foto}" alt="Foto de perfil">
                    <div>
                        <p><strong>${profesional.nombre}</strong></p>
                        <p>Puntos: ${profesional.puntos}</p>
                    </div>
                    <span>#${posicion}</span>
                </div>
            `;
        });
    }
});
