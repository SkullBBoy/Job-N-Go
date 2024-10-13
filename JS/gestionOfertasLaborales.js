document.addEventListener('DOMContentLoaded', function () {
  
    const ofertasCreadasDiv = document.getElementById('ofertasCreadas');
    const ofertasSelect = document.getElementById('ofertasSelect');
    const crearOfertaForm = document.getElementById('crearOfertaForm');
    const editarOfertaForm = document.getElementById('editarOfertaForm');
    const eliminarOfertaBtn = document.getElementById('eliminarOfertaBtn');

    const cerrarSesionBtn = document.getElementById('cerrarSesion');

    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener('click', function() {
            const nuevaSesion = { estado: 'no', dni: '', rol: '' };
            localStorage.setItem('sesionIniciada', JSON.stringify(nuevaSesion));
            window.location.href = 'login.html';
        });
    }




    // Datos de sesión (simulación de empresa logueada)
    const obtenerDniReclutadorLogueado = () => {
        const sesion = JSON.parse(localStorage.getItem('sesionIniciada'));
        return sesion ? sesion.dni : '';
    };

    const dniReclutadorLogueado = obtenerDniReclutadorLogueado();

    const obtenerEmpresaLogueada = () => {
        const reclutadores = JSON.parse(localStorage.getItem('reclutadores')) || [];
        const reclutador = reclutadores.find(r => r.dni === dniReclutadorLogueado);
        return reclutador ? reclutador.empresa : '';
    };

    const empresaLogueada = obtenerEmpresaLogueada();

    // Cargar ofertas laborales desde localStorage
    const cargarOfertas = () => {
        const ofertasData = JSON.parse(localStorage.getItem('ofertasLaborales')) || [];
        const empresa = ofertasData.find(o => o.empresa === empresaLogueada);
        return empresa ? empresa.ofertasLaborales : [];
    };

    // Guardar ofertas laborales en localStorage
    const guardarOfertas = (ofertas) => {
        let ofertasData = JSON.parse(localStorage.getItem('ofertasLaborales')) || [];
        const empresaIndex = ofertasData.findIndex(o => o.empresa === empresaLogueada);
        if (empresaIndex > -1) {
            ofertasData[empresaIndex].ofertasLaborales = ofertas;
        } else {
            ofertasData.push({ empresa: empresaLogueada, ofertasLaborales: ofertas });
        }
        localStorage.setItem('ofertasLaborales', JSON.stringify(ofertasData));
    };

    // Mostrar ofertas creadas
    const mostrarOfertas = () => {
        const ofertas = cargarOfertas();
        ofertasCreadasDiv.innerHTML = '';
        ofertasSelect.innerHTML = '<option value="">Seleccionar oferta</option>';
        ofertas.forEach((oferta, index) => {
            ofertasCreadasDiv.innerHTML += `
                <div>
                    <h4>${oferta.nombre}</h4>
                    <p>Sueldo: ${formatCurrency(oferta.sueldo)}</p>
                    <p>Horas: ${oferta.horas}</p>
                    <p>Descripción: ${oferta.descripcion}</p>
                    <p>Fecha límite: ${oferta.fechaLimite || 'Indefinida'}</p>
                </div>
            `;
            ofertasSelect.innerHTML += `<option value="${index}">${oferta.nombre}</option>`;
        });
    };

    // Crear oferta
    crearOfertaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nombre = document.getElementById('nombre').value;
        const sueldo = document.getElementById('sueldo').value;
        const horas = document.getElementById('horas').value;
        const descripcion = document.getElementById('descripcion').value;
        const fechaLimite = document.getElementById('fechaLimite').value;

        const nuevaOferta = {
            nombre, sueldo, horas, descripcion, fechaLimite: fechaLimite || 'Indefinida'
        };

        const ofertas = cargarOfertas();
        ofertas.push(nuevaOferta);
        guardarOfertas(ofertas);
        mostrarOfertas();
        crearOfertaForm.reset();
    });

    // Eliminar oferta
    eliminarOfertaBtn.addEventListener('click', () => {
        const selectedIndex = ofertasSelect.value;
        if (selectedIndex !== '') {
            let ofertas = cargarOfertas();
            ofertas.splice(selectedIndex, 1); // Eliminar la oferta seleccionada
            guardarOfertas(ofertas);
            mostrarOfertas();
            
            // Limpiar y ocultar la selección
            ofertasSelect.value = '';
            editarOfertaForm.style.display = 'none';
            
            // Actualizar la lista desplegable para reflejar la eliminación
            ofertasSelect.innerHTML = '<option value="">Seleccionar oferta</option>';
            cargarOfertas().forEach((oferta, index) => {
                ofertasSelect.innerHTML += `<option value="${index}">${oferta.nombre}</option>`;
            });

            // Ocultar el formulario de edición si no hay ofertas
            if (ofertas.length === 0) {
                editarOfertaForm.style.display = 'none';
            }
        }
    });

    // Cargar datos de la oferta seleccionada para editar
    ofertasSelect.addEventListener('change', () => {
        const selectedIndex = ofertasSelect.value;
        if (selectedIndex !== '') {
            editarOfertaForm.style.display = 'block';
            const oferta = cargarOfertas()[selectedIndex];
            document.getElementById('nombreEdit').value = oferta.nombre;
            document.getElementById('sueldoEdit').value = oferta.sueldo;
            document.getElementById('horasEdit').value = oferta.horas;
            document.getElementById('descripcionEdit').value = oferta.descripcion;
            document.getElementById('fechaLimiteEdit').value = oferta.fechaLimite === 'Indefinida' ? '' : oferta.fechaLimite;
        } else {
            editarOfertaForm.style.display = 'none';
        }
    });

    // Editar oferta
    editarOfertaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedIndex = ofertasSelect.value;
        if (selectedIndex !== '') {
            const nombre = document.getElementById('nombreEdit').value;
            const sueldo = document.getElementById('sueldoEdit').value;
            const horas = document.getElementById('horasEdit').value;
            const descripcion = document.getElementById('descripcionEdit').value;
            const fechaLimite = document.getElementById('fechaLimiteEdit').value || 'Indefinida';

            const ofertaEditada = {
                nombre, sueldo, horas, descripcion, fechaLimite
            };

            const ofertas = cargarOfertas();
            ofertas[selectedIndex] = ofertaEditada;
            guardarOfertas(ofertas);
            mostrarOfertas();
            editarOfertaForm.style.display = 'none';
        }
    });

    // Función para formatear el sueldo como moneda
    const formatCurrency = (amount) => {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    mostrarOfertas();
});
