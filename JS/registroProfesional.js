// Función para inicializar el estado de la sesión
function inicializarSesion() {
    const sesion = JSON.parse(localStorage.getItem('sesionIniciada'));
    
    if (sesion && sesion.estado === 'si') {
        window.location.href = 'ofertasLaborales.html';
    } else if (!sesion) {
        const nuevaSesion = {
            estado: 'no',
            dni: '',
            rol: ''
        };
        localStorage.setItem('sesionIniciada', JSON.stringify(nuevaSesion));
    }
}

document.addEventListener('DOMContentLoaded', inicializarSesion);

// Arrays para almacenar los profesionales y reclutadores en localStorage
let profesionales = JSON.parse(localStorage.getItem('profesionales')) || [];
let reclutadores = JSON.parse(localStorage.getItem('reclutadores')) || [];

// Función para mostrar la vista previa de la imagen
document.getElementById('foto').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const fileType = file.type;
        const fileSize = file.size;

        if (!fileType.startsWith('image/')) {
            alert('Por favor, sube un archivo de imagen válido');
            return;
        }
        if (fileSize > 2 * 1024 * 1024) { // 2 MB
            alert('La imagen no debe superar los 2MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.getElementById('imagenPrevia');
            img.src = e.target.result;
            img.style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
});

// Función para mostrar/ocultar contraseñas
function togglePasswordVisibility(id) {
    const input = document.getElementById(id);
    const button = input.nextElementSibling;
    input.type = input.type === 'password' ? 'text' : 'password';
    button.textContent = input.type === 'password' ? 'Mostrar' : 'Ocultar';
}

// Función para validar el formulario en tiempo real
function validateField(id, validationFunction) {
    const field = document.getElementById(id);
    const feedback = document.getElementById(`${id}Feedback`);
    field.addEventListener('input', () => {
        const error = validationFunction(field.value.trim());
        feedback.textContent = error || '';
        field.style.borderColor = error ? 'red' : '';
    });
}

// Validaciones
function validateNombre(nombre) {
    if (!nombre) return 'Es obligatorio';
    if (nombre.split(' ').length < 2) return 'Incompleto';
    return '';
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'El email es obligatorio';
    if (!emailRegex.test(email)) return 'Email inválido';
    return '';
}

function validateDni(dni) {
    if (!dni) return 'El DNI es obligatorio';
    if (dni.length !== 8 || isNaN(dni)) return 'El DNI debe tener exactamente 8 dígitos';
    return '';
}

function validateTelefono(telefono) {
    const telefonoRegex = /^[0-9]{10}$/; // 10 dígitos
    if (!telefono) return 'El teléfono es obligatorio';
    if (!telefonoRegex.test(telefono)) return 'El teléfono debe tener 10 dígitos';
    return '';
}

function validateContraseña(contraseña) {
    const contraseñaRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!contraseña) return 'La contraseña es obligatoria';
    if (!contraseñaRegex.test(contraseña)) return 'Mínimo 8 caracteres, una mayúscula, minúscula y un número';
    return '';
}

function validateConfirmarContraseña(contraseña, confirmarContraseña) {
    if (contraseña !== confirmarContraseña) return 'Las contraseñas no coinciden';
    return '';
}

// Agregar validaciones en tiempo real
validateField('nombre', validateNombre);
validateField('email', validateEmail);
validateField('dni', validateDni);
validateField('telefono', validateTelefono);
validateField('contraseña', validateContraseña);

document.getElementById('confirmarContraseña').addEventListener('input', function() {
    const contraseña = document.getElementById('contraseña').value.trim();
    const confirmarContraseña = document.getElementById('confirmarContraseña').value.trim();
    const error = validateConfirmarContraseña(contraseña, confirmarContraseña);
    document.getElementById('confirmarContraseñaFeedback').textContent = error || '';
    this.style.borderColor = error ? 'red' : '';
});

// Función para registrar un nuevo profesional
document.getElementById('registroForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const dni = document.getElementById('dni').value;
    const telefono = document.getElementById('telefono').value;
    const contraseña = document.getElementById('contraseña').value;
    const confirmarContraseña = document.getElementById('confirmarContraseña').value;
    const fotoInput = document.getElementById('foto');
    const file = fotoInput.files[0];

    // Validar los campos del formulario
    const errorNombre = validateNombre(nombre);
    const errorEmail = validateEmail(email);
    const errorDni = validateDni(dni);
    const errorTelefono = validateTelefono(telefono);
    const errorContraseña = validateContraseña(contraseña);
    const errorConfirmarContraseña = validateConfirmarContraseña(contraseña, confirmarContraseña);

    if (errorNombre || errorEmail || errorDni || errorTelefono || errorContraseña || errorConfirmarContraseña) {
        alert('Por favor, corrige los errores del formulario.');
        return;
    }

    if (file && file.size > 2 * 1024 * 1024) { 
        alert('La imagen no debe superar los 2MB');
        return;
    }

    // Verificar que el email, dni o teléfono no existan en profesionales o reclutadores
    const emailExistente = profesionales.some(profesional => profesional.email === email) ||
                           reclutadores.some(reclutador => reclutador.email === email);
    const dniExistente = profesionales.some(profesional => profesional.dni === dni) ||
                         reclutadores.some(reclutador => reclutador.dni === dni);
    const telefonoExistente = profesionales.some(profesional => profesional.telefono === telefono);

    if (emailExistente) {
        alert('Ya existe un usuario con ese email');
        return;
    }

    if (dniExistente) {
        alert('Ya existe un usuario con ese DNI');
        return;
    }

    if (telefonoExistente) {
        alert('Ya existe un profesional con ese teléfono');
        return;
    }

    // Crear el nuevo profesional
    const reader = new FileReader();
    reader.onload = function(e) {
        const fotoBase64 = e.target.result;

        const nuevoProfesional = {
            nombre,
            email,
            dni,
            telefono,
            contraseña,
            foto: fotoBase64,
            experiencia: [],
            puntos: 0
        };

        profesionales.push(nuevoProfesional);
        localStorage.setItem('profesionales', JSON.stringify(profesionales));
        alert('Registro exitoso');
        window.location.href = 'login.html';
    };

    if (file) {
        reader.readAsDataURL(file);
    }
});
