document.addEventListener('DOMContentLoaded', function() {
    const cerrarSesionBtn = document.getElementById('cerrarSesion');

    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener('click', function() {
            const nuevaSesion = { estado: 'no', dni: '', rol: '' };
            localStorage.setItem('sesionIniciada', JSON.stringify(nuevaSesion));
            window.location.href = 'login.html';
        });
    }

    // Función para formatear el sueldo
    function formatCurrency(value) {
        const number = parseFloat(value.replace(/[^0-9.-]+/g, "")); // Elimina cualquier carácter no numérico
        if (isNaN(number)) return '$0';
        return `$${number.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }

    // Cargar ofertas laborales desde localStorage
    const ofertas = JSON.parse(localStorage.getItem('ofertasLaborales')) || [];
    const sesionIniciada = JSON.parse(localStorage.getItem('sesionIniciada')) || {};
    const dniProfesional = sesionIniciada.dni;

    const ofertasListDiv = document.getElementById('ofertas-list');
    const mensajeNoOfertas = document.getElementById('mensaje-no-ofertas');

    if (ofertas.length === 0) {
        mensajeNoOfertas.style.display = 'block';
        ofertasListDiv.style.display = 'none';
    } else {
        mensajeNoOfertas.style.display = 'none';
        ofertasListDiv.style.display = 'block';

        // Crear elementos para cada oferta laboral
        ofertas.forEach(empresa => {
            empresa.ofertasLaborales.forEach(oferta => {
                const ofertaDiv = document.createElement('div');
                ofertaDiv.classList.add('oferta-item');

                // Crear el botón "Inscribirme"
                const inscribirmeBtn = document.createElement('button');
                inscribirmeBtn.classList.add('inscribirme-btn');
                inscribirmeBtn.textContent = 'Inscribirme';

                // Cargar las inscripciones del profesional
                const inscripciones = JSON.parse(localStorage.getItem(`inscripciones_${dniProfesional}`)) || {
                    aprobadas: [],
                    rechazadas: [],
                    pendientes: []
                };

                // Verificar si el profesional ya se ha inscrito
                const yaInscrito = inscripciones.pendientes.some(p => p.empresa === empresa.empresa && p.puesto === oferta.nombre);

                if (yaInscrito) {
                    inscribirmeBtn.disabled = true; // Desactiva el botón si ya está inscrito
                    inscribirmeBtn.textContent = 'Ya inscrito'; // Cambia el texto del botón
                }

                inscribirmeBtn.addEventListener('click', function() {
                    // Cargar nuevamente las inscripciones para asegurar el estado correcto
                    const inscripcionesActualizadas = JSON.parse(localStorage.getItem(`inscripciones_${dniProfesional}`)) || {
                        aprobadas: [],
                        rechazadas: [],
                        pendientes: []
                    };

                    // Verificar si ya está inscrito antes de agregar
                    const yaInscritoActualizado = inscripcionesActualizadas.pendientes.some(p => p.empresa === empresa.empresa && p.puesto === oferta.nombre);

                    if (!yaInscritoActualizado) {
                        // Añadir la inscripción a las pendientes
                        inscripcionesActualizadas.pendientes.push({
                            puesto: oferta.nombre,
                            empresa: empresa.empresa
                        });

                        // Guardar en localStorage con la nueva clave
                        localStorage.setItem(`inscripciones_${dniProfesional}`, JSON.stringify(inscripcionesActualizadas));
                        inscribirmeBtn.disabled = true;
                        inscribirmeBtn.textContent = 'Ya inscrito';

                        // Añadir la solicitud a solicitudesActuales
                        const solicitudesActuales = JSON.parse(localStorage.getItem('solicitudesActuales')) || [];
                        solicitudesActuales.push({
                            empresa: empresa.empresa,
                            puesto: oferta.nombre,
                            dni: dniProfesional
                        });
                        localStorage.setItem('solicitudesActuales', JSON.stringify(solicitudesActuales));
                    }
                });

                ofertaDiv.innerHTML = `
                    <h3>${oferta.nombre}</h3>
                    <p><strong>Empresa:</strong> ${empresa.empresa}</p>
                    <p><strong>Sueldo:</strong> ${formatCurrency(oferta.sueldo)}</p>
                    <p><strong>Horas:</strong> ${oferta.horas}</p>
                    <p><strong>Fecha Límite:</strong> ${oferta.fechaLimite}</p>
                    <p><strong>Descripción:</strong> ${oferta.descripcion}</p>
                `;
                ofertaDiv.appendChild(inscribirmeBtn); // Añadir el botón al div de la oferta

                ofertasListDiv.appendChild(ofertaDiv);
            });
        });
    }
});
