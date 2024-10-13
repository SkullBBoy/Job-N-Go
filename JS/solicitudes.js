document.addEventListener('DOMContentLoaded', function () {
    const listaOfertasDiv = document.getElementById('lista-ofertas');
    const listaCandidatosDiv = document.getElementById('lista-candidatos');
    const cerrarSesionBtn = document.getElementById('cerrarSesion');

    // Evento para cerrar sesión
    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener('click', function() {
            const nuevaSesion = { estado: 'no', dni: '', rol: '' };
            localStorage.setItem('sesionIniciada', JSON.stringify(nuevaSesion));
            window.location.href = 'login.html';
        });
    }

    // Función para obtener el reclutador logueado
    const obtenerReclutadorActual = () => {
        const sesion = JSON.parse(localStorage.getItem('sesionIniciada'));
        return sesion ? sesion.dni : null;
    };

    // Función para cargar la lista de reclutadores desde localStorage
    const cargarReclutadores = () => {
        return JSON.parse(localStorage.getItem('reclutadores')) || [];
    };

    // Función para cargar las ofertas laborales desde localStorage
    const cargarOfertasLaborales = () => {
        return JSON.parse(localStorage.getItem('ofertasLaborales')) || [];
    };

    // Función para cargar la lista de profesionales desde localStorage
    const cargarProfesionales = () => {
        return JSON.parse(localStorage.getItem('profesionales')) || [];
    };

    // Función para cargar las solicitudes actuales desde localStorage
    const cargarSolicitudesActuales = () => {
        return JSON.parse(localStorage.getItem('solicitudesActuales')) || [];
    };

    // Función para guardar las solicitudes actuales en localStorage
    const guardarSolicitudesActuales = (solicitudes) => {
        localStorage.setItem('solicitudesActuales', JSON.stringify(solicitudes));
    };

    // Función para cargar las inscripciones de un reclutador por su DNI
    const cargarInscripcionesReclutador = (dni) => {
        return JSON.parse(localStorage.getItem(`inscripciones_${dni}`)) || { aprobadas: [], pendientes: [], rechazadas: [] };
    };

    // Función para guardar las inscripciones de un reclutador por su DNI
    const guardarInscripcionesReclutador = (dni, inscripciones) => {
        localStorage.setItem(`inscripciones_${dni}`, JSON.stringify(inscripciones));
    };

    // Función para obtener la empresa del reclutador actual
    const obtenerEmpresaReclutador = () => {
        const dniReclutador = obtenerReclutadorActual();
        const reclutadores = cargarReclutadores();
        const reclutador = reclutadores.find(r => r.dni === dniReclutador);
        return reclutador ? reclutador.empresa : null;
    };

    // Función para mostrar las ofertas de la empresa del reclutador actual
    const mostrarOfertas = () => {
        const empresaReclutador = obtenerEmpresaReclutador();
        const ofertas = cargarOfertasLaborales();
        listaOfertasDiv.innerHTML = ''; // Limpiar el div antes de mostrar las ofertas

        if (!empresaReclutador) {
            listaOfertasDiv.innerHTML = '<p>Error: No se encontró la empresa del reclutador actual.</p>';
            return;
        }

        // Filtrar las ofertas por la empresa del reclutador actual
        const ofertasEmpresa = ofertas.filter(oferta => oferta.empresa === empresaReclutador);

        // Comprobar si hay ofertas para la empresa
        if (ofertasEmpresa.length === 0) {
            listaOfertasDiv.innerHTML = `<p>No hay ofertas creadas por la empresa ${empresaReclutador}.</p>`;
            return;
        }

        // Mostrar las ofertas de la empresa
        ofertasEmpresa.forEach((ofertaEmpresa) => {
            ofertaEmpresa.ofertasLaborales.forEach((ofertaLaboral) => {
                listaOfertasDiv.innerHTML += `
                    <div class="oferta-item" data-puesto="${ofertaLaboral.nombre}" data-empresa="${ofertaEmpresa.empresa}">
                        <h4>${ofertaLaboral.nombre} (${ofertaEmpresa.empresa})</h4>
                        <p>Descripción: ${ofertaLaboral.descripcion}</p>
                        <p>Horas: ${ofertaLaboral.horas}</p>
                        <p>Fecha límite: ${ofertaLaboral.fechaLimite}</p>
                        <p>Sueldo: ${ofertaLaboral.sueldo}</p>
                    </div>
                `;
            });
        });

        // Agregar evento de clic a cada oferta para mostrar los candidatos
        const ofertaItems = document.querySelectorAll('.oferta-item');
        ofertaItems.forEach((item) => {
            item.addEventListener('click', () => {
                const puestoSeleccionado = item.dataset.puesto;
                const empresaSeleccionada = item.dataset.empresa;
                mostrarCandidatos(puestoSeleccionado, empresaSeleccionada);
            });
        });
    };

    const mostrarCandidatos = (puesto, empresa) => {
        const solicitudes = cargarSolicitudesActuales();
        const profesionales = cargarProfesionales();
        const reclutadorDni = obtenerReclutadorActual();
        let inscripcionesReclutador = cargarInscripcionesReclutador(reclutadorDni);

        // Filtrar las solicitudes para obtener candidatos para la oferta seleccionada
        const candidatos = solicitudes.filter(solicitud => solicitud.puesto === puesto && solicitud.empresa === empresa);

        listaCandidatosDiv.innerHTML = ''; // Limpiar el div antes de mostrar los candidatos

        // Comprobar si hay candidatos
        if (candidatos.length > 0) {
            listaCandidatosDiv.innerHTML = `
                <h4>Oferta: ${puesto}</h4>
                <p>Empresa: ${empresa}</p>
                <h5>Candidatos:</h5>
            `;

            candidatos.forEach(candidato => {
                const infoCandidato = profesionales.find(prof => prof.dni === candidato.dni);
                if (infoCandidato) {
                    listaCandidatosDiv.innerHTML += `
                        <div class="candidato-item" data-dni="${infoCandidato.dni}">
                            <p>Nombre: ${infoCandidato.nombre}</p>
                            <p>DNI: ${infoCandidato.dni}</p>
                            <p>Email: ${infoCandidato.email}</p>
                            <p>Teléfono: ${infoCandidato.telefono}</p>
                        </div>
                    `;
                }
            });

           
        } else {
            listaCandidatosDiv.innerHTML = '<p>No hay candidatos disponibles para esta oferta.</p>';
        }
    };

    const aprobarCandidato = (dniCandidato, puesto, empresa) => {
        const solicitudes = cargarSolicitudesActuales();
        const reclutadorDni = obtenerReclutadorActual();
        let inscripcionesReclutador = cargarInscripcionesReclutador(reclutadorDni);

        const nuevasSolicitudes = solicitudes.filter(solicitud => !(solicitud.dni === dniCandidato && solicitud.puesto === puesto && solicitud.empresa === empresa));
        guardarSolicitudesActuales(nuevasSolicitudes);

       
        inscripcionesReclutador.aprobadas.push({ puesto, empresa });
        guardarInscripcionesReclutador(reclutadorDni, inscripcionesReclutador);

      
        mostrarCandidatos(puesto, empresa);
    };

   
    const rechazarCandidato = (dniCandidato, puesto, empresa) => {
        const solicitudes = cargarSolicitudesActuales();
        const reclutadorDni = obtenerReclutadorActual();
        let inscripcionesReclutador = cargarInscripcionesReclutador(reclutadorDni);

        const nuevasSolicitudes = solicitudes.filter(solicitud => !(solicitud.dni === dniCandidato && solicitud.puesto === puesto && solicitud.empresa === empresa));
        guardarSolicitudesActuales(nuevasSolicitudes);

        inscripcionesReclutador.rechazadas.push({ puesto, empresa });
        guardarInscripcionesReclutador(reclutadorDni, inscripcionesReclutador);

        mostrarCandidatos(puesto, empresa);
    };

    mostrarOfertas();
});
