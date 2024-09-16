document.addEventListener('DOMContentLoaded', function () {
    const cerrarSesionBtn = document.getElementById('cerrarSesion');
    const solicitudesContainer = document.getElementById('solicitudes-container');
    
    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener('click', function() {
            const nuevaSesion = { estado: 'no', dni: '', rol: '' };
            localStorage.setItem('sesionIniciada', JSON.stringify(nuevaSesion));
            window.location.href = 'login.html';
        });
    }

});

