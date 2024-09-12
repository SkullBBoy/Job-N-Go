document.addEventListener('DOMContentLoaded', function() {
    const cerrarSesionBtn = document.getElementById('cerrarSesion');
    
    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener('click', function() {
            const nuevaSesion = { estado: 'no', dni: '', rol: '' };
            localStorage.setItem('sesionIniciada', JSON.stringify(nuevaSesion));
            window.location.href = 'login.html';
        });
    }

    // Cargar ofertas laborales desde localStorage
    const ofertas = JSON.parse(localStorage.getItem('ofertasLaborales')) || [];
    
    const ofertasListDiv = document.getElementById('ofertas-list');
    const mensajeNoOfertas = document.getElementById('mensaje-no-ofertas');
    
    if (ofertas.length === 0) {
        mensajeNoOfertas.style.display = 'block';
        ofertasListDiv.style.display = 'none';
    } else {
        mensajeNoOfertas.style.display = 'none';
        ofertasListDiv.style.display = 'block';
        
        // Crear elementos para cada oferta laboral
        ofertas.forEach(oferta => {
            const ofertaDiv = document.createElement('div');
            ofertaDiv.classList.add('oferta-item');
            ofertaDiv.innerHTML = `
                <h3>${oferta.puesto}</h3>
                <p><strong>Empresa:</strong> ${oferta.empresa}</p>
                <p><strong>Sueldo:</strong> ${oferta.sueldo}</p>
                <p><strong>Horas:</strong> ${oferta.horas}</p>
            `;
            ofertasListDiv.appendChild(ofertaDiv);
        });
    }
});
